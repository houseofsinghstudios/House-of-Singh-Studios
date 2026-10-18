// Links into /start from elsewhere on the site. Tiny on purpose: Brand Pulse and the case study page import it.
import type { DeliveredId, ServiceId } from "./types";

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

export function startHref(from: "services" | "case_study" | "brand_pulse" | "contact", service?: ServiceId | null): string {
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
