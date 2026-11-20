"use client";
// Client hooks and helpers shared by the two Living Indexes: /work (WorkIndex) and the homepage's
// Selected work (HomeWorkIndex). The list options with their counts and thumbnails, which list is
// open, and the image window wired to the pointer, focus or (at 1080px and below) scroll.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery, REDUCED_MOTION } from "@/lib/use-media-query";
import { BUSINESS_TYPES, rankProjects, type IndexChoice } from "@/lib/work-index";
import type { ListId } from "./WorkSentence";
import type { ChoiceOption } from "./WorkChoicePanel";
import { useRowAtWindowEdge, useWorkWindow } from "./use-work-window";
import type { WorkItem } from "./types";

const PHONE = "(max-width: 1080px)";

type Choose = (next: IndexChoice) => void;

// One option in a list: how many projects it would bring to the top together with the other current
// choice, and the first three of their images.
export function option(items: readonly WorkItem[], key: string, label: string, choice: IndexChoice, current: boolean, onChoose: Choose): ChoiceOption {
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

// "All work" and the five business types, each combined with the discipline chosen (if any).
export function businessOptions(items: readonly WorkItem[], choice: IndexChoice, onChoose: Choose): ChoiceOption[] {
  const other = { discipline: choice.discipline };
  return [
    option(items, "all", "All work", other, !choice.sector, onChoose),
    ...BUSINESS_TYPES.map((t) => option(items, t.id, t.label, { ...other, sector: t.id }, choice.sector === t.id, onChoose)),
  ];
}

// Which list is open (one at a time), and the way back to its choice when it closes.
export function useLists() {
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

// The image window for a list in this order. key: the current choice, so a new one starts again on
// the first row. On a phone there is no pointer to follow: the scroll position picks the project.
export function useIndexWindow(ordered: readonly WorkItem[], key: string) {
  const reduced = useMediaQuery(REDUCED_MOTION);
  const phone = useMediaQuery(PHONE);
  const listRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const win = useWorkWindow(ordered, key, reduced);
  const { show } = win;
  const showOnScroll = useCallback((item: WorkItem) => show(item, "hover"), [show]);
  useRowAtWindowEdge(phone, listRef, windowRef, ordered, showOnScroll);
  const none = () => {};
  const rowHandlers = phone ? { ...win.handlers, onRowEnter: none, onImageEnter: none, onImageLeave: none } : win.handlers;
  return { win, rowHandlers, listRef, windowRef };
}
