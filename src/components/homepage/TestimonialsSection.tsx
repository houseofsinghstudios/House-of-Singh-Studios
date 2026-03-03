"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TESTIMONIALS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function TestimonialsSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const authorRef = useRef<HTMLParagraphElement>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  // Word-by-word animation on slide change
  useEffect(() => {
    const quoteEl = quoteRef.current;
    const authorEl = authorRef.current;
    if (!quoteEl) return;

    const words = TESTIMONIALS[activeSlide].quote.split(" ");
    quoteEl.innerHTML = "";

    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.cssText = `opacity:0;transform:translateY(8px);display:inline-block;transition:opacity 0.3s ease ${i * 25}ms, transform 0.3s ease ${i * 25}ms`;
      span.dataset.tWord = "1";
      quoteEl.appendChild(span);
      if (i < words.length - 1) quoteEl.appendChild(document.createTextNode(" "));
    });

    if (authorEl) {
      authorEl.style.opacity = "0";
      authorEl.style.transition = `opacity 0.4s ease ${words.length * 25 + 300}ms`;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        quoteEl.querySelectorAll<HTMLSpanElement>("span[data-t-word]").forEach((w) => {
          w.style.opacity = "1";
          w.style.transform = "translateY(0)";
        });
        if (authorEl) authorEl.style.opacity = "1";
      });
    });
  }, [activeSlide]);

  function goTo(i: number) { setActiveSlide(i); resetTimer(); }
  function goNext() { setActiveSlide((p) => (p + 1) % TESTIMONIALS.length); resetTimer(); }
  function goPrev() { setActiveSlide((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); resetTimer(); }

  return (
    <section className="py-[140px] px-[var(--page-px)] bg-[var(--bg-shift)] text-center">
      <ScrollReveal>
        <EditorialLabel text="Clients" className="mb-8" />
      </ScrollReveal>

      <ScrollReveal>
        <div className="font-[var(--serif)] text-[120px] leading-none text-[#E0E0DB] select-none -mb-5">
          &ldquo;
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="relative max-w-[720px] mx-auto" style={{ minHeight: 180 }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`carousel-slide${i === activeSlide ? " active" : ""}`}
            >
              <blockquote
                ref={i === activeSlide ? quoteRef : undefined}
                className="font-[var(--serif)] font-normal italic text-[color:var(--text-primary)] m-0 p-0"
                style={{ fontSize: "clamp(22px, 2.2vw, 30px)", lineHeight: 1.45 }}
              >
                {t.quote}
              </blockquote>
              <p
                ref={i === activeSlide ? authorRef : undefined}
                className="mt-7 font-[var(--sans)] font-normal text-sm text-[color:var(--text-muted)]"
              >
                &mdash; {t.author}
              </p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button onClick={goPrev} aria-label="Previous testimonial" className="carousel-arrow">
            &larr;
          </button>
          <div className="flex gap-2.5 items-center">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="carousel-dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  background: i === activeSlide ? "var(--text-primary)" : "var(--border)",
                  transition: "background 0.3s ease",
                }}
              />
            ))}
          </div>
          <button onClick={goNext} aria-label="Next testimonial" className="carousel-arrow">
            &rarr;
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}
