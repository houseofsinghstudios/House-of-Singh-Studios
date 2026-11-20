// Project Planner settings. The planner shows no prices (decided 20 Nov 2026): price is discussed after
// the call, in the written proposal.
import { PACKAGE_TIERS } from "@/data/packages";
import type { DeliveredId, ServiceId } from "./types";

// Package durations, from src/data/packages.ts. Names drop the leading "Brand ".
export const BRAND_TIMELINES = (): { name: string; timeline: string }[] =>
  PACKAGE_TIERS.map((t) => ({ name: t.title.replace(/^Brand /, ""), timeline: t.timeline }));

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

