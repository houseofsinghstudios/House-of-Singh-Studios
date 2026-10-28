// Google Analytics 4 in the browser: the one way anything is sent. Nothing goes to Google unless the
// visitor's analytics consent is granted, not even a cookieless ping: the tracker
// (src/components/GoogleAnalytics.tsx) only starts gtag once consent is granted and opens the gate
// below; every page view and event passes through it.
//
// Every page view first sets the page it belongs to (location, path, title and content group), so
// any event sent after it, a click or a lead, is credited to the page the visitor is on, not to the
// page they landed on.

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
