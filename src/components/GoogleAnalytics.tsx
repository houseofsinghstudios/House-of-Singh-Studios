// Google Analytics 4, page views only. Rendered by the (site) layout on production deployments only,
// so local development, previews and /studio never load it. Server rendered: no client code of our own.
//
// Page views: one config call sends the first page view, and GA4's enhanced measurement
// ("page changes based on browser history events") counts each later navigation. No manual
// page_view events and no custom events, so nothing is counted twice.
import Script from "next/script";
import { GA_MEASUREMENT_ID, STRICT_CONSENT_REGIONS } from "@/lib/constants/analytics";

// Consent defaults come first, then config. Ads are off everywhere; analytics cookies are off
// by default in the stricter consent regions, where GA4 sends cookieless signals instead.
const SETUP = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
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
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', {
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});
`;

export default function GoogleAnalytics() {
  return (
    <>
      <Script id="ga-setup" strategy="afterInteractive">
        {SETUP}
      </Script>
      <Script
        id="ga-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
