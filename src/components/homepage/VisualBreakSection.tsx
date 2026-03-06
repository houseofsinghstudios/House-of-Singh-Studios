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

    const ctx = gsap.context(() => {
      // GSAP parallax: image translateY(-15%) to translateY(15%) as section scrolls through
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
