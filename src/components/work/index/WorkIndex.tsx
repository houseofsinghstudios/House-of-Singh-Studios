"use client";
// A client component: the Living Index on /work. The visitor finishes the sentence "Work for [your
// kind of business], in [every discipline]." and the list reorders under it: matching projects
// first, everything else after. The choices live in the address (?for= and ?in=), so a chosen view
// can be shared; the image window beside the list follows the pointer, focus or scroll.

import { useId, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BUYER_DISCIPLINES,
  invitationQuestion,
  parseWorkParams,
  rankProjects,
  sentenceWords,
  statusText,
  workHref,
  type IndexChoice,
} from "@/lib/work-index";
import WorkSentence from "./WorkSentence";
import WorkChoicePanel, { type ChoiceOption } from "./WorkChoicePanel";
import WorkRows from "./WorkRows";
import WorkWindow from "./WorkWindow";
import { businessOptions, option, useIndexWindow, useLists } from "./index-shared";
import type { WorkItem } from "./types";
import "./work-index.css";

function disciplineOptions(items: readonly WorkItem[], choice: IndexChoice, onChoose: (next: IndexChoice) => void): ChoiceOption[] {
  const other = { sector: choice.sector };
  return [
    option(items, "all", "Every discipline", other, !choice.discipline, onChoose),
    ...BUYER_DISCIPLINES.map((d) => option(items, d.id, d.label, { ...other, discipline: d.id }, choice.discipline === d.id, onChoose)),
  ];
}

interface Props {
  items: WorkItem[];
  choice: IndexChoice;
}

export default function WorkIndex({ items, choice }: Props) {
  const router = useRouter();
  const lists = useLists();
  const id = useId();
  const ids = { business: `${id}business`, discipline: `${id}discipline` };

  const key = workHref(choice);
  const hasChoice = Boolean(choice.sector || choice.discipline);
  const { matches, rest } = useMemo(() => rankProjects(items, choice), [items, choice]);
  const ordered = useMemo(() => [...matches, ...rest], [matches, rest]);
  const { win, rowHandlers, listRef, windowRef } = useIndexWindow(ordered, key);

  const choose = (next: IndexChoice) => {
    router.replace(workHref(next), { scroll: false });
    lists.close();
  };

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
