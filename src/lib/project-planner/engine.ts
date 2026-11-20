// Project Planner engine. Pure and rule based: buildBrief(answers) always gives the same brief for
// the same input. No randomness, no dates, no network, and no prices: every brief ends in the call.

import { BRAND_TIMELINES, DELIVERED_FOR, SERVICE_SLUGS } from "./config";
import {
  BRIEF, DEPENDENCY_NOTE, DISCOVERY, GOAL, HEADLINES, PRIORITIES, SERVICE_LABELS, START, SUCCESS, TIMELINES, TIMING,
  TOLD_QUESTIONS, TO_CONFIRM,
} from "./content";
import {
  BAND_IDS, GOAL_IDS, HELP, MAX_NEEDS, MAX_PRIORITIES, NAMED_SERVICES, PRIORITY_IDS, SERVICE_IDS, START_IDS, TIMING_IDS,
  type ActionId, type Answers, type BandId, type Brief, type NamedService, type ServiceId,
} from "./types";

export const ENGINE_VERSION = "2.0.0";

const isNamed = (s: ServiceId): s is NamedService => (NAMED_SERVICES as readonly string[]).includes(s);

export function priorityOptions(primary: ServiceId): readonly string[] {
  return isNamed(primary) ? PRIORITY_IDS[primary] : [];
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
const priorityLabel = (primary: ServiceId, p: string) => (p === HELP ? PRIORITIES.help : isNamed(primary) ? PRIORITIES.options[primary][p] : p);

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

// Brand package durations: only for brand identity as the main focus, and never for packaging.
function timelines(a: Answers): Brief["timelines"] {
  if (a.primary !== "identity" || a.start === "ready") return null;
  return { title: BRIEF.timelinesTitle, label: TIMELINES.label, text: TIMELINES.text(BRAND_TIMELINES().map((t) => `${t.timeline} (${t.name})`)) };
}

// Every brief ends in the call: choosing a time comes first, sending the brief second.
const ACTIONS: Brief["actions"] = { primary: "book", secondary: "send" };

export function buildBrief(a: Answers): Brief {
  const also = a.needs.filter((n) => n !== a.primary);
  const delivered = DELIVERED_FOR[a.primary];
  const dependency = a.primary === "identity" && a.start === "new" && also.includes("website");
  return {
    engineVersion: ENGINE_VERSION,
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
    timelines: timelines(a),
    relatedWork: delivered ? { deliveredType: delivered, title: BRIEF.relatedTitle } : null,
    nextSteps: { title: BRIEF.nextTitle, text: BRIEF.next },
    actions: ACTIONS,
    serviceSlug: SERVICE_SLUGS[a.primary],
  };
}

export type { ActionId };
