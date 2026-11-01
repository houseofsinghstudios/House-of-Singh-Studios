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

    // Keyboard focus stays in view. Lenis can leave the browser's own focus scroll behind, so a
    // Tab that lands on an element hidden under the header or outside the window brings it to the
    // middle of the view at once. Only Tab moves are handled: a mouse or touch press never scrolls
    // here. With reduced motion Lenis is off and the browser scrolls focus into view itself.
    let viaKeyboard = false;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Tab") viaKeyboard = true; };
    const onPointer = () => { viaKeyboard = false; };
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target;
      if (!viaKeyboard || !(el instanceof HTMLElement)) return;
      for (let node: HTMLElement | null = el; node; node = node.parentElement) {
        const position = getComputedStyle(node).position;
        if (position === "fixed" || position === "sticky") return;
      }
      const rect = el.getBoundingClientRect();
      const top = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
      const room = window.innerHeight - top;
      if (rect.top >= top + 8 && rect.bottom <= window.innerHeight - 8) return;
      const offset = rect.height < room ? -(top + (room - rect.height) / 2) : -(top + 24);
      lenis.scrollTo(el, { offset, immediate: true });
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("focusin", onFocusIn);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.getElementById("lenis-styles")?.remove();
    };
  }, [isStudio, reduceMotion]);

  return null;
}
