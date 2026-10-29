// The referring address the Project Planner and Brand Pulse send to n8n: origin and path only, never
// a query string or fragment. fetch is replaced, so nothing leaves the process. Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { originAndPath } from "@/lib/referrer";
import { buildPayload, parseEvent } from "@/lib/project-planner/events-server";
import { allAnswers } from "./brand-pulse/all-answers";
import { POST as brandPulse } from "@/app/api/brand-pulse/route";

process.env.N8N_BRAND_PULSE_WEBHOOK_URL = "http://n8n.test/brand-pulse";
process.env.N8N_WEBHOOK_SECRET = "test-secret";

const LEAKY = "https://www.google.com/search?q=pat+tester+pat@example.com#frag";

test("origin and path only; anything else is dropped", () => {
  assert.equal(originAndPath(LEAKY), "https://www.google.com/search");
  assert.equal(originAndPath("https://chatgpt.com/c/abc?token=secret"), "https://chatgpt.com/c/abc");
  assert.equal(originAndPath("android-app://com.google.android.gm/"), "");
  assert.equal(originAndPath("not an address"), "");
  assert.equal(originAndPath(""), "");
  assert.equal(originAndPath(42), "");
});

test("Project Planner: the server trims whatever the browser sent", () => {
  const e = parseEvent({ event: "started", briefId: "3f1c2b6e-8a4d-4c1e-9b7a-2d5e6f708192", attribution: { referrer: LEAKY } });
  assert.ok(typeof e !== "string");
  assert.equal((buildPayload(e, null, "2026-10-29T00:00:00.000Z") as { attribution: { referrer: string } }).attribution.referrer, "https://www.google.com/search");
});

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

test("Brand Pulse: the server trims whatever the browser sent, before n8n", async () => {
  const bodies: { attribution: { referrer: string } }[] = [];
  globalThis.fetch = (async (_u: string, init: RequestInit) => { bodies.push(JSON.parse(String(init.body))); return new Response("{}", { status: 200 }); }) as typeof fetch;
  const answers = allAnswers().next().value!;
  const res = await brandPulse(new Request("http://localhost/api/brand-pulse", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "10.7.7.7" },
    body: JSON.stringify({ event: "completed", resultId: "3f1c2b6e-8a4d-4c1e-9b7a-2d5e6f708194", gate: "none", answers, attribution: { referrer: LEAKY } }),
  }));
  assert.equal(res.status, 200);
  assert.equal(bodies[0].attribution.referrer, "https://www.google.com/search");
  assert.ok(!JSON.stringify(bodies[0]).includes("pat@example.com"));
});
