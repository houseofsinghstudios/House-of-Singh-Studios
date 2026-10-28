// Google Analytics helpers: content groups, page context on every page view, and the consent gate.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { contentGroup, pageContext, setAllowed, track, trackPageView } from "@/lib/analytics";
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
