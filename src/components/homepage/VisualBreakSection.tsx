"use client";

import { useEffect, useRef } from "react";

export default function VisualBreakSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Subtle parallax on scroll
  useEffect(() => {
    let ticking = false;

    function update() {
      const section = sectionRef.current;
      const img = imgRef.current;
      if (!section || !img) { ticking = false; return; }

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // Only apply when section is in viewport
      if (rect.bottom > 0 && rect.top < vh) {
        const progress = (vh - rect.top) / (vh + rect.height);
        const offset = (progress - 0.5) * 30; // max ±15px shift
        img.style.transform = `scale(1.05) translateY(${offset}px)`;
      }

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

  return (
    <section ref={sectionRef} className="visual-break">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/images/photography-ideas-creative-occupation-design-studio-concept.jpg"
        alt="Design studio workspace"
        className="visual-break-img"
        onError={(e) => {
          const img = e.currentTarget;
          img.style.display = "none";
          const fallback = img.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div className="visual-break-fallback" style={{ display: "none" }}>
        <span className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[#999]">
          Image
        </span>
      </div>
      <div className="visual-break-overlay" />
    </section>
  );
}
