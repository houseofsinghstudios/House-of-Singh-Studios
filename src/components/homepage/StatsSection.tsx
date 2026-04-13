"use client";

import { useState, useEffect, useRef } from "react";
import { STATS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

// Desktop slot-machine durations — biggest number gets longest animation
const DESKTOP_DURATIONS: Record<number, number> = {
  50: 2000,
  12: 1600,
  8: 1200,
};

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface StatItemProps {
  target: number;
  suffix: string;
  label: string;
  isMobile: boolean;
  triggerDesktop: boolean;
}

function StatItem({ target, suffix, label, isMobile, triggerDesktop }: StatItemProps) {
  const [display, setDisplay] = useState<string>(String(target));
  const [showSuffix, setShowSuffix] = useState(true);
  const [showLabel, setShowLabel] = useState(true);
  const [cardVisible, setCardVisible] = useState(true);
  const animatedRef = useRef(false);
  const cellRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Desktop: slot-machine animation triggered by parent observer
  useEffect(() => {
    if (isMobile || !triggerDesktop || animatedRef.current) return;

    animatedRef.current = true;
    setDisplay("0");
    setShowSuffix(false);
    setShowLabel(false);

    const duration = DESKTOP_DURATIONS[target] || 1600;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 0.7) {
        // Random digit cycling — slot machine feel
        setDisplay(String(Math.floor(Math.random() * target)));
      } else {
        // Sequential count-up for clean landing
        const landingProgress = (progress - 0.7) / 0.3;
        const landingEased = easeOut(landingProgress);
        const startFrom = Math.floor(target * 0.7);
        const current = Math.round(startFrom + (target - startFrom) * landingEased);
        setDisplay(String(Math.min(current, target)));
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(String(target));
        setShowSuffix(true);
        setTimeout(() => setShowLabel(true), 200);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [triggerDesktop, isMobile, target]);

  // Mobile: individual intersection observer + count-up
  useEffect(() => {
    if (!isMobile || animatedRef.current) return;

    const el = cellRef.current;
    if (!el) return;

    setDisplay("0");
    setShowSuffix(false);
    setShowLabel(false);
    setCardVisible(false);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          animatedRef.current = true;

          // Card scale entrance first
          setCardVisible(true);

          // Start counting shortly after card entrance
          setTimeout(() => {
            const duration = 1500;
            const startTime = performance.now();

            function tick(now: number) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = easeOut(progress);
              const current = Math.round(eased * target);
              setDisplay(String(Math.min(current, target)));

              if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
              } else {
                setDisplay(String(target));
                setShowSuffix(true);
                setTimeout(() => setShowLabel(true), 200);
              }
            }

            rafRef.current = requestAnimationFrame(tick);
          }, 200);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, target]);

  const mobileStyle = isMobile
    ? {
        opacity: cardVisible ? 1 : 0,
        transform: cardVisible ? "scale(1)" : "scale(0.97)",
        transition: "opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1), transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
      }
    : undefined;

  return (
    <div ref={cellRef} className="stat-cell" style={mobileStyle}>
      <p className="stat-number">
        <span className="stat-number-value">{display}</span>
        <span
          className="stat-suffix"
          style={{
            opacity: showSuffix ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          {suffix}
        </span>
      </p>
      <p
        className="stat-label-static"
        style={{
          opacity: showLabel ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {label}
      </p>
    </div>
  );
}

export default function StatsSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [triggerDesktop, setTriggerDesktop] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Desktop: observe the stats row, trigger all counters at once
  useEffect(() => {
    if (isMobile || triggerDesktop) return;

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTriggerDesktop(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, triggerDesktop]);

  return (
    <section style={{ padding: "clamp(64px, 8vw, 100px) var(--page-px)" }}>
      <div className="css-reveal mb-10">
        <EditorialLabel text="(07) Proof" />
      </div>
      <div className="stats-row" ref={sectionRef}>
        {STATS.items.map((stat, i) => (
          <StatItem
            key={i}
            target={stat.target}
            suffix={stat.suffix}
            label={stat.label}
            isMobile={isMobile}
            triggerDesktop={triggerDesktop}
          />
        ))}
      </div>
    </section>
  );
}
