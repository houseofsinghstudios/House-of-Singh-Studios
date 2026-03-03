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
          const block = entry.target as HTMLElement;
          const idx = Number(block.dataset.idx);
          const delay = idx * 100;

          block.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
          block.style.opacity = "1";
          block.style.transform = "translateY(0)";

          observer.unobserve(block);
        });
      },
      { threshold: 0.1 }
    );

    grid.querySelectorAll<HTMLElement>(".service-block").forEach((el) =>
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

      <div ref={gridRef} className="services-visual-grid mt-16">
        {SERVICES_SECTION.items.map((service, i) => (
          <Link
            key={service.href}
            href={service.href}
            className="service-block no-underline"
            data-idx={i}
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              background: service.color,
            }}
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
