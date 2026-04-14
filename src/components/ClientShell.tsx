"use client";

import dynamic from "next/dynamic";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const PageTransition = dynamic(() => import("@/components/PageTransition"), { ssr: false });
const ScrollObserver = dynamic(() => import("@/components/ScrollObserver"), { ssr: false });
const FooterReveal = dynamic(() => import("@/components/layout/FooterReveal"), { ssr: false });

export default function ClientShell() {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <PageTransition />
      <ScrollObserver />
      <FooterReveal />
    </>
  );
}
