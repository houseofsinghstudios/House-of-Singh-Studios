"use client";

import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";

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
}: {
  steps: ProcessStep[];
  // Which row starts open: the first by default (service pages), -1 for all closed (questions).
  initialOpen?: number;
  // When set, each trigger sits in a heading of that level (questions are h3).
  headingLevel?: "h3";
}) {
  const [openIndex, setOpenIndex] = useState(initialOpen);
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = useCallback(
    (i: number) => {
      if (isMobile) return;
      setOpenIndex((prev) => (prev === i ? -1 : i));
    },
    [isMobile]
  );

  const trigger = (step: ProcessStep, i: number, isOpen: boolean) => (
    <button
      type="button"
      className="svc-acc-trigger"
      onClick={() => toggle(i)}
      aria-expanded={isOpen}
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
        const isOpen = isMobile || openIndex === i;
        return (
          <div
            key={step.step}
            className={`svc-acc-row${isOpen ? " svc-acc-row--open" : ""}`}
          >
            {headingLevel ? (
              <h3 className="svc-acc-heading">{trigger(step, i, isOpen)}</h3>
            ) : (
              trigger(step, i, isOpen)
            )}
            {/* A closed panel stays in the page (and the server HTML) but is inert, so nothing in a
                hidden answer, such as a link, can take keyboard focus. */}
            <div
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
