// Brand Pulse types. Answer ids are stable: they travel in share codes and n8n payloads.

export const INDUSTRY_IDS = ["professional-services", "real-estate", "hospitality", "retail", "health", "technology", "other"] as const;
export const UPDATED_IDS = ["under-1", "1-3", "3-5", "over-5", "never"] as const;
export const WEAKEST_IDS = ["website", "photo-video", "social", "print-sales", "logo-look", "none"] as const;
export const CONSISTENT_IDS = ["yes", "mostly", "no", "never-compared"] as const;
export const HANDOVER_IDS = ["written-followed", "rules-unused", "lots-of-help", "in-our-heads"] as const;
export const CLARITY_IDS = ["straight-away", "some-explanation", "after-talking", "struggle"] as const;
export const AHEAD_IDS = ["launch", "growing", "investment", "steady"] as const;

export type Industry = (typeof INDUSTRY_IDS)[number];
export type Updated = (typeof UPDATED_IDS)[number];
export type Weakest = (typeof WEAKEST_IDS)[number];
export type Consistent = (typeof CONSISTENT_IDS)[number];
export type Handover = (typeof HANDOVER_IDS)[number];
export type Clarity = (typeof CLARITY_IDS)[number];
export type Ahead = (typeof AHEAD_IDS)[number];

export interface Answers {
  industry: Industry;
  updated: Updated;
  weakest: Weakest;
  consistent: Consistent;
  handover: Handover;
  clarity: Clarity;
  ahead: Ahead;
}

export type QuestionId = keyof Answers;

// Question order, and the allowed ids for each. Used by the flow, the codec and the server.
export const QUESTION_ORDER: readonly QuestionId[] = ["industry", "updated", "weakest", "consistent", "handover", "clarity", "ahead"];

export const ANSWER_IDS: { readonly [Q in QuestionId]: readonly Answers[Q][] } = {
  industry: INDUSTRY_IDS,
  updated: UPDATED_IDS,
  weakest: WEAKEST_IDS,
  consistent: CONSISTENT_IDS,
  handover: HANDOVER_IDS,
  clarity: CLARITY_IDS,
  ahead: AHEAD_IDS,
};

export type Level = "good" | "attention" | "risk";
export type Pulse = "strong" | "steady" | "weak";
export type VitalId = "uptodate" | "presence" | "consistent" | "ready" | "clear";

export type ProfileId =
  | "strong"
  | "hard-to-explain"
  | "overdue"
  | "unused-rulebook"
  | "outgrown"
  | "unwritten"
  | "scattered"
  | "undersold";

export type ServiceKey = "BRAND" | "MEDIA" | "DIGITAL" | "STRATEGY";

export type Gate = "none" | "before-full-result" | "before-questions";
export const GATES: readonly Gate[] = ["none", "before-full-result", "before-questions"];

export type Feedback = "yes" | "partly" | "not-really";
export const FEEDBACK_IDS: readonly Feedback[] = ["yes", "partly", "not-really"];

export type TeamSize = "1-10" | "11-50" | "51-200" | "over-200";
export const TEAM_SIZE_IDS: readonly TeamSize[] = ["1-10", "11-50", "51-200", "over-200"];

export interface Vital {
  id: VitalId;
  label: string;
  level: Level;
  levelLabel: string;
  explainer: string;
}

export interface ServiceLink {
  slug: string;
  name: string;
  url: string;
}

export interface Result {
  pulse: Pulse;
  pulseLabel: string;
  profileId: ProfileId;
  profileName: string;
  headline: string;
  vitals: Vital[];
  paragraphs: [string, string, string, string];
  // For the email only. Never rendered on the page.
  actions: [string, string, string];
  service: ServiceLink;
  alsoService: ServiceLink | null;
  engineVersion: string;
}
