"use client";

import { useEffect } from "react";

/**
 * Safari/Firefox fallback for CSS scroll-driven animations.
 * Uses IntersectionObserver to add "in-view" class to elements
 * when they enter the viewport. Does nothing in browsers that
 * support animation-timeline: view() (Chrome 115+).
 */
export default function ScrollObserver() {
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

    // Observe all elements that use CSS scroll-driven animations
    const targets = document.querySelectorAll(
      ".css-reveal, .css-reveal-late, .css-fade, " +
      ".service-block-number, " +
      ".svc-deliverable-row, " +
      ".about-process-step, .svc-process-row, " +
      ".project-image-inner img, " +
      ".founder-photo-reveal, " +
      ".ai-process-row, " +
      ".packages-grid .package-tier, " +
      ".argument-section .argument-step-line, " +
      ".argument-section h2, " +
      ".argument-section > div > p, " +
      ".cta-section-mobile > div:first-child, " +
      ".cta-section-mobile > h2, " +
      ".cta-section-mobile > p, " +
      ".cta-section-mobile > div:last-child"
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
