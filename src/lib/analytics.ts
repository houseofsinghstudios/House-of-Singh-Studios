// Google Analytics 4 in the browser: the one way anything is sent. Nothing goes to Google unless the
// visitor's analytics consent is granted, not even a cookieless ping: the tracker
// (src/components/GoogleAnalytics.tsx) only starts gtag once consent is granted and opens the gate
// below; every page view and event passes through it.
//
// Every page view first sets the page it belongs to (location, path, title and content group), so
// any event sent after it, a click or a lead, is credited to the page the visitor is on, not to the
// page they landed on.

import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { NOMINATION_SERVICES } from "@/lib/initiatives/nominations";
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

export type LeadType = "contact" | "project_planner" | "partner_introduction";

// What a contact form submission is. Only a prospective paying client is a lead: an enquiry about
// the studio's services, or a client a partner introduces. A Commons nomination (pro bono), a
// Parallel suggestion (a brand for the studio to reimagine) and a partner's own application are
// not, so each has its own event, without parameters.
export type ContactEventName = "generate_lead" | "commons_nomination" | "parallel_suggestion" | "partner_application";

export function contactEvent(service: string, referralCode: string): { name: ContactEventName; params: EventParams } {
  if (service === NOMINATION_SERVICES.commons) return { name: "commons_nomination", params: {} };
  if (service === NOMINATION_SERVICES.parallel) return { name: "parallel_suggestion", params: {} };
  if (service === PARTNER_SERVICES.partnership) return { name: "partner_application", params: {} };
  const type: LeadType = service === PARTNER_SERVICES.introduction ? "partner_introduction" : "contact";
  return { name: "generate_lead", params: leadParams(type, service, referralCode) };
}

// A service is a choice from a list (a select value or a planner code), never typed text. Anything
// that does not look like one (digits, @, very long) is dropped rather than sent.
export function safeService(value: unknown): string {
  return typeof value === "string" && /^[A-Za-z][A-Za-z ()_-]{0,39}$/.test(value.trim()) ? value.trim() : "";
}

// generate_lead's parameters: the lead type, the service if one was chosen (an introduction has
// none: its choice is the lead type), and whether a partner's referral code came with it.
export function leadParams(leadType: LeadType, service: unknown, referralCode: string): EventParams {
  const s = leadType === "partner_introduction" ? "" : safeService(service);
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

// ── Internal traffic and debug flags ──

// Both are set by visiting any page with their parameter at 1 and cleared with it at 0.
// Internal (localStorage, lasts until cleared, on any network or device): GA4 is configured with
// traffic_type "internal", which the property's internal traffic filter removes.
// Debug (sessionStorage, this tab's session only): GA4 is configured with debug_mode, so the events
// show in DebugView. Debug traffic is still counted in reports unless the browser is internal too.
export const INTERNAL_KEY = "hos-internal";
export const INTERNAL_PARAM = "hos_internal";
export const DEBUG_KEY = "hos-debug";
export const DEBUG_PARAM = "hos_debug";

type FlagStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

// The flag after this address: the query parameter decides if present, otherwise what was stored.
export function flagFromSearch(search: string, param: string, stored: boolean): boolean {
  const value = new URLSearchParams(search).get(param);
  if (value === "1") return true;
  if (value === "0") return false;
  return stored;
}

// Reads the stored flag, applies this address's parameter, stores the result and returns it.
export function syncFlag(search: string, param: string, key: string, store: FlagStore | null): boolean {
  let stored = false;
  try {
    stored = store?.getItem(key) === "1";
  } catch {
    // Storage blocked: the parameter still applies to this page.
  }
  const next = flagFromSearch(search, param, stored);
  try {
    if (next) store?.setItem(key, "1");
    else store?.removeItem(key);
  } catch {
    // Storage blocked: nothing to keep.
  }
  return next;
}

export const syncInternalFlag = (search: string, store: FlagStore | null) => syncFlag(search, INTERNAL_PARAM, INTERNAL_KEY, store);
export const syncDebugFlag = (search: string, store: FlagStore | null) => syncFlag(search, DEBUG_PARAM, DEBUG_KEY, store);

// The GA4 config: page views are sent by the tracker, no Google signals or ad personalization,
// traffic_type "internal" on the studio's own browsers, and debug_mode only while debugging (GA
// treats any debug_mode value, even false, as on, so it is left out otherwise).
export function configParams(internal: boolean, debug = false): EventParams {
  return {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...(internal ? { traffic_type: "internal" } : {}),
    ...(debug ? { debug_mode: true } : {}),
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

// ── Once per submission ──

// sessionStorage: the submissions already reported in this tab, as "event:id", newest last. A lead
// or conversion goes once per submission id: a second success callback, a React strict mode double
// effect, a reload or going back and forward never sends it again.
export const SENT_KEY = "hos-ga-sent";
const MAX_SENT = 50;
const sentHere = new Set<string>();

type SentStore = Pick<Storage, "getItem" | "setItem">;

function sessionStorageOrNull(): SentStore | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

function readSent(store: SentStore | null): string[] {
  try {
    const list: unknown = JSON.parse(store?.getItem(SENT_KEY) ?? "[]");
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

// A new id for one form submission. Random, never derived from what the visitor typed.
export function submissionId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Sends the event for this submission unless it has been sent already. Returns whether it was sent.
export function trackOnce(event: string, id: string, params: EventParams = {}, store: SentStore | null = sessionStorageOrNull()): boolean {
  if (!id || !gtag()) return false;
  const key = `${event}:${id}`;
  const sent = readSent(store);
  if (sentHere.has(key) || sent.includes(key)) return false;
  sentHere.add(key);
  try {
    store?.setItem(SENT_KEY, JSON.stringify([...sent, key].slice(-MAX_SENT)));
  } catch {
    // Storage blocked or full: this page still remembers it.
  }
  track(event, params);
  return true;
}

// One page view for the current page, after setting it as the page every later event belongs to.
export function trackPageView(href: string, title: string) {
  const send = gtag();
  if (!send) return;
  send("set", pageContext(href, title));
  send("event", "page_view");
}
