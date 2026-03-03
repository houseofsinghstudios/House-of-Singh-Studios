"use client";

import { useEffect, useRef } from "react";
import { ARGUMENT } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";

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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const weFixRef = useRef<HTMLParagraphElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headingEl = headingRef.current;
    const weFixEl = weFixRef.current;
    const visualEl = visualRef.current;

    // Split heading into word spans for staggered reveal
    if (headingEl && !headingEl.dataset.initialized) {
      headingEl.dataset.initialized = "1";
      const words = (headingEl.textContent || "").split(" ");
      headingEl.innerHTML = "";
      words.forEach((word, i) => {
        const span = document.createElement("span");
        span.textContent = word;
        span.style.cssText = `opacity:0;display:inline-block;transition:opacity 0.4s ease ${i * 40}ms`;
        span.dataset.wordIdx = String(i);
        headingEl.appendChild(span);
        if (i < words.length - 1) headingEl.appendChild(document.createTextNode(" "));
      });
    }

    // "We fix that." starts invisible, no transition (snap)
    if (weFixEl) {
      weFixEl.style.opacity = "0";
      weFixEl.style.transition = "none";
    }

    // Visual column: starts hidden, fades up
    if (visualEl) {
      visualEl.style.opacity = "0";
      visualEl.style.transform = "translateY(40px)";
      visualEl.style.transition = "opacity 1s ease 0.3s, transform 1s ease 0.3s";
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          if (target === headingEl) {
            headingEl.querySelectorAll<HTMLSpanElement>("span[data-word-idx]")
              .forEach((w) => { w.style.opacity = "1"; });
            observer.unobserve(headingEl);
          }
          if (target === weFixEl) {
            weFixEl!.style.opacity = "1";
            observer.unobserve(weFixEl!);
          }
          if (target === visualEl) {
            visualEl!.style.opacity = "1";
            visualEl!.style.transform = "translateY(0)";
            observer.unobserve(visualEl!);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (headingEl) observer.observe(headingEl);
    if (weFixEl) observer.observe(weFixEl);
    if (visualEl) observer.observe(visualEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="argument-section py-40 px-[var(--page-px)]">
      <div className="argument-grid">
        {/* Left column: text content */}
        <div className="argument-text max-w-[640px]">
          <ScrollReveal>
            <EditorialLabel text={ARGUMENT.label} className="mb-6" />
          </ScrollReveal>

          <h2
            ref={headingRef}
            className="font-[var(--serif)] font-semibold tracking-[-0.015em] max-w-[800px] text-[color:var(--text-primary)] m-0"
            style={{ fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.15 }}
          >
            {ARGUMENT.heading}
          </h2>

          <ScrollReveal>
            <p className="mt-9 font-[var(--sans)] font-normal text-[17px] leading-[1.65] text-[color:var(--text-secondary)]">
              {ARGUMENT.pain}
            </p>
          </ScrollReveal>

          <p
            ref={weFixRef}
            className="mt-20 mb-10 font-[var(--sans)] font-medium text-[color:var(--text-primary)]"
            style={{ fontSize: "clamp(22px, 2vw, 28px)", opacity: 0 }}
          >
            {ARGUMENT.snap}
          </p>

          <ScrollReveal>
            <p className="font-[var(--sans)] font-normal text-[17px] leading-[1.65] text-[color:var(--text-secondary)]">
              {ARGUMENT.process}
            </p>
          </ScrollReveal>

          <ScrollReveal className="process-steps">
            <div className="mt-12 flex items-center flex-wrap">
              {ARGUMENT.steps.map((step, i) => (
                <div key={step} className="flex items-center">
                  {i > 0 && <div className="process-connector" />}
                  <span className="font-[var(--sans)] font-medium text-[11px] uppercase tracking-[0.13em] text-[color:var(--text-primary)] whitespace-nowrap">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Right column: editorial image */}
        <div ref={visualRef} className="argument-visual">
          <div className="argument-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
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
          <p className="editorial-label mt-3 text-right">
            (Brand Identity Detail)
          </p>
        </div>
      </div>
    </section>
  );
}
