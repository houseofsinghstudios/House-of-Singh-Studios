// Google Analytics helpers: content groups, page context on every page view, and the consent gate.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { DEBUG_KEY, INTERNAL_KEY, SENT_KEY, configParams, contactEvent, contentGroup, flagFromSearch, isDiscoveryCallHref, leadParams, pageContext, safeService, setAllowed, startGtag, submissionId, syncDebugFlag, syncInternalFlag, track, trackOnce, trackPageView } from "@/lib/analytics";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { PARTNER_SERVICES } from "@/lib/partners/forms";
import { NOMINATION_SERVICES } from "@/lib/initiatives/nominations";
import { apply } from "@/lib/consent";
import { ANALYTICS_CONSENT_EVENT } from "@/lib/constants/consent";

// A stand in gtag that records every call.
const calls: unknown[][] = [];
Object.assign(globalThis, {
  window: { gtag: (...args: unknown[]) => calls.push(args), location: { hostname: "studios.houseofsingh.com" } },
  document: { set cookie(_: string) {} },
});

test("content group from the route", () => {
  const cases: [string, string][] = [
    ["/", "home"],
    ["/services", "services"], ["/services/brand-identity", "services"],
    ["/work", "work"], ["/work/marell-studio", "work"],
    ["/insights", "insights"], ["/insights/branding-agency-pricing-toronto", "insights"],
    ["/careers", "careers"],
    ["/start", "tools"], ["/brand-pulse", "tools"], ["/ai", "tools"],
    ["/initiatives", "initiatives"], ["/initiatives/commons", "initiatives"],
    ["/partners", "partners"], ["/about", "about"], ["/contact", "contact"],
    ["/privacy", "legal"], ["/terms", "legal"],
    ["/workshop", "other"], ["/starting", "other"], ["/no-such-page", "other"],
  ];
  for (const [path, group] of cases) assert.equal(contentGroup(path), group, path);
});

test("page context: the full address, its path, the title and the group", () => {
  assert.deepEqual(pageContext("https://studios.houseofsingh.com/services/brand-identity?from=home#faq", "Branding | House of Singh Studios"), {
    page_location: "https://studios.houseofsingh.com/services/brand-identity?from=home#faq",
    page_path: "/services/brand-identity",
    page_title: "Branding | House of Singh Studios",
    content_group: "services",
  });
});

test("without consent nothing is sent: no events, no page views", () => {
  calls.length = 0;
  setAllowed(false);
  track("tool_band_click", { tool: "pulse" });
  trackPageView("https://studios.houseofsingh.com/careers", "Careers");
  assert.equal(calls.length, 0);
});

test("each page view sets its page first, so later events belong to it, not the landing page", () => {
  calls.length = 0;
  setAllowed(true);
  trackPageView("https://studios.houseofsingh.com/careers", "Careers");
  trackPageView("https://studios.houseofsingh.com/", "Home");
  track("tool_band_click", { tool: "pulse", kind: "chip", value: "never" });
  assert.deepEqual(calls.map((c) => c.slice(0, 2)), [
    ["set", pageContext("https://studios.houseofsingh.com/careers", "Careers")],
    ["event", "page_view"],
    ["set", pageContext("https://studios.houseofsingh.com/", "Home")],
    ["event", "page_view"],
    ["event", "tool_band_click"],
  ]);
  // The last page set before the click is the homepage.
  const lastSet = calls.filter((c) => c[0] === "set").at(-1)![1] as { page_path: string; content_group: string };
  assert.deepEqual([lastSet.page_path, lastSet.content_group], ["/", "home"]);
  setAllowed(false);
});

test("the page view carries its page context as its own parameters, content_group included", () => {
  calls.length = 0;
  setAllowed(true);
  trackPageView("https://studios.houseofsingh.com/careers", "Careers");
  const view = calls.find((c) => c[0] === "event" && c[1] === "page_view")!;
  // On the event itself, not only through set: gtag does not add set's custom parameters to hits.
  assert.deepEqual(view[2], { page_location: "https://studios.houseofsingh.com/careers", page_path: "/careers", page_title: "Careers", content_group: "careers" });
  setAllowed(false);
});

test("every event carries the page the visitor is on; its own parameters win", () => {
  calls.length = 0;
  setAllowed(true);
  const w = (globalThis as unknown as { window: { location: Record<string, string> } }).window;
  const doc = (globalThis as unknown as { document: Record<string, unknown> }).document;
  w.location.href = "https://studios.houseofsingh.com/";
  Object.defineProperty(doc, "title", { value: "Home", configurable: true });
  track("tool_band_click", { tool: "pulse", kind: "chip", value: "never" });
  track("discovery_call_click", { page_path: "/contact" });
  assert.deepEqual(calls[0], ["event", "tool_band_click", { page_location: "https://studios.houseofsingh.com/", page_path: "/", page_title: "Home", content_group: "home", tool: "pulse", kind: "chip", value: "never" }]);
  assert.equal((calls[1][2] as Record<string, string>).page_path, "/contact");
  delete w.location.href;
  setAllowed(false);
});

