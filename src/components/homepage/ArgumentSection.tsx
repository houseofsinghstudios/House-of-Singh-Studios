"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ARGUMENT } from "@/lib/constants/homepage-data";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 3: THE ARGUMENT — "The Typographic Wall"
 *
 * Single massive typographic statement filling viewport.
 * Variable font weight starts at 700 and DECREASES to 300 on scroll.
 * "We fix that." appears instantly — zero transition.
 * Three process steps fade up with stagger.
 * Reverse parallax: headline moves up faster, "We fix that." moves up slower.
 */
export default function ArgumentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fixRef = useRef<HTMLParagraphElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

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
      // "We fix that." — appears INSTANTLY at 60% through section
      if (fixRef.current) {
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

      // Process steps stagger in
      if (stepsRef.current) {
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

      // Firefox fallback for variable font weight (CSS SDA handles in Chrome/Safari)
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
  }, []);

  const steps = [
    { bold: "Discover", rest: "what your brand should be." },
    { bold: "Design", rest: "the system that makes it real." },
    { bold: "Deliver", rest: "assets that hold up everywhere." },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-reveal-wipe"
      style={{
        minHeight: "150vh",
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
          className="argument-headline-sda argument-parallax-fast"
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 700,
            fontSize: "clamp(48px, 8vw, 120px)",
            lineHeight: 1.05,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          {ARGUMENT.heading}
        </h2>

        {/* "We fix that." — instant appearance, reverse parallax (slower) */}
        <p
          ref={fixRef}
          className="argument-parallax-slow"
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: "clamp(28px, 4vw, 48px)",
            color: "var(--text-primary)",
            margin: "40px 0 0",
            opacity: 0,
          }}
        >
          {ARGUMENT.snap}
        </p>

        {/* Process steps */}
        <div ref={stepsRef} style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          {steps.map((step, i) => (
            <p
              key={i}
              className="step-item"
              style={{
                fontFamily: "var(--sans)",
                fontSize: 16,
                fontWeight: 400,
                color: "var(--text-muted)",
                margin: 0,
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
