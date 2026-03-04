"use client";

import { useEffect, useRef } from "react";
import { STATS, TESTIMONIALS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

/**
 * SECTION 5: THE EVIDENCE — "The Ticker"
 *
 * Stats and testimonials merged into a continuous dual-direction ticker.
 * Row 1: left to right. Row 2: right to left.
 * Scroll velocity affects ticker speed via CSS custom property.
 * Hover pauses the ticker.
 */

function buildTickerItems() {
  const stats = STATS.targets.map((val, i) => ({
    type: "stat" as const,
    text: `${val}+ ${STATS.labels[i].toLowerCase()}`,
  }));
  const quotes = TESTIMONIALS.map((t) => ({
    type: "quote" as const,
    text: t.quote.length > 100 ? t.quote.slice(0, 100) + "..." : t.quote,
    author: t.author.split(",")[0],
  }));

  type TickerItem = { type: "stat" | "quote"; text: string; author?: string };
  // Interleave stats and quotes
  const row1: TickerItem[] = [];
  const row2: TickerItem[] = [];
  let si = 0, qi = 0;
  for (let i = 0; i < 12; i++) {
    if (i % 2 === 0 && si < stats.length) {
      row1.push(stats[si]);
      si++;
    } else if (qi < quotes.length) {
      row1.push(quotes[qi]);
      qi++;
    } else if (si < stats.length) {
      row1.push(stats[si]);
      si++;
    }
  }
  // Row 2: reversed mix
  si = stats.length - 1;
  qi = quotes.length - 1;
  for (let i = 0; i < 12; i++) {
    if (i % 2 === 0 && qi >= 0) {
      row2.push(quotes[qi]);
      qi--;
    } else if (si >= 0) {
      row2.push(stats[si]);
      si--;
    }
  }

  return { row1, row2 };
}

export default function EvidenceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastScroll = 0;
    let velocity = 0;
    let decaying = 0;

    const onScroll = () => {
      velocity = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      decaying = velocity;
    };

    const tick = () => {
      decaying *= 0.95;
      const speed = Math.max(15, 40 - decaying * 0.5);
      document.documentElement.style.setProperty("--ticker-speed", `${speed}s`);
      requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const { row1, row2 } = buildTickerItems();

  const renderItem = (item: { type: string; text: string; author?: string }, i: number) => (
    <span key={i} className="ticker-item" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
      {item.type === "stat" ? (
        <span style={{
          fontFamily: "var(--serif)", fontWeight: 600,
          fontSize: "clamp(28px, 3vw, 36px)", color: "var(--text-primary)",
        }}>
          {item.text}
        </span>
      ) : (
        <span>
          <span style={{
            fontFamily: "var(--sans)", fontWeight: 400, fontStyle: "italic",
            fontSize: 16, color: "var(--text-muted)",
          }}>
            &ldquo;{item.text}&rdquo;
          </span>
          {item.author && (
            <span style={{
              fontFamily: "var(--sans)", fontWeight: 500, fontSize: 12,
              textTransform: "uppercase", letterSpacing: "0.06em",
              color: "var(--text-faint)", marginLeft: 12,
            }}>
              &mdash; {item.author}
            </span>
          )}
        </span>
      )}
    </span>
  );

  return (
    <section
      ref={sectionRef}
      className="section-reveal-wipe"
      data-cursor="pause"
      style={{
        padding: "var(--section-py) 0",
        overflow: "hidden",
        background: "var(--bg-shift)",
      }}
    >
      <div style={{ padding: "0 var(--page-px)", marginBottom: 40 }}>
        <EditorialLabel text="(Evidence)" />
      </div>

      {/* Row 1: left to right */}
      <div
        className="ticker-row"
        style={{
          display: "flex",
          gap: 80,
          animation: "tickerLeft var(--ticker-speed, 40s) linear infinite",
          width: "max-content",
          paddingBottom: 32,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = "running";
        }}
      >
        {/* Duplicate for seamless loop */}
        {row1.map((item, i) => renderItem(item, i))}
        {row1.map((item, i) => renderItem(item, i + row1.length))}
      </div>

      {/* Row 2: right to left */}
      <div
        className="ticker-row"
        style={{
          display: "flex",
          gap: 80,
          animation: "tickerRight var(--ticker-speed, 40s) linear infinite",
          width: "max-content",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = "running";
        }}
      >
        {row2.map((item, i) => renderItem(item, i))}
        {row2.map((item, i) => renderItem(item, i + row2.length))}
      </div>
    </section>
  );
}
