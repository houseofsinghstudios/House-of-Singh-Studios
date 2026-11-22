"use client";
// A client component: the call brief in the homepage (04) Start. It holds the chosen services (up to
// three, as in the planner), reads the business type chosen in (01) Selected work (page state, never the
// address), writes the started date in Toronto time after mount (so the server HTML never differs), and
// plays the entrance once: the sheet wipes open from the top, then its hairlines draw from the left.
// "Plan your project" carries the choices into the planner, which opens on question 02.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInBrowser } from "@/lib/use-in-browser";
import { Link } from "next-view-transitions";
import { track } from "@/lib/analytics";
import { useHomeSector } from "@/lib/home-choice";
import { CHIP_SERVICES, FIRST_QUESTION, START_COPY, chipAnnouncement, chipLabel, countText, laterQuestions, planHref, startedText, toggleChip } from "@/lib/home-start";
import type { ServiceId } from "@/lib/project-planner/types";
import { BUSINESS_TYPES } from "@/lib/work-index";

// Values that exist only in the browser: the server (and hydration) sees the second snapshot, the browser
// the first, so nothing mismatches.
const noSubscribe = () => () => {};
const useStarted = () => useSyncExternalStore(noSubscribe, () => startedText(new Date()), () => "");

// The entrance is armed only in the browser (without JavaScript the sheet simply shows) and plays once,
// when the sheet first comes into view. The observer watches the unclipped wrapper: a sheet clipped to
// nothing never counts as intersecting.
function useEntrance() {
  const ref = useRef<HTMLDivElement>(null);
  const armed = useInBrowser();
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setEntered(true);
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, armed, entered };
}

// The hairline order for the draw: each line waits 80ms more than the one above it.
const at = (i: number) => ({ "--i": i }) as React.CSSProperties;

function QuestionOne({ selected, onChoose, line }: { selected: ServiceId[]; onChoose: (id: ServiceId) => void; line: number }) {
  return (
    <div className="hs-q hs-line" style={at(line)}>
      <p className="hs-q-num">01</p>
      <p id="hs-q1" className="hs-q-text">{FIRST_QUESTION.text}</p>
      <p className="hs-q-help">{FIRST_QUESTION.help}</p>
      <div className="hs-chips" role="group" aria-labelledby="hs-q1">
        {CHIP_SERVICES.map((id) => (
          <button key={id} type="button" className="hs-chip" aria-pressed={selected.includes(id)} onClick={() => onChoose(id)}>
            {chipLabel(id)}
          </button>
        ))}
      </div>
    </div>
  );
}

// The later questions as labels (four, or three when the visitor is unsure, as in the planner), then the
// call. 02 turns Obsidian once question 01 has an answer.
function LaterRows({ selected, line }: { selected: ServiceId[]; line: number }) {
  const later = laterQuestions(selected);
  return (
    <>
      <ol className="hs-later">
        {later.map((q, i) => (
          <li key={q.title} className="hs-row hs-line" style={at(line + i)} data-next={(i === 0 && selected.length > 0) || undefined}>
            <span className="hs-row-label">{q.number}</span>
            <span>{q.title}</span>
          </li>
        ))}
      </ol>
      <p className="hs-row hs-line" style={at(line + later.length)}>
        <span className="hs-row-label">{START_COPY.then}</span>
        <span>{START_COPY.thenText}</span>
      </p>
    </>
  );
}

export default function StartSheet() {
  const [selected, setSelected] = useState<ServiceId[]>([]);
  const [live, setLive] = useState("");
  const started = useStarted();
  const sector = useHomeSector();
  const business = BUSINESS_TYPES.find((t) => t.id === sector)?.label;
  const { ref, armed, entered } = useEntrance();
  const first = business ? 1 : 0;

  const choose = (id: ServiceId) => {
    const next = toggleChip(selected, id);
    if (next.length === selected.length && next.every((s, i) => s === selected[i])) return;
    setSelected(next);
    setLive(chipAnnouncement(selected, next));
    track("home_start_chip", { service: id, selected: next.includes(id) });
  };

  return (
    <div className="hs-sheet-wrap" ref={ref}>
      <div className="hs-sheet" data-armed={armed || undefined} data-in={entered || undefined}>
        <div className="hs-sheet-head">
          <p className="hs-sheet-title">{START_COPY.sheetTitle}</p>
          <p className="hs-count">{countText(selected)}</p>
        </div>
        <p className="hs-started">{started || "\u00a0"}</p>
        {business && (
          <p className="hs-row hs-line" style={at(0)}>
            <span className="hs-row-label">{START_COPY.business}</span>
            <span>{business}</span>
          </p>
        )}
        <QuestionOne selected={selected} onChoose={choose} line={first} />
        <LaterRows selected={selected} line={first + 1} />
        <Link href={planHref(selected)} className="btn-primary hs-plan" data-cursor="link" onClick={() => track("home_start_plan_click", { services_count: selected.length })}>
          {START_COPY.button}
        </Link>
        <p className="hs-note">{START_COPY.line}</p>
        <p className="sr-only" aria-live="polite">{live}</p>
      </div>
    </div>
  );
}
