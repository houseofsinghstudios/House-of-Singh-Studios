// Browser side of Project Planner events. Nothing is sent until the visitor starts, and contact
// details only with the send form. The server validates everything and recomputes the brief.

import { parsePlacement } from "@/lib/project-planner/start-links";
import type { Answers, BandId } from "@/lib/project-planner/types";
import type { LeadSource } from "@/lib/lead-source";
import { captureAttribution, uuid, type ToolAttribution } from "@/lib/tool-attribution";

export interface Session {
  briefId: string;
  attribution: ToolAttribution;
}

export interface Contact {
  name: string;
  email: string;
  company: string;
  location: string;
  note: string;
  marketingConsent: boolean;
}

// "How did you hear about us?" and, for a recommendation or a partner, who it was. Both optional.
export interface Heard {
  hearAbout: string;
  recommendedBy: string;
}

export function startSession(): Session {
  return { briefId: uuid(), attribution: captureAttribution(parsePlacement) };
}

type EventBody =
  | { event: "started" }
  | { event: "viewed"; answers: Answers }
  | { event: "call_clicked" }
  | { event: "sent"; answers: Answers; optional: { investment?: BandId; website?: string; importantDate?: string }; contact: Contact; honeypot: string; leadSource: LeadSource | null } & Heard;

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
