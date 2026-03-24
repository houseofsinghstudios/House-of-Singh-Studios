"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { getServiceBySlug } from "@/data/services";
import Button from "@/components/ui/Button";
import ServiceDeliverableRow from "./ServiceDeliverableRow";
import ServiceDetailAccordion from "./ServiceDetailAccordion";

const CLIENT_QUALIFIER: Record<string, string> = {
  "brand-identity":
    "This service is for established businesses doing $1M+ in revenue that have outgrown their original branding. Your visual identity is inconsistent across channels. You know you need professional design but you have been burned by agencies before. You value expertise and clarity over flash.",
  "visual-media":
    "This service is for businesses that have a brand identity but no visual content strategy. Your photography is inconsistent, your video content is ad-hoc, and your social presence does not match your brand positioning. You need a system, not a one-off shoot.",
  "digital-design":
    "This service is for businesses whose website is their highest-traffic touchpoint but does not convert like it should. The design feels dated, the content architecture is unclear, and visitors leave without understanding what you do. You need design direction, not just a developer.",
  "creative-strategy":
    "This service is for businesses where the brand problem is actually a strategy problem. Your team makes inconsistent creative decisions because there is no framework. You need positioning clarity, creative direction systems, and operational structure before you need more design.",
};

export default function ServiceDetailClient({ slug }: { slug: string }) {
  const service = getServiceBySlug(slug);

  if (!service) return null;

  const hasRelatedWork = service.relatedWork.length > 0;
  const qualifierText = CLIENT_QUALIFIER[slug] || "";

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section
        className="svcd-hero"
        style={{ padding: "clamp(120px, 15vh, 180px) var(--page-px) clamp(48px, 6vh, 80px)" }}
      >
        <Link href="/services" className="svcd-back css-reveal">
          <span className="svcd-back-arrow">←</span> Services
        </Link>
        <p className="editorial-label css-reveal" style={{ transitionDelay: "0ms", margin: "24px 0 12px" }}>
          (Services)
        </p>
        <p className="svcd-service-name css-reveal" style={{ transitionDelay: "60ms" }}>
          {service.subtitle}
        </p>
        <h1
          className="svcd-headline css-reveal"
          style={{
            transitionDelay: "120ms",
            viewTransitionName: `service-${service.slug}`,
          }}
        >
          {service.headline}
        </h1>
        <p className="svcd-hero-body css-reveal" style={{ transitionDelay: "200ms" }}>
          {service.description}
        </p>
      </section>

      {/* ═══ (01) WHAT YOU GET — Deliverables ═══ */}
      <section
        className="svcd-deliverables"
        style={{
          background: "var(--bg-shift)",
          padding: "clamp(48px, 8vw, 96px) var(--page-px)",
        }}
      >
        <div className="svcd-del-header css-reveal">
          <p className="editorial-label" style={{ margin: 0 }}>
            (01) What you get
          </p>
          <span className="svcd-del-badge">
            {String(service.deliverables.length).padStart(2, "0")} deliverables
          </span>
        </div>
        <div className="svcd-del-grid">
          <div className="svcd-del-list">
            {service.deliverables.map((d, i) => (
              <div key={d.name} className="css-reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <ServiceDeliverableRow
                  number={String(i + 1).padStart(2, "0")}
                  name={d.name}
                  description={d.description}
                />
              </div>
            ))}
          </div>
          <div className="svcd-del-spacer" />
        </div>
      </section>

      {/* ═══ (02) WHY IT MATTERS — Business Impact ═══ */}
      <section
        style={{ padding: "clamp(48px, 8vw, 96px) var(--page-px)" }}
      >
        <div className="svcd-impact-grid">
          <div className="svcd-impact-left css-reveal">
            <p className="editorial-label" style={{ margin: "0 0 32px" }}>
              (02) Why it matters
            </p>
          </div>
          <div className="svcd-impact-right css-reveal" style={{ transitionDelay: "120ms" }}>
            <h2 className="svcd-impact-heading">{service.impact.heading}</h2>
            <p className="svcd-impact-body">{service.impact.body}</p>
          </div>
        </div>
      </section>

      {/* ═══ (03) WHO THIS IS FOR — Client Qualifier ═══ */}
      <section
        className="svcd-qualifier"
        style={{
          background: "var(--bg-shift)",
          padding: "clamp(48px, 8vw, 96px) var(--page-px)",
        }}
      >
        <div className="svcd-qualifier-inner">
          <h2 className="svcd-qualifier-heading css-reveal">
            Is this for you?
          </h2>
          <p className="svcd-qualifier-body css-reveal" style={{ transitionDelay: "100ms" }}>
            {qualifierText}
          </p>
        </div>
      </section>

      {/* ═══ (04) HOW WE DO IT — Process Accordion ═══ */}
      <section
        style={{ padding: "clamp(48px, 8vw, 96px) var(--page-px)" }}
      >
        <p className="editorial-label css-reveal" style={{ margin: "0 0 16px" }}>
          (04) How we do it
        </p>
        <h2 className="svcd-process-heading css-reveal" style={{ transitionDelay: "80ms" }}>
          Five stages. One system.
        </h2>
        <div className="css-reveal" style={{ transitionDelay: "160ms" }}>
          <ServiceDetailAccordion steps={service.process} />
        </div>
      </section>

      {/* ═══ (05) RELATED WORK ═══ */}
      {hasRelatedWork && (
        <section
          style={{
            background: "var(--bg-shift)",
            padding: "clamp(48px, 8vw, 96px) var(--page-px)",
          }}
        >
          <p className="editorial-label css-reveal" style={{ margin: "0 0 40px" }}>
            (05) Related work
          </p>
          <div className="svcd-work-grid">
            {service.relatedWork.slice(0, 2).map((work, i) => (
              <Link
                key={work.slug}
                href={`/work/${work.slug}`}
                className="svcd-work-card css-reveal"
                data-cursor="view"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="svcd-work-img reveal-clip">
                  <Image
                    src={work.image}
                    alt={work.name}
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <p className="svcd-work-name">{work.name}</p>
                <p className="svcd-work-cat">{work.client}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ CTA — Dark Section ═══ */}
      <section
        className="css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "clamp(80px, 10vw, 120px) var(--page-px)",
        }}
      >
        <div className="svcd-cta-grid">
          <div>
            <p className="svcd-cta-label">(Next step)</p>
            <h2 className="svcd-cta-heading">{service.ctaHeading}</h2>
            <p className="svcd-cta-sub">
              Book a discovery call. We will scope your project and recommend
              the right approach.
            </p>
          </div>
          <div className="svcd-cta-buttons">
            <Button
              href="/contact"
              variant="primary-inverted"
              data-cursor="link"
            >
              Book a Discovery Call
            </Button>
            <Button
              href="/packages"
              variant="text"
              className="svcd-cta-text-btn"
              data-cursor="link"
            >
              View Packages
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
