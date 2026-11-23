// Project Planner types. Answer ids are stable: they travel in n8n payloads and in ?service= links.
import { BAND_IDS, type BandId } from "@/lib/budget-bands";

export const SERVICE_IDS = ["identity", "website", "photo", "video", "packaging", "strategy", "unsure"] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];
// Services the visitor can name, each with its own priorities. "unsure" is not one of them.
export const NAMED_SERVICES = ["identity", "website", "photo", "video", "packaging", "strategy"] as const;
export type NamedService = (typeof NAMED_SERVICES)[number];

// P2: the starting point options depend on the primary service.
export const START_IDS = {
  identity: ["new", "logo", "system", "ready"],
  packaging: ["new", "logo", "system", "ready"],
  website: ["no_site", "refresh", "redesign", "feature"],
  photo: ["new_content", "refresh_library", "campaign", "ongoing"],
  video: ["new_content", "refresh_library", "campaign", "ongoing"],
  strategy: ["new_positioning", "reposition", "inconsistent", "unsure_context"],
  unsure: ["launching", "growing", "changing", "no_label"],
} as const satisfies Record<ServiceId, readonly string[]>;
type StartId = (typeof START_IDS)[ServiceId][number];

export const GOAL_IDS = ["credibility", "clarity", "differentiation", "launch", "conversion", "consistency", "production", "other"] as const;
export type GoalId = (typeof GOAL_IDS)[number];

// P4: priorities for the primary service. "help" is exclusive and on every list. Not asked for "unsure".
export const PRIORITY_IDS = {
  identity: ["logo_system", "guidelines", "collateral", "launch_apps", "refine"],
  website: ["structure", "visual", "new_site", "landing", "content_org", "self_edit"],
  photo: ["product", "people", "editorial", "campaign_assets", "spaces"],
  video: ["brand_story", "campaign_video", "short_form", "interviews", "demos"],
  packaging: ["pack_system", "variants", "print_ready", "production"],
  strategy: ["positioning", "messaging", "workshop", "direction", "governance"],
} as const satisfies Record<NamedService, readonly string[]>;
export const HELP = "help";
type PriorityId = (typeof PRIORITY_IDS)[NamedService][number] | typeof HELP;

export const TIMING_IDS = ["now", "one_three", "three_six", "flexible"] as const;
export type TimingId = (typeof TIMING_IDS)[number];

// The investment ranges: one list shared with the contact form (src/lib/budget-bands.ts).
export { BAND_IDS, type BandId };

export const MAX_NEEDS = 3;
export const MAX_PRIORITIES = 3;

export interface Answers {
  // P1: one to three services, or "unsure" alone. In the order chosen.
  needs: ServiceId[];
  // The main focus: one of needs. Starts as the first choice and can be changed.
  primary: ServiceId;
  // P2, for the primary service.
  start: StartId;
  // P3.
  goal: GoalId;
  // P4, for the primary service: one to three, or "help" alone. Empty when primary is "unsure".
  priorities: PriorityId[];
  // P5.
  timing: TimingId;
}

// "Make my brief more useful": all optional. Free text stays out of tracking events and URLs.
export interface Optional {
  investment?: BandId;
  website?: string;
  importantDate?: string;
}

// The brief ends in the call: "book" chooses a time, "send" sends the brief with contact details.
export type ActionId = "book" | "send";

// What a case study says it delivered (caseStudy.workDelivered in Sanity).
export type DeliveredId = "identity" | "strategy" | "website_design" | "website_build" | "photography" | "video" | "packaging" | "print";

export interface Brief {
  engineVersion: string;
  intro: string;
  headline: string;
  primaryService: ServiceId;
  services: ServiceId[];
  told: { step: number; question: string; answer: string }[];
  firstPhase: { title: string; items: string[] };
  alsoRequested: { service: ServiceId; label: string; note: string }[];
  dependencyNote: string | null;
  success: string;
  toConfirm: string[];
  // How long the brand packages take: only for brand identity as the main focus. Never a price.
  timelines: { title: string; label: string; text: string } | null;
  relatedWork: { deliveredType: DeliveredId; title: string } | null;
  nextSteps: { title: string; text: string };
  actions: { primary: ActionId; secondary: ActionId | null };
  serviceSlug: string;
}
