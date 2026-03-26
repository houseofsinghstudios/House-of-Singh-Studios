"use client";

import { useEffect, useRef } from "react";

export default function FooterReveal() {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = el.querySelectorAll(
              ".footer-reveal-crest, .footer-reveal-tagline, .footer-reveal-legal"
            );
            children.forEach((child) => child.classList.add("in-view"));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="footer-reveal-outer" ref={revealRef}>
      <img
        src="/hos-studios-logo.svg"
        alt="House of Singh Studios"
        className="footer-reveal-crest"
      />
      <p className="footer-reveal-tagline">
        Design studio. AI powered. Brand focused.
      </p>
      <span className="footer-reveal-legal">
        &copy; 2026 House of Singh Studios Inc.
      </span>
    </div>
  );
}
