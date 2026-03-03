"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { SERVICES_SECTION } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ServicesSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const card = entry.target as HTMLElement;
          const col = Number(card.dataset.col);
          const delay = col * 150;

          const border = card.querySelector<HTMLElement>(".service-border-draw");
          const content = card.querySelector<HTMLElement>(".service-content");

          if (border) {
            border.style.transition = `width 0.6s ease ${delay}ms`;
            border.style.width = "100%";
          }
          if (content) {
            content.style.transition = `opacity 0.5s ease ${delay + 600}ms, transform 0.5s ease ${delay + 600}ms`;
            content.style.opacity = "1";
            content.style.transform = "translateY(0)";
          }

          observer.unobserve(card);
        });
      },
      { threshold: 0.15 }
    );

    grid.querySelectorAll<HTMLElement>(".service-card-animated").forEach((el) =>
      observer.observe(el)
    );

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-40 px-[var(--page-px)]">
      <ScrollReveal>
        <EditorialLabel text={SERVICES_SECTION.label} className="mb-6" />
      </ScrollReveal>

      <ScrollReveal>
        <h2
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
          style={{ fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.15 }}
        >
          {SERVICES_SECTION.heading}
        </h2>
      </ScrollReveal>

      <ScrollReveal>
        <p className="mt-4 font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-muted)] max-w-[560px]">
          {SERVICES_SECTION.subheading}
        </p>
      </ScrollReveal>

      <div ref={gridRef} className="services-grid mt-[72px]">
        {SERVICES_SECTION.items.map((service, i) => (
          <div
            key={service.href}
            className="service-card-animated relative pt-7"
            data-col={i % 2}
          >
            <div
              className="service-border-draw absolute top-0 left-0 h-px bg-[var(--border)]"
              style={{ width: 0 }}
            />
            <div
              className="service-content"
              style={{ opacity: 0, transform: "translateY(12px)" }}
            >
              <h3
                className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
                style={{ fontSize: "clamp(22px, 2vw, 28px)" }}
              >
                {service.title}
              </h3>
              <p className="mt-3.5 font-[var(--sans)] font-normal text-[15px] leading-[1.55] text-[color:var(--text-secondary)]">
                {service.sentence}
              </p>
              <ul className="service-bullets mt-[18px]">
                {service.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Link
                href={service.href}
                className="arrow-link mt-[22px] inline-block no-underline"
              >
                <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
                  {service.linkText} <span className="arrow-icon">&rarr;</span>
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
