"use client";

import { CTA } from "@/lib/constants/homepage-data";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function CtaSection() {
  return (
    <section className="css-reveal py-[200px] px-[var(--page-px)] text-center cta-section-mobile">
      <div className="css-reveal">
        <EditorialLabel text={CTA.label} className="mb-6" />
      </div>

      <h2
        className="css-reveal font-[var(--serif)] font-semibold text-[color:var(--text-primary)] mx-auto overflow-hidden"
        style={{ fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.15 }}
      >
        {CTA.heading}
      </h2>

      <p
        className="css-reveal mt-5 font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-muted)] max-w-[480px] mx-auto"
      >
        {CTA.supporting}
      </p>

      <div className="css-reveal mt-11 flex flex-wrap justify-center gap-3">
        <Button href={CTA.buttons.primary.href} data-cursor="link">
          {CTA.buttons.primary.text}
        </Button>
        <Button href={CTA.buttons.secondary.href} variant="secondary" data-cursor="link">
          {CTA.buttons.secondary.text}
        </Button>
      </div>
    </section>
  );
}
