"use client";
// One Project Planner question. Client component: it holds the step's validation message and
// moves focus to the step heading when it appears.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FLOW, GOAL, NEEDS, PRIORITIES, SERVICE_LABELS, START, TIMING } from "@/lib/project-planner/content";
import { priorityOptions, type Draft } from "@/lib/project-planner/engine";
import { GOAL_IDS, HELP, MAX_NEEDS, MAX_PRIORITIES, SERVICE_IDS, START_IDS, TIMING_IDS, type ServiceId } from "@/lib/project-planner/types";
import OptionList, { type Option } from "./OptionList";

export type StepKey = "needs" | "start" | "goal" | "priorities" | "timing";

interface Props {
  step: StepKey;
  index: number;
  total: number;
  draft: Draft;
  onNeeds: (needs: ServiceId[]) => void;
  onPrimary: (primary: ServiceId) => void;
  onChange: (patch: Partial<Draft>) => void;
  onContinue: () => void;
  onBack: () => void;
  isLast: boolean;
}

const QUESTIONS: Record<StepKey, { question: string; helper: string }> = {
  needs: NEEDS,
  start: START,
  goal: GOAL,
  priorities: PRIORITIES,
  timing: TIMING,
};

// Adds or removes one choice from a multi select, keeping "exclusive" alone and the limit.
function toggleMulti(list: string[], id: string, exclusive: string, max: number): { next: string[]; tooMany: boolean } {
  if (list.includes(id)) return { next: list.filter((x) => x !== id), tooMany: false };
  if (id === exclusive) return { next: [id], tooMany: false };
  const base = list.filter((x) => x !== exclusive);
  if (base.length >= max) return { next: list, tooMany: true };
  return { next: [...base, id], tooMany: false };
}

function optionsFor(step: StepKey, draft: Draft): Option[] {
  const primary = draft.primary;
  if (step === "needs") return SERVICE_IDS.map((id) => ({ id, label: SERVICE_LABELS[id], hint: id === "packaging" ? NEEDS.packagingHint : undefined }));
  if (step === "start" && primary) return START_IDS[primary].map((id) => ({ id, label: START.options[primary][id] }));
  if (step === "goal") return GOAL_IDS.map((id) => ({ id, label: GOAL.options[id] }));
  if (step === "priorities" && primary && primary !== "unsure") {
    const labels = PRIORITIES.options[primary];
    return [...priorityOptions(primary).map((id) => ({ id, label: labels[id] })), { id: HELP, label: PRIORITIES.help }];
  }
  if (step === "timing") return TIMING_IDS.map((id) => ({ id, label: TIMING.options[id] }));
  return [];
}

function selectedFor(step: StepKey, d: Draft): string[] {
  if (step === "needs") return d.needs;
  if (step === "priorities") return d.priorities ?? [];
  const v = step === "start" ? d.start : step === "goal" ? d.goal : d.timing;
  return v ? [v] : [];
}

function MainFocus({ draft, onPrimary }: { draft: Draft; onPrimary: (p: ServiceId) => void }) {
  const [open, setOpen] = useState(false);
  if (draft.needs.length < 2 || !draft.primary) return null;
  return (
    <div className="pp-focus">
      <p className="pp-focus-line">
        {FLOW.mainFocus} <strong>{SERVICE_LABELS[draft.primary]}</strong>.{" "}
        <button type="button" className="pp-quiet" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{FLOW.change}</button>
      </p>
      {open && (
        <fieldset className="pp-fieldset pp-focus-choice">
          <legend className="pp-label">{FLOW.chooseMainFocus}</legend>
          <OptionList name="pp-primary" type="radio" options={draft.needs.map((id) => ({ id, label: SERVICE_LABELS[id] }))} selected={[draft.primary]} onToggle={(id) => onPrimary(id as ServiceId)} />
        </fieldset>
      )}
    </div>
  );
}

export default function PlannerStep({ step, index, total, draft, onNeeds, onPrimary, onChange, onContinue, onBack, isLast }: Props) {
  const [message, setMessage] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { question, helper } = QUESTIONS[step];
  const selected = selectedFor(step, draft);
  const multi = step === "needs" || step === "priorities";

  // Each step mounts fresh (the flow keys it by step), so only focus needs setting here.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  function toggle(id: string) {
    setMessage("");
    if (step === "needs") {
      const { next, tooMany } = toggleMulti(draft.needs, id, "unsure", MAX_NEEDS);
      if (tooMany) setMessage(NEEDS.tooMany);
      else onNeeds(next as ServiceId[]);
    } else if (step === "priorities") {
      const { next, tooMany } = toggleMulti(draft.priorities ?? [], id, HELP, MAX_PRIORITIES);
      if (tooMany) setMessage(PRIORITIES.tooMany);
      else onChange({ priorities: next as Draft["priorities"] });
    } else {
      onChange({ [step]: id } as Partial<Draft>);
    }
  }

  function next() {
    if (!selected.length) return setMessage(FLOW.required);
    onContinue();
  }

  return (
    <div className="pp-step">
      <p className="pp-progress">{FLOW.progress(index + 1, total)}</p>
      <h2 ref={headingRef} id={`pp-q-${step}`} className="pp-question" tabIndex={-1}>{question}</h2>
      <p id={`pp-help-${step}`} className="pp-helper">{helper}</p>
      <fieldset className="pp-fieldset" aria-labelledby={`pp-q-${step}`}>
        <OptionList name={`pp-${step}`} type={multi ? "checkbox" : "radio"} options={optionsFor(step, draft)} selected={selected} onToggle={toggle} describedBy={`pp-help-${step}`} />
      </fieldset>
      <p className="pp-message" role="status" aria-live="polite">{message}</p>
      {step === "needs" && (
        <>
          <MainFocus draft={draft} onPrimary={onPrimary} />
          <p className="pp-small">
            {NEEDS.printLead} <Link href="/contact" className="pp-link">{NEEDS.printLink}</Link>
          </p>
        </>
      )}
      <div className="pp-step-actions">
        <button type="button" className="btn-primary pp-btn" onClick={next}>{isLast ? FLOW.seeBrief : FLOW.continue}</button>
        <button type="button" className="pp-quiet" onClick={onBack}>{FLOW.back}</button>
      </div>
    </div>
  );
}
