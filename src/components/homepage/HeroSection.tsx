"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { HERO } from "@/lib/constants/homepage-data";
import { clamp01, rangeProgress } from "@/lib/hooks/useScrollProgress";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const supportLine1Ref = useRef<HTMLParagraphElement>(null);
  const supportLine2Ref = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const secondaryEl = secondaryRef.current;
    if (!section) return;

    const isTouchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const isSmallScreen = window.innerWidth <= 600;
    const isMobile = isTouchOnly && isSmallScreen;
    const isTablet = isTouchOnly && !isSmallScreen;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Initialize secondary text character spans (desktop/tablet only) ──
    if (!isMobile && secondaryEl && !secondaryEl.dataset.initialized) {
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

    // ── Page load orchestration (GSAP timeline) ──
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (reducedMotion) {
      // Reduced motion: show everything instantly
      if (labelRef.current) gsap.set(labelRef.current, { opacity: 1, y: 0 });
      if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 1, y: 0 });
      if (secondaryEl) gsap.set(secondaryEl, { opacity: 1, y: 0 });
      if (supportLine1Ref.current) {
        supportLine1Ref.current.style.clipPath = "inset(0 0% 0 0)";
        supportLine1Ref.current.style.opacity = "1";
      }
      if (supportLine2Ref.current) {
        supportLine2Ref.current.style.clipPath = "inset(0 0% 0 0)";
        supportLine2Ref.current.style.opacity = "1";
      }
      if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1, scale: 1 });
      if (scrollRef.current) gsap.set(scrollRef.current, { opacity: 1 });
      return () => { tl.kill(); };
    }

    if (isMobile) {
      // ── MOBILE: No SplitType, block fade-up ──
      if (labelRef.current) {
        gsap.set(labelRef.current, { opacity: 0, y: 12 });
        tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0.1);
      }

      // Headline as single block fade-up (no SplitType)
      if (headlineRef.current) {
        gsap.set(headlineRef.current, { opacity: 0, y: 20 });
        tl.to(headlineRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.15);
      }

      // Secondary text: simple fade-up (no character spans)
      if (secondaryEl) {
        gsap.set(secondaryEl, { opacity: 0, y: 15 });
        tl.to(secondaryEl, { opacity: 1, y: 0, duration: 0.35 }, 0.4);
      }

      // Support lines: simple translateY fade
      if (supportLine1Ref.current) {
        supportLine1Ref.current.style.clipPath = "none";
        gsap.set(supportLine1Ref.current, { opacity: 0, y: 12 });
        tl.to(supportLine1Ref.current, { opacity: 1, y: 0, duration: 0.3 }, 0.5);
      }
      if (supportLine2Ref.current) {
        supportLine2Ref.current.style.clipPath = "none";
        gsap.set(supportLine2Ref.current, { opacity: 0, y: 12 });
        tl.to(supportLine2Ref.current, { opacity: 1, y: 0, duration: 0.3 }, 0.55);
      }

      // CTAs fade up
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, y: 10 });
        tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0.55);
      }

      // Scroll indicator
      if (scrollRef.current) {
        gsap.set(scrollRef.current, { opacity: 0 });
        tl.to(scrollRef.current, { opacity: 1, duration: 0.2 }, 0.65);
      }

      // ── Mobile scroll: simple opacity fade for secondary, earlier scroll indicator fade ──
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const scrollPct = self.progress * 100;

          // Secondary: simple opacity fade 3–15%
          if (secondaryEl) {
            const p = clamp01((scrollPct - 3) / 12);
            secondaryEl.style.opacity = String(0.3 + 0.7 * p);
          }

          // Support lines: fade in via translateY (18–26%, 24–32%)
          if (supportLine1Ref.current) {
            const p = rangeProgress(scrollPct, 18, 26);
            supportLine1Ref.current.style.opacity = String(p);
            supportLine1Ref.current.style.transform = `translateY(${12 * (1 - p)}px)`;
          }
          if (supportLine2Ref.current) {
            const p = rangeProgress(scrollPct, 24, 32);
            supportLine2Ref.current.style.opacity = String(p);
            supportLine2Ref.current.style.transform = `translateY(${12 * (1 - p)}px)`;
          }

          // CTAs fade at 28%
          if (ctaRef.current) {
            const p = rangeProgress(scrollPct, 28, 36);
            ctaRef.current.style.opacity = String(p);
          }

          // Scroll indicator: fades out earlier (5–15%)
          if (scrollRef.current) {
            const fadeOut = rangeProgress(scrollPct, 5, 15);
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
    }

    // ── TABLET / DESKTOP ──

    // t=0.10: Editorial label fades up
    if (labelRef.current) {
      gsap.set(labelRef.current, { opacity: 0, y: 12 });
      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0.1);
    }

    // t=0.20: Headline word reveal with SplitType
    let split: SplitType | null = null;
    if (headlineRef.current) {
      split = new SplitType(headlineRef.current, {
        types: isTablet ? "words" : "words",
      });
      if (split.words) {
        gsap.set(split.words, { y: "100%", opacity: 0 });
        tl.to(
          split.words,
          { y: "0%", opacity: 1, stagger: isTablet ? 0.04 : 0.06, duration: 0.6 },
          0.2
        );
      }
    }

    // t=0.60: Secondary text container fades up
    if (secondaryEl) {
      gsap.set(secondaryEl, { opacity: 0, y: 15 });
      tl.to(secondaryEl, { opacity: 1, y: 0, duration: 0.4 }, 0.6);
    }

    // t=0.80: Scroll indicator fades in
    if (scrollRef.current) {
      gsap.set(scrollRef.current, { opacity: 0 });
      tl.to(scrollRef.current, { opacity: 1, duration: 0.3 }, 0.8);
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

        // Supporting Line 1: clip-path wipe (18–28%)
        if (supportLine1Ref.current) {
          const p = rangeProgress(scrollPct, 18, 28);
          supportLine1Ref.current.style.clipPath = `inset(0 ${100 * (1 - p)}% 0 0)`;
          supportLine1Ref.current.style.opacity = p > 0 ? "1" : "0";
        }

        // Supporting Line 2: clip-path wipe (26–36%)
        if (supportLine2Ref.current) {
          const p = rangeProgress(scrollPct, 26, 36);
          supportLine2Ref.current.style.clipPath = `inset(0 ${100 * (1 - p)}% 0 0)`;
          supportLine2Ref.current.style.opacity = p > 0 ? "1" : "0";
        }

        // CTAs: scale + fade (34–42%)
        if (ctaRef.current) {
          const p = rangeProgress(scrollPct, 34, 42);
          ctaRef.current.style.opacity = String(p);
          ctaRef.current.style.transform = `scale(${0.96 + 0.04 * p})`;
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
      if (split) split.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-end px-[var(--page-px)] pb-20"
    >
      <div ref={labelRef}>
        <EditorialLabel text={HERO.label} className="mb-6" />
      </div>

      <div className="max-w-[900px]">
        <h1
          ref={headlineRef}
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0 overflow-hidden"
          style={{
            fontSize: "clamp(36px, 5.5vw, 76px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {HERO.headline[0]}
          <br />
          {HERO.headline[1]}
        </h1>

        {/* Secondary — character blur reveal on scroll */}
        <div
          ref={secondaryRef}
          className="mt-8 font-[var(--sans)] font-normal text-lg leading-relaxed text-[color:var(--text-muted)] max-w-[700px]"
        >
          {HERO.secondary}
        </div>

        {/* Supporting Line 1 — clip-path wipe */}
        <p
          ref={supportLine1Ref}
          className="mt-8 font-[var(--sans)] font-light leading-[1.65] text-[color:var(--text-faint)] max-w-[600px]"
          style={{
            fontSize: "clamp(14px, 1.2vw, 16px)",
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
          }}
        >
          {HERO.supportingLine1}
        </p>

        {/* Supporting Line 2 — clip-path wipe */}
        <p
          ref={supportLine2Ref}
          className="mt-2.5 font-[var(--sans)] font-light leading-[1.65] text-[color:var(--text-faint)] max-w-[600px]"
          style={{
            fontSize: "clamp(14px, 1.2vw, 16px)",
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
          }}
        >
          {HERO.supportingLine2}
        </p>

        {/* CTAs — scale + fade */}
        <div
          ref={ctaRef}
          className="hero-cta-group mt-12 flex flex-wrap gap-4"
          style={{ opacity: 0, transform: "scale(0.96)" }}
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
