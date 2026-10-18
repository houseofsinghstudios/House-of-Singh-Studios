// Browser side of Project Planner events. Nothing is sent until the visitor starts, and contact
// details only with the send form. The server validates everything and recomputes the brief.

import type { Answers, BandId } from "@/lib/project-planner/types";

export interface Attribution {
  source: string;
  medium: string;
  campaign: string;
  landingPage: string;
  entryPlacement: string;
  // Origin and path only: query strings can carry personal details.
  referrer: string;
}

export interface Session {
  briefId: string;
  attribution: Attribution;
}

export interface Contact {
  name: string;
  email: string;
  company: string;
  location: string;
  note: string;
  marketingConsent: boolean;
}

// Where the visitor came from inside the site, from ?from= on our own links.
const PLACEMENTS = ["services", "case_study", "brand_pulse", "contact"];

function uuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function referrerOriginAndPath(): string {
  try {
    if (!document.referrer) return "";
    const u = new URL(document.referrer);
    return `${u.origin}${u.pathname}`;
  } catch {
    return "";
  }
}

export function startSession(): Session {
  const params = new URLSearchParams(window.location.search);
  const from = params.get("from") ?? "";
  return {
    briefId: uuid(),
    attribution: {
      source: params.get("utm_source") ?? "",
      medium: params.get("utm_medium") ?? "",
      campaign: params.get("utm_campaign") ?? "",
      landingPage: window.location.pathname,
      entryPlacement: PLACEMENTS.includes(from) ? from : "direct",
      referrer: referrerOriginAndPath(),
    },
  };
}

type EventBody =
  | { event: "started" }
  | { event: "viewed"; answers: Answers }
  | { event: "call_clicked" }
  | { event: "sent"; answers: Answers; optional: { investment?: BandId; website?: string; importantDate?: string }; contact: Contact; honeypot: string };

// Resolves true only when the server confirms the event was accepted. Never throws.
export async function sendEvent(session: Session, body: EventBody): Promise<boolean> {
  try {
    const res = await fetch("/api/project-planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, briefId: session.briefId, attribution: session.attribution }),
      keepalive: body.event === "call_clicked",
    });
    const data: unknown = await res.json().catch(() => null);
    return res.ok && !!data && (data as { success?: unknown }).success === true;
  } catch {
    return false;
  }
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
