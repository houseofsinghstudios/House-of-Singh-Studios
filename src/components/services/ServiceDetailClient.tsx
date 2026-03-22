"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { getServiceBySlug } from "@/data/services";
import Button from "@/components/ui/Button";

export default function ServiceDetailClient({ slug }: { slug: string }) {
  const service = getServiceBySlug(slug);

  if (!service) return null;

  const hasRelatedWork = service.relatedWork.length > 0;

  return (
    <>
      {/* ═══ SECTION 1: HERO ═══ */}
      <section
        className="css-reveal"
        style={{
          padding: "140px var(--page-px) clamp(48px, 6vw, 80px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            margin: "0 0 24px",
          }}
        >
          (Services)
        </p>
        <p
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
            margin: "0 0 16px",
          }}
        >
          {service.subtitle}
        </p>
        <h1
          className="font-[var(--sans)]"
          style={{
            fontSize: "clamp(28px, 4.5vw, 48px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--text-primary)",
            margin: "0 0 20px",
            maxWidth: 700,
            viewTransitionName: `service-${service.slug}`,
          }}
        >
          {service.headline}
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            maxWidth: 500,
            margin: 0,
          }}
        >
          {service.description}
        </p>
      </section>

      {/* ═══ SECTION 2: DELIVERABLES ═══ */}
      <section style={{ padding: "clamp(48px, 6vw, 80px) var(--page-px)" }}>
        <div
          className="css-reveal"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 40,
          }}
        >
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            (What you get)
          </p>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            {String(service.deliverables.length).padStart(2, "0")} deliverables
          </p>
        </div>

        <div className="svc-deliverables-list reveal-stagger-parent">
          {service.deliverables.map((d) => (
            <div key={d.name} className="svc-deliverable-row css-reveal">
              <div className="svc-deliverable-name">{d.name}</div>
              <div className="svc-deliverable-desc">{d.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 3: BUSINESS IMPACT (full-bleed bg-shift) ═══ */}
      <section
        className="css-reveal"
        style={{
          background: "var(--bg-shift)",
          padding: "clamp(48px, 8vw, 96px) var(--page-px)",
        }}
      >
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            margin: "0 0 32px",
          }}
        >
          (Why it matters)
        </p>
        <div className="svc-impact-grid">
          <div>
            <h2
              className="font-[var(--sans)]"
              style={{
                fontSize: "clamp(22px, 3vw, 36px)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {service.impact.heading}
            </h2>
          </div>
          <div>
            <p
              style={{
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {service.impact.body}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: PROCESS (5-column grid) ═══ */}
      <section style={{ padding: "clamp(48px, 6vw, 80px) var(--page-px)" }}>
        <div className="svc-process-grid css-reveal">
          {service.process.map((step) => (
            <div key={step.step} className="svc-process-step">
              <p className="svc-process-step-num">{step.step}</p>
              <p className="svc-process-step-name">{step.name}</p>
              <p className="svc-process-step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 5: RELATED WORK ═══ */}
      {hasRelatedWork && (
        <section
          style={{
            background: "var(--bg-shift)",
            padding: "clamp(48px, 6vw, 80px) var(--page-px)",
          }}
        >
          <p
            className="css-reveal"
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
              margin: "0 0 40px",
            }}
          >
            (Related work)
          </p>

          <div className="svc-related-grid">
            {service.relatedWork.slice(0, 2).map((work) => (
              <Link
                key={work.slug}
                href={`/work/${work.slug}`}
                className="svc-related-card css-reveal"
                data-cursor="view"
              >
                <div
                  className="svc-related-img"
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
                  <h3 className="svc-related-title font-[var(--sans)] font-medium">
                    {work.name}
                  </h3>
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
              {service.ctaHeading}
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
              Book a discovery call. We will scope your project and recommend
              the right approach.
            </p>
          </div>

          <div className="cta-dark-buttons">
            <Button
              href="/contact"
              variant="primary-inverted"
              data-cursor="link"
            >
              Book a Discovery Call
            </Button>
            <Button
              href="/packages"
              variant="secondary-inverted"
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
