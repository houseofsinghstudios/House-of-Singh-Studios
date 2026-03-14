"use client";

import { useEffect, useRef } from "react";
import { HERO } from "@/lib/constants/homepage-data";
import { clamp01, rangeProgress } from "@/lib/hooks/useScrollProgress";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const secondaryEl = secondaryRef.current;
    if (!section) return;

    // Initialize secondary text character spans for scroll-driven blur reveal
    if (secondaryEl && !secondaryEl.dataset.initialized) {
      secondaryEl.dataset.initialized = "1";
      secondaryEl.innerHTML = "";
      for (let i = 0; i < HERO.secondary.length; i++) {
        const span = document.createElement("span");
        span.textContent = HERO.secondary[i] === " " ? "\u00A0" : HERO.secondary[i];
        span.style.cssText = "opacity:0;filter:blur(6px);transform:translateY(8px);display:inline-block";
        span.dataset.charIdx = String(i);
        secondaryEl.appendChild(span);
      }
    }

    // Scroll-driven char-by-char blur reveal via scroll listener
    const chars = secondaryEl
      ? Array.from(secondaryEl.querySelectorAll<HTMLSpanElement>("span[data-char-idx]"))
      : [];
    const totalChars = chars.length;

    function onScroll() {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      // Progress from 0 (section top at viewport top) to 1 (section bottom at viewport top)
      const scrollPct = Math.max(0, Math.min(1, -rect.top / sectionHeight)) * 100;

      // Secondary text: char-by-char blur-to-sharp (3–18%)
      for (let i = 0; i < totalChars; i++) {
        const ch = chars[i];
        const charStart = 3 + (i / totalChars) * 12;
        const p = clamp01((scrollPct - charStart) / 3);
        ch.style.opacity = String(p);
        ch.style.filter = `blur(${6 * (1 - p)}px)`;
        ch.style.transform = `translateY(${8 * (1 - p)}px)`;
      }

      // Scroll indicator: fades out (20–50%)
      if (scrollRef.current) {
        const fadeOut = rangeProgress(scrollPct, 20, 50);
        scrollRef.current.style.opacity = String(1 - fadeOut);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section relative px-[var(--page-px)]"
      style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "20vh", paddingBottom: 80 }}
    >
      <div data-hero-label>
        <EditorialLabel text={HERO.label} className="mb-6" />
      </div>

      <div className="max-w-[900px]">
        <h1
          data-hero-heading
          className="font-[var(--sans)] font-semibold text-[color:var(--text-primary)] m-0"
          style={{
            fontSize: "clamp(36px, 5.5vw, 76px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ display: "block" }}>{HERO.headline[0]}</span>
          <span style={{ display: "block" }}>{HERO.headline[1]}</span>
        </h1>

        {/* Secondary — character blur reveal on scroll */}
        <div
          ref={secondaryRef}
          data-hero-body
          className="mt-8 font-[var(--sans)] font-normal text-lg leading-relaxed text-[color:var(--text-muted)] max-w-[700px]"
        >
          {HERO.secondary}
        </div>

        {/* CTAs */}
        <div
          data-hero-sub
          className="mt-12 flex flex-wrap gap-3 hero-cta-row"
        >
          <Button href={HERO.cta.primary.href} data-cursor="link">
            {HERO.cta.primary.text}
          </Button>
          <Button href={HERO.cta.secondary.href} variant="secondary" data-cursor="link">
            {HERO.cta.secondary.text}
          </Button>
        </div>
      </div>

      {/* Scroll indicator — bottom right */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 right-[var(--page-px)] flex flex-col items-end gap-3"
      >
        <EditorialLabel text="Scroll" />
        <div className="scroll-track">
          <div className="scroll-thumb" />
        </div>
      </div>

      {/* Horizontal divider at section bottom */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ height: 1, background: "var(--border)" }}
      />
    </section>
  );
}
