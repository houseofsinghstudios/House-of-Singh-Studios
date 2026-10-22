// The shared n8n secret: every route sends it, and without it (or the webhook URL) nothing is sent.
// Run with: npm run test
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { n8nTarget, postToN8n, SECRET_HEADER, SECRET_VAR } from "@/lib/n8n";
import { allAnswers } from "./brand-pulse/all-answers";

const SECRET = "test-secret-value";
const URLS = {
  lead: "N8N_WEBHOOK_URL",
  careers: "N8N_CAREERS_WEBHOOK_URL",
  subscribe: "N8N_SUBSCRIBE_WEBHOOK_URL",
  "brand-pulse": "N8N_BRAND_PULSE_WEBHOOK_URL",
  "project-planner": "N8N_PROJECT_PLANNER_WEBHOOK_URL",
} as const;
type RouteName = keyof typeof URLS;

// fetch is replaced for the whole file: calls are recorded and answered with 200.
const calls: { url: string; headers: Headers; body: unknown }[] = [];
const realFetch = globalThis.fetch;
const realSetInterval = globalThis.setInterval;
const errors: string[] = [];
const realError = console.error;
const realLog = console.log;
before(() => {
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), headers: new Headers(init?.headers), body: JSON.parse(String(init?.body)) });
    return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  // Some routes start a cleanup interval on import; it must not keep the test process alive.
  globalThis.setInterval = ((...args: Parameters<typeof setInterval>) => {
    const t = realSetInterval(...args);
    (t as unknown as { unref?: () => void }).unref?.();
    return t;
  }) as typeof setInterval;
  console.error = (...a: unknown[]) => void errors.push(a.map(String).join(" "));
  console.log = () => {};
});
after(() => {
  globalThis.fetch = realFetch;
  globalThis.setInterval = realSetInterval;
  console.error = realError;
  console.log = realLog;
});

let ip = 0;
function request(body: unknown): Request {
  ip++;
  return new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.9.0.${ip}` },
    body: JSON.stringify(body),
  });
}
const uuid = (n: number) => `3f1c2b6e-8a4d-4c1e-9b7a-${String(n).padStart(12, "0")}`;
const bodies: Record<RouteName, () => unknown> = {
  lead: () => ({ name: "Test", email: "test@example.com", message: "Hello" }),
  careers: () => ({ name: "Test", email: "test@example.com", role: "Designer" }),
  subscribe: () => ({ email: "test@example.com", source: "footer-subscribe" }),
  "brand-pulse": () => ({ event: "completed", resultId: uuid(ip + 1), gate: "none", answers: allAnswers().next().value, attribution: {} }),
  "project-planner": () => ({ event: "started", briefId: uuid(ip + 1000), attribution: {} }),
};
async function post(route: RouteName): Promise<Response> {
  const mod = (await import(`@/app/api/${route}/route`)) as { POST: (r: Request) => Promise<Response> };
  return mod.POST(request(bodies[route]()) as never);
}
function setEnv(route: RouteName, url: boolean, secret: boolean) {
  for (const v of Object.values(URLS)) delete process.env[v];
  delete process.env[SECRET_VAR];
  if (url) process.env[URLS[route]] = `https://n8n.example.test/${route}`;
  if (secret) process.env[SECRET_VAR] = SECRET;
}

test("helper: target needs both the URL and the secret, and names what is missing", () => {
  assert.deepEqual(n8nTarget("X_URL", { X_URL: "https://a.test", [SECRET_VAR]: "s" }), { url: "https://a.test", secret: "s" });
  assert.deepEqual(n8nTarget("X_URL", { [SECRET_VAR]: "s" }), { missing: "X_URL" });
  assert.deepEqual(n8nTarget("X_URL", { X_URL: "https://a.test" }), { missing: SECRET_VAR });
  assert.deepEqual(n8nTarget("X_URL", { X_URL: "https://a.test", [SECRET_VAR]: "" }), { missing: SECRET_VAR });
});

test("helper: posts JSON with the secret header", async () => {
  calls.length = 0;
  await postToN8n({ url: "https://a.test/hook", secret: SECRET }, { a: 1 });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].headers.get(SECRET_HEADER), SECRET);
  assert.equal(calls[0].headers.get("content-type"), "application/json");
  assert.deepEqual(calls[0].body, { a: 1 });
});

for (const route of Object.keys(URLS) as RouteName[]) {
  test(`${route}: sends the secret header to its own webhook`, async () => {
    setEnv(route, true, true);
    calls.length = 0;
    const res = await post(route);
    assert.equal(res.status, 200, await res.clone().text());
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, `https://n8n.example.test/${route}`);
    assert.equal(calls[0].headers.get(SECRET_HEADER), SECRET);
  });

  test(`${route}: without the secret, 500 and no request; the log names the variable, never a value`, async () => {
    setEnv(route, true, false);
    calls.length = 0;
    errors.length = 0;
    const res = await post(route);
    assert.equal(res.status, 500);
    assert.equal(calls.length, 0);
    assert.equal(errors.length, 1);
    assert.match(errors[0], /N8N_WEBHOOK_SECRET is not configured/);
  });

  test(`${route}: without the webhook URL, 500 and no request`, async () => {
    setEnv(route, false, true);
    calls.length = 0;
    errors.length = 0;
    const res = await post(route);
    assert.equal(res.status, 500);
    assert.equal(calls.length, 0);
    assert.ok(errors.some((e) => e.includes(URLS[route])) && !errors.some((e) => e.includes(SECRET)));
  });
}
