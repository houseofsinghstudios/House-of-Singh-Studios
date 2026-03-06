"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { TESTIMONIALS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const quoteMarkRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const splitRef = useRef<SplitType | null>(null);
  const prevSlideRef = useRef(0);
  const hasEnteredRef = useRef(false);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      transitionTo(
        ((prevSlideRef.current) + 1) % TESTIMONIALS.length
      );
    }, 6000);
  }, []);

  // Animate a slide in with SplitType word reveal
  const animateSlideIn = useCallback((idx: number, delay = 0) => {
    const slideEl = slideRefs.current[idx];
    if (!slideEl) return;

    // Clean up previous SplitType
    if (splitRef.current) {
      splitRef.current.revert();
      splitRef.current = null;
    }

    const quoteEl = slideEl.querySelector("blockquote") as HTMLElement;
    const authorEl = slideEl.querySelector("[data-author]") as HTMLElement;

    // Show slide container
    gsap.set(slideEl, { opacity: 1, y: 0, pointerEvents: "auto", position: "relative" });

    if (quoteEl) {
      const split = new SplitType(quoteEl, { types: "words" });
      splitRef.current = split;

      if (split.words) {
        gsap.set(split.words, { opacity: 0, y: 20 });
        gsap.to(split.words, {
          opacity: 1,
          y: 0,
          stagger: 0.02,
          duration: 0.4,
          ease: "power3.out",
          delay,
        });
      }
    }

    if (authorEl) {
      const wordCount = splitRef.current?.words?.length || 0;
      gsap.set(authorEl, { opacity: 0 });
      gsap.to(authorEl, {
        opacity: 1,
        duration: 0.3,
        delay: delay + wordCount * 0.02 + 0.15,
      });
    }
  }, []);

  // Transition from current to new slide
  const transitionTo = useCallback(
    (idx: number) => {
      if (idx === prevSlideRef.current) return;

      const outgoing = slideRefs.current[prevSlideRef.current];

      // Animate outgoing
      if (outgoing) {
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
        gsap.to(outgoing, {
          opacity: 0,
          y: -15,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(outgoing, { position: "absolute", pointerEvents: "none" });
          },
        });
      }

      // Animate incoming (delayed to let outgoing complete)
      animateSlideIn(idx, 0.3);

      prevSlideRef.current = idx;
      setActiveSlide(idx);
    },
    [animateSlideIn]
  );

  function goTo(i: number) {
    transitionTo(i);
    resetTimer();
  }

  // Auto-rotate timer
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // ── ScrollTrigger entrance animation ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Set initial states for entrance
      if (labelRef.current) gsap.set(labelRef.current, { opacity: 0, y: 15 });
      if (quoteMarkRef.current) gsap.set(quoteMarkRef.current, { opacity: 0, scale: 0.8 });
      if (controlsRef.current) gsap.set(controlsRef.current, { opacity: 0 });

      // Hide all slides initially
      slideRefs.current.forEach((el, i) => {
        if (el) {
          gsap.set(el, {
            opacity: 0,
            position: i === 0 ? "relative" : "absolute",
            pointerEvents: i === 0 ? "auto" : "none",
          });
        }
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          hasEnteredRef.current = true;
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          // Label fades up
          if (labelRef.current) {
            tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0);
          }

          // Quote mark scales in
          if (quoteMarkRef.current) {
            tl.to(quoteMarkRef.current, { opacity: 1, scale: 1, duration: 0.5 }, 0.1);
          }

          // First testimonial word reveal
          tl.call(() => animateSlideIn(0, 0), [], 0.4);

          // Controls fade in
          if (controlsRef.current) {
            tl.to(controlsRef.current, { opacity: 1, duration: 0.3 }, 1.0);
          }
        },
      });
    }, section);

    return () => {
      ctx.revert();
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
    };
  }, [animateSlideIn]);

  return (
    <section
      ref={sectionRef}
      className="py-[140px] px-[var(--page-px)] bg-[var(--bg-shift)] text-center"
      onMouseEnter={() => { if (timerRef.current) clearInterval(timerRef.current); }}
      onMouseLeave={() => { resetTimer(); }}
    >
      <div ref={labelRef}>
        <EditorialLabel text="Clients" className="mb-8" />
      </div>

      <div
        ref={quoteMarkRef}
        className="font-[var(--serif)] text-[120px] leading-none text-[#E0E0DB] select-none -mb-5"
      >
        &ldquo;
      </div>

      <div ref={carouselRef} className="relative max-w-[720px] mx-auto" style={{ minHeight: 180 }}>
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            ref={(el) => { slideRefs.current[i] = el; }}
            className="carousel-slide-gsap"
            style={{
              position: i === 0 ? "relative" : "absolute",
              top: 0,
              left: 0,
              right: 0,
              opacity: 0,
              pointerEvents: i === 0 ? "auto" : "none",
            }}
          >
            <blockquote
              className="font-[var(--serif)] font-normal italic text-[color:var(--text-primary)] m-0 p-0"
              style={{ fontSize: "clamp(22px, 2.2vw, 30px)", lineHeight: 1.45 }}
            >
              {t.quote}
            </blockquote>
            <p
              data-author
              className="mt-7 font-[var(--sans)] font-normal text-sm text-[color:var(--text-muted)]"
            >
              &mdash; {t.author}
            </p>
          </div>
        ))}
      </div>

      {/* Dot pagination */}
      <div ref={controlsRef} style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 12 }}>
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              padding: 8,
              backgroundClip: "content-box",
              background: "#1A1A1A",
              opacity: i === activeSlide ? 0.8 : 0.15,
              transition: "opacity 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
