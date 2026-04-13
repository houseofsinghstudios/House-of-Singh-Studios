"use client";

import { useEffect, useRef, useCallback } from "react";

const ITEMS = [
  { value: 50, suffix: "+", label: "Projects Delivered", duration: 2000 },
  { value: 12, suffix: "+", label: "Years of Practice", duration: 1600 },
  { value: 8, suffix: "+", label: "Industries Served", duration: 1200 },
];

let animated = false;

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function ProofCounter() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sufRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const rafIds = useRef<number[]>([]);

  const setNumRef = useCallback(
    (i: number) => (el: HTMLSpanElement | null) => {
      numRefs.current[i] = el;
    },
    [],
  );
  const setSufRef = useCallback(
    (i: number) => (el: HTMLSpanElement | null) => {
      sufRefs.current[i] = el;
    },
    [],
  );
  const setLabRef = useCallback(
    (i: number) => (el: HTMLParagraphElement | null) => {
      labRefs.current[i] = el;
    },
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || animated) return;

    const label = labelRef.current;
    if (label) {
      label.style.opacity = "0";
      label.style.transform = "translateY(12px)";
    }
    ITEMS.forEach((_, i) => {
      const num = numRefs.current[i];
      const suf = sufRefs.current[i];
      const lab = labRefs.current[i];
      if (num) num.style.opacity = "0";
      if (suf) suf.style.opacity = "0";
      if (lab) lab.style.opacity = "0";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        if (animated) return;
        animated = true;
        observer.disconnect();

        // Phase 1: fade in label
        if (label) {
          label.style.transition =
            "opacity 0.3s cubic-bezier(0.23,1,0.32,1), transform 0.3s cubic-bezier(0.23,1,0.32,1)";
          label.style.opacity = "1";
          label.style.transform = "translateY(0)";
        }

        // Phase 2: start counters after label finishes
        const mobile = window.innerWidth < 1024;

        setTimeout(() => {
          ITEMS.forEach((item, i) => {
            const num = numRefs.current[i];
            const suf = sufRefs.current[i];
            const lab = labRefs.current[i];
            if (!num || !suf || !lab) return;

            num.style.opacity = "1";
            num.textContent = "0";

            const dur = mobile ? 1500 : item.duration;
            const t0 = performance.now();

            function tick(now: number) {
              const p = Math.min((now - t0) / dur, 1);
              let v: number;

              if (mobile || p >= 0.65) {
                const seg = mobile ? p : (p - 0.65) / 0.35;
                const base = mobile ? 0 : Math.floor(item.value * 0.65);
                const range = item.value - base;
                v = Math.round(base + easeOut(seg) * range);
              } else {
                v = Math.floor(Math.random() * item.value);
              }

              num!.textContent = String(Math.min(v, item.value));

              if (p < 1) {
                rafIds.current[i] = requestAnimationFrame(tick);
              } else {
                num!.textContent = String(item.value);
                suf!.style.transition = "opacity 0.2s ease";
                suf!.style.opacity = "1";
                setTimeout(() => {
                  lab!.style.transition = "opacity 0.2s ease";
                  lab!.style.opacity = "1";
                }, 200);
              }
            }

            rafIds.current[i] = requestAnimationFrame(tick);
          });
        }, 300);
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
        <p ref={labelRef} className="proof-label">
          (07) Proof
        </p>

        <div className="proof-grid">
          {ITEMS.map((item, i) => (
            <div key={i} className="proof-col">
              <p className="proof-value">
                <span ref={setNumRef(i)}>{item.value}</span>
                <span ref={setSufRef(i)}>{item.suffix}</span>
              </p>
              <p className="proof-value-label" ref={setLabRef(i)}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
