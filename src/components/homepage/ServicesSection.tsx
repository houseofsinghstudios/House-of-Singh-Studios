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
            <div className="svc-accordion-header">
              <h3
                className="svc-accordion-title"
                style={{
                  viewTransitionName: `service-${service.href.split("/").pop()}`,
                }}
              >
                {service.title}
              </h3>
              <span className="svc-accordion-num">{NUMBERS[i]}</span>
            </div>
            <div className="svc-accordion-body">
              <p className="svc-accordion-desc">{service.sentence}</p>
              <span className="svc-accordion-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
