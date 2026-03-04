"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const isTouchOnly = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;
    const isSmallScreen = window.innerWidth <= 600;

    // Mobile: skip Lenis, use native scroll physics
    if (isTouchOnly && isSmallScreen) {
      ScrollTrigger.config({ ignoreMobileResize: true });
      return;
    }

    // Tablet/Desktop: Lenis with adjusted duration
    const lenis = new Lenis({
      duration: isTouchOnly ? 1.0 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    (window as unknown as Record<string, unknown>).__lenis = lenis;

    if (isTouchOnly) {
      ScrollTrigger.config({ ignoreMobileResize: true });
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf as unknown as gsap.TickerCallback);
    };
  }, []);

  return null;
}
