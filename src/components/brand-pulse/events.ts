// Browser side of Brand Pulse events: attribution capture and posting to /api/brand-pulse.
// Answers are sent only once the result is shown. The server recomputes the result itself.

import { parsePlacement, type EntryPlacement } from "@/lib/brand-pulse/entry";
import type { Answers, Feedback, Gate, TeamSize } from "@/lib/brand-pulse/types";
import type { LeadSource } from "@/lib/lead-source";
import { captureAttribution, uuid, type ToolAttribution } from "@/lib/tool-attribution";

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
  attribution: ToolAttribution<EntryPlacement>;
}

// Captured once when the flow starts and kept in memory for the session.
export function startSession(): PulseSession {
  return { resultId: uuid(), attribution: captureAttribution(parsePlacement) };
}

type EventBody =
  | { event: "completed" }
  | { event: "feedback"; feedback: Feedback }
  | { event: "lead"; contact: LeadContact; honeypot?: string; leadSource: LeadSource | null }
  | { event: "profile"; contact: ProfileContact; honeypot?: string; leadSource: LeadSource | null };

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
