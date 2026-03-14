"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TESTIMONIALS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const sectionRef = useRef<HTMLElement>(null);

  const total = TESTIMONIALS.length;

  const goTo = useCallback(
    (idx: number) => {
      if (idx === active || isTransitioning) return;
      setIsTransitioning(true);
      setActive(idx);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [active, isTransitioning]
  );

  const next = useCallback(() => {
    goTo((active + 1) % total);
  }, [active, total, goTo]);

  const prev = useCallback(() => {
    goTo((active - 1 + total) % total);
  }, [active, total, goTo]);

  // Auto-rotate
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const nextIdx = (prev + 1) % total;
        return nextIdx;
      });
    }, 6000);
  }, [total]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  // Restart timer after manual navigation
  const handleNav = useCallback(
    (idx: number) => {
      stopTimer();
      goTo(idx);
      startTimer();
    },
    [stopTimer, goTo, startTimer]
  );

  const handlePrev = useCallback(() => {
    stopTimer();
    prev();
    startTimer();
  }, [stopTimer, prev, startTimer]);

  const handleNext = useCallback(() => {
    stopTimer();
    next();
    startTimer();
  }, [stopTimer, next, startTimer]);

  // Build preview list (all testimonials except the active one)
  const previews = TESTIMONIALS.map((t, i) => ({ ...t, originalIndex: i })).filter(
    (_, i) => i !== active
  );

  return (
    <section
      ref={sectionRef}
      className="testimonials-section css-reveal"
      data-cursor="pause"
      onMouseEnter={() => { stopTimer(); setIsPaused(true); }}
      onMouseLeave={() => { startTimer(); setIsPaused(false); }}
    >
      <div className="testimonials-inner">
        {/* Left column: quote */}
        <div className="testimonials-left">
          <EditorialLabel text="Clients" className="mb-7" />

          <div className="testimonials-quote-wrap">
            {/* Ghost number */}
            <span className="testimonials-ghost-number">
              {String(active + 1).padStart(2, "0")}
            </span>

            {/* Quote carousel */}
            <div className="testimonials-carousel">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className={`testimonials-slide ${
                    i === active ? "testimonials-slide-active" : ""
                  }`}
                >
                  <blockquote className="testimonials-quote">
                    {t.quote}
                  </blockquote>
                  <p className="testimonials-author">&mdash; {t.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: controls */}
        <div className="testimonials-right">
          {/* Counter */}
          <div className="testimonials-counter-wrap">
            <p className="testimonials-counter">
              {String(active + 1).padStart(2, "0")}
              <span> / {String(total).padStart(2, "0")}</span>
            </p>
            <div className="testimonials-progress-track">
              <div
                className="testimonials-progress-fill"
                style={{ width: `${((active + 1) / total) * 100}%` }}
              />
            </div>
            {isPaused && <span className="testimonials-paused-label">Paused</span>}
          </div>

          {/* Navigation arrows */}
          <div className="testimonials-nav">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="testimonials-nav-btn"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M19 12H5M5 12L11 6M5 12L11 18" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="testimonials-nav-btn"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 12H19M19 12L13 6M19 12L13 18" />
              </svg>
            </button>
          </div>

          {/* Preview snippets */}
          <div className="testimonials-previews">
            {previews.map((t) => (
              <button
                key={t.originalIndex}
                onClick={() => handleNav(t.originalIndex)}
                className="testimonials-preview-btn"
              >
                {t.quote.length > 80
                  ? t.quote.substring(0, 80) + "..."
                  : t.quote}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
