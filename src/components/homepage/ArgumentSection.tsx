"use client";

import { ARGUMENT } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function ArgumentSection() {
  return (
    <section className="argument-section css-reveal py-40 px-[var(--page-px)]">
      <div className="max-w-[640px]">
        <div className="css-reveal">
          <EditorialLabel text={ARGUMENT.label} className="mb-6" />
        </div>

        <h2
          className="css-reveal font-[var(--serif)] font-semibold tracking-[-0.015em] max-w-[800px] text-[color:var(--text-primary)] m-0 overflow-hidden"
          style={{ fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.15 }}
        >
          {ARGUMENT.heading}
        </h2>

        <p
          className="we-fix-that css-reveal mt-12 mb-10 font-[var(--sans)] font-medium text-[color:var(--text-primary)]"
          style={{ fontSize: "clamp(22px, 2vw, 28px)", position: "relative", display: "inline-block" }}
        >
          {ARGUMENT.snap}
        </p>

        <div className="flex flex-col gap-3 mt-10">
          {ARGUMENT.steps.map((step) => (
            <p
              key={step}
              className="argument-step-line css-reveal font-[var(--sans)] text-[15px] leading-[1.6] text-[color:var(--text-secondary)]"
            >
              {step}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
