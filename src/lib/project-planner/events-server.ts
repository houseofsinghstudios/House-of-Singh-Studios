// Server side of Project Planner events: validate each event's own shape, recompute the brief, and
// build the payload for n8n. Whatever brief, fit or price the browser sends is ignored.
import "server-only";
import { buildBrief, ENGINE_VERSION, answerLabels, validateAnswers, validBand } from "./engine";
import { bookingUrl } from "./links";
import { parsePlacement } from "./start-links";
import { REFERRAL_LIMITS } from "@/lib/partners/forms";
import type { Answers, Optional, Pricing } from "./types";

export const PLANNER_EVENTS = ["started", "viewed", "call_clicked", "sent"] as const;
export type PlannerEvent = (typeof PLANNER_EVENTS)[number];

// For n8n: one brief per briefId whose status only ever moves forward (started < viewed < sent).
// call_clicked is an intention signal recorded beside the status, never a booked or attended call.
export const STATUS_RANK: Record<PlannerEvent, number | null> = { started: 1, viewed: 2, sent: 3, call_clicked: null };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v: unknown, max: number): string => (typeof v === "string" ? v.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, max) : "");

// Origin and path only. Query strings and fragments can carry personal details.
function originAndPath(v: unknown): string {
  const raw = clean(v, 500);
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return /^https?:$/.test(u.protocol) ? `${u.origin}${u.pathname}`.slice(0, 300) : "";
  } catch {
    return "";
  }
}

function attribution(v: unknown) {
  const a = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const landing = clean(a.landingPage, 200);
  return {
    source: clean(a.source, 100),
    medium: clean(a.medium, 100),
    campaign: clean(a.campaign, 100),
    landingPage: landing.startsWith("/") ? landing.split(/[?#]/)[0] : "",
    entryPlacement: parsePlacement(a.entryPlacement),
    referrer: originAndPath(a.referrer),
  };
}

function website(v: unknown): string | null {
  const raw = clean(v, 200);
  if (!raw) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!u.hostname.includes(".")) return null;
    return `${u.protocol}//${u.host.toLowerCase()}${u.pathname === "/" ? "" : u.pathname}`.slice(0, 200);
  } catch {
    return null;
  }
}

function optional(v: unknown): Optional | string {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  if (o.investment !== undefined && o.investment !== null && o.investment !== "" && !validBand(o.investment)) return "Invalid investment";
  const site = website(o.website);
  if (site === null) return "Invalid website";
  return { investment: validBand(o.investment) ? o.investment : undefined, website: site, importantDate: clean(o.importantDate, 60) };
}

function contact(v: unknown) {
  const c = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const name = clean(c.name, 100);
  const email = clean(c.email, 254);
  if (!name) return "Name required";
  if (!EMAIL.test(email)) return "Invalid email";
  return { name, email, company: clean(c.company, 120), location: clean(c.location, 120), note: clean(c.note, 500), marketingConsent: c.marketingConsent === true };
}

export type ParsedEvent =
  | { event: "started"; briefId: string; attribution: ReturnType<typeof attribution> }
  | { event: "call_clicked"; briefId: string; attribution: ReturnType<typeof attribution> }
  | { event: "viewed"; briefId: string; attribution: ReturnType<typeof attribution>; answers: Answers }
  | { event: "sent"; briefId: string; attribution: ReturnType<typeof attribution>; answers: Answers; optional: Optional; contact: Exclude<ReturnType<typeof contact>, string>; honeypot: boolean; hearAbout: string; recommendedBy: string };

// Each event has its own shape. started and call_clicked never need answers.
export function parseEvent(body: unknown): ParsedEvent | string {
  if (!body || typeof body !== "object") return "Invalid request";
  const b = body as Record<string, unknown>;
  if (!PLANNER_EVENTS.includes(b.event as PlannerEvent)) return "Invalid event";
  if (typeof b.briefId !== "string" || !UUID.test(b.briefId)) return "Invalid briefId";
  const base = { briefId: b.briefId.toLowerCase(), attribution: attribution(b.attribution) };
  const event = b.event as PlannerEvent;
  if (event === "started") return { event, ...base };
  if (event === "call_clicked") return { event, ...base };

  const valid = validateAnswers(b.answers);
  if (!valid.ok) return "Invalid answers";
  if (event === "viewed") return { event, ...base, answers: valid.answers };

  const opt = optional(b.optional);
  if (typeof opt === "string") return opt;
  const who = contact(b.contact);
  if (typeof who === "string") return who;
  return {
    event,
    ...base,
    answers: valid.answers,
    optional: opt,
    contact: who,
    honeypot: typeof b.honeypot === "string" && b.honeypot.trim() !== "",
    // "How did you hear about us?" and who recommended us: optional, cut to the contact form's caps.
    hearAbout: clean(b.hearAbout, REFERRAL_LIMITS.hearAbout),
    recommendedBy: clean(b.recommendedBy, REFERRAL_LIMITS.recommendedBy),
  };
}

// The brief fields n8n receives. No contact details, no free text.
function briefFields(e: { briefId: string; answers: Answers }, pricing: Pricing, opt: Optional = {}) {
  const brief = buildBrief(e.answers, pricing, opt);
  return {
    headline: brief.headline,
    primaryService: brief.primaryService,
    services: brief.services,
    firstPhase: brief.firstPhase,
    alsoRequested: brief.alsoRequested.map((x) => x.service),
    dependencyNote: brief.dependencyNote,
    success: brief.success,
    toConfirm: brief.toConfirm,
    // Only approved, published figures. A hidden price is sent as null.
    priceLines: brief.investment.lines.map((l) => ({ service: l.service, amount: l.amount, text: l.text })),
    fitNote: brief.fitNote,
    action: brief.actions,
    bookingUrl: bookingUrl(e.briefId, brief, e.answers),
  };
}

export function buildPayload(e: ParsedEvent, pricing: Pricing | null, submittedAt: string) {
  const base = {
    event: e.event,
    briefId: e.briefId,
    eventIdempotencyKey: `${e.briefId}:${e.event}`,
    statusRank: STATUS_RANK[e.event],
    engineVersion: ENGINE_VERSION,
    priceSource: pricing ? pricing.source : null,
    submittedAt,
    attribution: e.attribution,
  };
  if (e.event === "started" || e.event === "call_clicked") return base;
  if (e.event === "viewed") return { ...base, answers: e.answers, brief: briefFields(e, pricing!) };
  return {
    ...base,
    answers: e.answers,
    answerLabels: answerLabels(e.answers),
    brief: briefFields(e, pricing!, e.optional),
    optional: { investment: e.optional.investment ?? null, website: e.optional.website ?? "", importantDate: e.optional.importantDate ?? "" },
    contact: e.contact,
    hearAbout: e.hearAbout,
    recommendedBy: e.recommendedBy,
  };
}
