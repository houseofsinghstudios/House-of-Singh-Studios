"use client";
// A client component: the homepage's (01) Selected work, a short Living Index. The visitor finishes
// "See our work for [your kind of business]." and the six rows reorder: that business type's work from
// the whole portfolio first, then the curated six fill the places left. The same rows, lists and image
// window as /work (index-shared.ts); the choice is page state only (the address does not change) and
// carries forward through the closing link to /work?for=.

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Link } from "next-view-transitions";
import { setHomeSector } from "@/lib/home-choice";
import {
  homeAllWorkLink,
  homeRows,
  invitationQuestion,
  rankProjects,
  sentenceWords,
  statusText,
  type BusinessTypeId,
  type HomeKey,
  type IndexChoice,
} from "@/lib/work-index";
import { Choice } from "./WorkSentence";
import WorkChoicePanel from "./WorkChoicePanel";
import WorkRows from "./WorkRows";
import WorkWindow from "./WorkWindow";
import { businessOptions, useIndexWindow, useLists } from "./index-shared";
import type { WorkItem } from "./types";
import "./work-index.css";
import "./home-work.css";

// The window's and the strips' images wait for intent, so nothing here loads with the hero image (the
// LCP): a pointer or keyboard focus in the section, or the window itself scrolling into view once the
// page has finished loading.
function useFirstIntent(windowRef: React.RefObject<HTMLDivElement | null>) {
  const [armed, setArmed] = useState(false);
  const arm = useCallback(() => setArmed(true), []);
  useEffect(() => {
    const target = windowRef.current;
    if (armed || !target) return;
    const observer = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && arm());
    const watch = () => observer.observe(target);
    if (document.readyState === "complete") watch();
    else window.addEventListener("load", watch, { once: true });
    return () => {
      window.removeEventListener("load", watch);
      observer.disconnect();
    };
  }, [armed, arm, windowRef]);
  return { armed, arm };
}

interface Props {
  // Every project, in index order: the counts and thumbnails in the list are across the whole portfolio.
  items: WorkItem[];
  // The six for each choice (homeOrders, worked out on the server).
  orders: Record<HomeKey, string[]>;
  // "(01) Selected work", rendered by the server section.
  label: React.ReactNode;
}

export default function HomeWorkIndex({ items, orders, label }: Props) {
  const [sector, setSector] = useState<BusinessTypeId | undefined>();
  // The choice is shared with (04) Start, which shows it on the call brief; cleared when this leaves.
  useEffect(() => setHomeSector(sector), [sector]);
  useEffect(() => () => setHomeSector(undefined), []);
  const choice: IndexChoice = useMemo(() => (sector ? { sector } : {}), [sector]);
  const lists = useLists();
  const panelId = `${useId()}business`;

  const { matches, rest } = useMemo(() => homeRows(items, orders[sector ?? "all"], sector), [items, orders, sector]);
  const ordered = useMemo(() => [...matches, ...rest], [matches, rest]);
  const { win, rowHandlers, listRef, windowRef } = useIndexWindow(ordered, sector ?? "all");
  const { armed, arm } = useFirstIntent(windowRef);

  const choose = (next: IndexChoice) => {
    setSector(next.sector);
    lists.close();
  };
  const total = sector ? rankProjects(items, choice).matches.length : items.length;
  const all = homeAllWorkLink(sector, total);

  return (
    <div className="wi-island hw-island" onPointerEnter={arm} onFocus={arm}>
      <div className="hw-head">
        {label}
        <h2 className="hw-sentence">
          See our work for{" "}
          <Choice words={sentenceWords(choice).business} open={lists.open === "business"} controls={panelId} onToggle={() => lists.toggle("business")} choiceRef={lists.refs.business} />.
        </h2>
        <WorkChoicePanel id={panelId} open={lists.open === "business"} label="Your kind of business" options={businessOptions(items, choice, choose)} withOther onClose={lists.close} />
      </div>
      <p className="sr-only" aria-live="polite">
        {statusText(choice, matches.length, rest.length)}
      </p>
      <div className="wi-index wi-index--home">
        <WorkRows home matches={matches} rest={rest} hasChoice={Boolean(sector)} question={invitationQuestion(choice)} listRef={listRef} armed={armed} {...rowHandlers} />
        <WorkWindow item={win.item} image={win.image} step={win.step} cycling={win.cycling} onCycleEnd={win.next} windowRef={windowRef} armed={armed} />
      </div>
      {/* The closing row, across the grid under the list: the choice carries forward to /work?for=. */}
      <div className="hw-close">
        <Link href={all.href} className="hw-all" data-cursor="link">
          {all.text}
        </Link>
      </div>
    </div>
  );
}
