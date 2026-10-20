// Consent rules. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { CONSENT_KEY, CONSENT_MAX_AGE_MS, REGION_KEY } from "@/lib/constants/consent";
// consent.ts only reads browser globals inside its functions, so the stand ins below are in place in time.
import * as consent from "@/lib/consent";

// Minimal browser stand ins for the parts consent.ts touches.
const stores = { local: new Map<string, string>(), session: new Map<string, string>() };
const storage = (m: Map<string, string>) => ({ getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) });
const cookies: string[] = [];
let fetchCalls = 0;
const fetchAnswer: () => Promise<Response> = async () => new Response(JSON.stringify({ strict: true }));
Object.assign(globalThis, {
  localStorage: storage(stores.local),
  sessionStorage: storage(stores.session),
  window: { location: { hostname: "studios.houseofsingh.com" } },
  document: { set cookie(v: string) { cookies.push(v); } },
  fetch: async () => { fetchCalls++; return fetchAnswer(); },
});

const NOW = Date.UTC(2026, 9, 20);

test("region: one request for concurrent callers, cached for the session", async () => {
  const [a, b, c] = await Promise.all([consent.isStrictRegion(), consent.isStrictRegion(), consent.isStrictRegion()]);
  assert.deepEqual([a, b, c], [true, true, true]);
  assert.equal(fetchCalls, 1);
  assert.equal(stores.session.get(REGION_KEY), "strict");
});

test("stored choice: valid for 12 months, ignored when expired, malformed or from the future", () => {
  const raw = (analytics: string, decidedAt: number) => JSON.stringify({ analytics, decidedAt });
  assert.deepEqual(consent.parseChoice(raw("granted", NOW - 1000), NOW), { analytics: "granted", decidedAt: NOW - 1000 });
  assert.deepEqual(consent.parseChoice(raw("denied", NOW - CONSENT_MAX_AGE_MS + 1), NOW)?.analytics, "denied");
  assert.equal(consent.parseChoice(raw("granted", NOW - CONSENT_MAX_AGE_MS), NOW), null, "exactly 12 months old has expired");
  assert.equal(consent.parseChoice(raw("granted", NOW + 60000), NOW), null);
  assert.equal(consent.parseChoice(raw("maybe", NOW), NOW), null);
  assert.equal(consent.parseChoice("{not json", NOW), null);
  assert.equal(consent.parseChoice(null, NOW), null);
  assert.equal(consent.parseChoice(JSON.stringify({ analytics: "granted" }), NOW), null);
});

test("effective state: a stored choice wins, otherwise denied in strict regions and granted elsewhere", () => {
  const granted = { analytics: "granted" as const, decidedAt: NOW };
  const denied = { analytics: "denied" as const, decidedAt: NOW };
  assert.equal(consent.effectiveState(true, null), "denied");
  assert.equal(consent.effectiveState(false, null), "granted");
  assert.equal(consent.effectiveState(true, granted), "granted");
  assert.equal(consent.effectiveState(false, denied), "denied");
  assert.equal(consent.shouldAsk(true, null), true);
  assert.equal(consent.shouldAsk(true, denied), false);
  assert.equal(consent.shouldAsk(false, null), false);
});

test("store and read a choice through localStorage, with expiry", () => {
  consent.storeChoice("granted", NOW);
  assert.deepEqual(JSON.parse(stores.local.get(CONSENT_KEY)!), { analytics: "granted", decidedAt: NOW });
  assert.equal(consent.readChoice(NOW + 1000)?.analytics, "granted");
  assert.equal(consent.readChoice(NOW + CONSENT_MAX_AGE_MS), null);
});

test("apply: one GA update and one Clarity consentv2, advertising always denied; off clears Clarity cookies", () => {
  const calls: unknown[][] = [];
  const w = { gtag: (...a: unknown[]) => calls.push(["gtag", ...a]), clarity: (...a: unknown[]) => calls.push(["clarity", ...a]) };
  consent.apply("granted", w as unknown as Window);
  assert.deepEqual(calls, [
    ["gtag", "consent", "update", { analytics_storage: "granted" }],
    ["clarity", "consentv2", { ad_Storage: "denied", analytics_Storage: "granted" }],
  ]);
  assert.equal(cookies.length, 0);
  calls.length = 0;
  consent.apply("denied", w as unknown as Window);
  assert.deepEqual(calls, [
    ["gtag", "consent", "update", { analytics_storage: "denied" }],
    ["clarity", "consentv2", { ad_Storage: "denied", analytics_Storage: "denied" }],
  ]);
  assert.ok(cookies.some((c) => c.startsWith("_clck=; Max-Age=0")) && cookies.some((c) => c.startsWith("_clsk=; Max-Age=0")));
  assert.ok(cookies.some((c) => c.includes("domain=.houseofsingh.com")));
  // Without GA or Clarity on the page, apply does nothing and does not throw.
  consent.apply("granted", {} as Window);
});
