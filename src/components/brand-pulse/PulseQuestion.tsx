"use client";
// One Brand Pulse question. Client component: keyboard handling and focus on the radio group.
// Arrow keys move focus without choosing; Enter, Space or a click chooses.

import { useEffect, useRef } from "react";
import { FLOW, QUESTIONS } from "@/lib/brand-pulse/content";
import { QUESTION_ORDER, type Answers, type QuestionId } from "@/lib/brand-pulse/types";

interface Props {
  step: number;
  answers: Partial<Answers>;
  pending: string | null;
  onChoose: (id: string) => void;
  onBack: () => void;
}

const TOTAL = QUESTION_ORDER.length;

function optionsFor(q: QuestionId) {
  const options: Record<string, { label: string; chip: string }> = QUESTIONS[q].options;
  return Object.entries(options).map(([id, o]) => ({ id, ...o }));
}

function Progress({ step }: { step: number }) {
  const timeText = step === TOTAL - 1 ? FLOW.lastQuestion : FLOW.timeLeft(60 - 9 * step);
  return (
    <div className="bp-progress">
      <div className="bp-progress-bars" aria-hidden="true">
        {QUESTION_ORDER.map((q, i) => (
          <span key={q} className={`bp-progress-seg${i < step ? " is-done" : ""}`} />
        ))}
      </div>
      <span className="bp-progress-count">{FLOW.progress(step + 1, TOTAL)}</span>
      <span className="bp-progress-time">{timeText}</span>
    </div>
  );
}

function Chips({ step, answers }: { step: number; answers: Partial<Answers> }) {
  const given = QUESTION_ORDER.slice(0, step).filter((q) => answers[q]);
  if (given.length === 0) return null;
  return (
    <ul className="bp-chips" aria-label={FLOW.answersSoFar}>
      {given.map((q) => {
        const options: Record<string, { chip: string }> = QUESTIONS[q].options;
        return <li key={q} className="bp-chip">{options[answers[q] as string].chip}</li>;
      })}
    </ul>
  );
}

export default function PulseQuestion({ step, answers, pending, onChoose, onBack }: Props) {
  const q = QUESTION_ORDER[step];
  const content = QUESTIONS[q];
  const options = optionsFor(q);
  const current = pending ?? (answers[q] as string | undefined) ?? null;
  const groupRef = useRef<HTMLFieldSetElement>(null);

  // Focus the chosen option, or the first, when the question appears.
  useEffect(() => {
    const radios = groupRef.current?.querySelectorAll<HTMLInputElement>("input[type=radio]");
    if (!radios?.length) return;
    ([...radios].find((r) => r.checked) ?? radios[0]).focus({ preventScroll: true });
  }, [step]);

  function onKeyDown(e: React.KeyboardEvent<HTMLFieldSetElement>) {
    const radios = [...(groupRef.current?.querySelectorAll<HTMLInputElement>("input[type=radio]") ?? [])];
    const index = radios.indexOf(document.activeElement as HTMLInputElement);
    if (index < 0) return;
    if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
      radios[(index + delta + radios.length) % radios.length].focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChoose(radios[index].value);
    }
  }

  return (
    <div className="bp-question">
      <Progress step={step} />
      <Chips step={step} answers={answers} />
      <fieldset ref={groupRef} className="bp-fieldset" onKeyDown={onKeyDown} disabled={pending !== null}>
        <legend className="bp-question-text">{content.text}</legend>
        {content.helper && <p className="bp-helper">{content.helper}</p>}
        <div className="bp-options">
          {options.map((o) => (
            <label key={o.id} className={`bp-option${current === o.id ? " is-selected" : ""}`}>
              <input
                type="radio"
                name={`bp-${q}`}
                value={o.id}
                checked={current === o.id}
                onChange={() => onChoose(o.id)}
                onClick={() => current === o.id && onChoose(o.id)}
                className="bp-radio"
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button type="button" className="bp-back" onClick={onBack}>
        {FLOW.back}
      </button>
    </div>
  );
}
