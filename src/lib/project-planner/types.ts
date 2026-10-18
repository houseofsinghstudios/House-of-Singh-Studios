// Project Planner types. Answer ids are stable: they travel in n8n payloads and in ?service= links.

export const SERVICE_IDS = ["identity", "website", "photo", "video", "packaging", "strategy", "unsure"] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];
// Services with a starting price. "unsure" never has one.
export const PRICED_SERVICES = ["identity", "website", "photo", "video", "packaging", "strategy"] as const;
export type PricedService = (typeof PRICED_SERVICES)[number];

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
export type StartId = (typeof START_IDS)[ServiceId][number];

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
} as const satisfies Record<PricedService, readonly string[]>;
export const HELP = "help";
export type PriorityId = (typeof PRIORITY_IDS)[PricedService][number] | typeof HELP;

export const TIMING_IDS = ["now", "one_three", "three_six", "flexible"] as const;
export type TimingId = (typeof TIMING_IDS)[number];

export const BAND_IDS = ["under_1k", "1k_4k", "4k_10k", "10k_20k", "20k_plus", "not_sure"] as const;
export type BandId = (typeof BAND_IDS)[number];

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

// Where the starting prices came from. "sanity": the published Service Pricing document.
// "initial": the request worked but nothing is published yet, so the owner approved initial prices apply.
// "unavailable": the request failed, so no price is shown.
export type PriceSource = "sanity" | "initial" | "unavailable";

export interface Pricing {
  source: PriceSource;
  // CAD, excluding HST. null means do not show a figure for this service.
  prices: Record<PricedService, number | null>;
}

export type ActionId = "book" | "send" | "focused";

// What a case study says it delivered (caseStudy.workDelivered in Sanity).
export const DELIVERED_IDS = ["identity", "strategy", "website_design", "website_build", "photography", "video", "packaging", "print"] as const;
export type DeliveredId = (typeof DELIVERED_IDS)[number];

export interface PriceLine {
  service: PricedService;
  label: string;
  text: string;
  amount: number | null;
}

export interface Brief {
  engineVersion: string;
  priceSource: PriceSource;
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
  investment: {
    title: string;
    lines: PriceLine[];
    message: string | null;
    timelines: { label: string; text: string } | null;
    note: string;
  };
  relatedWork: { deliveredType: DeliveredId; title: string } | null;
  nextSteps: { title: string; text: string };
  fitNote: string | null;
  actions: { primary: ActionId; secondary: ActionId | null };
  serviceSlug: string;
}
