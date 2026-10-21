// First touch campaign tags (utm_source, utm_medium, utm_campaign). The first page a visitor lands
// on with any of them stores them in sessionStorage for the rest of the visit, never overwritten.
// Brand Pulse and the Project Planner use the tags on their own address when there are any,
// otherwise the stored ones, so a visitor who lands on the homepage from a campaign and then opens a
// tool is still attributed. Session storage only: no cookie, nothing kept after the tab closes.
// Every storage access is wrapped, since storage can be blocked.

export const CAMPAIGN_KEY = "hos-campaign";

export interface Campaign {
  source: string;
  medium: string;
  campaign: string;
}

type Store = Pick<Storage, "getItem" | "setItem">;

const EMPTY: Campaign = { source: "", medium: "", campaign: "" };
const MAX = 100;

// A tag is a short label. Anything that looks like an email address is dropped, so a mistagged
// link can never carry personal data into a tool's events.
function tag(value: unknown): string {
  if (typeof value !== "string") return "";
  const v = value.trim().slice(0, MAX);
  return v.includes("@") ? "" : v;
}

const hasAny = (c: Campaign) => Boolean(c.source || c.medium || c.campaign);

// The tags on an address's query string, or null when it carries none.
export function campaignFromSearch(search: string): Campaign | null {
  const p = new URLSearchParams(search);
  const c = { source: tag(p.get("utm_source")), medium: tag(p.get("utm_medium")), campaign: tag(p.get("utm_campaign")) };
  return hasAny(c) ? c : null;
}

export function readStoredCampaign(store: Store | null | undefined): Campaign | null {
  try {
    const raw: unknown = JSON.parse(store?.getItem(CAMPAIGN_KEY) ?? "null");
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    const c = { source: tag(r.source), medium: tag(r.medium), campaign: tag(r.campaign) };
    return hasAny(c) ? c : null;
  } catch {
    return null;
  }
}

// First touch only: stores the address's tags if there are any and nothing is stored yet.
export function rememberFirstTouch(search: string, store: Store | null | undefined): void {
  const c = campaignFromSearch(search);
  if (!c || readStoredCampaign(store)) return;
  try {
    store?.setItem(CAMPAIGN_KEY, JSON.stringify(c));
  } catch {
    // Storage blocked or full: the tool page's own address still counts.
  }
}

// What a tool records: its own address's tags if present, otherwise the stored first touch.
export function resolveCampaign(search: string, store: Store | null | undefined): Campaign {
  return campaignFromSearch(search) ?? readStoredCampaign(store) ?? EMPTY;
}

// sessionStorage, or null where reading the property itself throws.
export function sessionStore(): Store | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
