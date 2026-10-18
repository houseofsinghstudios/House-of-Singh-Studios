// Brand Pulse engine. A pure, rule based function: the same answers always give the same result.
// No randomness, no dates, no network. Runs in the browser for display and on the server for n8n.
// The three actions are not here: they are server only, added by the API route from actions.ts.

import { services } from "@/data/services";
import {
  AHEAD_SENTENCES,
  CLARITY_SENTENCES,
  CONSISTENT_SENTENCES,
  HANDOVER_SENTENCES,
  INDUSTRY_SENTENCES,
  LEVEL_LABELS,
  NEXT_STEP_SENTENCES,
  PROFILES,
  PULSE_LABELS,
  UPDATED_SENTENCES,
  VITALS,
  WEAKEST_SENTENCES,
} from "./content";
import { SITE_URL } from "./settings";
import type { Answers, Level, ProfileId, Pulse, Result, ServiceKey, ServiceLink, VitalId, Weakest } from "./types";

// 2.0.0: severity scoring and the weakest-area tie break.
export const ENGINE_VERSION = "2.0.0";

const SERVICE_SLUGS: Record<ServiceKey, string> = {
  BRAND: "brand-identity",
  MEDIA: "visual-media",
  DIGITAL: "digital-design",
  STRATEGY: "creative-strategy",
};

// Every number the scoring uses. Tune here; the logic below only reads these.
export const SCORING = {
  // Severity of each answer, 0 healthy to 4 serious.
  updated: { "under-1": 0, "1-3": 1, "3-5": 2, "over-5": 3, never: 4 },
  presence: {
    // Nothing named as weak.
    none: 0,
    // A part named as weak, and the same when the look is also three or more years old.
    named: 2,
    namedStale: 3,
    staleUpdated: ["3-5", "over-5", "never"],
  },
  consistent: { yes: 0, mostly: 2, "never-compared": 2, no: 4 },
  handover: { "written-followed": 0, "rules-unused": 2, "lots-of-help": 2, "in-our-heads": 3 },
  // Growth ahead adds to a Ready severity that is already above 0.
  growthBonus: 1,
  clarity: { "straight-away": 0, "some-explanation": 2, "after-talking": 3, struggle: 4 },
  maxSeverity: 4,
  // Level from severity: up to goodMax is Good, up to attentionMax is Needs attention, above is At risk.
  level: { goodMax: 1, attentionMax: 2 },
  // Pulse from the total of the five severities (0 to 20).
  pulse: { strongMax: 6, steadyMax: 11 },
  // Strong profile when every severity is at most this.
  strongProfileMax: 1,
  // Ties for the most serious sign: the sign linked to the part named as weakest wins first...
  weakestPreference: {
    "logo-look": "uptodate",
    website: "presence",
    "photo-video": "presence",
    social: "presence",
    "print-sales": "presence",
    none: null,
  } as Record<Weakest, VitalId | null>,
  // ...then this order.
  tieOrder: ["consistent", "ready", "clear", "uptodate", "presence"] as VitalId[],
} as const;

export type Severities = Record<VitalId, number>;

export function severities(a: Answers): Severities {
  const presence =
    a.weakest === "none"
      ? SCORING.presence.none
      : (SCORING.presence.staleUpdated as readonly string[]).includes(a.updated)
        ? SCORING.presence.namedStale
        : SCORING.presence.named;
  const baseReady = SCORING.handover[a.handover];
  const ready = a.ahead !== "steady" && baseReady > 0 ? Math.min(SCORING.maxSeverity, baseReady + SCORING.growthBonus) : baseReady;
  return {
    uptodate: SCORING.updated[a.updated],
    presence,
    consistent: SCORING.consistent[a.consistent],
    ready,
    clear: SCORING.clarity[a.clarity],
  };
}

export function levelFor(severity: number): Level {
  if (severity <= SCORING.level.goodMax) return "good";
  if (severity <= SCORING.level.attentionMax) return "attention";
  return "risk";
}

export const totalOf = (s: Severities): number => Object.values(s).reduce((sum, n) => sum + n, 0);

export function overallPulse(total: number): Pulse {
  if (total <= SCORING.pulse.strongMax) return "strong";
  if (total <= SCORING.pulse.steadyMax) return "steady";
  return "weak";
}

// The sign with the highest severity. Ties go to the sign linked to the part named as weakest,
// then to the order in SCORING.tieOrder.
export function weakestVital(s: Severities, weakest: Weakest): VitalId {
  const preferred = SCORING.weakestPreference[weakest];
  const order = preferred ? [preferred, ...SCORING.tieOrder.filter((id) => id !== preferred)] : [...SCORING.tieOrder];
  return order.reduce((worst, id) => (s[id] > s[worst] ? id : worst));
}

export function profileFor(a: Answers, s: Severities): ProfileId {
  if (Object.values(s).every((n) => n <= SCORING.strongProfileMax)) return "strong";
  const weakest = weakestVital(s, a.weakest);
  if (weakest === "clear") return "hard-to-explain";
  if (weakest === "uptodate") return "overdue";
  if (weakest === "ready") {
    if (a.handover === "rules-unused") return "unused-rulebook";
    if (a.ahead !== "steady") return "outgrown";
    return "unwritten";
  }
  if (weakest === "consistent") return "scattered";
  return "undersold";
}

export function serviceFromWeakest(weakest: Weakest): ServiceKey {
  if (weakest === "website") return "DIGITAL";
  if (weakest === "print-sales" || weakest === "logo-look") return "BRAND";
  return "MEDIA";
}

export function primaryService(profile: ProfileId, weakest: Weakest): ServiceKey {
  if (profile === "overdue") return "BRAND";
  if (profile === "undersold" || profile === "strong") return serviceFromWeakest(weakest);
  return "STRATEGY";
}

export function serviceLink(key: ServiceKey): ServiceLink {
  const slug = SERVICE_SLUGS[key];
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Brand Pulse: service ${slug} is missing from src/data/services.ts`);
  return { slug, name: service.name, url: `${SITE_URL}/services/${slug}` };
}

// Everything except the three actions, which live on the server only (actions.ts).
export function assess(a: Answers): Result {
  const sev = severities(a);
  const total = totalOf(sev);
  const pulse = overallPulse(total);
  const profileId = profileFor(a, sev);
  const primary = primaryService(profileId, a.weakest);
  const fromWeakest = serviceFromWeakest(a.weakest);
  const also = a.weakest !== "none" && fromWeakest !== primary ? fromWeakest : null;

  return {
    pulse,
    pulseLabel: PULSE_LABELS[pulse],
    profileId,
    profileName: PROFILES[profileId].name,
    headline: PROFILES[profileId].headline,
    vitals: VITALS.map((v) => ({ ...v, level: levelFor(sev[v.id]), levelLabel: LEVEL_LABELS[levelFor(sev[v.id])], severity: sev[v.id] })),
    total,
    paragraphs: [
      `${INDUSTRY_SENTENCES[a.industry]} ${UPDATED_SENTENCES[a.updated]}`,
      `${WEAKEST_SENTENCES[a.weakest]} ${CONSISTENT_SENTENCES[a.consistent]}`,
      `${HANDOVER_SENTENCES[a.handover]} ${CLARITY_SENTENCES[a.clarity]} ${AHEAD_SENTENCES[a.ahead]}`,
      NEXT_STEP_SENTENCES[profileId],
    ],
    service: serviceLink(primary),
    alsoService: also ? serviceLink(also) : null,
    engineVersion: ENGINE_VERSION,
  };
}
