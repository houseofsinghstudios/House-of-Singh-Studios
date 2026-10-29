// Google Analytics events for /partners, through src/lib/analytics.ts: sent only on the production
// site and only with analytics consent. Never personal data: only what was clicked and where.
import { track } from "@/lib/analytics";

export type PartnerEvent = "partner_cta_click" | "partner_copy_intro";

export function trackPartner(event: PartnerEvent, params: Record<string, string> = {}) {
  track(event, params);
}
