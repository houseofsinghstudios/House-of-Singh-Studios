"use client";
// Two ways to start, phones: one tool at a time behind a two option tab switch. Desktop: two
// columns, no switch. Client component: it holds the selected tab, moves between tabs with the
// arrow keys, and applies the tab roles only at phone width. The panels arrive server rendered.
// Showing and hiding is CSS, so hydration changes nothing on screen, and without JavaScript
// both panels show stacked.

import { useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";

const PHONE = "(max-width: 767px)";
const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(PHONE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const isPhone = () => window.matchMedia(PHONE).matches;
const notOnServer = () => false;

const TABS = [
  { id: "pulse", label: "Not sure what's wrong" },
  { id: "planner", label: "I know what I need" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function ToolBandSwitch({ pulse, planner }: { pulse: ReactNode; planner: ReactNode }) {
  const [selected, setSelected] = useState<TabId>("pulse");
  const phone = useSyncExternalStore(subscribe, isPhone, notOnServer);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
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
    <div className="tb-switch" data-selected={selected}>
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
