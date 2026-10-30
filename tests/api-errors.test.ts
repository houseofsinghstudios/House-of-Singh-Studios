// The form API routes answer the same failure the same way: 400 for a body that is not JSON, 502 when
// n8n refuses, 504 when n8n times out, 500 when the webhook is not configured, 429 over the rate
// limit; every log line carries the route's prefix. fetch is replaced, so nothing leaves the process.
// Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { POST as lead } from "@/app/api/lead/route";
import { POST as careers } from "@/app/api/careers/route";
import { POST as subscribe } from "@/app/api/subscribe/route";
import { POST as brandPulse } from "@/app/api/brand-pulse/route";
import { POST as planner } from "@/app/api/project-planner/route";
import { ANSWER_IDS, QUESTION_ORDER } from "@/lib/brand-pulse/types";

const ENV = {
  N8N_WEBHOOK_URL: "http://n8n.test/lead",
  N8N_CAREERS_WEBHOOK_URL: "http://n8n.test/careers",
  N8N_SUBSCRIBE_WEBHOOK_URL: "http://n8n.test/subscribe",
  N8N_BRAND_PULSE_WEBHOOK_URL: "http://n8n.test/brand-pulse",
  N8N_PROJECT_PLANNER_WEBHOOK_URL: "http://n8n.test/planner",
  N8N_WEBHOOK_SECRET: "test-secret",
};
Object.assign(process.env, ENV);

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; Object.assign(process.env, ENV); });
const n8nAnswers = (status: number) => { globalThis.fetch = (async () => new Response("{}", { status })) as typeof fetch; };
const n8nTimesOut = () => { globalThis.fetch = (async () => { throw new DOMException("The operation was aborted due to timeout", "TimeoutError"); }) as typeof fetch; };

let ip = 0;
const post = (body: string) =>
  new Request("http://localhost/api", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": `10.8.${Math.floor(++ip / 250)}.${ip % 250}` }, body });

const answers = Object.fromEntries(QUESTION_ORDER.map((q, i) => [q, ANSWER_IDS[q][i % ANSWER_IDS[q].length]]));
const ROUTES = [
  { name: "lead", handler: lead, env: "N8N_WEBHOOK_URL", valid: { name: "Ada", email: "ada@example.com", service: "Brand Identity", message: "Hello." } },
  { name: "careers", handler: careers, env: "N8N_CAREERS_WEBHOOK_URL", valid: { name: "Ada", email: "ada@example.com", role: "Photographer", portfolioUrl: "", message: "Hello." } },
  { name: "subscribe", handler: subscribe, env: "N8N_SUBSCRIBE_WEBHOOK_URL", valid: { email: "ada@example.com", source: "article" } },
  { name: "brand-pulse", handler: brandPulse, env: "N8N_BRAND_PULSE_WEBHOOK_URL", valid: { event: "completed", resultId: "3f1c2b6e-8a4d-4c1e-9b7a-2d5e6f708192", gate: "none", answers } },
  { name: "project-planner", handler: planner, env: "N8N_PROJECT_PLANNER_WEBHOOK_URL", valid: { event: "started", briefId: "4a1c2b6e-8a4d-4c1e-9b7a-2d5e6f708192", attribution: {} } },
] as const;

// Collects log lines while a handler runs, so they can be checked and kept out of the test output.
async function withLogs<T>(run: () => Promise<T>): Promise<{ result: T; lines: string[] }> {
  const lines: string[] = [];
  const original = { log: console.log, error: console.error, warn: console.warn };
  console.log = console.error = console.warn = (...args: unknown[]) => { lines.push(args.map(String).join(" ")); };
  try {
    return { result: await run(), lines };
  } finally {
    Object.assign(console, original);
  }
}

test("a body that is not JSON gets a 400 on every form route", async () => {
  for (const r of ROUTES) {
    for (const body of ["not json", "{", "", "null", "42"]) {
      const { result: res } = await withLogs(() => r.handler(post(body) as never));
      assert.equal(res.status, 400, `${r.name} ${JSON.stringify(body)}`);
    }
  }
});

test("a refused n8n call gets a 502 on every form route, and a valid submission a 200", async () => {
  for (const r of ROUTES) {
    n8nAnswers(500);
    const { result: failed } = await withLogs(() => r.handler(post(JSON.stringify(r.valid)) as never));
    assert.equal(failed.status, 502, r.name);
    n8nAnswers(200);
    // The planner remembers delivered events, so each pass uses a fresh brief id.
    const body = r.name === "project-planner" ? { ...r.valid, briefId: crypto.randomUUID() } : r.valid;
    const { result: ok } = await withLogs(() => r.handler(post(JSON.stringify(body)) as never));
    assert.equal(ok.status, 200, r.name);
  }
});

test("an n8n timeout gets a 504, and a missing webhook a 500, on every form route", async () => {
  for (const r of ROUTES) {
    n8nTimesOut();
    const body = r.name === "project-planner" ? { ...r.valid, briefId: crypto.randomUUID() } : r.valid;
    const { result: timedOut } = await withLogs(() => r.handler(post(JSON.stringify(body)) as never));
    assert.equal(timedOut.status, 504, r.name);
    delete process.env[r.env];
    n8nAnswers(200);
    const { result: missing } = await withLogs(() => r.handler(post(JSON.stringify(r.valid)) as never));
    assert.equal(missing.status, 500, r.name);
    Object.assign(process.env, ENV);
  }
});

test("over the rate limit gets a 429 on every form route", async () => {
  for (const r of ROUTES) {
    const fixed = { "x-forwarded-for": `10.99.0.${ROUTES.indexOf(r)}`, "content-type": "application/json" };
    n8nAnswers(200);
    let last = 0;
    for (let i = 0; i < 25 && last !== 429; i++) {
      const { result } = await withLogs(() => r.handler(new Request("http://localhost/api", { method: "POST", headers: fixed, body: "{}" }) as never));
      last = result.status;
    }
    assert.equal(last, 429, r.name);
  }
});

test("every log line carries the route's prefix, and visitor messages are unchanged", async () => {
  for (const r of ROUTES) {
    n8nAnswers(500);
    const { result, lines } = await withLogs(() => r.handler(post(JSON.stringify(r.valid)) as never));
    assert.ok(lines.length > 0, `${r.name} logs`);
    for (const line of lines) assert.ok(line.startsWith(`[${r.name}] `), `${r.name}: ${line}`);
    const body = await result.json();
    if (r.name === "careers") assert.deepEqual(body, { error: "Failed to submit application." });
    else assert.deepEqual(body, { success: false });
  }
});
