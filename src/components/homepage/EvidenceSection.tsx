"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { STATS, TESTIMONIALS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

/**
 * SECTION 5: THE EVIDENCE — "The Ticker"
 *
 * Desktop: Dual-direction continuous ticker, scroll velocity affects speed.
 * Mobile: 2x2 stats grid with count-up + single-row ticker with touch-hold pause.
 * Tablet: Horizontal stats row + wider ticker cards.
 */

type TickerItem = { type: "stat" | "quote"; text: string; author?: string };

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

function animateCountUp(el: Element) {
  const target = parseInt(el.getAttribute("data-target") || "0", 10);
  if (!target) return;
  let current = 0;
  const duration = 1200;
  const start = performance.now();

  function tick(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    current = Math.round(target * eased);
    el.textContent = `${current}+`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export default function EvidenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const w = window.innerWidth;
    setIsMobile(w <= 600);
    setIsTablet(w > 600 && w <= 900);
  }, []);

  // Desktop: scroll velocity drives ticker speed
  useEffect(() => {
    if (isMobile || isTablet) return;

    let lastScroll = 0;
    let decaying = 0;

    const onScroll = () => {
      const velocity = Math.abs(window.scrollY - lastScroll);
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
  }, [isMobile, isTablet]);

  // Mobile: count-up on intersection + touch-hold ticker pause
  useEffect(() => {
    if (!isMobile && !isTablet) return;

    // Count-up observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCountUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const statEls = document.querySelectorAll(".stat-number-countup");
    statEls.forEach((el) => observer.observe(el));

    // Touch-hold ticker pause
    const ticker = tickerRef.current;
    if (ticker) {
      let holdTimer: ReturnType<typeof setTimeout>;
      const onTouchStart = () => {
        holdTimer = setTimeout(() => {
          ticker.style.animationPlayState = "paused";
        }, 300);
      };
      const onTouchEnd = () => {
        clearTimeout(holdTimer);
        ticker.style.animationPlayState = "running";
      };
      ticker.addEventListener("touchstart", onTouchStart, { passive: true });
      ticker.addEventListener("touchend", onTouchEnd, { passive: true });

      return () => {
        observer.disconnect();
        ticker.removeEventListener("touchstart", onTouchStart);
        ticker.removeEventListener("touchend", onTouchEnd);
      };
    }

    return () => observer.disconnect();
  }, [isMobile, isTablet]);

  const { row1, row2 } = buildTickerItems();

  const renderItem = useCallback((item: TickerItem, i: number) => (
    <span key={i} className="ticker-item" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
      {item.type === "stat" ? (
        <span style={{
          fontFamily: "var(--serif)", fontWeight: 600,
          fontSize: isMobile ? "clamp(20px, 5vw, 28px)" : "clamp(28px, 3vw, 36px)",
          color: "var(--text-primary)",
        }}>
          {item.text}
        </span>
      ) : (
        <span style={{ maxWidth: isMobile ? 280 : isTablet ? 360 : undefined, display: "inline-block" }}>
          <span style={{
            fontFamily: "var(--sans)", fontWeight: 400, fontStyle: "italic",
            fontSize: isMobile ? 14 : 16, color: "var(--text-muted)",
          }}>
            &ldquo;{item.text}&rdquo;
          </span>
          {item.author && (
            <span style={{
              fontFamily: "var(--sans)", fontWeight: 500, fontSize: isMobile ? 11 : 12,
              textTransform: "uppercase", letterSpacing: "0.06em",
              color: "var(--text-faint)", marginLeft: 12,
            }}>
              &mdash; {item.author}
            </span>
          )}
        </span>
      )}
    </span>
  ), [isMobile, isTablet]);

  // Mobile/Tablet layout: stats grid + single ticker
  if (isMobile || isTablet) {
    return (
      <section
        ref={sectionRef}
        className="m-section-wipe"
        style={{
          padding: "var(--section-py) 0",
          overflow: "hidden",
          background: "var(--bg-shift)",
        }}
      >
        <div style={{ padding: "0 var(--page-px)", marginBottom: 40 }}>
          <EditorialLabel text="(Evidence)" />
        </div>

        {/* Stats grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isTablet ? "repeat(4, 1fr)" : "1fr 1fr",
          border: "1px solid var(--border)",
          margin: `0 ${isTablet ? "var(--page-px)" : "0"}`,
        }}>
          {STATS.targets.map((val, i) => (
            <div
              key={i}
              style={{
                padding: isTablet ? "32px 24px" : "28px 16px",
                textAlign: "center",
                borderRight: (isTablet ? i < 3 : i % 2 === 0) ? "1px solid var(--border)" : undefined,
                borderBottom: (isTablet ? false : i < 2) ? "1px solid var(--border)" : undefined,
              }}
            >
              <div
                className="stat-number-countup"
                data-target={val}
                style={{
                  fontFamily: "var(--serif)", fontWeight: 600,
                  fontSize: isTablet ? "clamp(28px, 4vw, 36px)" : "clamp(32px, 8vw, 44px)",
                  color: "var(--text-primary)",
                }}
              >
                0+
              </div>
              <div style={{
                fontFamily: "var(--sans)", fontWeight: 400, fontSize: 11,
                textTransform: "uppercase", letterSpacing: "0.06em",
                color: "var(--text-faint)", marginTop: 4,
              }}>
                {STATS.labels[i]}
              </div>
            </div>
          ))}
        </div>

        {/* Single-row ticker */}
        <div
          ref={tickerRef}
          className="ticker-mobile"
          style={{ marginTop: 48 }}
        >
          {row1.map((item, i) => renderItem(item, i))}
          {row1.map((item, i) => renderItem(item, i + row1.length))}
        </div>
      </section>
    );
  }

  // Desktop layout: dual-direction ticker
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

      <div
        className="ticker-row"
        style={{
          display: "flex", gap: 80,
          animation: "tickerLeft var(--ticker-speed, 40s) linear infinite",
          width: "max-content", paddingBottom: 32,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "running"; }}
      >
        {row1.map((item, i) => renderItem(item, i))}
        {row1.map((item, i) => renderItem(item, i + row1.length))}
      </div>

      <div
        className="ticker-row"
        style={{
          display: "flex", gap: 80,
          animation: "tickerRight var(--ticker-speed, 40s) linear infinite",
          width: "max-content",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "running"; }}
      >
        {row2.map((item, i) => renderItem(item, i))}
        {row2.map((item, i) => renderItem(item, i + row2.length))}
      </div>
    </section>
  );
}
