/**
 * Feature detection for CSS Scroll-Driven Animations.
 * Returns true if the browser natively supports animation-timeline: view().
 * When false, components should fall back to GSAP ScrollTrigger.
 */
export function supportsScrollTimeline(): boolean {
  if (typeof window === "undefined") return false;
  return CSS.supports("animation-timeline", "view()");
}

/**
 * Dynamically import GSAP + ScrollTrigger only when needed (Firefox fallback).
 */
export async function loadGSAPFallback() {
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
