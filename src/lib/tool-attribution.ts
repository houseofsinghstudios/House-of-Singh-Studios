// What Brand Pulse and the Project Planner capture in the browser when a visitor starts them: a fresh
// id for the result or brief, and where the visit came from. One copy for both tools (audit finding 29,
// 22 Nov 2026); each tool passes its own reading of ?from=. Runs in the browser only.
import { resolveCampaign, sessionStore } from "@/lib/campaign";
import { originAndPath } from "@/lib/referrer";

export interface ToolAttribution<Placement extends string = string> {
  source: string;
  medium: string;
  campaign: string;
  // A partner's code from ?ref=, on this page or stored for the visit.
  referralCode: string;
  landingPage: string;
  // Where the visitor came from inside the site, from ?from= on our own links.
  entryPlacement: Placement;
  // Origin and path only: query strings can carry personal details.
  referrer: string;
}

// randomUUID needs a secure context; the fallback builds the same version 4 shape.
export function uuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// Captured once when the tool starts. This page's campaign tags if it has any, otherwise the visit's
// first touch tags.
export function captureAttribution<Placement extends string>(placement: (from: string | null) => Placement): ToolAttribution<Placement> {
  const params = new URLSearchParams(window.location.search);
  const { source, medium, campaign, referralCode } = resolveCampaign(window.location.search, sessionStore());
  return {
    source,
    medium,
    campaign,
    referralCode,
    landingPage: window.location.pathname,
    entryPlacement: placement(params.get("from")),
    referrer: originAndPath(document.referrer),
  };
}
