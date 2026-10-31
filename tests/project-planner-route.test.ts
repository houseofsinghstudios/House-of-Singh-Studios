// /api/project-planner end to end: each event's own checks and payload, the 64 KB cap, the honeypot,
// the in instance duplicate guard, prices from Sanity (or hidden when Sanity fails), the rate limit,
// and n8n refusing or timing out. tests/api-errors.test.ts covers the failures every form route
// shares; this file covers what only the planner does. fetch is replaced, so nothing leaves the
// process. Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { POST as planner } from "@/app/api/project-planner/route";

process.env.N8N_PROJECT_PLANNER_WEBHOOK_URL = "http://n8n.test/planner";
process.env.N8N_WEBHOOK_SECRET = "test-secret";
// The price read uses the Sanity client, which needs a project to load; its answer is a stand in.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= "test";
process.env.NEXT_PUBLIC_SANITY_DATASET ||= "test";

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

type Sent = { url: string; headers: Record<string, string>; signal: unknown; body: Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any
// n8n answers with n8nStatus (or times out); Sanity's price read answers with no document, or fails.
function stub({ n8nStatus = 200, n8nTimesOut = false, sanityFails = false } = {}) {
  const n8n: Sent[] = [];
  const sanity: string[] = [];
  globalThis.fetch = (async (url: string, init: RequestInit = {}) => {
    const u = String(url);
    if (u.includes("sanity.io")) {
      sanity.push(u);
      if (sanityFails) throw new TypeError("fetch failed");
      return new Response(JSON.stringify({ result: null, ms: 1 }), { status: 200, headers: { "content-type": "application/json" } });
    }
    n8n.push({ url: u, headers: init.headers as Record<string, string>, signal: init.signal, body: JSON.parse(String(init.body)) });
    if (n8nTimesOut) throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
    return new Response("{}", { status: n8nStatus });
  }) as typeof fetch;
  return { n8n, sanity };
}

// Logs stay out of the test output.
async function quiet<T>(run: () => Promise<T>): Promise<T> {
  const original = { log: console.log, error: console.error, warn: console.warn };
  console.log = console.error = console.warn = () => {};
  try {
    return await run();
  } finally {
    Object.assign(console, original);
  }
}

let ip = 0;
const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/project-planner", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.42.${Math.floor(++ip / 250)}.${ip % 250}`, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const send = (body: unknown, headers?: Record<string, string>) => quiet(() => planner(post(body, headers)));

const answers = { needs: ["website"], primary: "website", start: "redesign", goal: "clarity", priorities: ["structure"], timing: "now" };
const contact = { name: "Ada", email: "ada@example.com", company: "Studio", location: "Toronto", note: "", marketingConsent: false };
const attribution = {
  source: "newsletter",
  medium: "email",
  campaign: "autumn",
  referralCode: "PARTNER1",
  landingPage: "/start?service=website#top",
  entryPlacement: "services",
  referrer: "https://search.example/results?q=private+terms#frag",
};
const briefId = () => crypto.randomUUID().toUpperCase();

test("started: a 200, sent to n8n with the secret header, a 10 second signal and no answers or prices", async () => {
  const { n8n, sanity } = stub();
  const id = briefId();
  const res = await send({ event: "started", briefId: id, attribution });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { success: true });
  assert.equal(n8n.length, 1);
  assert.equal(sanity.length, 0, "started never reads prices");
  assert.equal(n8n[0].headers["x-hos-webhook-secret"], "test-secret");
  assert.ok(n8n[0].signal, "the request carries an abort signal");
  const body = n8n[0].body;
  assert.equal(body.event, "started");
  assert.equal(body.briefId, id.toLowerCase(), "the brief id is lowercased");
  assert.equal(body.eventIdempotencyKey, `${id.toLowerCase()}:started`);
  assert.equal(body.statusRank, 1);
  assert.equal(body.priceSource, null);
  assert.deepEqual(body.attribution, {
    source: "newsletter",
    medium: "email",
    campaign: "autumn",
    referralCode: "partner1",
    landingPage: "/start",
    entryPlacement: "services",
    referrer: "https://search.example/results",
  }, "no query string or fragment survives, the referral code is lowercased");
  for (const key of ["answers", "brief", "contact", "leadSource"]) assert.ok(!(key in body), `no ${key}`);
});

test("call_clicked: an intention with no rank and no prices; an unknown placement counts as direct", async () => {
  const { n8n, sanity } = stub();
  const res = await send({ event: "call_clicked", briefId: briefId(), attribution: { entryPlacement: "somewhere-else" } });
  assert.equal(res.status, 200);
  assert.equal(sanity.length, 0);
  assert.equal(n8n[0].body.statusRank, null);
  assert.equal(n8n[0].body.attribution.entryPlacement, "direct");
});

test("viewed: the brief is recomputed with the published prices and sent without contact details", async () => {
  const { n8n, sanity } = stub();
  const res = await send({ event: "viewed", briefId: briefId(), attribution: {}, answers, brief: { headline: "forged by the browser" } });
  assert.equal(res.status, 200);
  assert.equal(sanity.length, 1, "viewed reads the prices once");
  const body = n8n[0].body;
  assert.equal(body.statusRank, 2);
  assert.deepEqual(body.answers, answers);
  assert.equal(typeof body.brief.headline, "string");
  assert.notEqual(body.brief.headline, "forged by the browser", "whatever brief the browser sends is ignored");
  assert.ok(Array.isArray(body.brief.priceLines));
  assert.ok(!("contact" in body));
});

