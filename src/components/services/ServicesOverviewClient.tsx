"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

const serviceBlocks = [
  {
    number: "01",
    title: "Brand Identity and Visual Design",
    description:
      "Your brand identity is the first thing your market judges you on. We build complete visual systems — logo, typography, color architecture, and brand guidelines — that give your business a consistent, professional presence across every touchpoint. The result is a brand that looks as established as your business actually is.",
    deliverables: ["Logo System", "Typography", "Color Architecture", "Brand Guidelines", "Collateral Suite", "Art Direction"],
    href: "/services/brand-identity",
    relatedProject: "TEDxToronto Visual Identity",
    relatedProjectTags: "Brand Identity",
  },
  {
    number: "02",
    title: "Visual Media and Content Production",
    description:
      "Content without a visual strategy is noise. We direct and produce brand photography, campaign films, and social content systems built on strategic intent. Every image and frame reinforces your brand positioning. The output works across channels because it was planned that way from the start.",
    deliverables: ["Brand Photography", "Video Production", "Social Systems", "Art Direction", "Script Development"],
    href: "/services/visual-media",
    relatedProject: "Meridian Financial Group",
    relatedProjectTags: "Brand Identity",
  },
  {
    number: "03",
    title: "Digital Design and Experience",
    description:
      "Your website is your highest-traffic brand touchpoint. We design the visual direction, content architecture, and interface systems that make it work commercially. We lead the design, work with development partners to build it, and ensure every page serves a business purpose — not just an aesthetic one.",
    deliverables: ["Website Design Direction", "Interface Design", "Content Architecture", "Digital Brand Systems", "Ongoing Support"],
    href: "/services/digital-design",
    relatedProject: "Soulbound Publication",
    relatedProjectTags: "Publication Design",
  },
  {
    number: "04",
    title: "Creative Strategy and Systems",
    description:
      "Most brand problems are strategy problems disguised as design problems. We run positioning workshops, build creative direction frameworks, and design content systems that give your team the structure to maintain brand quality without depending on a designer for every decision. For businesses exploring AI in their creative workflow, we provide guidance on tool selection and integration.",
    deliverables: ["Positioning Workshops", "Creative Frameworks", "Content Strategy", "Visual Systems", "AI Workflow Integration"],
    href: "/services/creative-strategy",
    relatedProject: "Nomad Kitchen",
    relatedProjectTags: "Brand Identity · Packaging",
  },
];

export default function ServicesOverviewClient() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  return (
    <>
      {/* ── HERO (~60vh) ── */}
      <section
        className="flex flex-col justify-center px-[var(--page-px)]"
        style={{ minHeight: "60vh", paddingTop: 140 }}
      >
        <EditorialLabel data-hero-label text="Services" />

        <h1
          data-hero-heading
          className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] mt-4 overflow-hidden"
          style={{ fontSize: "clamp(44px, 6vw, 84px)", lineHeight: 1.05 }}
        >
          Every service solves a business problem.
        </h1>

        <p
          data-hero-sub
          className="font-[var(--sans)] font-normal text-[color:var(--text-primary)] max-w-[540px] mt-8"
          style={{ fontSize: "clamp(14px, 1.1vw, 16px)", opacity: 0.5 }}
        >
          Four capabilities. One studio. Every service connects to measurable business outcomes.
        </p>
      </section>

      {/* ── Hero image placeholder ── */}
      <div
        className="css-reveal"
        style={{
          margin: "0 var(--page-px)",
          aspectRatio: "16/9",
          background: "var(--bg-shift)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="editorial-label" style={{ color: "var(--text-muted)" }}>
          Services Overview
        </span>
      </div>

      {/* ── SERVICE BLOCKS (alternating layout) ── */}
      <div style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px) 0" }}>
        {serviceBlocks.map((service, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={service.number}
              className="svc-overview-block css-reveal"
              data-reverse={!isEven ? "true" : undefined}
            >
              {/* Text side */}
              <div className="svc-overview-text">
                <h2
                  className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] overflow-hidden"
                  style={{
                    fontSize: "clamp(28px, 3vw, 40px)",
                    lineHeight: 1.15,
                    marginBottom: 20,
                    viewTransitionName: `service-${service.href.split("/").pop()}`,
                  }}
                >
                  {service.title}
                </h2>

                <p
                  className="font-[var(--sans)] font-normal text-[15px] leading-[1.7] text-[color:var(--text-secondary)]"
                  style={{ marginBottom: 24, maxWidth: 540 }}
                >
                  {service.description}
                </p>

                <p
                  className="font-[var(--sans)] uppercase text-[11px] tracking-[0.08em] text-[color:var(--text-muted)]"
                  style={{ marginBottom: 32 }}
                >
                  {service.deliverables.join(" — ")}
                </p>

                <Link
                  href={service.href}
                  className="arrow-link no-underline"
                  data-cursor="link"
                >
                  <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
                    Learn more <span className="arrow-icon">&rarr;</span>
                  </span>
                </Link>
              </div>

              {/* Image side */}
              <div className="svc-overview-image-wrap">
                <div
                  className="svc-overview-image"
                  style={{
                    background: "var(--bg-shift)",
                    aspectRatio: "4/3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="editorial-label" style={{ color: "var(--text-muted)" }}>
                    Featured Project
                  </span>
                </div>
                <div style={{ marginTop: 12 }}>
                  <p
                    className="font-[var(--sans)] font-medium text-[14px] text-[color:var(--text-primary)] m-0"
                  >
                    {service.relatedProject}
                  </p>
                  <p
                    className="font-[var(--sans)] text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-muted)] m-0 mt-1"
                  >
                    {service.relatedProjectTags}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SERVICES UNPACKED ACCORDION ── */}
      <section
        className="css-reveal"
        style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px)" }}
      >
        <EditorialLabel text="Services Unpacked" className="mb-6" />
        <h2
          className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] overflow-hidden mb-12"
          style={{ fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.15 }}
        >
          Detailed capabilities.
        </h2>

        <div className="svc-unpacked-accordion">
          {serviceBlocks.map((service, i) => {
            const isOpen = openAccordion === i;
            return (
              <div key={service.number} className="svc-unpacked-row">
                <button
                  className="svc-unpacked-header"
                  onClick={() => setOpenAccordion(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="svc-unpacked-title">{service.title}</span>
                  <span
                    className="svc-unpacked-toggle"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="svc-unpacked-body"
                  style={{
                    maxHeight: isOpen ? 400 : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="svc-unpacked-items">
                    {service.deliverables.map((d) => (
                      <span key={d} className="svc-unpacked-item">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── DARK CTA ── */}
      <section
        className="css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "120px var(--page-px)",
        }}
      >
        <div className="cta-dark-grid">
          <div>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                opacity: 0.4,
                marginBottom: 24,
              }}
            >
              (Next Step)
            </p>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 500,
                fontSize: "clamp(48px, 6vw, 80px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--bg)",
                margin: 0,
              }}
            >
              Not sure where to start?
            </h2>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 16,
                lineHeight: 1.6,
                opacity: 0.5,
                marginTop: 20,
              }}
            >
              Book a discovery call. We will help you identify which service fits your business.
            </p>
          </div>

          <div className="cta-dark-buttons">
            <Button href="/contact" variant="primary-inverted" data-cursor="link">
              Book a Discovery Call
            </Button>
            <Button href="/contact" variant="secondary-inverted" data-cursor="link">
              Start a Project
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
