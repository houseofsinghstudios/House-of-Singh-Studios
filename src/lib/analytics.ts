// Google Analytics 4 in the browser: the one way anything is sent. Nothing goes to Google unless the
// visitor's analytics consent is granted, not even a cookieless ping: the tracker
// (src/components/GoogleAnalytics.tsx) only starts gtag once consent is granted and opens the gate
// below; every page view and event passes through it.
//
// Every page view first sets the page it belongs to (location, path, title and content group), so
// any event sent after it, a click or a lead, is credited to the page the visitor is on, not to the
// page they landed on.

import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { PARTNER_SERVICES } from "@/lib/partners/forms";

type Gtag = (...args: unknown[]) => void;
type GtagWindow = Window & { gtag?: Gtag; dataLayer?: unknown[] };

export type EventParams = Record<string, string | number | boolean>;

// ── Pure rules (unit tested) ──

// The site section a path belongs to, sent as content_group with every page view.
const GROUPS: [RegExp, string][] = [
  [/^\/$/, "home"],
  [/^\/services(\/|$)/, "services"],
  [/^\/work(\/|$)/, "work"],
  [/^\/insights(\/|$)/, "insights"],
  [/^\/careers(\/|$)/, "careers"],
  [/^\/(start|brand-pulse|ai)(\/|$)/, "tools"],
  [/^\/initiatives(\/|$)/, "initiatives"],
  [/^\/partners(\/|$)/, "partners"],
  [/^\/about(\/|$)/, "about"],
  [/^\/contact(\/|$)/, "contact"],
  [/^\/(privacy|terms)(\/|$)/, "legal"],
];

export function contentGroup(pathname: string): string {
  return GROUPS.find(([pattern]) => pattern.test(pathname))?.[1] ?? "other";
}

// What a page view sets before it is sent, so later events carry the same page.
export function pageContext(href: string, title: string) {
  const url = new URL(href);
  return { page_location: url.href, page_path: url.pathname, page_title: title, content_group: contentGroup(url.pathname) };
}

// ── Leads (sent only once the API has confirmed success) ──

export type LeadType = "contact" | "project_planner" | "partner_introduction" | "partner_application";

// The contact form's service decides the lead type: the two partner choices are partner leads.
export function contactLeadType(service: string): LeadType {
  if (service === PARTNER_SERVICES.introduction) return "partner_introduction";
  if (service === PARTNER_SERVICES.partnership) return "partner_application";
  return "contact";
}

// A service is a choice from a list (a select value or a planner code), never typed text. Anything
// that does not look like one (digits, @, very long) is dropped rather than sent.
export function safeService(value: unknown): string {
  return typeof value === "string" && /^[A-Za-z][A-Za-z ()_-]{0,39}$/.test(value.trim()) ? value.trim() : "";
}

// generate_lead's parameters: the lead type, the service if one was chosen (partner leads have
// none: their choice is the lead type), and whether a partner's referral code came with it.
export function leadParams(leadType: LeadType, service: unknown, referralCode: string): EventParams {
  const s = leadType === "partner_introduction" || leadType === "partner_application" ? "" : safeService(service);
  return { lead_type: leadType, ...(s ? { service: s } : {}), has_referral: Boolean(referralCode) };
}

// Any link to the discovery call booking page, with or without a query string.
export function isDiscoveryCallHref(href: string): boolean {
  try {
    const target = new URL(DISCOVERY_CALL_URL);
    const url = new URL(href, target);
    return url.origin === target.origin && url.pathname.replace(/\/$/, "") === target.pathname.replace(/\/$/, "");
  } catch {
    return false;
  }
}

// ── Internal traffic ──

// localStorage: "1" while this browser belongs to the studio. Visiting any page with ?hos_internal=1
// sets it and ?hos_internal=0 clears it; it lasts until cleared, on any network or device. While set,
// GA4 is configured with traffic_type "internal", which the property's internal traffic filter removes.
export const INTERNAL_KEY = "hos-internal";
export const INTERNAL_PARAM = "hos_internal";

type FlagStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

// The flag after this address: the query parameter decides if present, otherwise what was stored.
export function internalFlag(search: string, stored: boolean): boolean {
  const value = new URLSearchParams(search).get(INTERNAL_PARAM);
  if (value === "1") return true;
  if (value === "0") return false;
  return stored;
}

// Reads the stored flag, applies this address's parameter, stores the result and returns it.
export function syncInternalFlag(search: string, store: FlagStore | null): boolean {
  let stored = false;
  try {
    stored = store?.getItem(INTERNAL_KEY) === "1";
  } catch {
    // Storage blocked: the parameter still applies to this page.
  }
  const next = internalFlag(search, stored);
  try {
    if (next) store?.setItem(INTERNAL_KEY, "1");
    else store?.removeItem(INTERNAL_KEY);
  } catch {
    // Storage blocked: nothing to keep.
  }
  return next;
}

// The GA4 config: page views are sent by the tracker, no Google signals or ad personalization, and
// traffic_type "internal" on the studio's own browsers.
export function configParams(internal: boolean): EventParams {
  return {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...(internal ? { traffic_type: "internal" } : {}),
  };
}

// ── The gate ──

let allowed = false;

// Opened by the tracker once consent is granted and gtag is set up; closed when consent is withdrawn.
export function setAllowed(value: boolean) {
  allowed = value;
}

export function isAllowed(): boolean {
  return allowed;
}

function gtag(): Gtag | null {
  if (!allowed || typeof window === "undefined") return null;
  return (window as GtagWindow).gtag ?? null;
}

// One event. Never personal data: names, emails, phone numbers and messages never go in params.
export function track(event: string, params: EventParams = {}) {
  gtag()?.("event", event, params);
}

// One page view for the current page, after setting it as the page every later event belongs to.
export function trackPageView(href: string, title: string) {
  const send = gtag();
  if (!send) return;
  send("set", pageContext(href, title));
  send("event", "page_view");
}
