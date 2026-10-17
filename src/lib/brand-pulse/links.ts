// Share and booking links. Shared by the browser flow and the server route.
import { encode } from "./codec";
import { QUESTIONS } from "./content";
import { BOOKING_URL, SITE_URL } from "./settings";
import { QUESTION_ORDER, type Answers, type QuestionId, type Result } from "./types";

export function shareUrl(answers: Answers, origin: string = SITE_URL): string {
  return `${origin}/brand-pulse?r=${encode(answers)}`;
}

export function answerLabel<Q extends QuestionId>(q: Q, answers: Answers): string {
  const options: Record<string, { label: string }> = QUESTIONS[q].options;
  return options[answers[q]].label;
}

export function answerLabels(answers: Answers): Record<QuestionId, string> {
  return Object.fromEntries(QUESTION_ORDER.map((q) => [q, answerLabel(q, answers)])) as Record<QuestionId, string>;
}

const NOTE_NAMES: Record<QuestionId, string> = {
  industry: "Industry",
  updated: "Last update",
  weakest: "Weakest",
  consistent: "Side by side",
  handover: "Handover",
  clarity: "Clarity",
  ahead: "Next 12 months",
};

// The notes Cal.com shows on the booking, so the call starts from the result.
export function bookingNotes(answers: Answers, result: Result, share: string): string {
  const vitals = result.vitals.map((v) => `${v.label} ${v.levelLabel}`).join(", ");
  const facts = QUESTION_ORDER.map((q) => `${NOTE_NAMES[q]}: ${answerLabel(q, answers)}.`).join(" ");
  return `Brand Pulse: ${result.profileName}, ${result.pulseLabel}. ${vitals}. ${facts} Result: ${share}`;
}

// Email and name are added only when the visitor gave them in this session.
export function bookingUrl(answers: Answers, result: Result, share: string, contact?: { email?: string; name?: string }): string {
  const params: [string, string][] = [["notes", bookingNotes(answers, result, share)]];
  if (contact?.email) params.push(["email", contact.email]);
  if (contact?.name) params.push(["name", contact.name]);
  return `${BOOKING_URL}?${params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")}`;
}
