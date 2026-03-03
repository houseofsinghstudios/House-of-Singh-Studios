"use client";

import { STATS } from "@/lib/constants/homepage-data";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import { useCountUp } from "@/lib/hooks/useCountUp";

export default function StatsSection() {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.5,
  });
  const values = useCountUp(STATS.targets, isIntersecting);

  return (
    <section
      ref={ref}
      className="bg-[var(--bg-shift)]"
      style={{ padding: "64px var(--page-px)" }}
    >
      <div className="stats-grid text-center">
        {STATS.targets.map((_, i) => (
          <div key={i}>
            <p
              className="font-[var(--serif)] font-semibold leading-none text-[color:var(--text-primary)] m-0"
              style={{ fontSize: "clamp(40px, 4vw, 56px)" }}
            >
              {values[i]}+
            </p>
            <p className="mt-2 font-[var(--sans)] font-normal text-[13px] leading-normal text-[color:var(--text-muted)]">
              {STATS.labels[i]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
