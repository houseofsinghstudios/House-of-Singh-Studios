import { Link } from "next-view-transitions";
import { SERVICES_SECTION } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

const NUMBERS = ["01", "02", "03", "04"];

export default function ServicesSection() {
  return (
    <section className="css-reveal services-section-mobile" style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px)" }}>
      <div className="css-reveal">
        <EditorialLabel text="03 — Capabilities" className="mb-6" />
      </div>

      <h2
        className="css-reveal font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] m-0 overflow-hidden mb-16"
        style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.1 }}
      >
        {SERVICES_SECTION.heading}
      </h2>

      <div className="svc-accordion reveal-stagger-parent">
        {SERVICES_SECTION.items.map((service, i) => (
          <Link
            key={service.href}
            href={service.href}
            className="svc-accordion-row"
            data-cursor="view"
          >
            <span className="svc-accordion-num">{NUMBERS[i]}</span>
            <div className="svc-accordion-content">
              <h3
                className="svc-accordion-title"
                style={{
                  viewTransitionName: `service-${service.href.split("/").pop()}`,
                }}
              >
                {service.title}
              </h3>
              <div className="svc-accordion-body">
                <p className="svc-accordion-desc">{service.description}</p>
              </div>
            </div>
            <div className="svc-accordion-arrow-col">
              <svg
                className="svc-accordion-arrow-icon"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="6" y1="26" x2="26" y2="6" />
                <polyline points="16,6 26,6 26,16" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
