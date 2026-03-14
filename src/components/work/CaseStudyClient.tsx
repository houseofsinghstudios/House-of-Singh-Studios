"use client";

import { Link } from "next-view-transitions";
import type { Project } from "@/data/projects";
import { getNextProject } from "@/data/projects";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

const GALLERY_GRADIENTS = {
  hero: "linear-gradient(155deg, #DDD8D2, #CFC8C0)",
  pair1a: "linear-gradient(155deg, #D8DDE2, #C8CFD4)",
  pair1b: "linear-gradient(155deg, #DDE2D8, #CFD4C8)",
  full1: "linear-gradient(155deg, #E2DDD8, #CFC8C2)",
};

interface CaseStudyClientProps {
  project: Project;
}

export default function CaseStudyClient({ project }: CaseStudyClientProps) {
  const next = getNextProject(project.slug);

  return (
    <div>
      {/* ═══ SECTION 1: PROJECT HEADER ═══ */}
      <section
        className="flex flex-col justify-end px-[var(--page-px)]"
        style={{ minHeight: "100vh", paddingBottom: 80 }}
      >
        <h1
          data-hero-heading
          className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] m-0 overflow-hidden"
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
        className="scroll-clip-reveal"
        style={{
          margin: "0 var(--page-px)",
          aspectRatio: "16/9",
          overflow: "hidden",
        }}
      >
        <div
          className="hero-img-inner"
          style={{
            width: "100%",
            height: "100%",
            background: GALLERY_GRADIENTS.hero,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="editorial-label" style={{ color: "var(--text-muted)" }}>
            Project Image
          </span>
        </div>
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

      {/* ═══ SECTION 4: THE CHALLENGE ═══ */}
      <section
        className="case-content-section css-reveal"
        style={{
          padding: "120px var(--page-px)",
          background: "var(--bg-shift)",
        }}
      >
        <EditorialLabel text={project.sections.challenge.label} className="mb-6" />
        <div className="max-w-[640px]">
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

      {/* ═══ SECTION 6: DELIVERABLES ═══ */}
      <section
        className="case-content-section css-reveal"
        style={{
          padding: "120px var(--page-px)",
          background: "var(--bg-shift)",
        }}
      >
        <EditorialLabel text={project.sections.deliverables.label} className="mb-6" />
        <div
          style={{
            borderLeft: "3px solid var(--border)",
            paddingLeft: 24,
          }}
        >
          {project.deliverablesList.map((item, i) => (
            <p
              key={i}
              className="font-[var(--sans)] text-[15px] text-[color:var(--text-primary)]"
              style={{
                opacity: 0.7,
                lineHeight: 1.5,
                marginBottom:
                  i < project.deliverablesList.length - 1 ? 8 : 0,
              }}
            >
              {item}
            </p>
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
            className="gallery-pair-item"
            style={{
              aspectRatio: "4/3",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: GALLERY_GRADIENTS.pair1a,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="editorial-label" style={{ color: "var(--text-muted)" }}>
                Gallery Image
              </span>
            </div>
          </div>
          <div
            className="gallery-pair-item"
            style={{
              aspectRatio: "4/3",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: GALLERY_GRADIENTS.pair1b,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="editorial-label" style={{ color: "var(--text-muted)" }}>
                Gallery Image
              </span>
            </div>
          </div>
        </div>

        <div
          className="gallery-full"
          style={{
            aspectRatio: "16/9",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: GALLERY_GRADIENTS.full1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="editorial-label" style={{ color: "var(--text-muted)" }}>
              Gallery Image
            </span>
          </div>
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

      {/* ═══ SECTION 10: CTA ═══ */}
      <section
        className="text-center"
        style={{
          padding: "120px var(--page-px)",
          background: "var(--bg-shift)",
        }}
      >
        <h2
          className="scroll-reveal-up font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)]"
          style={{
            fontSize: "clamp(32px, 4.5vw, 60px)",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Start a project.
        </h2>
        <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
          <Button href="/contact" data-cursor="link">
            Book a Discovery Call
          </Button>
          <Button href="/contact" variant="secondary" data-cursor="link">
            Start a Project
          </Button>
        </div>
      </section>
    </div>
  );
}
