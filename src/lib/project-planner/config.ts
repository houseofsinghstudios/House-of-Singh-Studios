// Project Planner numbers. Prices themselves are edited in Sanity Studio (Service Pricing); these
// are the owner approved initial values, used only when Sanity answers but nothing is published yet.
import { BRAND_FOUNDATION, PACKAGE_TIERS } from "@/data/packages";
import type { BandId, DeliveredId, PricedService, ServiceId } from "./types";

// CAD, excluding HST. Brand identity is not here: it always comes from the Brand Foundation package,
// the same figure the Packages page shows.
export const OWNER_APPROVED_INITIAL_PRICING: Record<Exclude<PricedService, "identity">, number> = {
  website: 3500,
  photo: 1000,
  video: 2500,
  packaging: 2500,
  strategy: 2000,
};

export const BRAND_IDENTITY_STARTS_FROM = (): number => BRAND_FOUNDATION.startsFrom;

// Package durations, from the Packages page data. Names drop the leading "Brand ".
export const BRAND_TIMELINES = (): { name: string; timeline: string }[] =>
  PACKAGE_TIERS.map((t) => ({ name: t.title.replace(/^Brand /, ""), timeline: t.timeline }));

// Budget bands, CAD. upper is the top of the band; null means no upper limit or not stated.
export const BUDGET_BANDS: Record<BandId, { upper: number | null }> = {
  under_1k: { upper: 999 },
  "1k_4k": { upper: 4000 },
  "4k_10k": { upper: 10000 },
  "10k_20k": { upper: 20000 },
  "20k_plus": { upper: null },
  not_sure: { upper: null },
};
// Below this, a range is under the studio's minimum review threshold whatever the prices.
export const MINIMUM_REVIEW_BUDGET = 1000;

// Planner service to the site's service page.
export const SERVICE_SLUGS: Record<ServiceId, string> = {
  identity: "brand-identity",
  packaging: "brand-identity",
  website: "digital-design",
  photo: "visual-media",
  video: "visual-media",
  strategy: "creative-strategy",
  unsure: "creative-strategy",
};

// Which caseStudy.workDelivered value counts as proof for each main service.
export const DELIVERED_FOR: Record<ServiceId, DeliveredId | null> = {
  identity: "identity",
  website: "website_design",
  photo: "photography",
  video: "video",
  packaging: "packaging",
  strategy: "strategy",
  unsure: null,
};

export const NOTE_LIMIT = 500;
export const IMPORTANT_DATE_LIMIT = 60;
export const WEBSITE_LIMIT = 200;

