// The lead source sent with every enquiry: where the session began, kept for the session only and
// forwarded to n8n by the contact, Project Planner and Brand Pulse routes. fetch is replaced, so
// nothing leaves the process. Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { LEAD_SOURCE_KEY, cleanLeadSource, leadSourceAtStart, readLeadSource, rememberLeadSource } from "@/lib/lead-source";
import { buildPayload, parseEvent } from "@/lib/project-planner/events-server";
import { pricingFromDocument } from "@/lib/project-planner/pricing";
import { allAnswers } from "./brand-pulse/all-answers";
import { POST as lead } from "@/app/api/lead/route";
import { POST as brandPulse } from "@/app/api/brand-pulse/route";

process.env.N8N_WEBHOOK_URL = "http://n8n.test/lead";
process.env.N8N_BRAND_PULSE_WEBHOOK_URL = "http://n8n.test/brand-pulse";
process.env.N8N_WEBHOOK_SECRET = "test-secret";

const SITE = "https://studios.houseofsingh.com";
const CAMPAIGN_URL = `${SITE}/?utm_source=google&utm_medium=organic&utm_campaign=gbp`;
const FULL = { landing_page: "/", referrer: "www.google.com", utm_source: "google", utm_medium: "organic", utm_campaign: "gbp" };
const DIRECT = { landing_page: "/services/brand-identity" };

