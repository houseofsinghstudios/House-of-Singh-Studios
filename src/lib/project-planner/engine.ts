// Project Planner engine. Pure and rule based: buildBrief(answers, pricing) always gives the same
// brief for the same input. No randomness, no dates, no network. Pricing is passed in by the server.

import { BRAND_TIMELINES, BUDGET_BANDS, DELIVERED_FOR, MINIMUM_REVIEW_BUDGET, SERVICE_SLUGS } from "./config";
import {
  BRIEF, DEPENDENCY_NOTE, DISCOVERY, FIT, GOAL, HEADLINES, PRICE_CONFIRM, PRICE_LABELS, PRICE_LINES, PRICE_NOTE,
  PRICE_UNSURE, PRIORITIES, SERVICE_LABELS, START, SUCCESS, TIMELINES, TIMING, TOLD_QUESTIONS, TO_CONFIRM,
} from "./content";
import { formatDollars } from "@/lib/money";
import {
  BAND_IDS, GOAL_IDS, HELP, MAX_NEEDS, MAX_PRIORITIES, PRICED_SERVICES, PRIORITY_IDS, SERVICE_IDS, START_IDS, TIMING_IDS,
  type ActionId, type Answers, type BandId, type Brief, type Optional, type PriceLine, type PricedService, type Pricing, type ServiceId,
} from "./types";

export const ENGINE_VERSION = "1.0.0";

const isPriced = (s: ServiceId): s is PricedService => (PRICED_SERVICES as readonly string[]).includes(s);

export function priorityOptions(primary: ServiceId): readonly string[] {
  return isPriced(primary) ? PRIORITY_IDS[primary] : [];
}

// Steps for this path: P4 is skipped when the visitor is unsure what they need.
export function stepCount(needs: ServiceId[]): number {
  return needs.includes("unsure") ? 4 : 5;
}

// ── Draft answers while the visitor is still choosing ──

export type Draft = Partial<Answers> & { needs: ServiceId[] };

// A new main focus clears the starting point and priorities, which belong to one service.
// Goal and timing still make sense, so they stay.
export function withPrimary(d: Draft, primary: ServiceId): Draft {
  if (d.primary === primary) return d;
  return { needs: d.needs, primary, goal: d.goal, timing: d.timing };
}

// New service choices. The main focus stays if still chosen, otherwise the first choice takes over.
export function withNeeds(d: Draft, needs: ServiceId[]): Draft {
  const next: Draft = { ...d, needs };
  if (!needs.length) return { needs, goal: d.goal, timing: d.timing };
  return d.primary && needs.includes(d.primary) ? next : withPrimary(next, needs[0]);
}

// ── Validation (shared by the browser and the API route) ──

const oneOf = <T extends string>(list: readonly T[], v: unknown): v is T => typeof v === "string" && (list as readonly string[]).includes(v);

// Returns the answers when every id is allowed and the combination is consistent, otherwise an error.
export function validateAnswers(input: unknown): { ok: true; answers: Answers } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "answers missing" };
  const a = input as Record<string, unknown>;
  const needs = a.needs;
  if (!Array.isArray(needs) || needs.length < 1 || needs.length > MAX_NEEDS || !needs.every((n) => oneOf(SERVICE_IDS, n))) return { ok: false, error: "needs" };
  if (new Set(needs).size !== needs.length) return { ok: false, error: "needs repeated" };
  if (needs.includes("unsure") && needs.length > 1) return { ok: false, error: "unsure is exclusive" };
  if (!oneOf(SERVICE_IDS, a.primary) || !needs.includes(a.primary)) return { ok: false, error: "primary" };
  const primary = a.primary;
  if (!oneOf(START_IDS[primary], a.start)) return { ok: false, error: "start" };
  if (!oneOf(GOAL_IDS, a.goal)) return { ok: false, error: "goal" };
  if (!oneOf(TIMING_IDS, a.timing)) return { ok: false, error: "timing" };
  // The priorities step is skipped when unsure, so a draft may have no priorities at all.
  const priorities = primary === "unsure" && a.priorities === undefined ? [] : a.priorities;
  if (!Array.isArray(priorities)) return { ok: false, error: "priorities" };
  if (primary === "unsure") {
    if (priorities.length) return { ok: false, error: "no priorities when unsure" };
  } else {
    const allowed = [...priorityOptions(primary), HELP];
    if (priorities.length < 1 || priorities.length > MAX_PRIORITIES || !priorities.every((p) => oneOf(allowed, p))) return { ok: false, error: "priorities" };
    if (new Set(priorities).size !== priorities.length) return { ok: false, error: "priorities repeated" };
    if (priorities.includes(HELP) && priorities.length > 1) return { ok: false, error: "help is exclusive" };
  }
  return { ok: true, answers: { needs: needs as ServiceId[], primary, start: a.start as Answers["start"], goal: a.goal, priorities: priorities as Answers["priorities"], timing: a.timing } };
}

export function validBand(v: unknown): v is BandId {
  return oneOf(BAND_IDS, v);
}

// ── Pieces of the brief ──

const startLabel = (a: Answers) => START.options[a.primary][a.start];
const priorityLabel = (primary: ServiceId, p: string) => (p === HELP ? PRIORITIES.help : isPriced(primary) ? PRIORITIES.options[primary][p] : p);

