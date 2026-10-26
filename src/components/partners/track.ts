// Google Analytics events for /partners, through the site's existing gtag. GA only loads on the
// production site under its consent rules; anywhere else window.gtag is missing and nothing is sent.
// Never personal data: only what was clicked and where.

type Gtag = (...args: unknown[]) => void;

export type PartnerEvent = "partner_cta_click" | "partner_copy_intro";

export function trackPartner(event: PartnerEvent, params: Record<string, string> = {}) {
  const gtag = (window as { gtag?: Gtag }).gtag;
  if (gtag) gtag("event", event, params);
}