test("a consent change is announced, so the tracker can start or stop", () => {
  const seen: string[] = [];
  const w = { dispatchEvent: (e: Event) => { if (e.type === ANALYTICS_CONSENT_EVENT) seen.push((e as CustomEvent).detail); return true; } };
  apply("granted", w as unknown as Window);
  apply("denied", w as unknown as Window);
  assert.deepEqual(seen, ["granted", "denied"]);
});

test("contact form: only a prospective client is a lead; the other paths have their own events", () => {
  for (const service of ["Brand Identity", "Visual Media", "Digital Design", "Creative Strategy", "Multiple Services", "Not sure", ""]) {
    assert.equal(contactEvent(service, "").name, "generate_lead", service);
    assert.equal(contactEvent(service, "").params.lead_type, "contact", service);
  }
  assert.deepEqual(contactEvent(PARTNER_SERVICES.introduction, "acme"), { name: "generate_lead", params: { lead_type: "partner_introduction", has_referral: true } });
  assert.deepEqual(contactEvent(NOMINATION_SERVICES.commons, "acme"), { name: "commons_nomination", params: {} });
  assert.deepEqual(contactEvent(NOMINATION_SERVICES.parallel, ""), { name: "parallel_suggestion", params: {} });
  assert.deepEqual(contactEvent(PARTNER_SERVICES.partnership, "acme"), { name: "partner_application", params: {} });
});

test("generate_lead parameters: type, the chosen service if any, whether a referral came with it", () => {
  assert.deepEqual(leadParams("contact", "Brand Identity", ""), { lead_type: "contact", service: "Brand Identity", has_referral: false });
  assert.deepEqual(leadParams("project_planner", "identity", "ref12"), { lead_type: "project_planner", service: "identity", has_referral: true });
  assert.deepEqual(leadParams("contact", "", ""), { lead_type: "contact", has_referral: false });
  // An introduction: the choice is the lead type, so no service.
  assert.deepEqual(leadParams("partner_introduction", PARTNER_SERVICES.introduction, ""), { lead_type: "partner_introduction", has_referral: false });
});

test("a service that could be personal data is never sent", () => {
  for (const bad of ["jane@example.com", "Call 416 555 0100", "x".repeat(41), "<script>", 42, null, undefined]) {
    assert.equal(safeService(bad), "", String(bad));
  }
  assert.equal(safeService(" Digital Design "), "Digital Design");
});

test("lead parameters never carry a name, email, phone number or message", () => {
  const params = leadParams("contact", "Jane Doe jane@example.com 4165550100", "");
  assert.deepEqual(params, { lead_type: "contact", has_referral: false });
});

test("discovery call links, with or without the notes added to them", () => {
  assert.equal(isDiscoveryCallHref(DISCOVERY_CALL_URL), true);
  assert.equal(isDiscoveryCallHref(`${DISCOVERY_CALL_URL}?notes=Brand%20Pulse%20result`), true);
  assert.equal(isDiscoveryCallHref(`${DISCOVERY_CALL_URL}/`), true);
  assert.equal(isDiscoveryCallHref("https://cal.com/houseofsinghstudios/other-call"), false);
  assert.equal(isDiscoveryCallHref("https://studios.houseofsingh.com/contact"), false);
  assert.equal(isDiscoveryCallHref("/start"), false);
});

test("internal flag: ?hos_internal=1 sets it, ?hos_internal=0 clears it, otherwise it stays", () => {
  assert.equal(flagFromSearch("?hos_internal=1", "hos_internal", false), true);
  assert.equal(flagFromSearch("?hos_internal=0", "hos_internal", true), false);
  assert.equal(flagFromSearch("?utm_source=x&hos_internal=1", "hos_internal", false), true);
  assert.equal(flagFromSearch("", "hos_internal", true), true);
  assert.equal(flagFromSearch("?hos_internal=yes", "hos_internal", false), false, "only 1 and 0 count");
  assert.equal(flagFromSearch("?hos_internal=yes", "hos_internal", true), true);
});

