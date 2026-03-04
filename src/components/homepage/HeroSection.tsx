"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { HERO } from "@/lib/constants/homepage-data";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

/**
 * SECTION 1: THE OPENING — "The Unfolding"
 *
 * Desktop: Split typography across a center vertical line.
 * Mobile: Centered single block with horizontal line, variable font weight shift.
 */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const leftLine1Ref = useRef<HTMLDivElement>(null);
  const rightLine1Ref = useRef<HTMLDivElement>(null);
  const leftLine2Ref = useRef<HTMLDivElement>(null);
  const rightLine2Ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Mobile-specific refs
  const mobileLineRef = useRef<HTMLDivElement>(null);
  const mobileHeadlineRef = useRef<HTMLHeadingElement>(null);
  const mobileCrestRef = useRef<HTMLDivElement>(null);
  const mobileSupportRef = useRef<HTMLParagraphElement>(null);
  const mobileCtaRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileLabelRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 600);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      // Show everything immediately
      const allRefs = [lineRef, leftLine1Ref, rightLine1Ref, leftLine2Ref, rightLine2Ref,
        labelRef, supportRef, ctaRef, scrollRef, mobileLineRef, mobileHeadlineRef,
        mobileCrestRef, mobileSupportRef, mobileCtaRef, mobileScrollRef, mobileLabelRef];
      allRefs.forEach((ref) => {
        if (ref.current) gsap.set(ref.current, { opacity: 1, y: 0, clipPath: "none" });
      });
      if (lineRef.current) gsap.set(lineRef.current, { height: "100%" });
      if (mobileLineRef.current) gsap.set(mobileLineRef.current, { width: 60 });
      return;
    }

    const mobile = window.innerWidth <= 600;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (mobile) {
      // Mobile page load animation (simplified, ~1.0s total)
      if (mobileCrestRef.current) {
        gsap.set(mobileCrestRef.current, { opacity: 0 });
        tl.to(mobileCrestRef.current, { opacity: 1, duration: 0.3 }, 0);
      }
      if (mobileLineRef.current) {
        gsap.set(mobileLineRef.current, { width: 0, opacity: 0.2 });
        tl.to(mobileLineRef.current, { width: 60, duration: 0.6, ease: "power2.out" }, 0.15);
      }
      if (mobileHeadlineRef.current) {
        gsap.set(mobileHeadlineRef.current, { opacity: 0, y: 20 });
        tl.to(mobileHeadlineRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.2);
      }
      if (mobileLabelRef.current) {
        gsap.set(mobileLabelRef.current, { opacity: 0 });
        tl.to(mobileLabelRef.current, { opacity: 1, duration: 0.2 }, 0.5);
      }
      if (mobileSupportRef.current) {
        gsap.set(mobileSupportRef.current, { opacity: 0, y: 15 });
        tl.to(mobileSupportRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0.6);
      }
      if (mobileCtaRef.current) {
        gsap.set(mobileCtaRef.current, { opacity: 0, y: 15 });
        tl.to(mobileCtaRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0.7);
      }
      if (mobileScrollRef.current) {
        gsap.set(mobileScrollRef.current, { opacity: 0 });
        tl.to(mobileScrollRef.current, { opacity: 1, duration: 0.2 }, 0.8);
      }
    } else {
      // Desktop page load animation
      if (lineRef.current) {
        gsap.set(lineRef.current, { height: 0, opacity: 0.15 });
        tl.to(lineRef.current, { height: "100%", duration: 0.8, ease: "cubic-bezier(.23,1,.32,1)" }, 0.3);
      }
      if (leftLine1Ref.current) {
        gsap.set(leftLine1Ref.current, { clipPath: "inset(0 0 0 100%)", opacity: 1 });
        tl.to(leftLine1Ref.current, { clipPath: "inset(0 0 0 0%)", duration: 0.5 }, 0.6);
      }
      if (rightLine1Ref.current) {
        gsap.set(rightLine1Ref.current, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
        tl.to(rightLine1Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.5 }, 0.72);
      }
      if (leftLine2Ref.current) {
        gsap.set(leftLine2Ref.current, { clipPath: "inset(0 0 0 100%)", opacity: 1 });
        tl.to(leftLine2Ref.current, { clipPath: "inset(0 0 0 0%)", duration: 0.5 }, 0.84);
      }
      if (rightLine2Ref.current) {
        gsap.set(rightLine2Ref.current, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
        tl.to(rightLine2Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.5 }, 0.96);
      }
      if (labelRef.current) {
        gsap.set(labelRef.current, { opacity: 0, y: 10 });
        tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.3 }, 1.4);
      }
      if (scrollRef.current) {
        gsap.set(scrollRef.current, { opacity: 0 });
        tl.to(scrollRef.current, { opacity: 1, duration: 0.3 }, 1.5);
      }

      // Firefox fallback for scroll-driven supporting text/CTAs
      if (!CSS.supports("animation-timeline", "view()")) {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger);
          if (supportRef.current) {
            gsap.set(supportRef.current, { opacity: 0, y: 20 });
            gsap.to(supportRef.current, {
              opacity: 1, y: 0, duration: 0.6,
              scrollTrigger: { trigger: section, start: "20% top", once: true },
            });
          }
          if (ctaRef.current) {
            gsap.set(ctaRef.current, { opacity: 0, y: 20 });
            gsap.to(ctaRef.current, {
              opacity: 1, y: 0, duration: 0.5,
              scrollTrigger: { trigger: section, start: "30% top", once: true },
            });
          }
        });
      }
    }

    return () => { tl.kill(); };
  }, [isMobile]);

  // Mobile layout
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="hero-section-mobile-fade"
        style={{ position: "relative" }}
      >
        <div className="hero-mobile">
          {/* Crest */}
          <div ref={mobileCrestRef} style={{ marginBottom: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hos-studios-logo.svg"
              alt="House of Singh Studios"
              style={{ height: 48, width: "auto" }}
            />
          </div>

          {/* Editorial label */}
          <div ref={mobileLabelRef}>
            <EditorialLabel text={`(${HERO.label})`} />
          </div>

          {/* Headline — variable font weight via CSS SDA */}
          <h1
            ref={mobileHeadlineRef}
            className="hero-headline-mobile-sda hero-mobile-headline"
          >
            AI can generate assets.
            <br />
            It cannot build a brand.
          </h1>

          {/* Horizontal line (replacing desktop center vertical line) */}
          <div
            ref={mobileLineRef}
            className="hero-mobile-line"
          />

          {/* Supporting text */}
          <p ref={mobileSupportRef} className="hero-mobile-support m-fade-up">
            {HERO.secondary}
          </p>

          {/* CTAs — stacked, full width */}
          <div ref={mobileCtaRef} className="hero-mobile-ctas">
            <Button href={HERO.cta.primary.href}>
              {HERO.cta.primary.text}
            </Button>
            <Button href={HERO.cta.secondary.href} variant="secondary">
              {HERO.cta.secondary.text}
            </Button>
          </div>

          {/* Scroll indicator */}
          <div ref={mobileScrollRef} className="hero-mobile-scroll">
            <EditorialLabel text="(Scroll)" />
          </div>
        </div>
      </section>
    );
  }

  // Desktop layout
  return (
    <section
      ref={sectionRef}
      className="hero-section-fade"
      style={{ position: "relative", minHeight: "300vh" }}
    >
      <div style={{
        position: "sticky", top: 0, height: "100vh", width: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        {/* Editorial label */}
        <div ref={labelRef} style={{ position: "absolute", top: 100, left: "var(--page-px)" }}>
          <EditorialLabel text={`(${HERO.label})`} />
        </div>

        {/* Vertical center line (drawn on load) */}
        <div ref={lineRef} style={{
          position: "absolute", top: 0, left: "50%", width: 1, height: 0,
          background: "var(--text-primary)", opacity: 0.15,
          transform: "translateX(-50%)", zIndex: 1,
        }} />

        {/* Split headline */}
        <div className="hero-headline-sda" style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.15em",
          fontFamily: "var(--serif)", fontWeight: 300,
          fontSize: "clamp(42px, 6vw, 84px)", letterSpacing: "-0.03em", lineHeight: 1.05,
          color: "var(--text-primary)", position: "relative", zIndex: 2,
          width: "100%", maxWidth: 1200, padding: "0 var(--page-px)",
        }}>
          <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
            <div ref={leftLine1Ref} style={{
              textAlign: "right", paddingRight: "clamp(16px, 3vw, 40px)", flex: "0 0 50%", opacity: 0,
            }}>
              AI can generate
            </div>
            <div ref={rightLine1Ref} style={{
              textAlign: "left", paddingLeft: "clamp(16px, 3vw, 40px)", flex: "0 0 50%", opacity: 0,
            }}>
              assets.
            </div>
          </div>
          <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
            <div ref={leftLine2Ref} style={{
              textAlign: "right", paddingRight: "clamp(16px, 3vw, 40px)", flex: "0 0 50%", opacity: 0,
            }}>
              It cannot build
            </div>
            <div ref={rightLine2Ref} style={{
              textAlign: "left", paddingLeft: "clamp(16px, 3vw, 40px)", flex: "0 0 50%", opacity: 0,
            }}>
              a brand.
            </div>
          </div>
        </div>

        {/* Supporting text */}
        <p ref={supportRef} className="hero-support-sda" style={{
          fontFamily: "var(--sans)", fontWeight: 400, fontSize: "clamp(16px, 1.4vw, 20px)",
          color: "var(--text-muted)", maxWidth: 520, textAlign: "center",
          marginTop: 40, lineHeight: 1.6, position: "relative", zIndex: 2,
        }}>
          {HERO.secondary}
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="hero-support-sda hero-cta-group" style={{
          display: "flex", gap: 16, marginTop: 32, position: "relative", zIndex: 2,
        }}>
          <Button href={HERO.cta.primary.href} data-cursor="magnetic">
            {HERO.cta.primary.text}
          </Button>
          <Button href={HERO.cta.secondary.href} variant="secondary" data-cursor="magnetic">
            {HERO.cta.secondary.text}
          </Button>
        </div>

        {/* Scroll indicator */}
        <div ref={scrollRef} style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}>
          <EditorialLabel text="(Scroll)" />
          <div className="scroll-track"><div className="scroll-thumb" /></div>
        </div>

        {/* Center line split pseudo-elements (CSS SDA drives these apart) */}
        <div className="center-line-left" style={{
          position: "absolute", top: 0, left: "50%", width: 1, height: "100%",
          background: "var(--text-primary)", opacity: 0.15,
          transform: "translateX(-50%)", pointerEvents: "none",
        }} />
        <div className="center-line-right" style={{
          position: "absolute", top: 0, left: "50%", width: 1, height: "100%",
          background: "var(--text-primary)", opacity: 0.15,
          transform: "translateX(-50%)", pointerEvents: "none",
        }} />
      </div>
    </section>
  );
}
