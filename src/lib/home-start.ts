// The homepage (04) Start: the words and rules behind the call brief, pure so they are tested without
// React. Every question, option and line comes from the Project Planner's own content
// (src/lib/project-planner/content.ts) and the call length from src/lib/constants/booking.ts, so the
// homepage never says something the planner does not.
import { DISCOVERY_CALL_MINUTES } from "@/lib/constants/booking";
import { ACTIONS, CALL, NEEDS, SERVICE_LABELS, TOLD_QUESTIONS } from "@/lib/project-planner/content";
import { stepCount } from "@/lib/project-planner/engine";
import { MAX_NEEDS, type ServiceId } from "@/lib/project-planner/types";
import { countWord } from "@/lib/what-we-do";

// The planner's questions for a named service: five (four only when the visitor is unsure).
export const QUESTION_TOTAL = stepCount(["identity"]);

export const START_COPY = {
  number: "04",
  label: "Start",
  heading: "Tell us about your business. We come to the call prepared.",
  sub: `${countWord(QUESTION_TOTAL)} quick questions, then pick a time. A ${DISCOVERY_CALL_MINUTES} minute call with the studio. No pitch, no obligation.`,
  pulseLead: "Not sure what needs work?",
  pulseLink: "Take the Brand Pulse",
  pulseTail: "One minute, free.",
  callLead: "Rather skip the questions?",
  callLink: "Book a discovery call",
  sheetTitle: "Your call brief",
  business: "Business",
  then: "Then",
  thenText: `${ACTIONS.book}.`,
  button: "Plan your project",
  line: CALL.line,
};

// Question 01, as the planner asks it, and the services offered as chips here (the board's five).
export const FIRST_QUESTION = { text: NEEDS.question, help: NEEDS.helper };
export const CHIP_SERVICES = ["identity", "website", "photo", "video", "packaging"] as const satisfies readonly ServiceId[];
export type ChipService = (typeof CHIP_SERVICES)[number];
export const chipLabel = (id: ChipService) => SERVICE_LABELS[id];

// Questions 02 to 05, by the planner's own short names.
export const LATER_QUESTIONS = [TOLD_QUESTIONS.start, TOLD_QUESTIONS.goal, TOLD_QUESTIONS.priorities, TOLD_QUESTIONS.timing].map((title, i) => ({
  number: String(i + 2).padStart(2, "0"),
  title,
}));

// A tap: on adds (up to three, as in the planner), off removes. A fourth tap does nothing.
export function toggleChip(selected: readonly ChipService[], id: ChipService): ChipService[] {
  if (selected.includes(id)) return selected.filter((s) => s !== id);
  return selected.length >= MAX_NEEDS ? [...selected] : [...selected, id];
}

const answeredCount = (selected: readonly ChipService[]) => (selected.length ? 1 : 0);
export const countText = (selected: readonly ChipService[]) => `${answeredCount(selected)} of ${QUESTION_TOTAL}`;

// "Brand identity or rebrand, Website added. 1 of 5 answered."
export function chipAnnouncement(before: readonly ChipService[], after: readonly ChipService[]): string {
  const removed = before.filter((s) => !after.includes(s));
  const what = removed.length ? `${removed.map(chipLabel).join(", ")} removed` : `${after.map(chipLabel).join(", ")} added`;
  return `${what}. ${answeredCount(after)} of ${QUESTION_TOTAL} answered.`;
}

// Into the planner: the chosen services in order, answered, so it opens on question 02; else question 01.
export function planHref(selected: readonly ChipService[]): string {
  return selected.length ? `/start?service=${selected.join(",")}&begin=1` : "/start?begin=1";
}

// "Started 21 November 2026", in Toronto time whatever the visitor's zone.
export function startedText(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", day: "numeric", month: "long", year: "numeric" }).formatToParts(date);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `Started ${part("day")} ${part("month")} ${part("year")}`;
}
