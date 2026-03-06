"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ARGUMENT } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

gsap.registerPlugin(ScrollTrigger);

function ImagePlaceholder() {
  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ aspectRatio: "4/5", background: "#E8E8E3" }}
    >
      <span className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[#999]">
        Image
      </span>
    </div>
  );
}

export default function ArgumentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);
  const weFixRef = useRef<HTMLParagraphElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const imgLabelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let headingSplit: SplitType | null = null;

    const ctx = gsap.context(() => {
      // ── Left column animations ──
      const leftTl = gsap.timeline({
        scrollTrigger: {
          trigger: leftColRef.current,
          start: "top 75%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      // Editorial label fades up
      if (labelRef.current) {
        gsap.set(labelRef.current, { opacity: 0, y: 15 });
        leftTl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0);
      }

      // Heading — SplitType word reveal
      if (headingRef.current) {
        headingSplit = new SplitType(headingRef.current, { types: "words" });
        if (headingSplit.words) {
          gsap.set(headingSplit.words, { y: "100%", opacity: 0 });
          leftTl.to(
            headingSplit.words,
            { y: "0%", opacity: 1, stagger: 0.05, duration: 0.5 },
            0.2
          );
        }
      }

      // Supporting line fades up after heading
      if (supportRef.current) {
        gsap.set(supportRef.current, { opacity: 0, y: 15 });
        leftTl.to(supportRef.current, { opacity: 1, y: 0, duration: 0.4 }, ">");
      }

      // "We fix that." snaps in (instant) 0.2s after supporting line
      if (weFixRef.current) {
        gsap.set(weFixRef.current, { opacity: 0 });
        leftTl.to(weFixRef.current, { opacity: 1, duration: 0.01 }, ">0.2");
      }

      // Process steps stagger from left
      if (stepsRef.current) {
        const items = stepsRef.current.querySelectorAll(".process-step-item");
        gsap.set(items, { opacity: 0, x: -20 });
        leftTl.to(
          items,
          { opacity: 1, x: 0, stagger: 0.08, duration: 0.4 },
          ">0.1"
        );
      }

      // ── Right column animations ──
      const rightTl = gsap.timeline({
        scrollTrigger: {
          trigger: rightColRef.current,
          start: "top 70%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      // Image clip-path reveal
      if (imgWrapRef.current) {
        gsap.set(imgWrapRef.current, { clipPath: "inset(8% 6% 8% 6%)" });
        rightTl.to(
          imgWrapRef.current,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1 },
          0
        );
      }
      if (imgRef.current) {
        gsap.set(imgRef.current, { scale: 1.12 });
        rightTl.to(imgRef.current, { scale: 1, duration: 1 }, 0);
      }

      // Image label fades in after image
      if (imgLabelRef.current) {
        gsap.set(imgLabelRef.current, { opacity: 0 });
        rightTl.to(imgLabelRef.current, { opacity: 1, duration: 0.3 }, 0.7);
      }
    }, section);

    return () => {
      ctx.revert();
      if (headingSplit) headingSplit.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="argument-section css-reveal py-40 px-[var(--page-px)]">
      <div className="argument-grid">
        {/* Left column: text content */}
        <div ref={leftColRef} className="argument-text max-w-[640px]">
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

          <div ref={stepsRef} className="process-steps" style={{ opacity: 1, transform: "none" }}>
            {ARGUMENT.steps.map((step, i) => (
              <div key={step} className="process-step-item">
                <span className="process-step-number">{String(i + 1).padStart(2, "0")}</span>
                <span className="process-step-name">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: editorial image */}
        <div ref={rightColRef} className="argument-visual">
          <div ref={imgWrapRef} className="argument-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src="/images/argument-editorial.png"
              alt="Brand identity detail"
              className="argument-img"
              onError={(e) => {
                const img = e.currentTarget;
                img.style.display = "none";
                const fallback = img.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div style={{ display: "none" }}>
              <ImagePlaceholder />
            </div>
          </div>
          <p ref={imgLabelRef} className="editorial-label mt-3 text-right">
            (Brand Identity Detail)
          </p>
        </div>
      </div>
    </section>
  );
}
