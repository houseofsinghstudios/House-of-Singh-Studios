"use client";

import { useEffect, useRef } from "react";
import { CTA } from "@/lib/constants/homepage-data";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CtaSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headingEl = headingRef.current;
    const supportEl = supportRef.current;

    // Split heading into words that "gather" into place
    if (headingEl && !headingEl.dataset.initialized) {
      headingEl.dataset.initialized = "1";
      const words = (headingEl.textContent || "").split(" ");
      headingEl.innerHTML = "";
      words.forEach((word, i) => {
        const span = document.createElement("span");
        span.textContent = word;
        span.style.cssText = `display:inline-block;transform:translateY(${(words.length - i) * 12}px);opacity:0;transition:transform 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms, opacity 0.6s ease ${i * 60}ms`;
        span.dataset.s7Word = "1";
        headingEl.appendChild(span);
        if (i < words.length - 1) {
          const space = document.createElement("span");
          space.innerHTML = "&nbsp;";
          headingEl.appendChild(space);
        }
      });
    }

    if (supportEl) {
      supportEl.style.cssText = "opacity:0;transform:translateY(20px);transition:opacity 0.6s ease 0.9s, transform 0.6s ease 0.9s";
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === headingEl) {
            headingEl!.querySelectorAll<HTMLSpanElement>("span[data-s7-word]")
              .forEach((w) => { w.style.transform = "translateY(0)"; w.style.opacity = "1"; });
            if (supportEl) {
              supportEl.style.opacity = "1";
              supportEl.style.transform = "translateY(0)";
            }
            observer.unobserve(headingEl!);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (headingEl) observer.observe(headingEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-[200px] px-[var(--page-px)] text-center">
      <ScrollReveal>
        <EditorialLabel text={CTA.label} className="mb-6" />
      </ScrollReveal>

      <h2
        ref={headingRef}
        className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] mx-auto"
        style={{ fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.15 }}
      >
        {CTA.heading}
      </h2>

      <div ref={supportRef}>
        <p className="mt-5 font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-muted)] max-w-[480px] mx-auto">
          {CTA.supporting}
        </p>
        <div className="mt-11">
          <Button href={CTA.button.href}>{CTA.button.text}</Button>
        </div>
      </div>
    </section>
  );
}
