"use client";

import { Link } from "next-view-transitions";
import { getServiceBySlug } from "@/data/services";
import Button from "@/components/ui/Button";
import ServiceDeliverableRow from "./ServiceDeliverableRow";
import ServiceDetailAccordion from "./ServiceDetailAccordion";
import ServiceLocalSection from "./ServiceLocalSection";
import RelatedThinking from "./RelatedThinking";
import ProjectCardRow from "@/components/work/ProjectCardRow";
import type { ArticleCard } from "@/lib/sanity/articles";
import NextPageLink from "@/components/layout/NextPageLink";
import type { ServiceProject } from "@/lib/sanity/projects";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { serviceForSiteSlug, startHref } from "@/lib/project-planner/start-links";

const CLIENT_QUALIFIER: Record<string, string> = {
  "brand-identity":
    "This service is for established businesses doing $1M+ in revenue that have outgrown their original branding. Your visual identity is inconsistent across channels. You know you need professional design but you have been burned by agencies before. You value expertise and clarity over flash.",
  "visual-media":
    "This service is for businesses that have a brand identity but no visual content strategy. Your photography is inconsistent, your video content is ad hoc, and your social presence does not match your brand positioning. You need a system, not a one off shoot.",
  "digital-design":
    "This service is for businesses whose website is their highest traffic touchpoint but does not convert like it should. The design feels dated, the content architecture is unclear, and visitors leave without understanding what you do. You need design direction, not just a developer.",
  "creative-strategy":
    "This service is for businesses where the brand problem is actually a strategy problem. Your team makes inconsistent creative decisions because there is no framework. You need positioning clarity, creative direction systems, and operational structure before you need more design.",
};

export default function ServiceDetailClient({
  slug,
  projects,
  articles = [],
}: {
  slug: string;
  // Two or three articles for "Related thinking", chosen in src/lib/linking.ts.
  articles?: ArticleCard[];
  // Sanity case studies that list this service. The section is hidden when there are none.
  projects: ServiceProject[];
}) {
  const service = getServiceBySlug(slug);
  // The planner service to preselect. Visual Media spans photo and video, so it opens with none.
  const planService = slug === "visual-media" ? null : serviceForSiteSlug(slug);

  if (!service) return null;

  const hasRelatedWork = projects.length > 0;
  const qualifierText = CLIENT_QUALIFIER[slug] || "";

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section
        className="svcd-hero"
        style={{ padding: "var(--hero-pt) var(--page-px) clamp(48px, 6vh, 80px)" }}
      >
        <Link href="/services" className="svcd-back css-reveal">
          <span className="svcd-back-arrow">←</span> Services
        </Link>
        <p className="editorial-label css-reveal" style={{ transitionDelay: "0ms", margin: "24px 0 12px" }}>
          (Services)
        </p>
        {/* The page topic is the h1, in the small label style; the large hero line is an h2. */}
        <h1 className="svcd-service-name css-reveal" style={{ transitionDelay: "60ms" }}>
          {service.seoH1}
        </h1>
        <h2
          className="svcd-headline css-reveal"
          style={{
            transitionDelay: "120ms",
            viewTransitionName: `service-${service.slug}`,
          }}
        >
          {service.headline}
        </h2>
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

      {/* ═══ (04) ACROSS THE GTA ═══ */}
      <ServiceLocalSection local={service.localSection} number="04" />
      <RelatedThinking articles={articles} />

      {/* ═══ (05) HOW WE DO IT — Process Accordion ═══ */}
      <section
        style={{ padding: "clamp(48px, 8vw, 96px) var(--page-px)" }}
      >
        <p className="editorial-label css-reveal" style={{ margin: "0 0 16px" }}>
          (05) How we do it
        </p>
        <h2 className="svcd-process-heading css-reveal" style={{ transitionDelay: "80ms" }}>
          Five stages. One system.
        </h2>
        <div className="css-reveal" style={{ transitionDelay: "160ms" }}>
          <ServiceDetailAccordion steps={service.process} />
        </div>
      </section>

      {/* ═══ (06) RELATED WORK ═══ */}
      {hasRelatedWork && (
        <section
          style={{
            background: "var(--bg-shift)",
            padding: "clamp(48px, 8vw, 96px) var(--page-px)",
          }}
        >
          <p className="editorial-label css-reveal" style={{ margin: "0 0 40px" }}>
            (06) Related work
          </p>
          <ProjectCardRow projects={projects} />
        </section>
      )}

      <NextPageLink current={`/services/${slug}`} />

      {/* ═══ CTA — Dark Section ═══ */}
      <section
        className="css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "clamp(80px, 10vw, 120px) var(--page-px)",
        }}
      >
        <div className="cta-centered">
          <p className="cta-label">(Next step)</p>
          <h2 className="cta-heading" style={{ fontSize: "clamp(28px, 3.5vw, 40px)", whiteSpace: "normal" }}>{service.ctaHeading}</h2>
          <p className="cta-sub">
            Book a discovery call. We will scope your project and recommend
            the right approach.
          </p>
          <div className="cta-buttons">
            <Button href={DISCOVERY_CALL_URL} variant="primary-inverted" data-cursor="link" target="_blank" rel="noopener noreferrer">
              Book a Discovery Call
            </Button>
            <Button href={startHref("services", planService)} variant="secondary-inverted" data-cursor="link">
              Plan a {service.name} Project
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
