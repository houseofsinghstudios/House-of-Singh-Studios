// Analytics consent: storage keys, lifetime and every visitor facing word. Shared by the server
// (Google Analytics setup script) and the browser (consent module and its UI).

// localStorage: the visitor's own choice, { analytics: "granted" | "denied", decidedAt }.
export const CONSENT_KEY = "hos-consent";
// A choice lasts 12 months, then the region default applies again.
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
// sessionStorage: the region answer ("strict" or "open"), shared with Microsoft Clarity.
export const REGION_KEY = "hos-consent-region";
// sessionStorage: page views this visit, and whether the ask has already appeared this visit.
export const VIEWS_KEY = "hos-consent-views";
export const ASKED_KEY = "hos-consent-asked";

export const CONSENT_COPY = {
  footerNotice: "Anonymous analytics. No ads.",
  footerLink: "Privacy choices",
  label: "(Cookies)",
  heading: "May we measure what works?",
  body: "Anonymous, no ads. Off until you say yes.",
  allow: "Allow",
  decline: "No thanks",
  thanksOn: "Analytics on. Thank you.",
  thanksOff: "Analytics stay off.",
  stateOn: "Analytics are on",
  stateOff: "Analytics are off",
  turnOn: "Turn on",
  turnOff: "Turn off",
  close: "Close",
  tab: "(Cookies)",
};
