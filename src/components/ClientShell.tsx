"use client";
// A client component: the site's client behaviour (smooth scroll, cursor, page transitions, the
// shared reveal and campaign capture). It also sets html[data-js] on mount if the arming script in the
// root layout did not run, so controls that need JavaScript never stay hidden; data-reveal is not set
// here, since arming after paint would hide content already on screen (site audit S-05).

import { useEffect } from "react";
import dynamic from "next/dynamic";
import CampaignCapture from "@/components/CampaignCapture";
// Loaded with the page, not lazily: content on the first screen waits for it to reveal.
import ScrollObserver from "@/components/ScrollObserver";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const PageTransition = dynamic(() => import("@/components/PageTransition"), { ssr: false });

export default function ClientShell() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-js")) root.setAttribute("data-js", "");
  }, []);
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <PageTransition />
      <ScrollObserver />
      <CampaignCapture />
    </>
  );
}
