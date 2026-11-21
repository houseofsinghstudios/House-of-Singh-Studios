// The homepage (04) Start: the words and rules behind the call brief, pure so they are tested without
// React. Every question, option and line comes from the Project Planner's own content
// (src/lib/project-planner/content.ts) and the call length from src/lib/constants/booking.ts, so the
// homepage never says something the planner does not.
import { DISCOVERY_CALL_MINUTES } from "@/lib/constants/booking";
import { ACTIONS, CALL, NEEDS, SERVICE_LABELS, TOLD_QUESTIONS } from "@/lib/project-planner/content";
import { stepCount, toggleMulti } from "@/lib/project-planner/engine";
import type { EntryPlacement } from "@/lib/project-planner/start-links";
import { MAX_NEEDS, SERVICE_IDS, type ServiceId } from "@/lib/project-planner/types";
import { countWord } from "@/lib/what-we-do";

// The planner's questions for a named service: five (four when the visitor is unsure what they need).
export const QUESTION_TOTAL = stepCount(["identity"]);

// Where these links say the visitor came from (?from=), recorded by the planner and Brand Pulse as
// attribution.entryPlacement, as every link into them from elsewhere on the site does.
const HOME_START_PLACEMENT = "home_start" satisfies EntryPlacement;
export const PULSE_HREF = `/brand-pulse?from=${HOME_START_PLACEMENT}`;

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

// Question 01, as the planner asks it, with every one of its options, in its order and words.
export const FIRST_QUESTION = { text: NEEDS.question, help: NEEDS.helper };
export const CHIP_SERVICES = SERVICE_IDS;
export const chipLabel = (id: ServiceId) => SERVICE_LABELS[id];

// The questions after 01, by the planner's own short names. Priorities is skipped when the visitor is
// unsure what they need, as the planner skips it; the numbers follow.
export function laterQuestions(selected: readonly ServiceId[]): { number: string; title: string }[] {
  const titles = [TOLD_QUESTIONS.start, TOLD_QUESTIONS.goal, ...(selected.includes("unsure") ? [] : [TOLD_QUESTIONS.priorities]), TOLD_QUESTIONS.timing];
  return titles.map((title, i) => ({ number: String(i + 2).padStart(2, "0"), title }));
}

// A tap, by the planner's own rule (toggleMulti): up to three; "I need help defining the work" stands
// alone, so choosing it clears the others and choosing another clears it. A fourth tap does nothing.
export function toggleChip(selected: readonly ServiceId[], id: ServiceId): ServiceId[] {
  const { next, tooMany } = toggleMulti(selected, id, "unsure", MAX_NEEDS);
  return tooMany ? [...selected] : next;
}

const answeredCount = (selected: readonly ServiceId[]) => (selected.length ? 1 : 0);
const totalFor = (selected: readonly ServiceId[]) => (selected.length ? stepCount([...selected]) : QUESTION_TOTAL);
export const countText = (selected: readonly ServiceId[]) => `${answeredCount(selected)} of ${totalFor(selected)}`;

// "Brand identity or rebrand, Website added. 1 of 5 answered."
export function chipAnnouncement(before: readonly ServiceId[], after: readonly ServiceId[]): string {
  const removed = before.filter((s) => !after.includes(s));
  const added = after.filter((s) => !before.includes(s));
  const what = added.length ? `${after.map(chipLabel).join(", ")} added` : `${removed.map(chipLabel).join(", ")} removed`;
  return `${what}. ${answeredCount(after)} of ${totalFor(after)} answered.`;
}

// Into the planner: the chosen services in order, answered, so it opens on question 02; else question 01.
// Both carry the placement, so the brief records where it began.
export function planHref(selected: readonly ServiceId[]): string {
  const from = `from=${HOME_START_PLACEMENT}`;
  return selected.length ? `/start?service=${selected.join(",")}&begin=1&${from}` : `/start?begin=1&${from}`;
}

// "Started 21 November 2026", in Toronto time whatever the visitor's zone.
export function startedText(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", day: "numeric", month: "long", year: "numeric" }).formatToParts(date);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `Started ${part("day")} ${part("month")} ${part("year")}`;
}
