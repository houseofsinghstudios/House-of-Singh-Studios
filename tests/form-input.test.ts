// Form input on hostile values: every cleaning path handles a 200 KB value in under 50 ms, every form
// route refuses a body over 64 KB with a 413, and normal values clean exactly as the old code did.
// fetch is replaced, so nothing leaves the process. Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { capRaw, EMAIL_MAX, isEmail, stripTags } from "@/lib/form-input";
import { cleanField, LEAD_LIMITS } from "@/lib/lead";
import { checkCareers, cleanCareers } from "@/lib/careers";
import { checkSubscribeEmail } from "@/lib/subscribe";
import { originAndPath } from "@/lib/referrer";
import { parseEvent } from "@/lib/project-planner/events-server";
import { MAX_BODY_BYTES, readBodyText } from "@/lib/request-body";
import { POST as lead } from "@/app/api/lead/route";
import { POST as careers } from "@/app/api/careers/route";
import { POST as subscribe } from "@/app/api/subscribe/route";
import { POST as brandPulse } from "@/app/api/brand-pulse/route";
import { POST as planner } from "@/app/api/project-planner/route";

process.env.N8N_WEBHOOK_URL = "http://n8n.test/lead";
process.env.N8N_CAREERS_WEBHOOK_URL = "http://n8n.test/careers";
process.env.N8N_SUBSCRIBE_WEBHOOK_URL = "http://n8n.test/subscribe";
process.env.N8N_BRAND_PULSE_WEBHOOK_URL = "http://n8n.test/brand-pulse";
process.env.N8N_PROJECT_PLANNER_WEBHOOK_URL = "http://n8n.test/planner";
process.env.N8N_WEBHOOK_SECRET = "test-secret";

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });
const stubN8n = () => { globalThis.fetch = (async () => new Response("{}", { status: 200 })) as typeof fetch; };

// The old cleaning, exactly as it was, as the reference for normal values.
const OLD_TAGS = /<[^>]*>/g;
const oldCleanField = (v: unknown) => (!v ? "" : String(v).replace(OLD_TAGS, "").trim());
const oldOriginAndPath = (value: unknown) => {
  if (typeof value !== "string") return "";
  const raw = value.replace(OLD_TAGS, "").replace(/\s+/g, " ").trim().slice(0, 500);
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return /^https?:$/.test(u.protocol) ? `${u.origin}${u.pathname}`.slice(0, 300) : "";
  } catch {
    return "";
  }
};

const KB200 = 200 * 1024;
const hostile = {
  tags: "<".repeat(KB200),
  spaces: `${" ".repeat(KB200)}x`,
  email: `a@${".".repeat(KB200)}@`,
};
function fast<T>(label: string, run: () => T): T {
  const start = performance.now();
  const result = run();
  const ms = performance.now() - start;
  assert.ok(ms < 50, `${label} took ${ms.toFixed(1)} ms`);
  return result;
}

// A small deterministic generator, so the comparison covers many shapes and is the same every run.
function* samples(count: number, maxLength: number) {
  let seed = 7;
  const next = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const alphabet = ["<", ">", "a", "Z", " ", "\n", "\t", "é", "/", "b", "<b>", "</i>", "&"];
  for (let i = 0; i < count; i++) {
    let s = "";
    const len = Math.floor(next() * maxLength);
    while (s.length < len) s += alphabet[Math.floor(next() * alphabet.length)];
    yield s;
  }
}

test("stripTags removes exactly what the old pattern removed", () => {
  for (const s of ["", "plain", "<b>Ada</b>", "a<b", "a>b", "<<b>>", "<a<b>c>", "x<y>z<", "<>", "1 < 2 > 0", "<b>open<i"]) {
    assert.equal(stripTags(s), s.replace(OLD_TAGS, ""), JSON.stringify(s));
  }
  for (const s of samples(3000, 300)) assert.equal(stripTags(s), s.replace(OLD_TAGS, ""), JSON.stringify(s));
});

test("normal values clean byte for byte as before, up to twice the limit", () => {
  for (const s of samples(3000, LEAD_LIMITS.name * 2)) assert.equal(cleanField(s, LEAD_LIMITS.name), oldCleanField(s), JSON.stringify(s));
  for (const v of ["  <b>Ada</b>  ", "Ada Lovelace", "ada@example.com", 42, true, "", null, undefined]) {
    assert.equal(cleanField(v, LEAD_LIMITS.name), oldCleanField(v), String(v));
  }
  for (const r of ["https://example.com/page?name=Pat#top", "  https://a.example/b  ", "<b>https://x.example</b>/p", "mailto:a@b.co", "not a url", ""]) {
    assert.equal(originAndPath(r), oldOriginAndPath(r), r);
  }
  for (const s of samples(1000, 1000)) assert.equal(originAndPath(`https://example.com/${s}`), oldOriginAndPath(`https://example.com/${s}`));
});

