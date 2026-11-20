"use client";
// A client component: the Living Index on /work. The visitor finishes the sentence "Work for [your
// kind of business], in [every discipline]." and the list reorders under it: matching projects
// first, everything else after. The choices live in the address (?for= and ?in=), so a chosen view
// can be shared; the image window beside the list follows the pointer, focus or scroll.

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery, REDUCED_MOTION } from "@/lib/use-media-query";
import {
  BUSINESS_TYPES,
  BUYER_DISCIPLINES,
  invitationQuestion,
  parseWorkParams,
  rankProjects,
  sentenceWords,
  statusText,
  workHref,
  type IndexChoice,
} from "@/lib/work-index";
import WorkSentence, { type ListId } from "./WorkSentence";
import WorkChoicePanel, { type ChoiceOption } from "./WorkChoicePanel";
import WorkRows from "./WorkRows";
import WorkWindow from "./WorkWindow";
import { useRowAtWindowEdge, useWorkWindow } from "./use-work-window";
import type { WorkItem } from "./types";
import "./work-index.css";

const PHONE = "(max-width: 1080px)";

// One option in a list: how many projects it would bring to the top together with the other current
// choice, and the first three of their images.
function option(items: readonly WorkItem[], key: string, label: string, choice: IndexChoice, current: boolean, onChoose: (next: IndexChoice) => void): ChoiceOption {
  const { matches, rest } = rankProjects(items, choice);
  const shown = choice.sector || choice.discipline ? matches : rest;
  return {
    key,
    label,
    count: shown.length,
    thumbs: shown.slice(0, 3).flatMap((p) => p.images.slice(0, 1)),
    current,
    onChoose: () => onChoose(choice),
  };
}

function businessOptions(items: readonly WorkItem[], choice: IndexChoice, onChoose: (next: IndexChoice) => void): ChoiceOption[] {
  const other = { discipline: choice.discipline };
  return [
    option(items, "all", "All work", other, !choice.sector, onChoose),
    ...BUSINESS_TYPES.map((t) => option(items, t.id, t.label, { ...other, sector: t.id }, choice.sector === t.id, onChoose)),
  ];
}

function disciplineOptions(items: readonly WorkItem[], choice: IndexChoice, onChoose: (next: IndexChoice) => void): ChoiceOption[] {
  const other = { sector: choice.sector };
  return [
    option(items, "all", "Every discipline", other, !choice.discipline, onChoose),
    ...BUYER_DISCIPLINES.map((d) => option(items, d.id, d.label, { ...other, discipline: d.id }, choice.discipline === d.id, onChoose)),
  ];
}

// Which list is open (one at a time), and the way back to its choice when it closes.
function useLists() {
  const [open, setOpen] = useState<ListId | null>(null);
  const business = useRef<HTMLSpanElement>(null);
  const discipline = useRef<HTMLSpanElement>(null);
  const refs = useMemo(() => ({ business, discipline }), []);
  const close = useCallback(() => {
    if (open) refs[open].current?.focus();
    setOpen(null);
  }, [open, refs]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);
  const toggle = useCallback((list: ListId) => setOpen((o) => (o === list ? null : list)), []);
  return { open, refs, close, toggle };
}

interface Props {
  items: WorkItem[];
  choice: IndexChoice;
}

export default function WorkIndex({ items, choice }: Props) {
  const router = useRouter();
  const reduced = useMediaQuery(REDUCED_MOTION);
  const phone = useMediaQuery(PHONE);
  const lists = useLists();
  const id = useId();
  const ids = { business: `${id}business`, discipline: `${id}discipline` };
  const listRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const key = workHref(choice);
  const hasChoice = Boolean(choice.sector || choice.discipline);
  const { matches, rest } = useMemo(() => rankProjects(items, choice), [items, choice]);
  const ordered = useMemo(() => [...matches, ...rest], [matches, rest]);
  const win = useWorkWindow(ordered, key, reduced);
  const { show } = win;
  const showOnScroll = useCallback((item: WorkItem) => show(item, "hover"), [show]);
  useRowAtWindowEdge(phone, listRef, windowRef, ordered, showOnScroll);

  const choose = (next: IndexChoice) => {
    router.replace(workHref(next), { scroll: false });
    lists.close();
  };
  // On a phone there is no pointer to follow: the scroll position picks the project.
  const rowHandlers = phone ? { ...win.handlers, onRowEnter: () => {}, onImageEnter: () => {}, onImageLeave: () => {} } : win.handlers;

  return (
    <div className="wi-island">
      <WorkSentence words={sentenceWords(choice)} open={lists.open} onToggle={lists.toggle} refs={lists.refs} ids={ids} />
      <WorkChoicePanel id={ids.business} open={lists.open === "business"} label="Your kind of business" options={businessOptions(items, choice, choose)} withOther onClose={lists.close} />
      <WorkChoicePanel id={ids.discipline} open={lists.open === "discipline"} label="Discipline" options={disciplineOptions(items, choice, choose)} onClose={lists.close} />
      <p className="sr-only" aria-live="polite">
        {statusText(choice, matches.length, rest.length)}
      </p>
      <div className="wi-index">
        <WorkRows matches={matches} rest={rest} hasChoice={hasChoice} question={invitationQuestion(choice)} listRef={listRef} {...rowHandlers} />
        <WorkWindow item={win.item} image={win.image} step={win.step} cycling={win.cycling} onCycleEnd={win.next} windowRef={windowRef} />
      </div>
    </div>
  );
}

// The index as the address asks for it. Reading the address makes this part render in the browser
// only, so the page around it stays static; until then the Suspense fallback shows the default list.
export function WorkIndexFromUrl({ items }: { items: WorkItem[] }) {
  const params = useSearchParams();
  const query = params.toString();
  const choice = useMemo(() => parseWorkParams(new URLSearchParams(query)), [query]);
  return <WorkIndex items={items} choice={choice} />;
}
