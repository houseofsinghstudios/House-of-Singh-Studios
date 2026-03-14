"use client";

import { Link } from "next-view-transitions";
import { SERVICES_SECTION } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function ServicesSection() {
  return (
    <section className="css-reveal py-40 px-[var(--page-px)] services-section-mobile">
      <div className="css-reveal">
        <EditorialLabel text={SERVICES_SECTION.label} className="mb-6" />
      </div>

      <h2
        className="css-reveal font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0 overflow-hidden"
        style={{ fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.15 }}
      >
        {SERVICES_SECTION.heading}
      </h2>

      <div className="services-visual-grid mt-16">
        {SERVICES_SECTION.items.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className="service-block css-reveal no-underline"
            data-cursor="link"
            style={{ background: service.color }}
          >
            <div className="service-block-inner">
              <h3
                className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
                style={{
                  fontSize: "clamp(22px, 2vw, 28px)",
                  viewTransitionName: `service-${service.href.split("/").pop()}`,
                }}
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
