"use client";

import { STATS } from "@/lib/constants/homepage-data";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import { useCountUp } from "@/lib/hooks/useCountUp";
import EditorialLabel from "@/components/ui/EditorialLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function StatsSection() {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.5,
  });
  const values = useCountUp(STATS.targets, isIntersecting);

  return (
    <section ref={ref} className="py-[140px] px-[var(--page-px)]">
      <ScrollReveal>
        <EditorialLabel text={STATS.label} className="mb-12" />
      </ScrollReveal>

      <div className="stats-grid">
        {STATS.targets.map((_, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <p
              className="font-[var(--serif)] font-semibold leading-none text-[color:var(--text-primary)] m-0"
              style={{ fontSize: "clamp(52px, 5.5vw, 76px)" }}
            >
              {values[i]}+
            </p>
            <p className="mt-3 font-[var(--sans)] font-normal text-sm leading-normal text-[color:var(--text-muted)]">
              {STATS.labels[i]}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
