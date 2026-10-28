// Google Analytics helpers: content groups, page context on every page view, and the consent gate.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { contactLeadType, contentGroup, isDiscoveryCallHref, leadParams, pageContext, safeService, setAllowed, track, trackPageView } from "@/lib/analytics";
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

test("a consent change is announced, so the tracker can start or stop", () => {
  const seen: string[] = [];
  const w = { dispatchEvent: (e: Event) => { if (e.type === ANALYTICS_CONSENT_EVENT) seen.push((e as CustomEvent).detail); return true; } };
  apply("granted", w as unknown as Window);
  apply("denied", w as unknown as Window);
  assert.deepEqual(seen, ["granted", "denied"]);
});

test("lead type from the contact form's service", () => {
  assert.equal(contactLeadType("Brand Identity"), "contact");
  assert.equal(contactLeadType(NOMINATION_SERVICES.commons), "contact");
  assert.equal(contactLeadType(""), "contact");
  assert.equal(contactLeadType(PARTNER_SERVICES.introduction), "partner_introduction");
  assert.equal(contactLeadType(PARTNER_SERVICES.partnership), "partner_application");
});

test("generate_lead parameters: type, the chosen service if any, whether a referral came with it", () => {
  assert.deepEqual(leadParams("contact", "Brand Identity", ""), { lead_type: "contact", service: "Brand Identity", has_referral: false });
  assert.deepEqual(leadParams("contact", NOMINATION_SERVICES.commons, "acme"), { lead_type: "contact", service: "Commons nomination (pro bono)", has_referral: true });
  assert.deepEqual(leadParams("project_planner", "identity", "ref12"), { lead_type: "project_planner", service: "identity", has_referral: true });
  assert.deepEqual(leadParams("contact", "", ""), { lead_type: "contact", has_referral: false });
  // Partner leads: the choice is the lead type, so no service.
  assert.deepEqual(leadParams("partner_introduction", PARTNER_SERVICES.introduction, ""), { lead_type: "partner_introduction", has_referral: false });
  assert.deepEqual(leadParams("partner_application", PARTNER_SERVICES.partnership, "x9"), { lead_type: "partner_application", has_referral: true });
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
