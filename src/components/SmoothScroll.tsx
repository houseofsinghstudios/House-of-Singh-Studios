"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { REDUCED_MOTION, useMediaQuery } from "@/lib/use-media-query";

// Lenis smooth scrolling, except in the Studio and when the visitor prefers reduced motion: then the
// browser's own scrolling is used. A change to the preference while the page is open starts or
// stops Lenis.
export default function SmoothScroll() {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");
  const reduceMotion = useMediaQuery(REDUCED_MOTION);

  useEffect(() => {
    // The media query is read here as well: the first render after hydration always reports false.
    if (isStudio || reduceMotion || window.matchMedia(REDUCED_MOTION).matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    const style = document.createElement("style");
    style.id = "lenis-styles";
    style.textContent =
      "html.lenis,html.lenis body{height:auto;overflow-y:visible}";
    document.head.appendChild(style);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    (window as unknown as Record<string, unknown>).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.getElementById("lenis-styles")?.remove();
    };
  }, [isStudio, reduceMotion]);

  return null;
}
