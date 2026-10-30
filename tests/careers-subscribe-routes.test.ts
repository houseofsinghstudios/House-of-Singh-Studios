// The careers and newsletter routes: honeypot, length caps, the 10 second n8n timeout and the secret
// header. fetch is replaced, so nothing leaves the process. Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { POST as careers } from "@/app/api/careers/route";
import { POST as subscribe } from "@/app/api/subscribe/route";

process.env.N8N_CAREERS_WEBHOOK_URL = "http://n8n.test/careers";
process.env.N8N_SUBSCRIBE_WEBHOOK_URL = "http://n8n.test/subscribe";
process.env.N8N_WEBHOOK_SECRET = "test-secret";

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

type Call = { url: string; init: RequestInit };
function stubFetch(respond: (call: Call) => Promise<Response>) {
  const calls: Call[] = [];
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    const call = { url: String(url), init };
    calls.push(call);
    return respond(call);
  }) as typeof fetch;
  return calls;
}
let ip = 0;
const req = (path: string, body: unknown) =>
  new Request(`http://localhost${path}`, { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": `10.1.1.${++ip}` }, body: JSON.stringify(body) });
const application = { name: "Ada", email: "ada@example.com", role: "Photographer", portfolioUrl: "", message: "Hello." };

test("careers: a valid application goes to n8n with the secret header and a 10 second timeout", async () => {
  const calls = stubFetch(async () => new Response("{}", { status: 200 }));
  const res = await careers(req("/api/careers", application) as never);
  assert.equal(res.status, 200);
  assert.equal(calls.length, 1);
  assert.equal((calls[0].init.headers as Record<string, string>)["x-hos-webhook-secret"], "test-secret");
  assert.ok(calls[0].init.signal, "the request carries an abort signal");
  assert.equal(JSON.parse(String(calls[0].init.body)).name, "Ada");
});

test("careers: a filled honeypot answers success and sends nothing", async () => {
  const calls = stubFetch(async () => new Response("{}", { status: 200 }));
  const res = await careers(req("/api/careers", { ...application, honeypot: "http://spam" }) as never);
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test("careers: an over long message is refused with a short reason and nothing is sent", async () => {
  const calls = stubFetch(async () => new Response("{}", { status: 200 }));
  const res = await careers(req("/api/careers", { ...application, message: "m".repeat(5001) }) as never);
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: "Message must be at most 5,000 characters" });
  assert.equal(calls.length, 0);
});

test("careers: an n8n timeout returns 504", async () => {
  stubFetch(async () => { throw new DOMException("The operation timed out.", "TimeoutError"); });
  const res = await careers(req("/api/careers", application) as never);
  assert.equal(res.status, 504);
});

test("subscribe: a filled honeypot answers success and sends nothing", async () => {
  const calls = stubFetch(async () => new Response("{}", { status: 200 }));
  const res = await subscribe(req("/api/subscribe", { email: "ada@example.com", source: "article", honeypot: "x" }));
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test("subscribe: an email over 254 characters is refused and nothing is sent", async () => {
  const calls = stubFetch(async () => new Response("{}", { status: 200 }));
  const res = await subscribe(req("/api/subscribe", { email: `${"a".repeat(250)}@example.com` }));
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { success: false, error: "Email must be at most 254 characters" });
  assert.equal(calls.length, 0);
});

test("subscribe: a valid email goes to n8n with the secret header", async () => {
  const calls = stubFetch(async () => new Response("{}", { status: 200 }));
  const res = await subscribe(req("/api/subscribe", { email: "ada@example.com", source: "article" }));
  assert.equal(res.status, 200);
  assert.equal(calls.length, 1);
  assert.equal((calls[0].init.headers as Record<string, string>)["x-hos-webhook-secret"], "test-secret");
});

test("careers: a portfolio that is not a web address is refused with a 400, and nothing is sent", async () => {
  const calls = stubFetch(async () => new Response("{}", { status: 200 }));
  const res = await careers(req("/api/careers", { ...application, portfolioUrl: "javascript:alert(1)" }) as never);
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: "Portfolio URL must start with http:// or https://" });
  assert.equal(calls.length, 0);
});
