"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VisualBreakSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;

    const isTouchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const isSmallScreen = window.innerWidth <= 600;
    const isMobile = isTouchOnly && isSmallScreen;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      if (isMobile) {
        // ── MOBILE: curtain draw-down reveal (no parallax) ──
        gsap.set(section, { clipPath: "inset(100% 0 0 0)" });
        gsap.to(section, {
          clipPath: "inset(0% 0 0 0)",
          ease: "power3.out",
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        });
        return;
      }

      // ── TABLET / DESKTOP: parallax ──
      gsap.fromTo(
        img,
        { yPercent: -15, scale: 1.05 },
        {
          yPercent: 15,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="visual-break">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/images/photography-ideas-creative-occupation-design-studio-concept.jpg"
        alt="Design studio workspace"
        className="visual-break-img"
        style={{ willChange: "transform" }}
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
