// The discovery call link from a brief. One parameter, notes, with no name, email, budget or free text:
// URLs end up in browser history, server logs and referrer headers.
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { SERVICE_LABELS, TIMING } from "./content";
import type { Answers, Brief } from "./types";

export function bookingNotes(briefId: string, brief: Brief, answers: Answers): string {
  const services = brief.services.map((s) => SERVICE_LABELS[s]).join(", ");
  return `Project brief ${briefId.slice(0, 8)}: ${brief.headline} Services: ${services}. Timing: ${TIMING.options[answers.timing]}.`;
}

export function bookingUrl(briefId: string, brief: Brief, answers: Answers): string {
  return `${DISCOVERY_CALL_URL}?notes=${encodeURIComponent(bookingNotes(briefId, brief, answers))}`;
}
