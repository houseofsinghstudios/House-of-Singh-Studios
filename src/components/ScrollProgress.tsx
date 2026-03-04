"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll progress indicator.
 *
 * Mobile/Tablet: CSS SDA-powered indicator (zero JS) when supported.
 * Falls back to JS-driven progress bar on unsupported browsers.
 * Hidden on desktop (only shows on touch devices).
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchOnly = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    // Only show on touch devices
    if (!isTouchOnly) return;

    // If CSS SDA is supported, the .scroll-indicator-css class handles everything
    if (CSS.supports("animation-timeline", "scroll()")) return;

    // JS fallback for Firefox mobile
    const bar = barRef.current;
    if (!bar) return;

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;

        bar!.style.transform = `scaleX(${progress})`;
        if (progress > 0.01) {
          bar!.classList.add("visible");
        } else {
          bar!.classList.remove("visible");
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* CSS SDA version (preferred, zero JS) */}
      <div className="scroll-indicator-css" />
      {/* JS fallback version */}
      <div ref={barRef} className="scroll-progress-bar" />
    </>
  );
}
