// First touch campaign tags (utm_source, utm_medium, utm_campaign) and partner referral code (?ref=).
// The first page a visitor lands on with any of them stores them in sessionStorage for the rest of
// the visit, never overwritten. Brand Pulse, the Project Planner and the contact form use the tags
// on their own address when there are any, otherwise the stored ones, so a visitor who lands on the
// homepage from a campaign or a partner's link and then opens a tool is still attributed. Session
// storage only: no cookie, nothing kept after the tab closes. Every storage access is wrapped,
// since storage can be blocked.

export const CAMPAIGN_KEY = "hos-campaign";

export interface Campaign {
  source: string;
  medium: string;
  campaign: string;
  // A partner's code from ?ref=, lowercased: 2 to 40 letters or digits, otherwise "".
  referralCode: string;
}

type Store = Pick<Storage, "getItem" | "setItem">;

const EMPTY: Campaign = { source: "", medium: "", campaign: "", referralCode: "" };
const MAX = 100;

// A tag is a short label. Anything that looks like an email address is dropped, so a mistagged
// link can never carry personal data into a tool's events.
function tag(value: unknown): string {
  if (typeof value !== "string") return "";
  const v = value.trim().slice(0, MAX);
  return v.includes("@") ? "" : v;
}

const REFERRAL_CODE = /^[a-z0-9]{2,40}$/;

// A referral code is lowercased and kept only if it is 2 to 40 letters or digits.
export function referralCode(value: unknown): string {
  if (typeof value !== "string") return "";
  const v = value.trim().toLowerCase();
  return REFERRAL_CODE.test(v) ? v : "";
}

const hasTags = (c: Campaign) => Boolean(c.source || c.medium || c.campaign);
const hasAny = (c: Campaign) => hasTags(c) || Boolean(c.referralCode);

// The tags and referral code on an address's query string, or null when it carries none.
export function campaignFromSearch(search: string): Campaign | null {
  const p = new URLSearchParams(search);
  const c = { source: tag(p.get("utm_source")), medium: tag(p.get("utm_medium")), campaign: tag(p.get("utm_campaign")), referralCode: referralCode(p.get("ref")) };
  return hasAny(c) ? c : null;
}

// The same rules for a campaign a browser sent: what the server forwards.
export function cleanCampaign(value: unknown): Campaign {
  const r = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  return { source: tag(r.source), medium: tag(r.medium), campaign: tag(r.campaign), referralCode: referralCode(r.referralCode) };
}

export function readStoredCampaign(store: Store | null | undefined): Campaign | null {
  try {
    const raw: unknown = JSON.parse(store?.getItem(CAMPAIGN_KEY) ?? "null");
    if (!raw || typeof raw !== "object") return null;
    const c = cleanCampaign(raw);
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

// What a tool records: its own address's tags if present, otherwise the stored first touch. The
// referral code resolves on its own: the address's ?ref= wins over the stored one.
export function resolveCampaign(search: string, store: Store | null | undefined): Campaign {
  const own = campaignFromSearch(search);
  const stored = readStoredCampaign(store);
  const tags = own && hasTags(own) ? own : stored ?? EMPTY;
  return {
    source: tags.source,
    medium: tags.medium,
    campaign: tags.campaign,
    referralCode: own?.referralCode || stored?.referralCode || "",
  };
}

// sessionStorage, or null where reading the property itself throws.
export function sessionStore(): Store | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
