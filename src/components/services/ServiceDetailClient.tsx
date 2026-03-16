"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { getServiceBySlug } from "@/data/services";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function ServiceDetailClient({ slug }: { slug: string }) {
  const service = getServiceBySlug(slug);

  if (!service) return null;

  const hasRelatedWork = service.relatedWork.length > 0;

  return (
    <>
      {/* ═══ SECTION 1: HERO (~50vh) ═══ */}
      <section
        className="flex flex-col justify-end px-[var(--page-px)]"
        style={{ minHeight: "50vh", paddingBottom: 80, paddingTop: 140 }}
      >
        <EditorialLabel data-hero-label text="Services" className="mb-5" />
        <h1
          data-hero-heading
          className="reveal-text font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] overflow-hidden"
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.1,
            margin: 0,
            maxWidth: 900,
            viewTransitionName: `service-${service.slug}`,
          }}
        >
          {service.name}
        </h1>
        <p
          data-desc
          className="font-[var(--sans)] font-normal text-[color:var(--text-primary)] max-w-[640px] mt-6"
          style={{ fontSize: 16, lineHeight: 1.75, opacity: 0.7 }}
        >
          {service.tagline}
        </p>
      </section>

      {/* ═══ SECTION 2: WHAT YOU GET ═══ */}
      <section style={{ padding: "120px var(--page-px)" }}>
        <EditorialLabel text="Deliverables" className="mb-6" />
        <h2
          className="scroll-reveal-up font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)]"
          style={{
            fontSize: "clamp(28px, 3vw, 32px)",
            lineHeight: 1.2,
            margin: 0,
            marginBottom: 48,
          }}
        >
          What you get.
        </h2>

        <div className="svc-deliverables-list reveal-stagger-parent">
          {service.deliverables.map((d) => (
            <div key={d.name} className="svc-deliverable-row scroll-reveal-up">
              <div className="svc-deliverable-name">{d.name}</div>
              <div className="svc-deliverable-desc">{d.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 3: BUSINESS IMPACT (asymmetric two-column) ═══ */}
      <section
        className="bg-[var(--bg-shift)]"
        style={{ padding: "120px var(--page-px)" }}
      >
        <EditorialLabel text="Business Impact" className="mb-6" />
        <div className="svc-impact-grid">
          <div>
            <h2
              className="scroll-reveal-up font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)]"
              style={{
                fontSize: "clamp(28px, 3vw, 32px)",
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {service.impact.heading}
            </h2>
          </div>
          <div>
            <p
              className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)]"
              style={{ lineHeight: 1.75, opacity: 0.7 }}
            >
              {service.impact.body}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: HOW WE DO IT ═══ */}
      <section style={{ padding: "120px var(--page-px)" }}>
        <EditorialLabel text="Process" className="mb-6" />
        <h2
          className="scroll-reveal-up font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)]"
          style={{
            fontSize: "clamp(28px, 3vw, 32px)",
            lineHeight: 1.2,
            margin: 0,
            marginBottom: 48,
          }}
        >
          How we work.
        </h2>

        <div className="svc-process-list reveal-stagger-parent">
          {service.process.map((step) => (
            <div
              key={step.step}
              className="svc-process-row scroll-reveal-up"
            >
              <div className="svc-process-name">{step.name}</div>
              <div className="svc-process-desc">{step.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 5: RELATED WORK ═══ */}
      {hasRelatedWork && (
        <section
          className="bg-[var(--bg-shift)]"
          style={{ padding: "120px var(--page-px)" }}
        >
          <EditorialLabel text="Related Work" className="mb-10" />

          <div className="svc-related-grid">
            {service.relatedWork.slice(0, 2).map((work) => (
              <Link
                key={work.slug}
                href={`/work/${work.slug}`}
                className="svc-related-card"
                data-cursor="expand"
              >
                <div
                  className="svc-related-img reveal-clip"
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  <Image
                    src={work.image}
                    alt={work.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="svc-related-text">
                  <p className="svc-related-label">{work.client}</p>
                  <h3 className="svc-related-title font-[var(--sans)] font-medium">{work.name}</h3>
                  <p className="svc-related-result">{work.result}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ SECTION 6: DARK CTA ═══ */}
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
              Ready to start?
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
              Book a discovery call. We will scope your project and recommend the right approach.
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
