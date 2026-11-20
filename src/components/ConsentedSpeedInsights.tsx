"use client";
// A client component: Vercel Speed Insights under the same consent rule as Google Analytics and
// Microsoft Clarity (audit of 20 Nov 2026, finding 5, owner approved). It reads the visitor's region
// and stored choice in the browser and follows later changes.
//
// The rule comes from src/lib/consent.ts unchanged: in the stricter regions nothing loads until the
// visitor allows analytics; elsewhere it loads by default, as before, and stops loading on later
// pages once the visitor turns analytics off. Until the region is known, nothing loads.

import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ANALYTICS_CONSENT_EVENT } from "@/lib/constants/consent";
import { effectiveState, isStrictRegion, readChoice, type ConsentState } from "@/lib/consent";

export default function ConsentedSpeedInsights() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let live = true;
    void isStrictRegion().then((strict) => {
      if (live) setAllowed(effectiveState(strict, readChoice()) === "granted");
    });
    const onChange = (e: Event) => setAllowed((e as CustomEvent<ConsentState>).detail === "granted");
    window.addEventListener(ANALYTICS_CONSENT_EVENT, onChange);
    return () => {
      live = false;
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, onChange);
    };
  }, []);

  return allowed ? <SpeedInsights /> : null;
}
