"use client";

import { Link } from "next-view-transitions";
import { getServiceBySlug } from "@/data/services";

export default function ServiceDetailClient({ slug }: { slug: string }) {
  const service = getServiceBySlug(slug);

  if (!service) return null;

  const hasRelatedWork = service.relatedWork.length > 0;

  return (
    <>
      {/* ═══ SECTION 1: HERO ═══ */}
      <section
        className="flex flex-col justify-end px-[var(--page-px)]"
        style={{ minHeight: "100vh", paddingBottom: 100 }}
      >
        <p
          data-hero-label
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-primary)] mb-5"
          style={{ opacity: 0.4 }}
        >
          (Services)
        </p>
        <h1
          data-hero-heading
          className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] overflow-hidden"
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
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-6"
          style={{ opacity: 0.4 }}
        >
          (Deliverables)
        </p>
        <h2
          className="scroll-reveal-up font-[var(--serif)] font-normal text-[color:var(--text-primary)] mb-12"
          style={{
            fontSize: "clamp(28px, 3vw, 32px)",
            lineHeight: 1.2,
            margin: 0,
            marginBottom: 48,
          }}
        >
          What you get.
        </h2>

        <div className="svc-deliverables-list">
          {service.deliverables.map((d) => (
            <div key={d.name} className="svc-deliverable-row scroll-reveal-up">
              <div className="svc-deliverable-name">{d.name}</div>
              <div className="svc-deliverable-desc">{d.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 3: WHY IT MATTERS ═══ */}
      <section
        className="bg-[var(--bg-shift)]"
        style={{ padding: "120px var(--page-px)" }}
      >
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-6"
          style={{ opacity: 0.4 }}
        >
          (Business Impact)
        </p>
        <h2
          className="scroll-reveal-up font-[var(--serif)] font-normal text-[color:var(--text-primary)]"
          style={{
            fontSize: "clamp(28px, 3vw, 32px)",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {service.impact.heading}
        </h2>
        <div className="max-w-[640px] mt-8">
          <p
            className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)]"
            style={{ lineHeight: 1.75, opacity: 0.7 }}
          >
            {service.impact.body}
          </p>
        </div>
      </section>

      {/* ═══ SECTION 4: HOW WE DO IT ═══ */}
      <section style={{ padding: "120px var(--page-px)" }}>
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-6"
          style={{ opacity: 0.4 }}
        >
          (Process)
        </p>
        <h2
          className="scroll-reveal-up font-[var(--serif)] font-normal text-[color:var(--text-primary)] mb-12"
          style={{
            fontSize: "clamp(28px, 3vw, 32px)",
            lineHeight: 1.2,
            margin: 0,
            marginBottom: 48,
          }}
        >
          How we work.
        </h2>

        <div className="svc-process-list">
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
          <p
            className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-10"
            style={{ opacity: 0.4 }}
          >
            (Related Work)
          </p>

          <div className="svc-related-grid">
            {service.relatedWork.slice(0, 2).map((work) => (
              <Link
                key={work.slug}
                href={`/work/${work.slug}`}
                className="svc-related-card"
                data-cursor="expand"
              >
                <div
                  className="svc-related-img"
                  style={{ background: work.gradient }}
                />
                <div className="svc-related-text">
                  <p className="svc-related-label">{work.client}</p>
                  <h3 className="svc-related-title">{work.name}</h3>
                  <p className="svc-related-result">{work.result}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ SECTION 6: CTA ═══ */}
      <section
        style={{
          padding: "120px var(--page-px)",
          background: hasRelatedWork ? undefined : "var(--bg-shift)",
          textAlign: "center",
        }}
      >
        <h2
          className="scroll-reveal-up font-[var(--serif)] font-normal text-[color:var(--text-primary)]"
          style={{ fontSize: "clamp(28px, 4vw, 36px)", lineHeight: 1.1, margin: 0 }}
        >
          Ready to start?
        </h2>
        <p
          className="font-[var(--sans)] text-[15px] text-[color:var(--text-primary)] mt-4"
          style={{ opacity: 0.6 }}
        >
          Book a discovery call. We will scope your project and recommend the right approach.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
          <a href="#" className="contact-submit inline-block" data-cursor="link">
            Book a Discovery Call
          </a>
          <Link
            href="/packages"
            className="inline-block font-[var(--sans)] text-[13px] uppercase tracking-[0.1em] text-[color:var(--text-primary)]"
            style={{ padding: "16px 32px", border: "1px solid rgba(26, 26, 26, 0.2)", textDecoration: "none", transition: "opacity 0.2s ease" }}
            data-cursor="link"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.6"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            View Packages
          </Link>
        </div>
      </section>
    </>
  );
}
