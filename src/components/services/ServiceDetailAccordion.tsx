"use client";

import { useState, useCallback, useEffect, useId, useRef, type ReactNode } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

interface ProcessStep {
  step: string;
  name: string;
  // Plain text, or text with links (service page questions).
  description: ReactNode;
}

// An open panel is at least this tall, as it always was; a longer answer opens to its full height.
const OPEN_MIN = 200;

export default function ServiceDetailAccordion({
  steps,
  initialOpen = 0,
  headingLevel,
  variant = "process",
}: {
  steps: ProcessStep[];
  // Which row starts open: the first by default (service pages), -1 for all closed (questions).
  initialOpen?: number;
  // When set, each trigger sits in a heading of that level (questions are h3).
  headingLevel?: "h3";
  // process: the service steps, every row open and still on phones. questions: rows open and close
  // on tap at every width, one at a time, with the plus icon showing on phones too.
  variant?: "process" | "questions";
}) {
  const questions = variant === "questions";
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(initialOpen);
  const isMobile = useMediaQuery("(max-width: 767px)");
  // Each answer's height, measured, so a long answer is never cut off.
  const [heights, setHeights] = useState<number[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const els = descRefs.current;
    const measure = () => setHeights(els.map((el) => el?.offsetHeight ?? 0));
    const ro = new ResizeObserver(measure);
    els.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [steps.length]);

  // Process steps on phones are always open, so a tap does nothing; questions always toggle.
  const forceOpen = isMobile && !questions;
  const toggle = useCallback(
    (i: number) => {
      if (forceOpen) return;
      setOpenIndex((prev) => (prev === i ? -1 : i));
    },
    [forceOpen]
  );

  const trigger = (step: ProcessStep, i: number, isOpen: boolean) => (
    <button
      type="button"
      className="svc-acc-trigger"
      onClick={() => toggle(i)}
      aria-expanded={isOpen}
      aria-controls={`${baseId}-panel-${i}`}
    >
      <span className="svc-acc-num">{step.step}</span>
      <span className="svc-acc-title">{step.name}</span>
      <span className="svc-acc-icon" aria-hidden="true">
        +
      </span>
    </button>
  );

  return (
    <div className="svc-accordion-list">
      {steps.map((step, i) => {
        const isOpen = forceOpen || openIndex === i;
        return (
          <div
            key={step.step}
            className={`svc-acc-row${questions ? " svc-acc-row--questions" : ""}${isOpen ? " svc-acc-row--open" : ""}`}
          >
            {headingLevel ? (
              <h3 className="svc-acc-heading">{trigger(step, i, isOpen)}</h3>
            ) : (
              trigger(step, i, isOpen)
            )}
            {/* A closed panel stays in the page (and the server HTML) but is inert, so nothing in a
                hidden answer, such as a link, can take keyboard focus. */}
            <div
              id={`${baseId}-panel-${i}`}
              className="svc-acc-panel"
              inert={!isOpen}
              style={{
                maxHeight: isOpen ? Math.max(OPEN_MIN, heights[i] ?? 0) : 0,
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p className="svc-acc-desc" ref={(el) => { descRefs.current[i] = el; }}>{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
