// Security hardening from the audit of 20 Nov 2026: JSON only and own origin only on the form routes
// (finding 2), CSP violation reporting (finding 3), Cross-Origin-Opener-Policy (finding 4) and Speed
// Insights under the consent rule (finding 5). fetch is replaced, so nothing leaves the process.
// Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import nextConfig from "../next.config";
import { POST as lead } from "@/app/api/lead/route";
import { POST as careers } from "@/app/api/careers/route";
import { POST as subscribe } from "@/app/api/subscribe/route";
import { POST as brandPulse } from "@/app/api/brand-pulse/route";
import { POST as planner } from "@/app/api/project-planner/route";
import { POST as cspReport, REPORT_MAX_BYTES, reportLine } from "@/app/api/csp-report/route";
import { isJsonRequest, originAllowed, SITE_ORIGIN } from "@/lib/request-guards";
import { effectiveState } from "@/lib/consent";

Object.assign(process.env, {
  N8N_WEBHOOK_URL: "http://n8n.test/lead",
  N8N_CAREERS_WEBHOOK_URL: "http://n8n.test/careers",
  N8N_SUBSCRIBE_WEBHOOK_URL: "http://n8n.test/subscribe",
  N8N_BRAND_PULSE_WEBHOOK_URL: "http://n8n.test/brand-pulse",
  N8N_PROJECT_PLANNER_WEBHOOK_URL: "http://n8n.test/planner",
  N8N_WEBHOOK_SECRET: "test-secret",
});

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });
// Records every outbound call: a refused request must send nothing.
function stubN8n() {
  const sent: string[] = [];
  globalThis.fetch = (async (url: string) => { sent.push(String(url)); return new Response("{}", { status: 200 }); }) as typeof fetch;
  return sent;
}

async function quiet<T>(run: () => Promise<T>): Promise<T> {
  const original = { log: console.log, error: console.error, warn: console.warn };
  console.log = console.error = console.warn = () => {};
  try { return await run(); } finally { Object.assign(console, original); }
}

let ip = 0;
const post = (headers: Record<string, string>, body = "{}") =>
  new Request("http://localhost/api", { method: "POST", headers: { "x-forwarded-for": `10.77.${Math.floor(++ip / 250)}.${ip % 250}`, ...headers }, body });

const FOUR = [
  { name: "careers", handler: careers },
  { name: "subscribe", handler: subscribe },
  { name: "brand-pulse", handler: brandPulse },
  { name: "project-planner", handler: planner },
] as const;

test("finding 2: the four form routes answer 415 to anything but JSON, and send nothing", async () => {
  for (const r of FOUR) {
    for (const type of ["text/plain", "application/x-www-form-urlencoded", "multipart/form-data; boundary=x", ""]) {
      const sent = stubN8n();
      const headers: Record<string, string> = type ? { "content-type": type } : {};
      const res = await quiet(() => r.handler(post(headers, '{"email":"ada@example.com"}') as never));
      assert.equal(res.status, 415, `${r.name} ${type || "no content type"}`);
      assert.deepEqual(sent, [], `${r.name} sent nothing`);
    }
    // JSON with a charset still counts as JSON (and then meets the routes' own checks).
    const ok = await quiet(() => r.handler(post({ "content-type": "application/json; charset=utf-8" }, "not json") as never));
    assert.equal(ok.status, 400, `${r.name} JSON is let through to its own checks`);
  }
});

test("finding 2: a post from another website gets 403 on every form route; the site and its previews pass", async () => {
  for (const r of [...FOUR, { name: "lead", handler: lead }]) {
    const sent = stubN8n();
    const res = await quiet(() => r.handler(post({ "content-type": "application/json", origin: "https://evil.example" }) as never));
    assert.equal(res.status, 403, r.name);
    assert.deepEqual(sent, [], `${r.name} sent nothing`);
    for (const origin of [SITE_ORIGIN, "https://house-of-singh-studios-git-152664-houseofsinghstudios-projects.vercel.app"]) {
      const allowed = await quiet(() => r.handler(post({ "content-type": "application/json", origin }, "not json") as never));
      assert.equal(allowed.status, 400, `${r.name} from ${origin} reaches its own checks`);
    }
  }
  // Lead keeps its own answer for a plain form post: the page for visitors without JavaScript.
  const plain = await quiet(() => lead(post({ "content-type": "application/x-www-form-urlencoded" }, "name=Ada") as never));
  assert.equal(plain.status, 415);
  assert.match(plain.headers.get("content-type") ?? "", /text\/html/);
});

