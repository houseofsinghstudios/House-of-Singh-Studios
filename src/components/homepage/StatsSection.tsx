"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATS } from "@/lib/constants/homepage-data";

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Set initial states
      numberRefs.current.forEach((el) => {
        if (el) el.textContent = "0+";
      });
      descRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 10 });
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          // Count-up each stat
          STATS.targets.forEach((target, i) => {
            const numEl = numberRefs.current[i];
            if (!numEl) return;

            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.5,
              ease: "power2.out",
              delay: i * 0.15,
              onUpdate: () => {
                numEl.textContent = `${Math.round(obj.val)}+`;
              },
            });
          });

          // Description text fades up staggered
          descRefs.current.forEach((el, i) => {
            if (el) {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                delay: i * 0.15 + 0.2,
                ease: "power3.out",
              });
            }
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--bg-shift)]"
      style={{ padding: "64px var(--page-px)" }}
    >
      <div className="stats-grid text-center">
        {STATS.targets.map((target, i) => (
          <div key={i}>
            <p
              ref={(el) => { numberRefs.current[i] = el; }}
              className="font-[var(--serif)] font-semibold leading-none text-[color:var(--text-primary)] m-0"
              style={{ fontSize: "clamp(40px, 4vw, 56px)" }}
            >
              {target}+
            </p>
            <p
              ref={(el) => { descRefs.current[i] = el; }}
              className="mt-2 font-[var(--sans)] font-normal text-[13px] leading-normal text-[color:var(--text-muted)]"
            >
              {STATS.labels[i]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
