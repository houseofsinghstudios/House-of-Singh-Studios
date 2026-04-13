"use client";

import { useEffect, useRef, useCallback } from "react";
import { STATS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

const DESKTOP_DURATIONS: Record<number, number> = {
  50: 2000,
  12: 1600,
  8: 1200,
};

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const suffixRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const animatedRef = useRef(false);
  const rafsRef = useRef<number[]>([]);

  const setNumberRef = useCallback((i: number) => (el: HTMLSpanElement | null) => {
    numberRefs.current[i] = el;
  }, []);
  const setSuffixRef = useCallback((i: number) => (el: HTMLSpanElement | null) => {
    suffixRefs.current[i] = el;
  }, []);
  const setLabelRef = useCallback((i: number) => (el: HTMLParagraphElement | null) => {
    labelRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || animatedRef.current) return;

        animatedRef.current = true;
        observer.disconnect();

        const isMobile = window.innerWidth < 1024;

        STATS.items.forEach((stat, i) => {
          const numEl = numberRefs.current[i];
          const suffixEl = suffixRefs.current[i];
          const labelEl = labelRefs.current[i];
          if (!numEl || !suffixEl || !labelEl) return;

          // Capture non-null refs for closure
          const num = numEl;
          const suf = suffixEl;
          const lab = labelEl;

          // Hide suffix and label before animation
          suf.style.opacity = "0";
          lab.style.opacity = "0";
          num.textContent = "0";

          const duration = isMobile ? 1500 : (DESKTOP_DURATIONS[stat.target] || 1600);

          const startTime = performance.now();

          function tick(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            let value: number;
            if (isMobile) {
              // Clean count-up
              value = Math.round(easeOut(progress) * stat.target);
            } else if (progress < 0.7) {
              // Slot machine: random digits
              value = Math.floor(Math.random() * stat.target);
            } else {
              // Sequential landing
              const lp = (progress - 0.7) / 0.3;
              const startFrom = Math.floor(stat.target * 0.7);
              value = Math.round(startFrom + (stat.target - startFrom) * easeOut(lp));
            }

            num.textContent = String(Math.min(value, stat.target));

            if (progress < 1) {
              rafsRef.current[i] = requestAnimationFrame(tick);
            } else {
              num.textContent = String(stat.target);
              suf.style.opacity = "1";
              setTimeout(() => { lab.style.opacity = "1"; }, 200);
            }
          }

          rafsRef.current[i] = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      rafsRef.current.forEach((id) => cancelAnimationFrame(id));
    };
  }, []);

  return (
    <section style={{ padding: "clamp(64px, 8vw, 100px) var(--page-px)" }}>
      <div className="css-reveal mb-10">
        <EditorialLabel text="(07) Proof" />
      </div>
      <div className="stats-row" ref={sectionRef}>
        {STATS.items.map((stat, i) => (
          <div key={i} className="stat-cell">
            <p className="stat-number">
              <span className="stat-number-value" ref={setNumberRef(i)}>
                {stat.target}
              </span>
              <span
                className="stat-suffix"
                ref={setSuffixRef(i)}
                style={{ transition: "opacity 0.3s ease" }}
              >
                {stat.suffix}
              </span>
            </p>
            <p
              className="stat-label-static"
              ref={setLabelRef(i)}
              style={{ transition: "opacity 0.3s ease" }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
