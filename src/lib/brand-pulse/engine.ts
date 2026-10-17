// Brand Pulse engine. A pure, rule based function: the same answers always give the same result.
// No randomness, no dates, no network. Runs in the browser for display and on the server for n8n.

import { services } from "@/data/services";
import {
  ACTIONS,
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
import type { Answers, Level, ProfileId, Pulse, Result, ServiceKey, ServiceLink, VitalId, Weakest } from "./types";

export const ENGINE_VERSION = "1.0.0";

const SITE_URL = "https://studios.houseofsingh.com";

const SERVICE_SLUGS: Record<ServiceKey, string> = {
  BRAND: "brand-identity",
  MEDIA: "visual-media",
  DIGITAL: "digital-design",
  STRATEGY: "creative-strategy",
};

const LEVEL_RANK: Record<Level, number> = { good: 0, attention: 1, risk: 2 };

// When two vital signs share the lowest level, the first in this list is the weakest.
export const TIE_ORDER: VitalId[] = ["clear", "uptodate", "ready", "consistent", "presence"];

const raise = (level: Level): Level => (level === "attention" ? "risk" : level);

export function vitalLevels(a: Answers): Record<VitalId, Level> {
  const uptodate: Level = a.updated === "under-1" || a.updated === "1-3" ? "good" : a.updated === "3-5" ? "attention" : "risk";

  const staleLook = a.updated === "3-5" || a.updated === "over-5" || a.updated === "never";
  const presence: Level = a.weakest === "none" ? "good" : staleLook ? "risk" : "attention";

  const consistent: Level = a.consistent === "yes" ? "good" : a.consistent === "no" ? "risk" : "attention";

  const baseReady: Level = a.handover === "written-followed" ? "good" : a.handover === "in-our-heads" ? "risk" : "attention";
  // Growth ahead turns a shaky handover into a risk. Good stays Good.
  const ready = a.ahead !== "steady" ? raise(baseReady) : baseReady;

  const clear: Level = a.clarity === "straight-away" ? "good" : a.clarity === "some-explanation" ? "attention" : "risk";

  return { uptodate, presence, consistent, ready, clear };
}

export function overallPulse(levels: Record<VitalId, Level>): Pulse {
  const risks = Object.values(levels).filter((l) => l === "risk").length;
  return risks === 0 ? "strong" : risks === 1 ? "steady" : "weak";
}

export function weakestVital(levels: Record<VitalId, Level>): VitalId {
  return TIE_ORDER.reduce((worst, id) => (LEVEL_RANK[levels[id]] > LEVEL_RANK[levels[worst]] ? id : worst));
}

export function profileFor(a: Answers, levels: Record<VitalId, Level>): ProfileId {
  if (Object.values(levels).every((l) => l === "good")) return "strong";
  const weakest = weakestVital(levels);
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

export function assess(a: Answers): Result {
  const levels = vitalLevels(a);
  const pulse = overallPulse(levels);
  const profileId = profileFor(a, levels);
  const primary = primaryService(profileId, a.weakest);
  const fromWeakest = serviceFromWeakest(a.weakest);
  const also = a.weakest !== "none" && fromWeakest !== primary ? fromWeakest : null;

  return {
    pulse,
    pulseLabel: PULSE_LABELS[pulse],
    profileId,
    profileName: PROFILES[profileId].name,
    headline: PROFILES[profileId].headline,
    vitals: VITALS.map((v) => ({ ...v, level: levels[v.id], levelLabel: LEVEL_LABELS[levels[v.id]] })),
    paragraphs: [
      `${INDUSTRY_SENTENCES[a.industry]} ${UPDATED_SENTENCES[a.updated]}`,
      `${WEAKEST_SENTENCES[a.weakest]} ${CONSISTENT_SENTENCES[a.consistent]}`,
      `${HANDOVER_SENTENCES[a.handover]} ${CLARITY_SENTENCES[a.clarity]} ${AHEAD_SENTENCES[a.ahead]}`,
      NEXT_STEP_SENTENCES[profileId],
    ],
    actions: ACTIONS[profileId],
    service: serviceLink(primary),
    alsoService: also ? serviceLink(also) : null,
    engineVersion: ENGINE_VERSION,
  };
}
