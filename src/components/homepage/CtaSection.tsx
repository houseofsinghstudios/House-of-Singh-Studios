"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { CTA } from "@/lib/constants/homepage-data";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

gsap.registerPlugin(ScrollTrigger);

export default function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

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
            { y: "0%", opacity: 1, stagger: 0.04, duration: 0.5 },
            0.15
          );
        }
      }

      // Supporting copy fades up
      if (copyRef.current) {
        gsap.set(copyRef.current, { opacity: 0, y: 20 });
        tl.to(copyRef.current, { opacity: 1, y: 0, duration: 0.4 }, ">");
      }

      // Button fades up and scales in
      if (btnRef.current) {
        gsap.set(btnRef.current, { opacity: 0, scale: 0.95 });
        tl.to(btnRef.current, { opacity: 1, scale: 1, duration: 0.4 }, ">0.2");
      }
    }, section);

    return () => {
      ctx.revert();
      if (headingSplit) headingSplit.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="css-reveal py-[200px] px-[var(--page-px)] text-center cta-section-mobile">
      <div ref={labelRef}>
        <EditorialLabel text={CTA.label} className="mb-6" />
      </div>

      <h2
        ref={headingRef}
        className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] mx-auto overflow-hidden"
        style={{ fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.15 }}
      >
        {CTA.heading}
      </h2>

      <p
        ref={copyRef}
        className="mt-5 font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-muted)] max-w-[480px] mx-auto"
      >
        {CTA.supporting}
      </p>

      <div ref={btnRef} className="mt-11">
        <Button href={CTA.button.href} data-cursor="link">
          {CTA.button.text}
        </Button>
      </div>
    </section>
  );
}