test("internal flag is kept in localStorage across visits", () => {
  const m = new Map<string, string>();
  const store = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
  assert.equal(syncInternalFlag("?hos_internal=1", store), true);
  assert.equal(m.get(INTERNAL_KEY), "1");
  assert.equal(syncInternalFlag("", store), true, "a later visit without the parameter keeps it");
  assert.equal(syncInternalFlag("?hos_internal=0", store), false);
  assert.equal(m.has(INTERNAL_KEY), false);
  assert.equal(syncInternalFlag("", store), false);
  // Blocked storage: the parameter still counts for this page, nothing throws.
  const blocked = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => { throw new Error("blocked"); } };
  assert.equal(syncInternalFlag("?hos_internal=1", blocked), true);
  assert.equal(syncInternalFlag("", null), false);
});

test("config: no automatic page view, no signals, traffic_type only on internal browsers, debug_mode only while debugging", () => {
  const base = { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false };
  assert.deepEqual(configParams(false), base);
  assert.deepEqual(configParams(true), { ...base, traffic_type: "internal" });
  assert.deepEqual(configParams(false, true), { ...base, debug_mode: true });
  assert.deepEqual(configParams(true, true), { ...base, traffic_type: "internal", debug_mode: true });
  assert.ok(!("debug_mode" in configParams(true, false)), "never debug_mode: false, which GA would read as on");
});

test("debug flag: ?hos_debug=1 for this session, ?hos_debug=0 off, kept in its own key", () => {
  const m = new Map<string, string>();
  const session = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
  assert.equal(syncDebugFlag("", session), false);
  assert.equal(syncDebugFlag("?hos_debug=1", session), true);
  assert.equal(m.get(DEBUG_KEY), "1");
  assert.equal(syncDebugFlag("", session), true, "later pages in the session stay in debug");
  assert.equal(syncDebugFlag("?hos_debug=0", session), false);
  assert.equal(m.has(DEBUG_KEY), false);
  // A new session starts with an empty sessionStorage, so debug is off again.
  const next = new Map<string, string>();
  assert.equal(syncDebugFlag("", { getItem: (k: string) => next.get(k) ?? null, setItem: () => {}, removeItem: () => {} }), false);
  // The two flags never touch each other's key.
  assert.equal(syncInternalFlag("?hos_debug=1", session), false);
  assert.equal(m.has(INTERNAL_KEY), false);
});

// ── Once per submission ──

const memoryStore = () => {
  const m = new Map<string, string>();
  return { m, getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};
const eventsNamed = (name: string) => calls.filter((c) => c[0] === "event" && c[1] === name).length;

test("one event per successful submission: the same id is never sent twice", () => {
  calls.length = 0;
  setAllowed(true);
  const store = memoryStore();
  const id = submissionId();
  assert.equal(trackOnce("generate_lead", id, { lead_type: "contact" }, store), true);
  assert.equal(trackOnce("generate_lead", id, { lead_type: "contact" }, store), false, "a second success callback");
  assert.equal(eventsNamed("generate_lead"), 1);
  // Two real submissions are two events.
  assert.equal(trackOnce("generate_lead", submissionId(), { lead_type: "contact" }, store), true);
  assert.equal(eventsNamed("generate_lead"), 2);
  setAllowed(false);
});

test("submission ids are random and distinct", () => {
  const ids = new Set(Array.from({ length: 200 }, submissionId));
  assert.equal(ids.size, 200);
  for (const id of ids) assert.match(id, /^[0-9a-f]{32}$/);
});

test("reloading or going back and forward to a success screen never sends it again", () => {
  calls.length = 0;
  setAllowed(true);
  const store = memoryStore();
  assert.equal(trackOnce("brand_pulse_complete", "result-1", {}, store), true);
  // What a reload, or a page restored from the back and forward cache, starts with: the same tab's
  // sessionStorage. The stored list alone is enough to refuse it, as a fresh page would read it.
  assert.deepEqual(JSON.parse(store.m.get(SENT_KEY)!), ["brand_pulse_complete:result-1"]);
  // A fresh page knows only the stored list: an id this page never sent, already in the list, is refused.
  const reloaded = memoryStore();
  reloaded.m.set(SENT_KEY, JSON.stringify(["brand_pulse_complete:sent-before-reload"]));
  assert.equal(trackOnce("brand_pulse_complete", "sent-before-reload", {}, reloaded), false);
  assert.equal(eventsNamed("brand_pulse_complete"), 1);
  setAllowed(false);
});

test("safe under React strict mode: an effect that runs twice sends once", () => {
  calls.length = 0;
  setAllowed(true);
  const store = memoryStore();
  const effect = () => { trackOnce("brand_pulse_complete", "result-2", {}, store); };
  effect(); // mount
  effect(); // strict mode runs the effect again after a simulated unmount
  assert.equal(eventsNamed("brand_pulse_complete"), 1);
  setAllowed(false);
});

test("blocked storage: the page itself still remembers what it sent", () => {
  calls.length = 0;
  setAllowed(true);
  const blocked = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
  assert.equal(trackOnce("job_application", "app-1", {}, blocked), true);
  assert.equal(trackOnce("job_application", "app-1", {}, blocked), false);
  assert.equal(eventsNamed("job_application"), 1);
  setAllowed(false);
});

test("without consent nothing is sent, and nothing is marked as sent", () => {
  calls.length = 0;
  setAllowed(false);
  const store = memoryStore();
  assert.equal(trackOnce("newsletter_signup", "sub-1", {}, store), false);
  assert.equal(calls.length, 0);
  assert.equal(store.m.has(SENT_KEY), false);
  assert.equal(trackOnce("newsletter_signup", "", {}, store), false, "no id, no event");
});

test("the list of sent submissions stays short", () => {
  setAllowed(true);
  const store = memoryStore();
  for (let i = 0; i < 80; i++) trackOnce("generate_lead", `id-${i}`, {}, store);
  const list = JSON.parse(store.m.get(SENT_KEY)!);
  assert.equal(list.length, 50);
  assert.equal(list.at(-1), "generate_lead:id-79");
  setAllowed(false);
});

// ── Debug mode and internal traffic: config only, never event parameters ──

// Starts gtag on a stand in window, then sends a page view and an event through it, and returns
// every queued command as plain arrays.
function queued(internal: boolean, debug: boolean) {
  const w: { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] } = {};
  let tags = 0;
  startGtag(w, internal, debug, () => { tags++; });
  const g = (globalThis as unknown as { window: { gtag: unknown; location: Record<string, string> } }).window;
  const saved = g.gtag;
  g.gtag = w.gtag;
  g.location.href = "https://studios.houseofsingh.com/careers";
  setAllowed(true);
  trackPageView("https://studios.houseofsingh.com/careers", "Careers");
  track("generate_lead", { lead_type: "contact", debug_mode: true, traffic_type: "internal" });
  setAllowed(false);
  g.gtag = saved;
  delete g.location.href;
  return { tags, commands: (w.dataLayer as IArguments[]).map((a) => Array.from(a)) };
}