test("finding 2: the origin rule itself", () => {
  const req = (origin?: string) => new Request("http://localhost/api", { method: "POST", headers: origin ? { origin } : {} });
  assert.ok(originAllowed(req()), "no Origin: judged by the other checks");
  assert.ok(originAllowed(req("https://studios.houseofsingh.com"), "production"));
  assert.ok(originAllowed(req("https://house-of-singh-studios.vercel.app"), "production"));
  assert.ok(originAllowed(req("https://house-of-singh-studios-abc123-houseofsinghstudios-projects.vercel.app"), "production"));
  for (const bad of ["https://evil.example", "https://studios.houseofsingh.com.evil.example", "http://studios.houseofsingh.com", "https://houseofsingh.com", "https://other-project-houseofsinghstudios-projects.vercel.app", "https://house-of-singh-studios-x-otherteam.vercel.app", "null"]) {
    assert.ok(!originAllowed(req(bad), "production"), bad);
  }
  assert.ok(originAllowed(req("http://localhost:3000"), "development"), "local development");
  assert.ok(!originAllowed(req("http://localhost:3000"), "production"), "never localhost in production");
  assert.ok(isJsonRequest(new Request("http://x", { method: "POST", headers: { "content-type": "Application/JSON" } })));
});

test("finding 3: the CSP report route keeps 2 KB, logs one clean line and answers 204", async () => {
  const lines: string[] = [];
  const original = console.warn;
  console.warn = (...args: unknown[]) => { lines.push(args.map(String).join(" ")); };
  try {
    const report = JSON.stringify([{ type: "csp-violation", body: { documentURL: "https://studios.houseofsingh.com/brand-pulse?r=private#x", blockedURL: "https://evil.example/x.js?token=abc", effectiveDirective: "script-src-elem" } }]);
    const res = await cspReport(post({ "content-type": "application/reports+json" }, report));
    assert.equal(res.status, 204);
    assert.equal(lines.length, 1);
    assert.match(lines[0], /^\[csp-report\] /);
    assert.ok(!lines[0].includes("r=private") && !lines[0].includes("token=abc") && !lines[0].includes("#x"), "no query strings or fragments");
    assert.ok(lines[0].includes("https://studios.houseofsingh.com/brand-pulse") && lines[0].includes("script-src-elem"));
    // A large report: only the first 2 KB is read, on one line.
    lines.length = 0;
    const big = await cspReport(post({ "content-type": "application/csp-report" }, `{"csp-report":"${"a\n".repeat(5000)}"}`));
    assert.equal(big.status, 204);
    assert.equal(lines.length, 1);
    assert.ok(lines[0].length <= REPORT_MAX_BYTES + 20, `line length ${lines[0].length}`);
    assert.ok(!lines[0].includes("\n"));
  } finally {
    console.warn = original;
  }
  assert.equal(reportLine("a\r\nb\u0000c  d"), "a b c d");
});

test("finding 3: the CSP report route uses the shared rate limiter", async () => {
  const fixed = { "x-forwarded-for": "10.99.99.99", "content-type": "application/reports+json" };
  const statuses: number[] = [];
  await quiet(async () => {
    for (let i = 0; i < 22; i++) statuses.push((await cspReport(new Request("http://localhost/api/csp-report", { method: "POST", headers: fixed, body: "[]" }))).status);
  });
  assert.deepEqual(statuses.slice(0, 20), Array(20).fill(204));
  assert.deepEqual(statuses.slice(20), [429, 429]);
});

test("findings 3 and 4: report-to and Reporting-Endpoints added, COOP set, every other directive unchanged", async () => {
  const rules = await nextConfig.headers!();
  const site = rules.find((r) => r.source === "/(.*)")!;
  const header = (key: string) => site.headers.find((h) => h.key === key)?.value;
  assert.equal(header("Cross-Origin-Opener-Policy"), "same-origin-allow-popups");
  assert.equal(header("Reporting-Endpoints"), 'csp="/api/csp-report"');
  const csp = header("Content-Security-Policy")!.split("; ");
  assert.equal(csp.at(-1), "report-to csp");
  assert.deepEqual(csp.slice(0, -1).map((d) => d.split(" ")[0]), [
    "default-src", "script-src", "style-src", "img-src", "font-src", "connect-src", "frame-src", "frame-ancestors", "object-src", "base-uri", "form-action",
  ]);
  assert.ok(csp.includes("script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms"));
});

test("finding 5: Speed Insights follows the consent rule, never loading before consent in strict regions", () => {
  const layout = readFileSync("src/app/(site)/layout.tsx", "utf8");
  assert.doesNotMatch(layout, /<SpeedInsights \/>/, "the layout never renders Speed Insights directly");
  assert.match(layout, /<ConsentedSpeedInsights \/>/);
  const wrapper = readFileSync("src/components/ConsentedSpeedInsights.tsx", "utf8");
  assert.match(wrapper, /useState\(false\)/, "nothing loads until the region is known");
  assert.match(wrapper, /effectiveState\(strict, readChoice\(\)\) === "granted"/);
  assert.match(wrapper, /ANALYTICS_CONSENT_EVENT/);
  assert.match(wrapper, /return allowed \? <SpeedInsights \/> : null;/);
  // The rule it follows, unchanged: strict regions wait for a yes; elsewhere it loads by default.
  assert.equal(effectiveState(true, null), "denied");
  assert.equal(effectiveState(false, null), "granted");
});
