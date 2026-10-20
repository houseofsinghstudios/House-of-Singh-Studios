"use client";
// Microsoft Clarity (session recordings and heatmaps). Client component: it needs the browser to
// check the hostname, read the visitor's consent region and add the tag once.
//
// Order: region first, then the consent signal is queued on the official stub, and only then is the
// tag script added, so Clarity never runs before it knows the consent state. Ads storage is always
// denied (we run no advertising). Analytics storage follows src/lib/consent.ts: the visitor's own
// choice if they made one, otherwise denied in the stricter regions (or if the region cannot be read).
// Clarity follows client side navigation itself, so there is no page tracking here.

import { useEffect } from "react";
import { CLARITY_HOST, CLARITY_PROJECT_ID } from "@/lib/constants/clarity";
import { effectiveState, isStrictRegion, readChoice } from "@/lib/consent";

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };
type ClarityWindow = Window & { clarity?: ClarityFn; __hosClarityStarted?: boolean };

async function startClarity(w: ClarityWindow) {
  const strict = await isStrictRegion();
  // The official snippet's queue stub: calls made before the tag loads are kept and replayed.
  w.clarity =
    w.clarity ||
    (function (...args: unknown[]) {
      (w.clarity!.q = w.clarity!.q || []).push(args);
    } as ClarityFn);
  // The region default, unless the visitor has made their own choice (Privacy choices or the ask).
  w.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: effectiveState(strict, readChoice()) });

  const src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  if (document.querySelector(`script[src="${src}"]`)) return;
  const tag = document.createElement("script");
  tag.async = true;
  tag.src = src;
  const first = document.getElementsByTagName("script")[0];
  if (first?.parentNode) first.parentNode.insertBefore(tag, first);
  else document.head.appendChild(tag);
}

export default function MicrosoftClarity() {
  useEffect(() => {
    if (window.location.hostname !== CLARITY_HOST) return;
    const w = window as ClarityWindow;
    // Once per page load, whatever re-renders or navigations happen.
    if (w.__hosClarityStarted) return;
    w.__hosClarityStarted = true;
    void startClarity(w);
  }, []);
  return null;
}
