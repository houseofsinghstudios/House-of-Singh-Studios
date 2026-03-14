"use client";

import { useEffect, useRef } from "react";
import { STATS } from "@/lib/constants/homepage-data";

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rafIds: number[] = [];

    // Set initial states
    STATS.items.forEach((stat, i) => {
      const el = numberRefs.current[i];
      if (el) el.textContent = prefersReducedMotion ? `${stat.target}${stat.suffix}` : `0${stat.suffix}`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        STATS.items.forEach((stat, i) => {
          const numEl = numberRefs.current[i];
          if (!numEl) return;

          if (prefersReducedMotion) {
            numEl.textContent = `${stat.target}${stat.suffix}`;
            return;
          }

          const delay = i * 150;
          const duration = 1500;

          setTimeout(() => {
            const startTime = performance.now();
            const el = numEl!;

            function tick(now: number) {
              const elapsed = now - startTime;
              const t = Math.min(elapsed / duration, 1);
              const progress = 1 - Math.pow(1 - t, 3);
              el.textContent = `${Math.round(progress * stat.target)}${stat.suffix}`;

              if (t < 1) {
                rafIds.push(requestAnimationFrame(tick));
              }
            }

            rafIds.push(requestAnimationFrame(tick));
          }, delay);
        });

        descRefs.current.forEach((el) => {
          if (el) el.classList.add("in-view");
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      rafIds.forEach((id) => cancelAnimationFrame(id));
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="css-fade"
      style={{ padding: "0 var(--page-px)" }}
    >
      <div className="stats-row">
        {STATS.items.map((stat, i) => (
          <div key={i} className="stat-cell">
            <p
              ref={(el) => { numberRefs.current[i] = el; }}
              className="stat-number"
            >
              {stat.target}{stat.suffix}
            </p>
            <p
              ref={(el) => { descRefs.current[i] = el; }}
              className="stat-label"
              style={{ opacity: 0, transform: "translateY(10px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
