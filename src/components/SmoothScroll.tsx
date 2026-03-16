"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function SmoothScroll() {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  useEffect(() => {
    console.log('SmoothScroll pathname:', pathname);

    if (isStudio) {
      // Override any Lenis CSS (overflow: hidden) that was applied globally
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      };
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

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
    };
  }, [isStudio]);

  return null;
}
