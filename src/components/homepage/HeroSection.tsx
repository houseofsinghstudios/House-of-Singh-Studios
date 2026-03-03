"use client";

import { useEffect, useRef } from "react";
import { HERO } from "@/lib/constants/homepage-data";
import { clamp01, rangeProgress } from "@/lib/hooks/useScrollProgress";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function HeroSection() {
  const secondaryRef = useRef<HTMLDivElement>(null);
  const supportLine1Ref = useRef<HTMLParagraphElement>(null);
  const supportLine2Ref = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const secondaryEl = secondaryRef.current;

    // Wrap secondary text in individual character spans
    if (secondaryEl && !secondaryEl.dataset.initialized) {
      secondaryEl.dataset.initialized = "1";
      secondaryEl.innerHTML = "";
      for (let i = 0; i < HERO.secondary.length; i++) {
        const span = document.createElement("span");
        span.textContent = HERO.secondary[i] === " " ? "\u00A0" : HERO.secondary[i];
        span.style.cssText = "opacity:0;filter:blur(6px);transform:translateY(8px);display:inline-block;transition:none";
        span.dataset.charIdx = String(i);
        secondaryEl.appendChild(span);
      }
    }

    let ticking = false;

    function update() {
      const vh = window.innerHeight;
      const scrollPct = (window.scrollY / vh) * 100;

      // Secondary text: char-by-char blur-to-sharp (5–30%)
      if (secondaryEl) {
        const chars = secondaryEl.querySelectorAll<HTMLSpanElement>("span[data-char-idx]");
        const total = chars.length;
        chars.forEach((ch) => {
          const idx = Number(ch.dataset.charIdx);
          const charStart = 5 + (idx / total) * 20;
          const p = clamp01((scrollPct - charStart) / 5);
          ch.style.opacity = String(p);
          ch.style.filter = `blur(${6 * (1 - p)}px)`;
          ch.style.transform = `translateY(${8 * (1 - p)}px)`;
        });
      }

      // Supporting Line 1: clip-path wipe (35–55%)
      const line1 = supportLine1Ref.current;
      if (line1) {
        const p = rangeProgress(scrollPct, 35, 55);
        line1.style.clipPath = `inset(0 ${100 * (1 - p)}% 0 0)`;
        line1.style.opacity = p > 0 ? "1" : "0";
      }

      // Supporting Line 2: clip-path wipe (48–68%)
      const line2 = supportLine2Ref.current;
      if (line2) {
        const p = rangeProgress(scrollPct, 48, 68);
        line2.style.clipPath = `inset(0 ${100 * (1 - p)}% 0 0)`;
        line2.style.opacity = p > 0 ? "1" : "0";
      }

      // CTAs: scale + fade (60–75%)
      const ctaEl = ctaRef.current;
      if (ctaEl) {
        const p = rangeProgress(scrollPct, 60, 75);
        ctaEl.style.opacity = String(p);
        ctaEl.style.transform = `scale(${0.96 + 0.04 * p})`;
      }

      // Scroll indicator: fade in (50–60%) then out (80–100%)
      const scrollEl = scrollRef.current;
      if (scrollEl) {
        const fadeIn = rangeProgress(scrollPct, 50, 60);
        const fadeOut = rangeProgress(scrollPct, 80, 100);
        scrollEl.style.opacity = String(fadeIn * (1 - fadeOut));
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
    <section className="relative min-h-screen flex flex-col justify-end px-[var(--page-px)] pb-20">
      <EditorialLabel text={HERO.label} className="mb-6" />

      <div className="max-w-[800px]">
        <h1
          className="font-[var(--serif)] font-semibold leading-[1.08] text-[color:var(--text-primary)] m-0"
          style={{ fontSize: "clamp(44px, 6.2vw, 80px)" }}
        >
          {HERO.headline[0]}
          <br />
          {HERO.headline[1]}
        </h1>

        {/* Secondary — wider max-width so "direction" doesn't break */}
        <div
          ref={secondaryRef}
          className="mt-8 font-[var(--sans)] font-normal text-lg leading-relaxed text-[color:var(--text-muted)] max-w-[700px]"
        >
          {HERO.secondary}
        </div>

        {/* Supporting Line 1 — clip-path wipe at 35% */}
        <p
          ref={supportLine1Ref}
          className="mt-8 font-[var(--sans)] font-light leading-[1.65] text-[color:var(--text-faint)] max-w-[600px]"
          style={{
            fontSize: "clamp(14px, 1.2vw, 16px)",
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
            transition: "clip-path 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {HERO.supportingLine1}
        </p>

        {/* Supporting Line 2 — clip-path wipe at 48% */}
        <p
          ref={supportLine2Ref}
          className="mt-2.5 font-[var(--sans)] font-light leading-[1.65] text-[color:var(--text-faint)] max-w-[600px]"
          style={{
            fontSize: "clamp(14px, 1.2vw, 16px)",
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
            transition: "clip-path 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {HERO.supportingLine2}
        </p>

        {/* CTAs — scale + fade at 60% */}
        <div
          ref={ctaRef}
          className="mt-12 flex flex-wrap gap-4"
          style={{ opacity: 0, transform: "scale(0.96)" }}
        >
          <Button href={HERO.cta.primary.href}>{HERO.cta.primary.text}</Button>
          <Button href={HERO.cta.secondary.href} variant="secondary">
            {HERO.cta.secondary.text}
          </Button>
        </div>
      </div>

      {/* Scroll indicator — bottom right */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 right-[var(--page-px)] flex flex-col items-end gap-3"
        style={{ opacity: 0 }}
      >
        <EditorialLabel text="Scroll" />
        <div className="scroll-track">
          <div className="scroll-thumb" />
        </div>
      </div>
    </section>
  );
}
