"use client";
// At a glance on /partners: the AI Lab statistics pattern. Client component: when the row comes into
// view the figures count up from 0 and the thin lines fill, once. The server HTML carries the final
// figures and full lines, so search engines, screen readers, visitors without JavaScript and
// visitors who prefer reduced motion always get the real values. The final value reserves each
// figure's width and the suffix stays fixed, so nothing shifts while counting.

import { useRef } from "react";
import { useCountUp } from "@/lib/use-count-up";
import { GLANCE } from "@/lib/partners/content";

export default function PartnerStats() {
  const gridRef = useRef<HTMLDivElement>(null);
  useCountUp(gridRef, { duration: 1200, stagger: 120, threshold: 0.4, finalIfReducedMotion: true });

  return (
    <div ref={gridRef} className="ai-proof-grid pt-glance">
      {GLANCE.map((stat) => (
        <div key={stat.text} className="ai-proof-col">
          <p className="ai-proof-num">
            {/* Read once as the final value; the moving digits are hidden from screen readers. */}
            <span className="sr-only">
              {stat.value}
              {stat.suffix}
            </span>
            <span aria-hidden="true">
              <span className="ai-proof-num-figure">
                <span className="ai-proof-num-reserve">{stat.value}</span>
                <span data-count-up={stat.value}>{stat.value}</span>
              </span>
              {stat.suffix}
            </span>
          </p>
          <div className="ai-proof-bar">
            <div className="ai-proof-bar-fill pt-glance-fill" data-count-bar />
          </div>
          <p className="ai-proof-text">{stat.text}</p>
        </div>
      ))}
    </div>
  );
}