test("viewed: when Sanity fails, prices are hidden and the event still goes through", async () => {
  const { n8n } = stub({ sanityFails: true });
  const res = await send({ event: "viewed", briefId: briefId(), attribution: {}, answers });
  assert.equal(res.status, 200);
  assert.equal(n8n[0].body.priceSource, "unavailable");
  for (const line of n8n[0].body.brief.priceLines) assert.equal(line.amount, null, "a hidden price is null");
});

test("sent: contact details, labels and optional fields reach n8n; a filled honeypot sends nothing", async () => {
  const { n8n } = stub();
  const res = await send({
    event: "sent",
    briefId: briefId(),
    attribution: {},
    answers,
    optional: { website: "Example.com/About", importantDate: "Spring launch" },
    contact,
    hearAbout: "Google search",
    leadSource: { landing_page: "/insights/x?utm_source=a", referrer: "google.com" },
  });
  assert.equal(res.status, 200);
  const body = n8n[0].body;
  assert.equal(body.statusRank, 3);
  assert.deepEqual(body.contact, contact);
  assert.deepEqual(body.optional, { investment: null, website: "https://example.com/About", importantDate: "Spring launch" });
  assert.equal(body.hearAbout, "Google search");
  assert.deepEqual(body.leadSource, { landing_page: "/insights/x", referrer: "google.com" });
  assert.equal(typeof body.answerLabels, "object");

  const trap = stub();
  const caught = await send({ event: "sent", briefId: briefId(), attribution: {}, answers, optional: {}, contact, honeypot: "http://spam.example" });
  assert.equal(caught.status, 200);
  assert.deepEqual(await caught.json(), { success: true });
  assert.equal(trap.n8n.length, 0, "a bot gets a success and nothing is sent");
});

test("invalid input: each event's own checks answer 400 with the reason, and nothing is sent", async () => {
  const id = briefId();
  const cases: [unknown, string][] = [
    [{ event: "opened", briefId: id }, "Invalid event"],
    [{ event: "started", briefId: "not-a-uuid" }, "Invalid briefId"],
    [{ event: "started" }, "Invalid briefId"],
    [{ event: "viewed", briefId: id, answers: { ...answers, primary: "video" } }, "Invalid answers"],
    [{ event: "viewed", briefId: id }, "Invalid answers"],
    [{ event: "sent", briefId: id, answers, optional: {}, contact: { ...contact, name: "" } }, "Name required"],
    [{ event: "sent", briefId: id, answers, optional: {}, contact: { ...contact, email: "ada@" } }, "Invalid email"],
    [{ event: "sent", briefId: id, answers, optional: { website: "not a site" }, contact }, "Invalid website"],
    [{ event: "sent", briefId: id, answers, optional: { investment: "a-lot" }, contact }, "Invalid investment"],
  ];
  for (const [body, error] of cases) {
    const { n8n } = stub();
    const res = await send(body);
    assert.equal(res.status, 400, JSON.stringify(body));
    assert.deepEqual(await res.json(), { success: false, error });
    assert.equal(n8n.length, 0);
  }
});

test("a body over 64 KB is refused with 413 before anything is read or sent", async () => {
  const { n8n } = stub();
  const big = JSON.stringify({ event: "started", briefId: briefId(), attribution: { campaign: "x".repeat(70 * 1024) } });
  const declared = await send(big);
  assert.equal(declared.status, 413);
  assert.deepEqual(await declared.json(), { success: false, error: "Request too large" });
  // Without a declared length, the body is cut off as it streams in.
  const streamed = await quiet(() =>
    planner(new Request("http://localhost/api/project-planner", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "10.43.0.1" },
      body: new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(big)); c.close(); } }),
      duplex: "half",
    } as RequestInit))
  );
  assert.equal(streamed.status, 413);
  assert.equal(n8n.length, 0);
});

test("duplicates: an event already delivered is answered 200 without a second send; other events still go", async () => {
  const { n8n } = stub();
  const id = briefId();
  assert.equal((await send({ event: "started", briefId: id, attribution: {} })).status, 200);
  assert.equal((await send({ event: "started", briefId: id.toLowerCase(), attribution: {} })).status, 200);
  assert.equal(n8n.length, 1, "the same brief and event is sent once");
  assert.equal((await send({ event: "call_clicked", briefId: id, attribution: {} })).status, 200);
  assert.equal(n8n.length, 2, "another event of the same brief goes through");
});

test("n8n refusing gives 502 and timing out 504; neither is remembered, so a retry goes out", async () => {
  const id = briefId();
  const refused = stub({ n8nStatus: 500 });
  const failed = await send({ event: "sent", briefId: id, attribution: {}, answers, optional: {}, contact });
  assert.equal(failed.status, 502);
  assert.deepEqual(await failed.json(), { success: false });
  assert.equal(refused.n8n.length, 1);

  stub({ n8nTimesOut: true });
  const timedOut = await send({ event: "sent", briefId: id, attribution: {}, answers, optional: {}, contact });
  assert.equal(timedOut.status, 504);

  const retry = stub();
  assert.equal((await send({ event: "sent", briefId: id, attribution: {}, answers, optional: {}, contact })).status, 200);
  assert.equal(retry.n8n.length, 1, "the retry is sent: failures are never recorded as delivered");
});

test("over 20 requests a minute from one address gets 429, and nothing more is sent", async () => {
  const { n8n } = stub();
  const fixed = { "x-forwarded-for": "10.44.0.7" };
  const statuses: number[] = [];
  for (let i = 0; i < 21; i++) statuses.push((await send({ event: "started", briefId: briefId(), attribution: {} }, fixed)).status);
  assert.deepEqual(statuses.slice(0, 20), Array(20).fill(200));
  assert.equal(statuses[20], 429);
  assert.equal(n8n.length, 20);
});
