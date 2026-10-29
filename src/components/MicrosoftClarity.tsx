"use client";
// Microsoft Clarity (session recordings and heatmaps). Client component: it needs the browser to
// check the hostname, read the visitor's consent and add the tag.
//
// Consent first, as with Google Analytics: the tag is loaded only once analytics consent is granted
// (the visitor's own choice, otherwise the region default from src/lib/consent.ts), so a visitor in
// a stricter region who has not turned analytics on sends nothing at all, not even a cookieless
// recording. Turning analytics off stops Clarity; turning them on starts it. The rule lives in
// src/lib/clarity.ts. Clarity follows client side navigation itself, so there is no page tracking here.

import { useEffect } from "react";
import { CLARITY_HOST, CLARITY_PROJECT_ID } from "@/lib/constants/clarity";
import { ANALYTICS_CONSENT_EVENT } from "@/lib/constants/consent";
import { effectiveState, isStrictRegion, readChoice, type ConsentState } from "@/lib/consent";
import { followClarity, type ClarityWindow } from "@/lib/clarity";

function loadTag() {
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
    const w = window as unknown as ClarityWindow;
    const follow = (state: ConsentState) => followClarity(state, w, loadTag);
    let live = true;
    void isStrictRegion().then((strict) => live && follow(effectiveState(strict, readChoice())));
    const onChange = (e: Event) => follow((e as CustomEvent<ConsentState>).detail);
    window.addEventListener(ANALYTICS_CONSENT_EVENT, onChange);
    return () => {
      live = false;
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, onChange);
    };
  }, []);
  return null;
}
