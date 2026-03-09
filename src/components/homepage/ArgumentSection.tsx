"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ARGUMENT } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

gsap.registerPlugin(ScrollTrigger);

export default function ArgumentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);
  const weFixRef = useRef<HTMLParagraphElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let headingSplit: SplitType | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      // Editorial label fades up
      if (labelRef.current) {
        gsap.set(labelRef.current, { opacity: 0, y: 15 });
        tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0);
      }

      // Heading — SplitType word reveal
      if (headingRef.current) {
        headingSplit = new SplitType(headingRef.current, { types: "words" });
        if (headingSplit.words) {
          gsap.set(headingSplit.words, { y: "100%", opacity: 0 });
          tl.to(
            headingSplit.words,
            { y: "0%", opacity: 1, stagger: 0.05, duration: 0.5 },
            0.2
          );
        }
      }

      // Supporting line fades up after heading
      if (supportRef.current) {
        gsap.set(supportRef.current, { opacity: 0, y: 15 });
        tl.to(supportRef.current, { opacity: 1, y: 0, duration: 0.4 }, ">");
      }

      // "We fix that." snaps in
      if (weFixRef.current) {
        gsap.set(weFixRef.current, { opacity: 0 });
        tl.to(weFixRef.current, { opacity: 1, duration: 0.01 }, ">0.2");
      }

      // Process steps stagger in
      if (stepsRef.current) {
        const items = stepsRef.current.querySelectorAll(".argument-step-line");
        gsap.set(items, { opacity: 0, y: 12 });
        tl.to(
          items,
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 },
          ">0.1"
        );
      }
    }, section);

    return () => {
      ctx.revert();
      if (headingSplit) headingSplit.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="argument-section css-reveal py-40 px-[var(--page-px)]">
      <div className="max-w-[640px]">
        <div ref={labelRef}>
          <EditorialLabel text={ARGUMENT.label} className="mb-6" />
        </div>

        <h2
          ref={headingRef}
          className="font-[var(--serif)] font-semibold tracking-[-0.015em] max-w-[800px] text-[color:var(--text-primary)] m-0 overflow-hidden"
          style={{ fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.15 }}
        >
          {ARGUMENT.heading}
        </h2>

        <p
          ref={supportRef}
          className="mt-7 font-[var(--sans)] font-normal text-[18px] leading-[1.65] text-[color:var(--text-secondary)]"
        >
          {ARGUMENT.supporting}
        </p>

        <p
          ref={weFixRef}
          className="mt-12 mb-10 font-[var(--sans)] font-medium text-[color:var(--text-primary)]"
          style={{ fontSize: "clamp(22px, 2vw, 28px)", opacity: 0 }}
        >
          {ARGUMENT.snap}
        </p>

        <div ref={stepsRef} className="flex flex-col gap-3 mt-10">
          {ARGUMENT.steps.map((step) => (
            <p
              key={step}
              className="argument-step-line font-[var(--sans)] text-[15px] leading-[1.6] text-[color:var(--text-secondary)]"
            >
              {step}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
