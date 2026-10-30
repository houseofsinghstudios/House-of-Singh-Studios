// Analytics consent in the browser: the visitor's region, their stored choice, and applying the
// result to Google Analytics and Microsoft Clarity. Advertising is always denied.
//
// Effective state: a stored choice (valid 12 months) wins; otherwise "denied" in the stricter
// regions and "granted" elsewhere, which is what the Google Analytics defaults already say.

import { ANALYTICS_CONSENT_EVENT, CONSENT_KEY, CONSENT_MAX_AGE_MS, REGION_KEY } from "@/lib/constants/consent";

export type ConsentState = "granted" | "denied";
export interface StoredChoice {
  analytics: ConsentState;
  decidedAt: number;
}

type ConsentWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
};

// ── Pure rules (unit tested) ──

export function parseChoice(raw: string | null, now: number): StoredChoice | null {
  if (!raw) return null;
  try {
    const c = JSON.parse(raw) as Partial<StoredChoice>;
    if ((c.analytics !== "granted" && c.analytics !== "denied") || typeof c.decidedAt !== "number") return null;
    if (c.decidedAt > now || now - c.decidedAt >= CONSENT_MAX_AGE_MS) return null;
    return { analytics: c.analytics, decidedAt: c.decidedAt };
  } catch {
    return null;
  }
}

export function effectiveState(strict: boolean, choice: StoredChoice | null): ConsentState {
  if (choice) return choice.analytics;
  return strict ? "denied" : "granted";
}

// The gentle ask is only for stricter regions where the visitor has not chosen yet.
export function shouldAsk(strict: boolean, choice: StoredChoice | null): boolean {
  return strict && !choice;
}

// ── Region (one request per browser session, shared with Clarity) ──

let regionPromise: Promise<boolean> | null = null;

async function fetchRegion(): Promise<boolean> {
  try {
    const saved = sessionStorage.getItem(REGION_KEY);
    if (saved === "strict" || saved === "open") return saved === "strict";
  } catch {
    // Storage blocked: ask the server below.
  }
  try {
    const res = await fetch("/api/consent-region", { credentials: "same-origin" });
    const data: unknown = res.ok ? await res.json() : null;
    if (!data || typeof (data as { strict?: unknown }).strict !== "boolean") return true;
    const strict = (data as { strict: boolean }).strict;
    try {
      sessionStorage.setItem(REGION_KEY, strict ? "strict" : "open");
    } catch {
      // Storage blocked: ask again next page load.
    }
    return strict;
  } catch {
    // A failed request counts as strict and is not remembered.
    return true;
  }
}

// Whether the visitor is in a region with stricter consent rules. Concurrent callers share one request.
export function isStrictRegion(): Promise<boolean> {
  regionPromise ??= fetchRegion();
  return regionPromise;
}

// ── Stored choice ──

export function readChoice(now = Date.now()): StoredChoice | null {
  try {
    return parseChoice(localStorage.getItem(CONSENT_KEY), now);
  } catch {
    return null;
  }
}

export function storeChoice(analytics: ConsentState, now = Date.now()): StoredChoice {
  const choice = { analytics, decidedAt: now };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(choice));
  } catch {
    // Storage blocked: the choice still applies to this page.
  }
  return choice;
}

// The analytics cookies removed when analytics are turned off: Clarity's (_clck, _clsk) and Google
// Analytics' (_ga, and one _ga_<id> per property, found by name). GA sets its cookies on the parent
// domain (.houseofsingh.com) by default, so each is deleted host only, for this host and for every
// parent domain above it, path "/".
const ANALYTICS_COOKIES = ["_clck", "_clsk", "_ga"];
const isGaPropertyCookie = (name: string) => name.startsWith("_ga_");

function cookieNames(): string[] {
  try {
    return String(document.cookie || "").split(";").map((c) => c.split("=")[0].trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function deleteAnalyticsCookies() {
  const host = window.location.hostname;
  const parts = host.split(".");
  const domains = ["", host, ...parts.slice(1).map((_, i) => `.${parts.slice(i + 1).join(".")}`).filter((d) => d.split(".").length > 2)];
  const names = new Set([...ANALYTICS_COOKIES, ...cookieNames().filter(isGaPropertyCookie)]);
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

// Tells Google Analytics and Clarity, then announces the change so the analytics tracker can start
// or stop. Advertising storage is always denied.
export function apply(state: ConsentState, w: ConsentWindow = window as ConsentWindow) {
  w.gtag?.("consent", "update", { analytics_storage: state });
  w.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: state });
  if (state === "denied") deleteAnalyticsCookies();
  w.dispatchEvent?.(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: state }));
}
