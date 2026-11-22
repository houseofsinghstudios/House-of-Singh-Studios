"use client";

import dynamic from "next/dynamic";
import CampaignCapture from "@/components/CampaignCapture";
// Loaded with the page, not lazily: content on the first screen waits for it to reveal.
import ScrollObserver from "@/components/ScrollObserver";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const PageTransition = dynamic(() => import("@/components/PageTransition"), { ssr: false });

export default function ClientShell() {
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
