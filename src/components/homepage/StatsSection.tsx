"use client";

import { useEffect, useRef, useCallback } from "react";
import EditorialLabel from "@/components/ui/EditorialLabel";

// ── Data ──

const ITEMS = [
  { target: 50, suffix: "+", label: "Projects Delivered", duration: 2000 },
  { target: 12, suffix: "+", label: "Years of Practice", duration: 1600 },
  { target: 8, suffix: "+", label: "Industries Served", duration: 1200 },
];

// ── Module-level guard — survives StrictMode, remounts, everything ──

let globalAnimated = false;

// ── Easing ──

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ── Component ──

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sufRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const rafIds = useRef<number[]>([]);

  const refNum = useCallback(
    (i: number) => (el: HTMLSpanElement | null) => { numRefs.current[i] = el; },
    [],
  );
  const refSuf = useCallback(
    (i: number) => (el: HTMLSpanElement | null) => { sufRefs.current[i] = el; },
    [],
  );
  const refLab = useCallback(
    (i: number) => (el: HTMLParagraphElement | null) => { labRefs.current[i] = el; },
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || globalAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        if (globalAnimated) return;
        globalAnimated = true;
        observer.disconnect();

        const mobile = window.innerWidth < 1024;

        ITEMS.forEach((item, i) => {
          const num = numRefs.current[i];
          const suf = sufRefs.current[i];
          const lab = labRefs.current[i];
          if (!num || !suf || !lab) return;

          // Prepare: hide suffix/label, reset number
          suf.style.opacity = "0";
          lab.style.opacity = "0";
          num.textContent = "0";

          const dur = mobile ? 1500 : item.duration;
          const t0 = performance.now();

          function tick(now: number) {
            const p = Math.min((now - t0) / dur, 1);
            let v: number;

            if (mobile || p >= 0.65) {
              // Sequential count-up (always on mobile; last 35% on desktop)
              const seg = mobile ? p : (p - 0.65) / 0.35;
              const base = mobile ? 0 : Math.floor(item.target * 0.65);
              const range = item.target - base;
              v = Math.round(base + easeOut(seg) * range);
            } else {
              // Desktop slot-machine: random digits
              v = Math.floor(Math.random() * item.target);
            }

            num!.textContent = String(Math.min(v, item.target));

            if (p < 1) {
              rafIds.current[i] = requestAnimationFrame(tick);
            } else {
              num!.textContent = String(item.target);
              suf!.style.opacity = "1";
              setTimeout(() => { lab!.style.opacity = "1"; }, 200);
            }
          }

          rafIds.current[i] = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      rafIds.current.forEach(cancelAnimationFrame);
    };
  }, []);

  return (
    <section style={{ padding: "clamp(64px, 8vw, 100px) var(--page-px)" }}>
      <div className="css-reveal mb-10">
        <EditorialLabel text="(07) Proof" />
      </div>

      <div className="stats-row" ref={sectionRef}>
        {ITEMS.map((item, i) => (
          <div key={i} className="stat-cell">
            <p className="stat-number">
              <span ref={refNum(i)}>{item.target}</span>
              <span className="stat-suffix" ref={refSuf(i)}>
                {item.suffix}
              </span>
            </p>
            <p className="stat-label" ref={refLab(i)}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