test("debug flag on: the config call carries debug_mode: true, before the first page view", () => {
  const { tags, commands } = queued(false, true);
  assert.equal(tags, 1);
  assert.deepEqual(commands.map((c) => c[0] === "event" ? `event ${c[1]}` : c[0]), ["consent", "js", "config", "set", "event page_view", "event generate_lead"]);
  const config = commands.find((c) => c[0] === "config")!;
  assert.equal(config[1], "G-DKQYLQ90EK");
  assert.equal((config[2] as Record<string, unknown>).debug_mode, true);
  assert.ok(!("traffic_type" in (config[2] as object)));
  assert.ok(commands.indexOf(config) < commands.findIndex((c) => c[1] === "page_view"), "config is queued before the first page view");
});

test("debug flag off: no debug_mode anywhere in the config", () => {
  const config = queued(false, false).commands.find((c) => c[0] === "config")![2] as Record<string, unknown>;
  assert.ok(!("debug_mode" in config));
  assert.deepEqual(config, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
});

test("internal flag: traffic_type in the config, as before", () => {
  const config = queued(true, false).commands.find((c) => c[0] === "config")![2] as Record<string, unknown>;
  assert.equal(config.traffic_type, "internal");
  assert.ok(!("debug_mode" in config));
});

test("page views and every other event never carry debug_mode or traffic_type, whatever the flags", () => {
  for (const [internal, debug] of [[false, false], [true, false], [false, true], [true, true]]) {
    const { commands } = queued(internal, debug);
    const sent = commands.filter((c) => c[0] === "event" || c[0] === "set");
    assert.equal(sent.length, 3);
    for (const c of sent) {
      const params = (c[0] === "set" ? c[1] : c[2]) as Record<string, unknown>;
      assert.ok(!("debug_mode" in params) && !("traffic_type" in params), JSON.stringify(c));
    }
    const lead = sent.find((c) => c[1] === "generate_lead")![2] as Record<string, unknown>;
    assert.equal(lead.lead_type, "contact", "the event's own parameters still go");
  }
});

test("startGtag runs once per page", () => {
  const w: { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] } = {};
  let tags = 0;
  startGtag(w, false, true, () => { tags++; });
  startGtag(w, true, false, () => { tags++; });
  assert.equal(tags, 1);
  assert.equal((w.dataLayer as IArguments[]).filter((a) => a[0] === "config").length, 1);
});
