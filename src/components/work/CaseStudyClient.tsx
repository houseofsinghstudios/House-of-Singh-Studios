"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { getNextProject } from "@/data/projects";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

interface CaseStudyClientProps {
  project: Project;
}

export default function CaseStudyClient({ project }: CaseStudyClientProps) {
  const next = getNextProject(project.slug);

  return (
    <div>
      {/* ═══ SECTION 1: PROJECT HEADER (~50vh) ═══ */}
      <section
        className="flex flex-col justify-end px-[var(--page-px)]"
        style={{ minHeight: "50vh", paddingBottom: 80, paddingTop: 140 }}
      >
        <h1
          data-hero-heading
          className="reveal-text font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] m-0 overflow-hidden"
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.1,
            viewTransitionName: `project-${project.slug}`,
          }}
        >
          {project.name}
        </h1>
        <p
          data-hero-label
          className="font-[var(--sans)] text-[12px] uppercase tracking-[0.1em] text-[color:var(--text-primary)] mt-4"
          style={{ opacity: 0.35 }}
        >
          {project.workType} &mdash; {project.origin}
        </p>
        <p
          data-hero-sub
          className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)] max-w-[640px] mt-4"
          style={{ opacity: 0.6, lineHeight: 1.75 }}
        >
          {project.description}
        </p>
      </section>

      {/* ═══ SECTION 2: HERO IMAGE ═══ */}
      <div
        className="scroll-clip-reveal reveal-clip"
        style={{
          margin: "0 var(--page-px)",
          aspectRatio: "16/9",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="100vw"
          className="hero-img-inner"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* ═══ SECTION 3: THE BUSINESS ═══ */}
      <section
        className="case-content-section css-reveal"
        style={{ padding: "120px var(--page-px)" }}
      >
        <EditorialLabel text={project.sections.business.label} className="mb-6" />
        <div className="max-w-[640px]">
          {project.sections.business.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)]"
              style={{
                lineHeight: 1.75,
                opacity: 0.7,
                marginBottom:
                  i < project.sections.business.paragraphs.length - 1
                    ? 24
                    : 0,
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 4: THE CHALLENGE (two-column) ═══ */}
      <section
        className="case-content-section css-reveal"
        style={{
          padding: "120px var(--page-px)",
          background: "var(--bg-shift)",
        }}
      >
        <EditorialLabel text={project.sections.challenge.label} className="mb-6" />
        <div className="case-challenge-grid">
          <div>
            {project.sections.challenge.paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)]"
                style={{
                  lineHeight: 1.75,
                  opacity: 0.7,
                  marginBottom:
                    i < project.sections.challenge.paragraphs.length - 1
                      ? 24
                      : 0,
                }}
              >
                {p}
              </p>
            ))}
          </div>
          <div className="case-challenge-highlight">
            <p
              className="font-[var(--sans)] font-medium text-[color:var(--text-primary)]"
              style={{
                fontSize: "clamp(20px, 2vw, 28px)",
                lineHeight: 1.4,
                opacity: 0.5,
              }}
            >
              {project.sections.challenge.paragraphs[0]?.split(".")[0]}.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: THE APPROACH ═══ */}
      <section
        className="case-content-section css-reveal"
        style={{ padding: "120px var(--page-px)" }}
      >
        <EditorialLabel text={project.sections.approach.label} className="mb-6" />
        <div className="max-w-[640px]">
          {project.sections.approach.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)]"
              style={{
                lineHeight: 1.75,
                opacity: 0.7,
                marginBottom:
                  i < project.sections.approach.paragraphs.length - 1
                    ? 24
                    : 0,
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 6: DELIVERABLES (two-column grid) ═══ */}
      <section
        className="case-content-section css-reveal"
        style={{
          padding: "120px var(--page-px)",
          background: "var(--bg-shift)",
        }}
      >
        <EditorialLabel text={project.sections.deliverables.label} className="mb-6" />
        <div className="case-deliverables-grid reveal-stagger-parent">
          {project.deliverablesList.map((item, i) => (
            <div key={i} className="case-deliverable-item">
              <span
                className="font-[var(--sans)] text-[12px] text-[color:var(--text-muted)]"
                style={{ marginRight: 12 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="font-[var(--sans)] text-[15px] text-[color:var(--text-primary)]"
                style={{ opacity: 0.7 }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 7: THE RESULT ═══ */}
      <section
        className="case-content-section css-reveal"
        style={{ padding: "120px var(--page-px)" }}
      >
        <EditorialLabel text={project.sections.result.label} className="mb-6" />
        <div className="max-w-[640px]">
          {project.sections.result.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)]"
              style={{
                lineHeight: 1.75,
                opacity: 0.7,
                marginBottom:
                  i < project.sections.result.paragraphs.length - 1
                    ? 24
                    : 0,
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 8: IMAGE GALLERY ═══ */}
      <div
        style={{
          padding: "0 var(--page-px)",
          display: "grid",
          gap: 24,
        }}
      >
        <div
          className="gallery-pair-container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <div
            className="gallery-pair-item reveal-clip"
            style={{ aspectRatio: "4/3", overflow: "hidden", position: "relative" }}
          >
            <Image
              src={project.image}
              alt={`${project.name} gallery`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div
            className="gallery-pair-item reveal-clip"
            style={{ aspectRatio: "4/3", overflow: "hidden", position: "relative" }}
          >
            <Image
              src={project.image}
              alt={`${project.name} gallery`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        <div
          className="gallery-full reveal-clip"
          style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}
        >
          <Image
            src={project.image}
            alt={`${project.name} gallery`}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      {/* ═══ SECTION 9: NEXT PROJECT ═══ */}
      <section
        className="text-center"
        style={{
          padding: "120px var(--page-px)",
          borderTop: "1px solid var(--border)",
          marginTop: 80,
        }}
      >
        <EditorialLabel text="Next Project" className="mb-6" />
        <Link
          href={`/work/${next.slug}`}
          className="next-project-link no-underline inline-block"
          data-cursor="expand"
        >
          <h2
            className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] m-0"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              transition: "letter-spacing 0.5s ease",
            }}
          >
            {next.name} &rarr;
          </h2>
        </Link>
      </section>

      {/* ═══ SECTION 10: DARK CTA ═══ */}
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
              Start a project.
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
              We respond within 24 hours.
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
    </div>
  );
}
