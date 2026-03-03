"use client";

import { useEffect, useState } from "react";

/**
 * Returns scroll progress as a 0–1+ value (scrollY / innerHeight).
 * Uses requestAnimationFrame for 60fps performance.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    function update() {
      setProgress(window.scrollY / window.innerHeight);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

/** Clamp a value between 0 and 1. */
export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Map scroll percentage into a 0–1 range within [start, end]. */
export function rangeProgress(scrollPct: number, start: number, end: number): number {
  return clamp01((scrollPct - start) / (end - start));
}
