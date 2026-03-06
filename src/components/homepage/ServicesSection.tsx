"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SERVICES_SECTION } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
            0.15
          );
        }
      }

      // Service blocks stagger in with clip-path
      if (gridRef.current) {
        const blocks = gridRef.current.querySelectorAll<HTMLElement>(".service-block");
        gsap.set(blocks, { opacity: 0, y: 30, clipPath: "inset(4%)" });
        tl.to(
          blocks,
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0%)",
            stagger: 0.1,
            duration: 0.6,
          },
          0.5
        );
      }
    }, section);

    return () => {
      ctx.revert();
      if (headingSplit) headingSplit.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="css-reveal py-40 px-[var(--page-px)]">
      <div ref={labelRef}>
        <EditorialLabel text={SERVICES_SECTION.label} className="mb-6" />
      </div>

      <h2
        ref={headingRef}
        className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0 overflow-hidden"
        style={{ fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.15 }}
      >
        {SERVICES_SECTION.heading}
      </h2>

      <div ref={gridRef} className="services-visual-grid mt-16">
        {SERVICES_SECTION.items.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className="service-block no-underline"
            data-cursor="link"
            style={{ background: service.color }}
          >
            <div className="service-block-inner">
              <h3
                className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
                style={{ fontSize: "clamp(22px, 2vw, 28px)" }}
              >
                {service.title}
              </h3>
              <p className="service-block-sentence font-[var(--sans)] font-normal text-sm text-[color:var(--text-secondary)] mt-2 m-0">
                {service.sentence}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