const memory = () => {
  const m = new Map<string, string>();
  return { m, getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

// ── Capture, in the browser ──

test("a first URL with utm_source=google, utm_medium=organic, utm_campaign=gbp from Google gives all five", () => {
  assert.deepEqual(leadSourceAtStart(CAMPAIGN_URL, "https://www.google.com/"), FULL);
});

test("a direct session gives landing_page only", () => {
  assert.deepEqual(leadSourceAtStart(`${SITE}/services/brand-identity`, ""), DIRECT);
});

test("only another site counts as the referrer, by domain only; the landing page has no query or fragment", () => {
  assert.deepEqual(leadSourceAtStart(`${SITE}/work?name=Pat&email=pat@example.com#top`, `${SITE}/about`), { landing_page: "/work" });
  assert.deepEqual(leadSourceAtStart(`${SITE}/`, "https://chatgpt.com/c/abc?q=private"), { landing_page: "/", referrer: "chatgpt.com" });
  assert.deepEqual(leadSourceAtStart(`${SITE}/`, "android-app://com.google.android.gm/"), { landing_page: "/" });
  // A tag that looks like an email address is dropped, as with the campaign tags.
  assert.deepEqual(leadSourceAtStart(`${SITE}/?utm_source=pat@example.com&utm_medium=email`, ""), { landing_page: "/", utm_medium: "email" });
});

test("the session's first page is kept; later pages never replace it", () => {
  const store = memory();
  rememberLeadSource(CAMPAIGN_URL, "https://www.google.com/", store);
  rememberLeadSource(`${SITE}/contact?utm_source=other`, `${SITE}/`, store);
  assert.deepEqual(readLeadSource(store), FULL);
  assert.ok(store.m.has(LEAD_SOURCE_KEY));
  // A new session (a new tab's empty sessionStorage) starts again.
  const next = memory();
  rememberLeadSource(`${SITE}/services/brand-identity`, "", next);
  assert.deepEqual(readLeadSource(next), DIRECT);
});

test("blocked storage: nothing is kept, nothing throws", () => {
  const blocked = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
  assert.doesNotThrow(() => rememberLeadSource(CAMPAIGN_URL, "", blocked));
  assert.equal(readLeadSource(blocked), null);
  assert.equal(readLeadSource(null), null);
});

test("the server applies the same rules to what a browser sends", () => {
  assert.deepEqual(cleanLeadSource(FULL), FULL);
  assert.deepEqual(cleanLeadSource({ ...FULL, extra: "x", referrer: "https://evil.example/path", utm_campaign: "a@b.co" }), { landing_page: "/", utm_source: "google", utm_medium: "organic" });
  assert.equal(cleanLeadSource({ landing_page: "https://elsewhere.example/" }), null);
  assert.equal(cleanLeadSource(null), null);
  assert.equal(cleanLeadSource("nope"), null);
});

// ── Forwarded to n8n by each lead route ──

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });
function capture() {
  const bodies: Record<string, unknown>[] = [];
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    bodies.push(JSON.parse(String(init.body)));
    return new Response("{}", { status: 200 });
  }) as typeof fetch;
  return bodies;
}
let ip = 0;
const req = (path: string, body: unknown) =>
  new Request(`http://localhost${path}`, { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": `10.9.9.${++ip}` }, body: JSON.stringify(body) });
const contact = { name: "Test", email: "test@example.test", service: "Brand Identity", message: "Hello.", permission: false };

test("contact, partner introduction and partner application send the lead source to n8n unchanged", async () => {
  for (const extra of [{}, { service: "Introducing a client", who: "A client", contact: "client@example.test", permission: true }, { service: "Becoming a partner", businessName: "Acme", partnerType: "Accountant", website: "" }]) {
    const bodies = capture();
    const res = await lead(req("/api/lead", { ...contact, ...extra, leadSource: FULL }) as never);
    assert.equal(res.status, 200, JSON.stringify(extra));
    assert.deepEqual(bodies[0].leadSource, FULL);
  }
  const direct = capture();
  await lead(req("/api/lead", { ...contact, leadSource: DIRECT }) as never);
  assert.deepEqual(direct[0].leadSource, DIRECT, "a direct session sends landing_page only");
  const none = capture();
  await lead(req("/api/lead", contact) as never);
  assert.ok(!("leadSource" in none[0]), "without a lead source the field is left out");
});

test("Project Planner: the sent brief carries the lead source, earlier events never do", () => {
  const ID = "3f1c2b6e-8a4d-4c1e-9b7a-2d5e6f708192";
  const answers = { needs: ["website"], primary: "website", start: "redesign", goal: "clarity", priorities: ["structure"], timing: "now" };
  const who = { name: "Test", email: "test@example.test", company: "", location: "", note: "", marketingConsent: false };
  const sent = parseEvent({ event: "sent", briefId: ID, attribution: {}, answers, optional: {}, contact: who, leadSource: FULL });
  assert.ok(typeof sent !== "string");
  assert.deepEqual((buildPayload(sent, pricingFromDocument(null), "2026-10-29T00:00:00.000Z") as Record<string, unknown>).leadSource, FULL);
  const direct = parseEvent({ event: "sent", briefId: ID, attribution: {}, answers, optional: {}, contact: who, leadSource: DIRECT });
  assert.ok(typeof direct !== "string");
  assert.deepEqual((buildPayload(direct, pricingFromDocument(null), "2026-10-29T00:00:00.000Z") as Record<string, unknown>).leadSource, DIRECT);
  const viewed = parseEvent({ event: "viewed", briefId: ID, attribution: {}, answers, leadSource: FULL });
  assert.ok(typeof viewed !== "string");
  assert.ok(!("leadSource" in buildPayload(viewed, pricingFromDocument(null), "2026-10-29T00:00:00.000Z")));
});

test("Brand Pulse: the email and details forms carry the lead source; the completed result does not", async () => {
  const answers = allAnswers().next().value!;
  const base = { resultId: "3f1c2b6e-8a4d-4c1e-9b7a-2d5e6f708193", gate: "none", answers, attribution: {} };
  const asLead = capture();
  assert.equal((await brandPulse(req("/api/brand-pulse", { ...base, event: "lead", contact: { email: "test@example.test" }, leadSource: FULL }))).status, 200);
  assert.deepEqual(asLead[0].leadSource, FULL);
  const asProfile = capture();
  assert.equal((await brandPulse(req("/api/brand-pulse", { ...base, event: "profile", contact: { email: "test@example.test", website: "" }, leadSource: DIRECT }))).status, 200);
  assert.deepEqual(asProfile[0].leadSource, DIRECT);
  const completed = capture();
  await brandPulse(req("/api/brand-pulse", { ...base, event: "completed", leadSource: FULL }));
  assert.ok(!("leadSource" in completed[0]), "nothing goes unless a form is submitted");
});
