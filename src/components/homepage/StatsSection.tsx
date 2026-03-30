"use client";

import { STATS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function StatsSection() {
  return (
    <section
      className="css-reveal"
      style={{ padding: "clamp(64px, 8vw, 100px) var(--page-px)" }}
    >
      <div className="css-reveal mb-10">
        <EditorialLabel text="(07) Proof" />
      </div>
      <div className="stats-row">
        {STATS.items.map((stat, i) => (
          <div key={i} className="stat-cell css-reveal">
            <p className="stat-number">
              {stat.target}{stat.suffix}
            </p>
            <p className="stat-label-static">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
