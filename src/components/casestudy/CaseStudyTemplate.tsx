import { Link } from "next-view-transitions";
import Image from "next/image";
import type { ProjectDetail } from "@/data/projectDetails";
import Button from "@/components/ui/Button";
import OverviewMeta from "./OverviewMeta";
import DeliverableGrid from "./DeliverableGrid";
import ImageGallery from "./ImageGallery";
import NextProject from "./NextProject";
import NextPageLink from "@/components/layout/NextPageLink";

export default function CaseStudyTemplate({
  project,
}: {
  project: ProjectDetail;
}) {
  const metaItems = [
    { label: "Client", value: project.name },
    { label: "Service", value: project.category },
    { label: "Year", value: project.year },
  ];
  if (project.timeline) {
    metaItems.push({ label: "Timeline", value: project.timeline });
  }

  const metaLine = [
    project.category,
    project.year,
    project.industry,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      {/* ═══ SECTION 1: HERO ═══ */}
      <section
        className="cs-hero"
        style={{
          padding:
            "var(--hero-pt) var(--page-px) clamp(48px, 6vh, 64px)",
        }}
      >
        <Link href="/work" className="cs-back css-reveal">
          <span className="cs-back-arrow">←</span> All Projects
        </Link>
        <p
          className="cs-hero-meta css-reveal"
          style={{ transitionDelay: "80ms" }}
        >
          {metaLine}
        </p>
        <h1
          className="cs-hero-heading css-reveal"
          style={{
            transitionDelay: "160ms",
            viewTransitionName: `project-${project.slug}`,
          }}
        >
          {project.name}
        </h1>
        <p
          className="cs-hero-summary css-reveal"
          style={{ transitionDelay: "240ms" }}
        >
          {project.summary}
        </p>
      </section>

      {/* ═══ SECTION 2: HERO IMAGE ═══ */}
      <div
        className="cs-hero-image reveal-clip cs-hero-image-reveal"
        style={{ viewTransitionName: `project-image-${project.slug}` }}
      >
        <Image
          src={project.heroImage.src}
          alt={project.heroImage.alt}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* ═══ SECTION 3: OVERVIEW ═══ */}
      <section
        style={{
          padding: "clamp(64px, 8vw, 120px) var(--page-px)",
        }}
      >
        <div className="cs-overview-grid">
          <div className="cs-overview-left">
            <p className="editorial-label css-reveal" style={{ margin: "0 0 16px" }}>
              (01) Overview
            </p>
            <OverviewMeta items={metaItems} />
          </div>
          <div className="cs-overview-right">
            <h2
              className="cs-section-heading css-reveal"
            >
              {project.overview.heading}
            </h2>
            {project.overview.paragraphs.map((p, i) => (
              <p
                key={i}
                className="cs-body-text css-reveal"
                style={{ transitionDelay: `${(i + 1) * 80}ms` }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: CHALLENGE + APPROACH ═══ */}
      <section
        style={{
          background: "var(--bg-shift)",
          padding: "clamp(64px, 8vw, 120px) var(--page-px)",
        }}
      >
        <div className="cs-challenge-grid">
          <div className="cs-challenge-col">
            <p className="editorial-label css-reveal" style={{ margin: "0 0 16px" }}>
              (02) The Challenge
            </p>
            <h2 className="cs-section-heading css-reveal">
              {project.challenge.heading}
            </h2>
            {project.challenge.paragraphs.map((p, i) => (
              <p key={i} className="cs-body-text css-reveal">
                {p}
              </p>
            ))}
          </div>
          <div className="cs-challenge-divider" />
          <div className="cs-approach-col">
            <p className="editorial-label css-reveal" style={{ margin: "0 0 16px" }}>
              (03) Our Approach
            </p>
            <h2 className="cs-section-heading css-reveal">
              {project.approach.heading}
            </h2>
            {project.approach.paragraphs.map((p, i) => (
              <p key={i} className="cs-body-text css-reveal">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: IMAGE GALLERY — SET 1 ═══ */}
      <ImageGallery images={project.images.set1} />

      {/* ═══ SECTION 6: DELIVERABLES ═══ */}
      <section
        style={{
          padding: "clamp(64px, 8vw, 120px) var(--page-px)",
        }}
      >
        <p className="editorial-label css-reveal" style={{ margin: "0 0 12px" }}>
          (04) What we delivered
        </p>
        <h2
          className="cs-section-heading css-reveal"
          style={{ marginBottom: 32 }}
        >
          Deliverables
        </h2>
        <DeliverableGrid deliverables={project.deliverables} />
      </section>

      {/* ═══ SECTION 7: IMAGE GALLERY — SET 2 ═══ */}
      {project.images.set2 && project.images.set2.length > 0 && (
        <ImageGallery images={project.images.set2} />
      )}

      {/* ═══ SECTION 8: RESULT ═══ */}
      <section
        style={{
          background: "var(--bg-shift)",
          padding: "clamp(64px, 8vw, 120px) var(--page-px)",
        }}
      >
        <p className="editorial-label css-reveal" style={{ margin: "0 0 16px" }}>
          (05) The Result
        </p>
        <div className="cs-result-grid">
          <div className="cs-result-left">
            <h2 className="cs-section-heading css-reveal">
              {project.result.heading}
            </h2>
            {project.result.paragraphs.map((p, i) => (
              <p key={i} className="cs-body-text css-reveal">
                {p}
              </p>
            ))}
          </div>
          {project.result.stats && project.result.stats.length > 0 && (
            <div className="cs-result-right">
              {project.result.stats.map((stat, i) => (
                <div
                  key={i}
                  className="cs-stat css-reveal"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <span className="cs-stat-value">{stat.value}</span>
                  <span className="cs-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ SECTION 9: NEXT PROJECT + DARK CTA ═══ */}
      <section style={{ padding: "0 var(--page-px)" }}>
        <NextProject
          slug={project.nextProject.slug}
          name={project.nextProject.name}
        />
      </section>

      <NextPageLink />

      <section
        className="css-reveal"
        style={{
          background: "var(--text-secondary)",
          color: "var(--bg)",
          padding: "clamp(80px, 10vw, 120px) var(--page-px)",
        }}
      >
        <div className="cs-cta-grid">
          <div>
            <p className="cs-cta-label">(Next step)</p>
            <h2 className="cs-cta-heading">Start a project.</h2>
          </div>
          <div className="cs-cta-buttons">
            <Button
              href="https://cal.com/houseofsinghstudios/hr"
              variant="primary-inverted"
              data-cursor="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Discovery Call
            </Button>
            <Button
              href="/contact"
              variant="text"
              className="cs-cta-text-btn"
              data-cursor="link"
            >
              Start a Project
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
