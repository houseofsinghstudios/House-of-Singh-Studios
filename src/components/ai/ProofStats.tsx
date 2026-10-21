"use client";
// The AI Lab statistics row. Client component: when the row is 40% on screen the numbers count
// up and the bars fill, once. The server HTML carries the final figures and full bars, so search
// engines, screen readers and visitors without JavaScript always get the real numbers.

import { useRef } from "react";
import { useCountUp } from "@/lib/use-count-up";

export interface ProofStat {
  value: number;
  text: string;
  source: string;
  link: string;
}

export default function ProofStats({ stats }: { stats: ProofStat[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  useCountUp(gridRef, { duration: 1400, stagger: 120, threshold: 0.4, settleIfVisible: true });

  return (
    <div ref={gridRef} className="ai-proof-grid">
      {stats.map((stat) => (
        <div key={stat.link} className="ai-proof-col">
          <p className="ai-proof-num">
            {/* Read once as the final value; the moving digits are hidden from screen readers. */}
            <span className="sr-only">{stat.value}%</span>
            <span aria-hidden="true">
              {/* The final value reserves the width, so the % sign never moves while counting. */}
              <span className="ai-proof-num-figure">
                <span className="ai-proof-num-reserve">{stat.value}</span>
                <span data-count-up={stat.value}>{stat.value}</span>
              </span>
              %
            </span>
          </p>
          <div className="ai-proof-bar">
            <div className="ai-proof-bar-fill" data-count-bar style={{ width: `${stat.value}%` }} />
          </div>
          <p className="ai-proof-text">{stat.text}</p>
          <p className="ai-proof-source">
            <a href={stat.link} target="_blank" rel="noopener noreferrer">
              {stat.source}
            </a>
          </p>
        </div>
      ))}
    </div>
  );
}