export function answerLabels(a: Answers): Record<string, string> {
  return {
    needs: a.needs.map((n) => SERVICE_LABELS[n]).join(", "),
    primary: SERVICE_LABELS[a.primary],
    start: startLabel(a),
    goal: GOAL.options[a.goal],
    priorities: a.priorities.map((p) => priorityLabel(a.primary, p)).join(", "),
    timing: TIMING.options[a.timing],
  };
}

function told(a: Answers): Brief["told"] {
  const labels = answerLabels(a);
  const rows: Brief["told"] = [
    { step: 1, question: TOLD_QUESTIONS.needs, answer: labels.needs },
    { step: 1, question: TOLD_QUESTIONS.primary, answer: labels.primary },
    { step: 2, question: TOLD_QUESTIONS.start, answer: labels.start },
    { step: 3, question: TOLD_QUESTIONS.goal, answer: labels.goal },
  ];
  if (a.primary !== "unsure") rows.push({ step: 4, question: TOLD_QUESTIONS.priorities, answer: labels.priorities });
  rows.push({ step: stepCount(a.needs), question: TOLD_QUESTIONS.timing, answer: labels.timing });
  return a.needs.length > 1 ? rows : rows.filter((r) => r.question !== TOLD_QUESTIONS.primary);
}

// Selected priorities as given; "help" becomes discovery activities, never a guessed list.
function firstPhase(a: Answers): Brief["firstPhase"] {
  if (a.primary === "unsure") return { title: BRIEF.confirmTogetherTitle, items: [...DISCOVERY.unsure] };
  if (a.priorities.includes(HELP)) {
    const keep = (a.primary === "identity" || a.primary === "packaging") && a.start !== "new";
    return { title: BRIEF.confirmTogetherTitle, items: [DISCOVERY.review, DISCOVERY.choose, DISCOVERY.depends, ...(keep ? [DISCOVERY.keep] : [])] };
  }
  return { title: BRIEF.firstPhaseTitle, items: a.priorities.map((p) => priorityLabel(a.primary, p)) };
}

function investment(a: Answers, pricing: Pricing): Brief["investment"] {
  const base = { title: BRIEF.investmentTitle, note: PRICE_NOTE };
  if (a.primary === "unsure") return { ...base, lines: [], message: PRICE_UNSURE, timelines: null };
  // One line per selected service, primary first. Never a sum.
  const ordered = [a.primary, ...a.needs.filter((n) => n !== a.primary)].filter(isPriced);
  const lines: PriceLine[] = ordered.map((s) => {
    const amount = pricing.prices[s];
    return { service: s, label: PRICE_LABELS[s], amount, text: amount ? PRICE_LINES[s].replace("{price}", formatDollars(amount)) : PRICE_CONFIRM };
  });
  // Brand package durations: only for brand identity as the main focus, and never for packaging.
  const relevant = a.primary === "identity" && a.start !== "ready";
  const timelines = relevant ? { label: TIMELINES.label, text: TIMELINES.text(BRAND_TIMELINES().map((t) => `${t.timeline} (${t.name})`)) } : null;
  return { ...base, lines, message: null, timelines };
}

// Compares a stated range with the published starting price of the main service only.
export function budgetPosition(band: BandId | undefined, a: Answers, pricing: Pricing): "below" | "scope" | null {
  if (!band || band === "not_sure") return null;
  const upper = BUDGET_BANDS[band].upper;
  if (band === "under_1k" || (upper !== null && upper < MINIMUM_REVIEW_BUDGET)) return "below";
  const price = isPriced(a.primary) ? pricing.prices[a.primary] : null;
  // Hidden or unavailable price: never infer fit.
  if (!price) return null;
  return upper !== null && upper < price ? "below" : "scope";
}

function actions(a: Answers, band: BandId | undefined, position: "below" | "scope" | null): Brief["actions"] {
  if (band === "under_1k") return { primary: "focused", secondary: null };
  if (position === "below") return { primary: "focused", secondary: "book" };
  const soon = (a.timing === "now" || a.timing === "one_three") && a.primary !== "unsure";
  return soon ? { primary: "book", secondary: "send" } : { primary: "send", secondary: "book" };
}

export function buildBrief(a: Answers, pricing: Pricing, optional: Optional = {}): Brief {
  const position = budgetPosition(optional.investment, a, pricing);
  const also = a.needs.filter((n) => n !== a.primary);
  const delivered = DELIVERED_FOR[a.primary];
  const dependency = a.primary === "identity" && a.start === "new" && also.includes("website");
  return {
    engineVersion: ENGINE_VERSION,
    priceSource: pricing.source,
    intro: BRIEF.intro,
    headline: HEADLINES[a.primary][a.start],
    primaryService: a.primary,
    services: [a.primary, ...also],
    told: told(a),
    firstPhase: firstPhase(a),
    alsoRequested: also.map((s) => ({ service: s, label: SERVICE_LABELS[s], note: BRIEF.alsoNote })),
    dependencyNote: dependency ? DEPENDENCY_NOTE : null,
    success: SUCCESS[a.goal],
    toConfirm: TO_CONFIRM[a.primary],
    investment: investment(a, pricing),
    relatedWork: delivered ? { deliveredType: delivered, title: BRIEF.relatedTitle } : null,
    nextSteps: { title: BRIEF.nextTitle, text: BRIEF.next },
    fitNote: position === "below" ? FIT.below : position === "scope" ? FIT.scope : null,
    actions: actions(a, optional.investment, position),
    serviceSlug: SERVICE_SLUGS[a.primary],
  };
}

export type { ActionId };
