// Where this visit began, sent with every enquiry: the landing page, the external site that sent the
// visitor (domain only) and the campaign tags, all as they were on the first page of the session.
// Kept in sessionStorage for this tab's session only, never long term, and sent nowhere unless the
// visitor submits a lead form (contact, Project Planner, partner introduction or application, Brand
// Pulse). Fields are named as n8n receives them: landing_page, referrer, utm_source, utm_medium,
// utm_campaign. A field with nothing to say is left out, so a direct visit sends landing_page only.

export const LEAD_SOURCE_KEY = "hos-lead-source";

export interface LeadSource {
  landing_page: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

type Store = Pick<Storage, "getItem" | "setItem">;

const TAG_MAX = 100;
const PATH_MAX = 200;
const HOST = /^[a-z0-9.-]{1,253}$/;

// A campaign tag is a short label; anything that looks like an email address is dropped.
function tag(value: unknown): string {
  if (typeof value !== "string") return "";
  const v = value.trim().slice(0, TAG_MAX);
  return v.includes("@") ? "" : v;
}

// A path on this site, without its query string or fragment, which could carry personal details.
function path(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/")) return "";
  return value.split(/[?#]/)[0].slice(0, PATH_MAX);
}

function host(value: unknown): string {
  if (typeof value !== "string") return "";
  const v = value.trim().toLowerCase();
  return HOST.test(v) ? v : "";
}

// Drops empty fields and keeps the order n8n sees.
function compact(s: LeadSource): LeadSource {
  const out: LeadSource = { landing_page: s.landing_page };
  if (s.referrer) out.referrer = s.referrer;
  if (s.utm_source) out.utm_source = s.utm_source;
  if (s.utm_medium) out.utm_medium = s.utm_medium;
  if (s.utm_campaign) out.utm_campaign = s.utm_campaign;
  return out;
}

// The lead source of a session starting at this address, arriving from this referrer. The referrer
// counts only when it is another site, and only its domain is kept.
export function leadSourceAtStart(href: string, referrer: string): LeadSource | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  let from = "";
  try {
    const r = new URL(referrer);
    if ((r.protocol === "http:" || r.protocol === "https:") && r.hostname !== url.hostname) from = host(r.hostname);
  } catch {
    // No referrer, or not an address: a direct visit.
  }
  const p = url.searchParams;
  const landing = path(url.pathname);
  if (!landing) return null;
  return compact({ landing_page: landing, referrer: from, utm_source: tag(p.get("utm_source")), utm_medium: tag(p.get("utm_medium")), utm_campaign: tag(p.get("utm_campaign")) });
}

// The same rules for a lead source a browser sent: what the server forwards to n8n.
export function cleanLeadSource(value: unknown): LeadSource | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const landing = path(v.landing_page);
  if (!landing) return null;
  return compact({ landing_page: landing, referrer: host(v.referrer), utm_source: tag(v.utm_source), utm_medium: tag(v.utm_medium), utm_campaign: tag(v.utm_campaign) });
}

export function readLeadSource(store: Store | null | undefined): LeadSource | null {
  try {
    return cleanLeadSource(JSON.parse(store?.getItem(LEAD_SOURCE_KEY) ?? "null"));
  } catch {
    return null;
  }
}

// Called on every page; only the first page of the session is kept.
export function rememberLeadSource(href: string, referrer: string, store: Store | null | undefined): void {
  if (readLeadSource(store)) return;
  const source = leadSourceAtStart(href, referrer);
  if (!source) return;
  try {
    store?.setItem(LEAD_SOURCE_KEY, JSON.stringify(source));
  } catch {
    // Storage blocked or full: enquiries simply go without a lead source.
  }
}
