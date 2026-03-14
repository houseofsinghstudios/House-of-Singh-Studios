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
    numberRefs.current.forEach((el, i) => {
      if (el) el.textContent = prefersReducedMotion ? `${STATS.targets[i]}+` : "0+";
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        // Count-up each stat with rAF
        STATS.targets.forEach((target, i) => {
          const numEl = numberRefs.current[i];
          if (!numEl) return;

          if (prefersReducedMotion) {
            numEl.textContent = `${target}+`;
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
              el.textContent = `${Math.round(progress * target)}+`;

              if (t < 1) {
                rafIds.push(requestAnimationFrame(tick));
              }
            }

            rafIds.push(requestAnimationFrame(tick));
          }, delay);
        });

        // Description text fades up via CSS class
        descRefs.current.forEach((el) => {
          if (el) el.classList.add("in-view");
        });
      },
      { threshold: 0.2 }
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
        {STATS.targets.map((target, i) => (
          <div key={i} className="stat-cell">
            <p
              ref={(el) => { numberRefs.current[i] = el; }}
              className="stat-number"
            >
              {target}+
            </p>
            <p
              ref={(el) => { descRefs.current[i] = el; }}
              className="stat-label"
              style={{ opacity: 0, transform: "translateY(10px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}
            >
              {STATS.labels[i]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
