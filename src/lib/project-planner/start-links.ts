// Links into /start from elsewhere on the site, and the rules for reading them back. Tiny on
// purpose: Brand Pulse, the case study page and the browser side of the planner import it.
import type { Draft } from "./engine";
import { MAX_NEEDS, SERVICE_IDS, type DeliveredId, type ServiceId } from "./types";

// Where a visitor came from inside the site (?from=), recorded as attribution.entryPlacement.
export const ENTRY_PLACEMENTS = ["services", "case_study", "brand_pulse", "contact", "home_band_chip", "home_band_button", "home_start"] as const;
export type EntryPlacement = (typeof ENTRY_PLACEMENTS)[number];

const first = (v: unknown): unknown => (Array.isArray(v) ? v[0] : v);

// A known placement, otherwise "direct".
export function parsePlacement(value: unknown): EntryPlacement | "direct" {
  const raw = first(value);
  return (ENTRY_PLACEMENTS as readonly unknown[]).includes(raw) ? (raw as EntryPlacement) : "direct";
}
const isService = (v: string): v is ServiceId => (SERVICE_IDS as readonly string[]).includes(v);

// ?service= preselects up to three known services, comma separated ("identity,website"), in the order
// given; a single value works as before. Unknown ids and repeats are ignored. "unsure" stands alone,
// as in the planner: with a named service beside it, it is dropped.
export function parseService(value: unknown): ServiceId[] {
  const raw = first(value);
  if (typeof raw !== "string") return [];
  const known = [...new Set(raw.split(",").filter(isService))];
  const named = known.filter((s) => s !== "unsure");
  return (named.length ? named : known).slice(0, MAX_NEEDS);
}
// ?begin=1 skips the intro and opens the first question.
export function parseBegin(value: unknown): boolean {
  return first(value) === "1";
}

// How the planner opens for these links. Preselected services fill question 01 (the first is the main
// focus); with ?begin=1 as well, that question is answered, so the planner opens on question 02.
export function plannerOpening(services: ServiceId[], begin: boolean): { screen: "intro" | "step"; stepIndex: number; draft: Draft } {
  const draft: Draft = services.length ? { needs: services, primary: services[0] } : { needs: [] };
  return { screen: begin ? "step" : "intro", stepIndex: begin && services.length ? 1 : 0, draft };
}

const SERVICE_FOR_DELIVERED: Record<DeliveredId, ServiceId | null> = {
  identity: "identity",
  strategy: "strategy",
  website_design: "website",
  website_build: "website",
  photography: "photo",
  video: "video",
  packaging: "packaging",
  // Standalone print is not a planner service.
  print: null,
};
const SERVICE_FOR_SITE_SLUG: Record<string, ServiceId> = {
  "brand-identity": "identity",
  "digital-design": "website",
  "visual-media": "photo",
  "creative-strategy": "strategy",
};

export function startHref(from: EntryPlacement, service?: ServiceId | null): string {
  return service ? `/start?service=${service}&from=${from}` : `/start?from=${from}`;
}
// The case study's first delivered type, or no preselection.
export function serviceForCaseStudy(workDelivered: string[] | undefined): ServiceId | null {
  const first = workDelivered?.[0] as DeliveredId | undefined;
  return first && first in SERVICE_FOR_DELIVERED ? SERVICE_FOR_DELIVERED[first] : null;
}
export function serviceForSiteSlug(slug: string): ServiceId | null {
  return SERVICE_FOR_SITE_SLUG[slug] ?? null;
}
