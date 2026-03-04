"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ARGUMENT } from "@/lib/constants/homepage-data";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 3: THE ARGUMENT — "The Typographic Wall"
 *
 * Desktop: Full-viewport typographic wall, variable font weight 700→300.
 * Mobile: Centered text, CSS SDA weight reverse, "We fix that." instant snap.
 * Tablet: Same as mobile but larger type and horizontal process steps.
 */
export default function ArgumentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fixRef = useRef<HTMLParagraphElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const w = window.innerWidth;
    setIsMobile(w <= 600);
    setIsTablet(w > 600 && w <= 900);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      if (fixRef.current) gsap.set(fixRef.current, { opacity: 1 });
      if (stepsRef.current) {
        gsap.set(stepsRef.current.querySelectorAll(".step-item"), { opacity: 1, y: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // "We fix that." — INSTANT appearance (desktop + Firefox mobile fallback)
      if (fixRef.current && !(isMobile && CSS.supports("animation-timeline", "view()"))) {
        gsap.set(fixRef.current, { opacity: 0 });
        ScrollTrigger.create({
          trigger: section,
          start: "60% bottom",
          once: true,
          onEnter: () => {
            gsap.set(fixRef.current, { opacity: 1 });
          },
        });
      }

      // Process steps stagger (desktop + Firefox fallback)
      if (stepsRef.current && !(isMobile && CSS.supports("animation-timeline", "view()"))) {
        const items = stepsRef.current.querySelectorAll(".step-item");
        gsap.set(items, { opacity: 0, y: 15 });
        ScrollTrigger.create({
          trigger: stepsRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(items, {
              opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: "power3.out",
            });
          },
        });
      }

      // Firefox fallback for variable font weight
      if (!CSS.supports("animation-timeline", "view()") && headingRef.current) {
        gsap.fromTo(headingRef.current, {
          fontVariationSettings: "'wght' 700",
          opacity: 1,
        }, {
          fontVariationSettings: "'wght' 300",
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  const steps = [
    { bold: "Discover", rest: "what your brand should be." },
    { bold: "Design", rest: "the system that makes it real." },
    { bold: "Deliver", rest: "assets that hold up everywhere." },
  ];

  return (
    <section
      ref={sectionRef}
      className={isMobile || isTablet ? "m-section-wipe" : "section-reveal-wipe"}
      style={{
        minHeight: isMobile ? "80svh" : "150vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--section-py) var(--page-px)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 1000, width: "100%" }}>
        {/* The statement — CSS SDA handles weight decrease */}
        <h2
          ref={headingRef}
          className={
            isMobile
              ? "argument-headline-mobile-sda"
              : "argument-headline-sda argument-parallax-fast"
          }
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 700,
            fontSize: isMobile
              ? "clamp(28px, 7vw, 38px)"
              : isTablet
                ? "clamp(32px, 5.5vw, 52px)"
                : "clamp(48px, 8vw, 120px)",
            lineHeight: 1.05,
            letterSpacing: isMobile ? "-0.02em" : undefined,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          {ARGUMENT.heading}
        </h2>

        {/* "We fix that." — instant snap */}
        <p
          ref={fixRef}
          className={
            isMobile
              ? "argument-fix-mobile"
              : "argument-parallax-slow"
          }
          style={{
            fontFamily: isMobile ? "var(--sans)" : "var(--serif)",
            fontWeight: 600,
            fontSize: isMobile
              ? 16
              : "clamp(28px, 4vw, 48px)",
            textTransform: isMobile ? "uppercase" : undefined,
            letterSpacing: isMobile ? "0.04em" : undefined,
            color: "var(--text-primary)",
            margin: "40px 0 0",
            opacity: 0,
          }}
        >
          {ARGUMENT.snap}
        </p>

        {/* Process steps */}
        <div
          ref={stepsRef}
          style={{
            marginTop: 48,
            display: "flex",
            flexDirection: isTablet ? "row" : "column",
            gap: isTablet ? 32 : 12,
            alignItems: "center",
            justifyContent: isTablet ? "center" : undefined,
          }}
        >
          {steps.map((step, i) => (
            <p
              key={i}
              className={isMobile ? "step-item m-fade-up" : "step-item"}
              style={{
                fontFamily: "var(--sans)",
                fontSize: isMobile ? 14 : 16,
                fontWeight: 400,
                color: "var(--text-muted)",
                margin: 0,
                ...(isMobile && CSS.supports?.("animation-timeline", "view()") ? {
                  animationRange: `entry ${20 + i * 10}% entry ${50 + i * 10}%`,
                } : {}),
              }}
            >
              <strong style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                {step.bold}
              </strong>{" "}
              {step.rest}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