test("an over-long value is still rejected by the length checks, never cut to fit", () => {
  const name = cleanField("a".repeat(LEAD_LIMITS.name + 1), LEAD_LIMITS.name);
  assert.equal(name.length, LEAD_LIMITS.name + 1);
  assert.match(checkCareers({ ...cleanCareers({ name: "Ada", email: "ada@example.com", role: "Editor" }), message: cleanField("m".repeat(6000), 5000) }) ?? "", /^Message must be at most/);
  assert.equal(capRaw("x".repeat(1000), 100).length, 200);
});

test("email: the length is checked before the pattern; normal addresses unchanged", () => {
  for (const e of ["ada@example.com", "a.b+c@sub.example.co"]) assert.equal(isEmail(e), true, e);
  for (const e of ["", "ada", "ada@", "@example.com", "ada@example", "a b@example.com", 42]) assert.equal(isEmail(e), false, String(e));
  assert.equal(isEmail(`${"a".repeat(EMAIL_MAX - 12)}@example.com`), true);
  assert.equal(isEmail(`${"a".repeat(EMAIL_MAX - 11)}@example.com`), false);
  assert.equal(checkSubscribeEmail("ada@example.com"), null);
  assert.equal(checkSubscribeEmail("not an email"), "Invalid email");
});

test("every cleaning path handles a 200 KB value in under 50 ms", () => {
  fast("stripTags", () => stripTags(hostile.tags));
  fast("cleanField", () => cleanField(hostile.tags, LEAD_LIMITS.message));
  fast("isEmail", () => isEmail(hostile.email));
  fast("careers", () => checkCareers(cleanCareers({ name: hostile.tags, email: hostile.email, role: hostile.tags, portfolioUrl: hostile.tags, message: hostile.tags })));
  fast("subscribe", () => checkSubscribeEmail(cleanField(hostile.email, EMAIL_MAX)));
  fast("referrer", () => originAndPath(hostile.tags));
  fast("referrer, spaces", () => originAndPath(hostile.spaces));
  fast("planner", () =>
    parseEvent({
      event: "sent",
      briefId: "3f1c2b6e-8a4d-4c1e-9b7a-2d5e6f708192",
      attribution: { source: hostile.tags, medium: hostile.spaces, campaign: hostile.tags, landingPage: hostile.tags, referrer: hostile.tags },
      answers: {},
      optional: { website: hostile.tags, importantDate: hostile.tags },
      contact: { name: hostile.tags, email: hostile.email, company: hostile.tags, location: hostile.spaces, note: hostile.tags },
    })
  );
});

let ip = 0;
const post = (path: string, body: string, length?: number) =>
  new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.9.0.${++ip}`, ...(length !== undefined && { "content-length": String(length) }) },
    body,
  });
const ROUTES = [
  ["/api/lead", lead],
  ["/api/careers", careers],
  ["/api/subscribe", subscribe],
  ["/api/brand-pulse", brandPulse],
  ["/api/project-planner", planner],
] as const;

test("every form route refuses a body over 64 KB with a 413 and a short JSON error, before parsing", async () => {
  stubN8n();
  const big = JSON.stringify({ name: hostile.tags, email: "ada@example.com", message: "x" });
  for (const [path, handler] of ROUTES) {
    const start = performance.now();
    const res = await handler(post(path, big) as never);
    const ms = performance.now() - start;
    assert.equal(res.status, 413, path);
    assert.deepEqual(await res.json(), { success: false, error: "Request too large" }, path);
    assert.ok(ms < 50, `${path} took ${ms.toFixed(1)} ms`);
    // A declared length over the cap is refused without reading the body.
    const declared = await handler(post(path, "{}", MAX_BODY_BYTES + 1) as never);
    assert.equal(declared.status, 413, `${path} declared length`);
  }
});

test("a hostile value inside the 64 KB cap is answered in under 50 ms on every route", async () => {
  stubN8n();
  const near = 60 * 1024;
  const fields = { name: "<".repeat(near / 7), email: `a@${".".repeat(near / 7)}@`, message: "<".repeat(near / 7) };
  for (const [path, handler] of ROUTES) {
    const body = JSON.stringify({ ...fields, event: "completed", resultId: "3f1c2b6e-8a4d-4c1e-9b7a-2d5e6f708192", contact: fields });
    assert.ok(Buffer.byteLength(body) <= MAX_BODY_BYTES, "inside the cap");
    const start = performance.now();
    const res = await handler(post(path, body) as never);
    const ms = performance.now() - start;
    assert.ok(res.status >= 200 && res.status < 500 && res.status !== 413, `${path} answered ${res.status}`);
    assert.ok(ms < 50, `${path} took ${ms.toFixed(1)} ms`);
  }
});

test("a body at or under the cap reads in full, as request.json() did", async () => {
  const text = JSON.stringify({ message: "é".repeat(1000), name: "Ada" });
  assert.equal(await readBodyText(new Request("http://localhost/", { method: "POST", body: text })), text);
  const exact = "x".repeat(MAX_BODY_BYTES);
  assert.equal((await readBodyText(new Request("http://localhost/", { method: "POST", body: exact })))?.length, MAX_BODY_BYTES);
  assert.equal(await readBodyText(new Request("http://localhost/", { method: "POST", body: `${exact}x` })), null);
});
