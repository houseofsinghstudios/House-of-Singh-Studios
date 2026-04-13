"use client";

import { useEffect, useRef, useCallback } from "react";

const ITEMS = [
  { value: 50, suffix: "+", label: "Projects Delivered", duration: 1800 },
  { value: 12, suffix: "+", label: "Years of Practice", duration: 1400 },
  { value: 8, suffix: "+", label: "Industries Served", duration: 1000 },
];

let hasRun = false;

export default function ProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafIds = useRef<number[]>([]);

  const setNumRef = useCallback(
    (i: number) => (el: HTMLSpanElement | null) => {
      numRefs.current[i] = el;
    },
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasRun) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        if (hasRun) return;
        hasRun = true;
        observer.disconnect();

        ITEMS.forEach((item, i) => {
          const num = numRefs.current[i];
          if (!num) return;

          num.textContent = "0";
          const t0 = performance.now();

          function tick(now: number) {
            const elapsed = now - t0;
            const progress = Math.min(elapsed / item.duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(eased * item.value);
            num!.textContent = String(value);

            if (progress < 1) {
              rafIds.current[i] = requestAnimationFrame(tick);
            } else {
              num!.textContent = String(item.value);
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
    <>
      <style>{`
        .proof-section {
          padding: clamp(40px, 5vw, 64px) var(--page-px, clamp(24px, 6vw, 80px));
        }
        .proof-label {
          font-family: var(--sans, Inter, sans-serif);
          font-size: 11px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-muted, #A9A6A2);
          margin: 0 0 24px;
        }
        .proof-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }
        .proof-col {
          padding: clamp(24px, 3vw, 40px) 0;
        }
        .proof-col:not(:first-child) {
          border-left: 1px solid var(--border, #E5E3E0);
          padding-left: clamp(20px, 2.5vw, 32px);
        }
        .proof-value {
          font-family: var(--sans, Inter, sans-serif);
          font-weight: 500;
          font-size: clamp(36px, 5vw, 56px);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.03em;
          line-height: 1;
          color: var(--text-primary, #22211F);
          margin: 0;
        }
        .proof-value-label {
          font-family: var(--sans, Inter, sans-serif);
          font-size: 13px;
          font-weight: 400;
          color: var(--text-secondary, #5C5B58);
          margin: 8px 0 0;
          line-height: 1.4;
        }
        @media (max-width: 767px) {
          .proof-grid {
            grid-template-columns: 1fr;
          }
          .proof-col {
            padding: 20px 0;
          }
          .proof-col:not(:first-child) {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--border, #E5E3E0);
          }
          .proof-value {
            font-size: clamp(32px, 8vw, 44px);
          }
        }
      `}</style>

      <section ref={sectionRef} className="proof-section">
        <p className="proof-label">(07) Proof</p>

        <div className="proof-grid">
          {ITEMS.map((item, i) => (
            <div key={i} className="proof-col">
              <p className="proof-value">
                <span ref={setNumRef(i)}>{item.value}</span>{item.suffix}
              </p>
              <p className="proof-value-label">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
