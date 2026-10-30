"use client";
// Two ways to start, phones: one tool at a time behind a two option tab switch. Desktop: two
// columns, no switch. Client component: it holds the selected tab, moves between tabs with the
// arrow keys, applies the tab roles only at phone width, starts the arrival animation and reports
// chip and button clicks.
// The panels arrive server rendered. Showing and hiding is CSS, so hydration changes nothing on
// screen, and without JavaScript both panels show stacked.

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { track } from "@/lib/analytics";
import { useMediaQuery } from "@/lib/use-media-query";

const PHONE = "(max-width: 767px)";

const TABS = [
  { id: "pulse", label: "Not sure what's wrong" },
  { id: "planner", label: "I know what I need" },
] as const;
type TabId = (typeof TABS)[number]["id"];

// The pulse line's visible length in pixels: the drawn part of the path inside the column.
function measurePulse(band: HTMLElement) {
  const svg = band.querySelector<SVGSVGElement>(".tb-pulse");
  const path = svg?.querySelector("path");
  if (!svg || !path) return;
  const hidden = 4000 - svg.getBoundingClientRect().width;
  band.style.setProperty("--tb-pulse-len", `${Math.ceil(path.getTotalLength() - Math.max(0, hidden))}px`);
}

// The server HTML shows the final state. Only when the band is below the fold at load does it
// drop to the start state ("waiting"), out of sight; at 35% visible it plays once ("playing"),
// then returns to the plain final state. Already on screen at load, or reduced motion: nothing
// moves. The motion itself is CSS.
const ARRIVAL_MS = 1600;
function useArrival(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const band = ref.current?.closest<HTMLElement>(".tb");
    if (!band || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let first = true;
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          if (entry.isIntersecting) return observer.disconnect();
          measurePulse(band);
          band.dataset.arrival = "waiting";
          return;
        }
        if (entry.intersectionRatio < 0.35) return;
        observer.disconnect();
        measurePulse(band);
        band.dataset.arrival = "playing";
        timer = window.setTimeout(() => delete band.dataset.arrival, ARRIVAL_MS);
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(band);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [ref]);
}

// One Google Analytics event per chip or button click: which tool, chip or button, and the answer
// or service code. Never personal data. Sent through src/lib/analytics.ts: nothing without consent.
function useClickEvents(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLElement>("[data-tb-kind]");
      if (!link) return;
      track("tool_band_click", { tool: link.dataset.tbTool || "", kind: link.dataset.tbKind || "", value: link.dataset.tbValue || "none" });
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [ref]);
}

export default function ToolBandSwitch({ pulse, planner }: { pulse: ReactNode; planner: ReactNode }) {
  const [selected, setSelected] = useState<TabId>("pulse");
  const phone = useMediaQuery(PHONE);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  useArrival(rootRef);
  useClickEvents(rootRef);
  const panels: Record<TabId, ReactNode> = { pulse, planner };

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TABS.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (keys[e.key] + TABS.length) % TABS.length;
    setSelected(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div ref={rootRef} className="tb-switch" data-selected={selected}>
      <div className="tb-tabs" role={phone ? "tablist" : undefined} aria-label={phone ? "Two ways to start" : undefined}>
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            id={`tb-tab-${t.id}`}
            className="tb-tab"
            role={phone ? "tab" : undefined}
            aria-selected={phone ? selected === t.id : undefined}
            aria-controls={phone ? `tb-panel-${t.id}` : undefined}
            tabIndex={phone && selected !== t.id ? -1 : 0}
            onClick={() => setSelected(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
        <span className="tb-tabs-underline" aria-hidden="true" />
      </div>
      <div className="tb-columns">
        {TABS.map((t) => (
          <div
            key={t.id}
            id={`tb-panel-${t.id}`}
            className={`tb-col${selected === t.id ? " is-selected" : ""}`}
            role={phone ? "tabpanel" : undefined}
            aria-labelledby={phone ? `tb-tab-${t.id}` : undefined}
          >
            {panels[t.id]}
          </div>
        ))}
      </div>
    </div>
  );
}
