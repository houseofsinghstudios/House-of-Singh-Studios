"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll() {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  useEffect(() => {
    if (isStudio) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    const style = document.createElement("style");
    style.id = "lenis-styles";
    style.textContent =
      "html.lenis,html.lenis body{height:auto;overflow:visible}";
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
  }, [isStudio]);

  return null;
}
