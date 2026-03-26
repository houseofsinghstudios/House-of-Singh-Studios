"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { HERO } from "@/lib/constants/homepage-data";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef<HTMLSpanElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animState, setAnimState] = useState<"idle" | "exiting">("idle");

  // Cycle words every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimState("exiting");
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % HERO.cycleWords.length);
        setAnimState("idle");
      }, 450);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Measure and set width of cycle container
  useEffect(() => {
    if (!cycleRef.current) return;
    const inner = cycleRef.current.querySelector(".hero-cycle-word.hero-cycle-active") as HTMLElement;
    if (inner) {
      cycleRef.current.style.width = inner.offsetWidth + "px";
    }
  }, [currentIndex]);

  // Scroll-driven fade for scroll indicator
  const onScroll = useCallback(() => {
    if (!sectionRef.current || !scrollRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const h = sectionRef.current.offsetHeight;
    const pct = Math.max(0, Math.min(1, -rect.top / h)) * 100;
    const fade = Math.max(0, Math.min(1, (pct - 20) / 30));
    scrollRef.current.style.opacity = String(1 - fade);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <section
      ref={sectionRef}
      className="hero-section relative px-[var(--page-px)]"
      style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "20vh", paddingBottom: 80 }}
    >
      <div data-hero-label>
        <EditorialLabel text={HERO.label} className="mb-6" />
      </div>

      <div className="max-w-[900px]">
        <h1
          data-hero-heading
          className="font-[var(--sans)] font-medium text-[color:var(--text-primary)] m-0"
          style={{
            fontSize: "clamp(36px, 5.5vw, 72px)",
            lineHeight: 1.12,
            letterSpacing: "-0.025em",
          }}
        >
          <span style={{ display: "block" }}>
            <span
              ref={cycleRef}
              className="hero-cycle-wrap"
            >
              {HERO.cycleWords.map((word, i) => (
                <span
                  key={word}
                  className={`hero-cycle-word${i === currentIndex ? " hero-cycle-active" : ""}${i === currentIndex && animState === "exiting" ? " hero-cycle-exit" : ""}`}
                >
                  {word}
                </span>
              ))}
            </span>
            {" "}{HERO.headlineStatic}
          </span>
          <span style={{ display: "block" }}>{HERO.headlineLine2}</span>
        </h1>

        <p
          data-hero-body
          className="mt-8 font-[var(--sans)] font-normal text-[color:var(--text-secondary)] max-w-[600px]"
          style={{ fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.65 }}
        >
          {HERO.secondary}
        </p>

        <div
          data-hero-sub
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

      <div
        ref={scrollRef}
        className="scroll-indicator-pulse absolute bottom-10 right-[var(--page-px)] flex flex-col items-end gap-3"
      >
        <EditorialLabel text="Scroll" />
        <div className="scroll-track">
          <div className="scroll-thumb" />
        </div>
      </div>

      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ height: 1, background: "var(--text-muted)", opacity: 0.3 }}
      />
    </section>
  );
}
