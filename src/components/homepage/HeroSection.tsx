"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { HERO } from "@/lib/constants/homepage-data";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

/**
 * SECTION 1: THE OPENING — "The Unfolding"
 *
 * Split typography across a center vertical line.
 * Variable font weight shifts 300→600 on scroll via CSS SDA.
 * Center line splits apart as user scrolls.
 * Page load: crest → line draws → text wipes in.
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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      [lineRef, leftLine1Ref, rightLine1Ref, leftLine2Ref, rightLine2Ref,
       labelRef, supportRef, ctaRef, scrollRef].forEach((ref) => {
        if (ref.current) {
          gsap.set(ref.current, { opacity: 1, y: 0, clipPath: "none" });
        }
      });
      if (lineRef.current) gsap.set(lineRef.current, { height: "100%" });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // t=0.30: Vertical center line draws downward
    if (lineRef.current) {
      gsap.set(lineRef.current, { height: 0, opacity: 0.15 });
      tl.to(lineRef.current, { height: "100%", duration: 0.8, ease: "cubic-bezier(.23,1,.32,1)" }, 0.3);
    }

    // t=0.60: "AI can generate" — left wipe from center outward
    if (leftLine1Ref.current) {
      gsap.set(leftLine1Ref.current, { clipPath: "inset(0 0 0 100%)", opacity: 1 });
      tl.to(leftLine1Ref.current, { clipPath: "inset(0 0 0 0%)", duration: 0.5 }, 0.6);
    }

    // t=0.72: "assets." — right wipe from center outward
    if (rightLine1Ref.current) {
      gsap.set(rightLine1Ref.current, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
      tl.to(rightLine1Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.5 }, 0.72);
    }

    // t=0.84: "It cannot build"
    if (leftLine2Ref.current) {
      gsap.set(leftLine2Ref.current, { clipPath: "inset(0 0 0 100%)", opacity: 1 });
      tl.to(leftLine2Ref.current, { clipPath: "inset(0 0 0 0%)", duration: 0.5 }, 0.84);
    }

    // t=0.96: "a brand."
    if (rightLine2Ref.current) {
      gsap.set(rightLine2Ref.current, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
      tl.to(rightLine2Ref.current, { clipPath: "inset(0 0% 0 0)", duration: 0.5 }, 0.96);
    }

    // t=1.40: Label
    if (labelRef.current) {
      gsap.set(labelRef.current, { opacity: 0, y: 10 });
      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.3 }, 1.4);
    }

    // t=1.50: Scroll indicator
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

    return () => { tl.kill(); };
  }, []);

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
