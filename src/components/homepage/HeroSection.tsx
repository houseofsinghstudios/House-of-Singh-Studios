"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO } from "@/lib/constants/homepage-data";
import { clamp01, rangeProgress } from "@/lib/hooks/useScrollProgress";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const secondaryEl = secondaryRef.current;
    if (!section) return;

    // ── Initialize secondary text character spans ──
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

    // ── Page load orchestration — line-by-line entrance ──
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // t=0: Editorial label
    if (labelRef.current) {
      gsap.set(labelRef.current, { opacity: 0, y: 20 });
      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0);
    }

    // t=0.1: Headline line 1 — "AI can generate assets."
    if (line1Ref.current) {
      gsap.set(line1Ref.current, { opacity: 0, y: 20 });
      tl.to(line1Ref.current, { opacity: 1, y: 0, duration: 0.5 }, 0.1);
    }

    // t=0.3: Headline line 2 — "It cannot build a brand."
    if (line2Ref.current) {
      gsap.set(line2Ref.current, { opacity: 0, y: 20 });
      tl.to(line2Ref.current, { opacity: 1, y: 0, duration: 0.5 }, 0.3);
    }

    // t=0.5: Secondary text container
    if (secondaryEl) {
      gsap.set(secondaryEl, { opacity: 0, y: 20 });
      tl.to(secondaryEl, { opacity: 1, y: 0, duration: 0.5 }, 0.5);
    }

    // t=0.7: CTA buttons
    if (ctaRef.current) {
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });
      tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.7);
    }

    // t=0.9: Scroll indicator
    if (scrollRef.current) {
      gsap.set(scrollRef.current, { opacity: 0 });
      tl.to(scrollRef.current, { opacity: 1, duration: 0.3 }, 0.9);
    }

    // ── Scroll-driven animations via ScrollTrigger ──
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const scrollPct = self.progress * 100;

        // Secondary text: char-by-char blur-to-sharp (3–18%)
        if (secondaryEl) {
          const chars = secondaryEl.querySelectorAll<HTMLSpanElement>("span[data-char-idx]");
          const total = chars.length;
          chars.forEach((ch) => {
            const idx = Number(ch.dataset.charIdx);
            const charStart = 3 + (idx / total) * 12;
            const p = clamp01((scrollPct - charStart) / 3);
            ch.style.opacity = String(p);
            ch.style.filter = `blur(${6 * (1 - p)}px)`;
            ch.style.transform = `translateY(${8 * (1 - p)}px)`;
          });
        }

        // Scroll indicator: fades out (20–50%)
        if (scrollRef.current) {
          const fadeOut = rangeProgress(scrollPct, 20, 50);
          scrollRef.current.style.opacity = String(1 - fadeOut);
        }
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section relative flex flex-col justify-end px-[var(--page-px)] pb-20"
      style={{ minHeight: "100svh" }}
    >
      <div ref={labelRef}>
        <EditorialLabel text={HERO.label} className="mb-6" />
      </div>

      <div className="max-w-[900px]">
        <h1
          ref={headlineRef}
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
          style={{
            fontSize: "clamp(36px, 5.5vw, 76px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          <span ref={line1Ref} style={{ display: "block" }}>{HERO.headline[0]}</span>
          <span ref={line2Ref} style={{ display: "block" }}>{HERO.headline[1]}</span>
        </h1>

        {/* Secondary — character blur reveal on scroll */}
        <div
          ref={secondaryRef}
          className="mt-8 font-[var(--sans)] font-normal text-lg leading-relaxed text-[color:var(--text-muted)] max-w-[700px]"
        >
          {HERO.secondary}
        </div>

        {/* CTAs */}
        <div
          ref={ctaRef}
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
    </section>
  );
}
