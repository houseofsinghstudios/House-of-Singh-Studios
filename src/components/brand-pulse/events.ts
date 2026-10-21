// Browser side of Brand Pulse events: attribution capture and posting to /api/brand-pulse.
// Answers are sent only once the result is shown. The server recomputes the result itself.

import { resolveCampaign, sessionStore } from "@/lib/campaign";
import { parsePlacement, type EntryPlacement } from "@/lib/brand-pulse/entry";
import type { Answers, Feedback, Gate, TeamSize } from "@/lib/brand-pulse/types";

export interface Attribution {
  source: string;
  medium: string;
  campaign: string;
  landingPage: string;
  referrer: string;
  // Where the visitor came from inside the site, from ?from= on our own links, else "direct".
  entryPlacement: EntryPlacement;
}

export interface LeadContact {
  email: string;
  retakeReminder: boolean;
  marketingConsent: boolean;
}

export interface ProfileContact {
  email: string;
  name: string;
  company: string;
  website: string;
  teamSize: TeamSize | "";
}

export type SendStatus = "idle" | "sending" | "success" | "error";

export interface PulseSession {
  resultId: string;
  attribution: Attribution;
}

// randomUUID needs a secure context; the fallback builds the same version 4 shape.
function uuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// Captured once when the flow starts and kept in memory for the session.
export function startSession(): PulseSession {
  const params = new URLSearchParams(window.location.search);
  // This page's campaign tags if it has any, otherwise the visit's first touch tags.
  const { source, medium, campaign } = resolveCampaign(window.location.search, sessionStore());
  return {
    resultId: uuid(),
    attribution: {
      source,
      medium,
      campaign,
      landingPage: window.location.pathname,
      referrer: document.referrer,
      entryPlacement: parsePlacement(params.get("from")),
    },
  };
}

type EventBody =
  | { event: "completed" }
  | { event: "feedback"; feedback: Feedback }
  | { event: "lead"; contact: LeadContact; honeypot?: string }
  | { event: "profile"; contact: ProfileContact; honeypot?: string };

// Resolves true only when the server confirms n8n accepted the event. Never throws.
export async function sendEvent(session: PulseSession, gate: Gate, answers: Answers, body: EventBody): Promise<boolean> {
  try {
    const res = await fetch("/api/brand-pulse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, resultId: session.resultId, gate, answers, attribution: session.attribution }),
    });
    const data: unknown = await res.json().catch(() => null);
    return res.ok && !!data && (data as { success?: unknown }).success === true;
  } catch {
    return false;
  }
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
