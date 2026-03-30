"use client";

import { useEffect, useRef } from "react";
import EditorialLabel from "@/components/ui/EditorialLabel";

const HEADLINE_WORDS = [
  "Your", "business", "has", "evolved.", "Your", "brand", "has", "not."
];

const PAYOFF = ["We", "fix", "that."];

export default function ArgumentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const payoffRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const allWords = [...wordsRef.current, ...payoffRef.current].filter(Boolean);
    const totalWords = allWords.length;

    function onScroll() {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Progress: 0 when section enters viewport, 1 when section top reaches 20% from top
      const start = windowH;
      const end = windowH * 0.2;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));

      for (let i = 0; i < totalWords; i++) {
        const word = allWords[i];
        if (!word) continue;

        // Each word has its own activation window
        const wordStart = i / totalWords;
        const wordEnd = (i + 1.5) / totalWords;
        const wordProgress = Math.max(0, Math.min(1, (progress - wordStart) / (wordEnd - wordStart)));

        // Opacity goes from 0.08 to 1
        const opacity = 0.08 + wordProgress * 0.92;
        word.style.opacity = String(opacity);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="argument-section"
      style={{ padding: "clamp(120px, 14vw, 200px) var(--page-px)" }}
    >
      <div className="argument-content">
        <EditorialLabel text="(02)" className="mb-8" />

        <h2 className="argument-headline">
          {HEADLINE_WORDS.map((word, i) => (
            <span
              key={`h-${i}`}
              ref={(el) => { if (el) wordsRef.current[i] = el; }}
              className="argument-word"
            >
              {word}{" "}
            </span>
          ))}
        </h2>

        <p className="argument-payoff">
          {PAYOFF.map((word, i) => (
            <span
              key={`p-${i}`}
              ref={(el) => { if (el) payoffRef.current[i] = el; }}
              className="argument-word"
            >
              {word}{" "}
            </span>
          ))}
        </p>

        <p className="argument-steps">
          Discover what your brand should be. Design the system that makes it real. Deliver assets that hold up everywhere.
        </p>
      </div>
    </section>
  );
}
