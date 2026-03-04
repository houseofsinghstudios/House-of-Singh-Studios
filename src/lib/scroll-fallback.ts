"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const fallbackTriggers: ScrollTrigger[] = [];

/**
 * If the browser does not support CSS scroll-driven animations,
 * create GSAP ScrollTrigger fallbacks for .scroll-reveal-up and
 * .scroll-clip-reveal elements.
 */
export function initScrollFallbacks() {
  if (
    typeof CSS !== "undefined" &&
    CSS.supports &&
    CSS.supports("animation-timeline", "view()")
  ) {
    return; // native CSS handles it
  }

  // .scroll-reveal-up fallback
  document.querySelectorAll<HTMLElement>(".scroll-reveal-up").forEach((el) => {
    gsap.set(el, { opacity: 0, y: 40 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }),
      onLeaveBack: () => gsap.to(el, { opacity: 0, y: 40, duration: 0.4 }),
    });
    fallbackTriggers.push(st);
  });

  // .scroll-clip-reveal fallback
  document.querySelectorAll<HTMLElement>(".scroll-clip-reveal").forEach((el) => {
    gsap.set(el, { clipPath: "inset(8% 6%)" });
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () =>
        gsap.to(el, { clipPath: "inset(0%)", duration: 0.8, ease: "power3.out" }),
      onLeaveBack: () =>
        gsap.to(el, { clipPath: "inset(8% 6%)", duration: 0.4 }),
    });
    fallbackTriggers.push(st);

    // Inner img/canvas scale
    el.querySelectorAll<HTMLElement>("img, canvas").forEach((inner) => {
      gsap.set(inner, { scale: 1.1 });
      const innerSt = ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => gsap.to(inner, { scale: 1, duration: 1, ease: "power3.out" }),
        onLeaveBack: () => gsap.to(inner, { scale: 1.1, duration: 0.4 }),
      });
      fallbackTriggers.push(innerSt);
    });
  });
}

export function cleanScrollFallbacks() {
  fallbackTriggers.forEach((st) => st.kill());
  fallbackTriggers.length = 0;
}
