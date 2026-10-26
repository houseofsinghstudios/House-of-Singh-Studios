// Google Analytics 4, page views only. Rendered by the (site) layout on production deployments only,
// so local development, previews and /studio never load it, and it runs only on the real hostname
// (CLARITY_HOST, the same rule Clarity follows), never on vercel.app addresses. Server rendered: no
// client code of our own; the setup script adds the gtag.js tag itself once the hostname matches.
//
// Page views: one config call sends the first page view, and GA4's enhanced measurement
// ("page changes based on browser history events") counts each later navigation. No manual
// page_view events and no custom events, so nothing is counted twice.
import Script from "next/script";
import { GA_MEASUREMENT_ID, STRICT_CONSENT_REGIONS } from "@/lib/constants/analytics";
import { CONSENT_KEY, CONSENT_MAX_AGE_MS } from "@/lib/constants/consent";
import { CLARITY_HOST } from "@/lib/constants/clarity";

// Consent defaults come first, then config. Ads are off everywhere; analytics cookies are off
// by default in the stricter consent regions, where GA4 sends cookieless signals instead.
// A choice the visitor made with Privacy choices (src/lib/consent.ts, same 12 month rule) is applied
// as an update between the defaults and config, so it holds before the first page view is sent.
const SETUP = `
(function () {
if (window.location.hostname !== ${JSON.stringify(CLARITY_HOST)}) return;
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted'
});
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  region: ${JSON.stringify(STRICT_CONSENT_REGIONS)}
});
try {
  var c = JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)}) || "null");
  var age = c && typeof c.decidedAt === 'number' ? Date.now() - c.decidedAt : -1;
  if (c && (c.analytics === 'granted' || c.analytics === 'denied') && age >= 0 && age < ${CONSENT_MAX_AGE_MS}) {
    gtag('consent', 'update', { analytics_storage: c.analytics });
  }
} catch (e) {}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', {
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});
var tag = document.createElement('script');
tag.async = true;
tag.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
document.head.appendChild(tag);
})();
`;

export default function GoogleAnalytics() {
  return (
    <Script id="ga-setup" strategy="afterInteractive">
      {SETUP}
    </Script>
  );
}
