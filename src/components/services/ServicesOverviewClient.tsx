"use client";

import { Link } from "next-view-transitions";
import Button from "@/components/ui/Button";

const serviceBlocks = [
  {
    number: "01",
    title: "Brand Identity and Visual Design",
    description:
      "Your brand identity is the first thing your market judges you on. We build complete visual systems — logo, typography, color architecture, and brand guidelines — that give your business a consistent, professional presence across every touchpoint. The result is a brand that looks as established as your business actually is.",
    deliverables: ["Logo System", "Typography", "Color Architecture", "Brand Guidelines", "Collateral Suite", "Art Direction"],
    href: "/services/brand-identity",
    color: "#E8E5E0",
  },
  {
    number: "02",
    title: "Visual Media and Content Production",
    description:
      "Content without a visual strategy is noise. We direct and produce brand photography, campaign films, and social content systems built on strategic intent. Every image and frame reinforces your brand positioning. The output works across channels because it was planned that way from the start.",
    deliverables: ["Brand Photography", "Video Production", "Social Systems", "Art Direction", "Script Development"],
    href: "/services/visual-media",
    color: "#E0E5E8",
  },
  {
    number: "03",
    title: "Digital Design and Experience",
    description:
      "Your website is your highest-traffic brand touchpoint. We design the visual direction, content architecture, and interface systems that make it work commercially. We lead the design, work with development partners to build it, and ensure every page serves a business purpose — not just an aesthetic one.",
    deliverables: ["Website Design Direction", "Interface Design", "Content Architecture", "Digital Brand Systems", "Ongoing Support"],
    href: "/services/digital-design",
    color: "#E5E8E0",
  },
  {
    number: "04",
    title: "Creative Strategy and Systems",
    description:
      "Most brand problems are strategy problems disguised as design problems. We run positioning workshops, build creative direction frameworks, and design content systems that give your team the structure to maintain brand quality without depending on a designer for every decision. For businesses exploring AI in their creative workflow, we provide guidance on tool selection and integration.",
    deliverables: ["Positioning Workshops", "Creative Frameworks", "Content Strategy", "Visual Systems", "AI Workflow Integration"],
    href: "/services/creative-strategy",
    color: "#E8E0E5",
  },
];

export default function ServicesOverviewClient() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="flex flex-col justify-center px-[var(--page-px)]"
        style={{ minHeight: "100vh" }}
      >
        <p
          data-hero-label
          className="font-[var(--sans)] text-xs uppercase tracking-[0.15em] text-[color:var(--text-primary)]"
          style={{ opacity: 0.5 }}
        >
          (Services)
        </p>

        <h1
          data-hero-heading
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] mt-4 overflow-hidden"
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

      {/* ── SERVICE BLOCKS ── */}
      <div className="px-[var(--page-px)]">
        {serviceBlocks.map((service) => (
          <Link
            key={service.number}
            href={service.href}
            className="service-block css-reveal"
            data-cursor="expand"
          >
            <div className="service-block-content">
              <span className="service-block-number font-[var(--serif)] font-semibold">
                {service.number}
              </span>

              <h2
                className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] overflow-hidden"
                style={{ fontSize: "clamp(28px, 3vw, 36px)", lineHeight: 1.15, marginBottom: 20 }}
              >
                {service.title}
              </h2>

              <p
                className="font-[var(--sans)] font-normal text-[15px] leading-[1.7] max-w-[540px]"
                style={{ color: "rgba(26, 26, 26, 0.7)", marginBottom: 24 }}
              >
                {service.description}
              </p>

              <p
                className="font-[var(--sans)] uppercase text-[12px] tracking-[0.05em]"
                style={{ color: "rgba(26, 26, 26, 0.4)" }}
              >
                {service.deliverables.join(" · ")}
              </p>

              <span
                className="inline-flex items-center gap-2 mt-8 font-[var(--sans)] font-medium text-[13px] uppercase tracking-[0.1em] text-[color:var(--text-primary)] no-underline"
              >
                Learn More
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            </div>

            <div
              className="service-block-color"
              style={{ background: service.color }}
            />
          </Link>
        ))}
      </div>

      {/* ── CTA ── */}
      <section
        className="css-reveal text-center"
        style={{ padding: "160px var(--page-px)" }}
      >
        <h2
          className="css-reveal font-[var(--serif)] font-semibold text-[color:var(--text-primary)] overflow-hidden"
          style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.1 }}
        >
          Not sure where to start?
        </h2>
        <p
          className="css-reveal font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-primary)] max-w-[480px] mx-auto"
          style={{ margin: "24px auto 40px", opacity: 0.7 }}
        >
          Book a discovery call. We will help you identify which service fits your business.
        </p>
        <div className="css-reveal flex flex-wrap justify-center gap-3">
          <Button href="#" data-cursor="link">
            Book a Discovery Call
          </Button>
          <Button href="/packages" variant="secondary" data-cursor="link">
            View Packages
          </Button>
        </div>
      </section>
    </>
  );
}
