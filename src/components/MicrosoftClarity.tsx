"use client";
// Microsoft Clarity (session recordings and heatmaps). Client component: it needs the browser to
// check the hostname, read the visitor's consent region and add the tag once.
//
// Order: region first, then the consent signal is queued on the official stub, and only then is the
// tag script added, so Clarity never runs before it knows the consent state. Ads storage is always
// denied (we run no advertising). Analytics storage is denied in the stricter regions, or if the
// region cannot be read, where Clarity runs without cookies.
// Clarity follows client side navigation itself, so there is no page tracking here.

import { useEffect } from "react";
import { CLARITY_HOST, CLARITY_PROJECT_ID } from "@/lib/constants/clarity";

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };
type ClarityWindow = Window & { clarity?: ClarityFn; __hosClarityStarted?: boolean };

const REGION_KEY = "hos-consent-region";

// Once per browser session. A failed or unreadable answer counts as strict and is not remembered.
async function isStrictRegion(): Promise<boolean> {
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
    return true;
  }
}

async function startClarity(w: ClarityWindow) {
  const strict = await isStrictRegion();
  // The official snippet's queue stub: calls made before the tag loads are kept and replayed.
  w.clarity =
    w.clarity ||
    (function (...args: unknown[]) {
      (w.clarity!.q = w.clarity!.q || []).push(args);
    } as ClarityFn);
  w.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: strict ? "denied" : "granted" });

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
