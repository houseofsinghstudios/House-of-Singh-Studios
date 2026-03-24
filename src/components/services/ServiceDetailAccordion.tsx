"use client";

import { useState, useCallback, useEffect } from "react";

interface ProcessStep {
  step: string;
  name: string;
  description: string;
}

export default function ServiceDetailAccordion({
  steps,
}: {
  steps: ProcessStep[];
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div className="svc-accordion-list">
      {steps.map((step, i) => {
        const isOpen = isMobile || openIndex === i;
        return (
          <div
            key={step.step}
            className={`svc-acc-row${isOpen ? " svc-acc-row--open" : ""}`}
          >
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
            <div
              className="svc-acc-panel"
              style={{
                maxHeight: isOpen ? 200 : 0,
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p className="svc-acc-desc">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
