"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Safari/Firefox fallback for CSS scroll-driven animations.
 * Uses IntersectionObserver to add "in-view" class to elements
 * when they enter the viewport. Does nothing in browsers that
 * support animation-timeline: view() (Chrome 115+).
 *
 * Re-runs on every route change so newly rendered pages get observed.
 */
export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip if browser supports CSS scroll-driven animations
    if (
      typeof CSS !== "undefined" &&
      CSS.supports &&
      CSS.supports("animation-timeline", "view()")
    ) {
      return;
    }

    // Skip if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Small delay to ensure new page DOM is ready after navigation
    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      const targets = document.querySelectorAll(
        ".css-reveal:not(.in-view), .css-reveal-late:not(.in-view), .css-fade:not(.in-view), " +
        ".scroll-reveal-up:not(.in-view), .scroll-clip-reveal:not(.in-view), " +
        ".about-process-step:not(.in-view), " +
        ".project-image-inner img:not(.in-view), " +
        ".founder-photo-reveal:not(.in-view), " +
        ".packages-grid .package-tier:not(.in-view), " +
        ".argument-section .argument-step-row:not(.in-view), " +
        ".argument-section .argument-left:not(.in-view), " +
        ".cta-section-mobile > div:first-child:not(.in-view), " +
        ".cta-section-mobile > h2:not(.in-view), " +
        ".cta-section-mobile > p:not(.in-view), " +
        ".cta-section-mobile > div:last-child:not(.in-view), " +
        ".testimonials-section:not(.in-view), " +
        ".svc-accordion-row:not(.in-view), " +
        ".featured-work-item:not(.in-view), " +
        ".clients-accordion-row:not(.in-view), " +
        ".case-content-section:not(.in-view), " +
        ".reveal-clip:not(.in-view), .reveal-stagger-parent:not(.in-view), .reveal-text:not(.in-view), " +
        ".ins-card:not(.in-view), .ins-featured:not(.in-view), " +
        ".about-team-card:not(.in-view)"
      );

      targets.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
