"use client";

import { useState, useMemo, useCallback } from "react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { projects, getWorkTypeFilters } from "@/data/projects";
import Button from "@/components/ui/Button";

const PROJECT_IMAGES: Record<string, string> = {
  tedxtoronto: "/images/projects/tedxtoronto/tedxtoronto.jpg",
  meridian: "/images/projects/meridian/meridian.jpg",
  soulbound: "/images/projects/soulbound/soulbound.jpg",
  "nomad-kitchen": "/images/projects/nomad-kitchen/nomad-kitchen.jpg",
};

type ViewMode = "list" | "grid";

export default function WorkPageClient() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [viewTransition, setViewTransition] = useState(false);

  const filterCategories = useMemo(
    () => ["All", ...getWorkTypeFilters()],
    []
  );

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) =>
      p.workType
        .split(",")
        .map((t) => t.trim())
        .includes(activeFilter)
    );
  }, [activeFilter]);

  const switchView = useCallback(
    (mode: ViewMode) => {
      if (mode === viewMode) return;
      setViewTransition(true);
      setTimeout(() => {
        setViewMode(mode);
        setTimeout(() => setViewTransition(false), 50);
      }, 200);
    },
    [viewMode]
  );

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="wp-hero">
        <p
          className="editorial-label css-reveal"
          style={{ margin: "0 0 16px", transitionDelay: "0ms" }}
        >
          (Portfolio)
        </p>

        <h1 className="wp-heading css-reveal" style={{ transitionDelay: "100ms" }}>
          Work
          <span className="wp-count">({projects.length})</span>
        </h1>

        <p
          className="wp-sub css-reveal"
          style={{ transitionDelay: "200ms" }}
        >
          Brand identities, visual narratives, and digital experiences for
          businesses ready to show up differently.
        </p>
      </section>

      {/* ═══ FILTER BAR + VIEW TOGGLE ═══ */}
      <div className="content-filter-sticky">
        <div className="content-filter-row">
          {filterCategories.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`content-filter${activeFilter === f ? " content-filter--active" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="wp-view-toggle-wrap" style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
          <button
            onClick={() => switchView("list")}
            className={`content-filter${viewMode === "list" ? " content-filter--active" : ""}`}
          >
            LIST
          </button>
          <span className="content-filter-divider" style={{ margin: "0 8px" }} />
          <button
            onClick={() => switchView("grid")}
            className={`content-filter${viewMode === "grid" ? " content-filter--active" : ""}`}
          >
            GRID
          </button>
        </div>
      </div>

      {/* ═══ PROJECT CONTENT ═══ */}
      <div
        className={`wp-content${viewTransition ? " wp-content--exiting" : ""}`}
        style={{ padding: "32px var(--page-px) 0" }}
      >
        {filteredProjects.length === 0 ? (
          <p className="wp-empty">No projects in this category yet.</p>
        ) : viewMode === "list" ? (
          /* ── LIST VIEW ── */
          <div className="wp-list">
            {filteredProjects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="wp-list-row no-underline"
                data-cursor="view"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span
                  className="wp-list-name"
                  style={{
                    viewTransitionName: `project-${project.slug}`,
                  }}
                >
                  {project.name}
                </span>
                <span className="wp-list-cat">
                  {project.workType
                    .split(",")
                    .map((t) => t.trim())
                    .join(" — ")}
                </span>
                <span className="wp-list-year">{project.year}</span>
                <span className="wp-list-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        ) : (
          /* ── GRID VIEW ── */
          <div className="wp-grid">
            {filteredProjects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="wp-grid-card no-underline"
                data-cursor="view"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div
                  className="wp-grid-img-wrap reveal-clip"
                  style={{ viewTransitionName: `project-image-${project.slug}` }}
                >
                  <div className="wp-grid-img-inner relative">
                    <Image
                      src={PROJECT_IMAGES[project.slug] || "/images/projects/tedxtoronto/tedxtoronto.jpg"}
                      alt={project.name}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      style={{ objectFit: "cover", pointerEvents: "none" }}
                    />
                  </div>
                  {/* Hover overlay with description */}
                  <div className="wp-grid-overlay">
                    <p className="wp-grid-overlay-desc">{project.shortDescription}</p>
                  </div>
                </div>
                <div className="wp-grid-meta">
                  {project.workType.split(",").map((cat) => (
                    <button
                      key={cat.trim()}
                      className="wp-grid-cat-tag"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveFilter(cat.trim());
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {cat.trim()}
                    </button>
                  ))}
                </div>
                <h3
                  className="wp-grid-name"
                  style={{ viewTransitionName: `project-${project.slug}` }}
                >
                  {project.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ═══ MOBILE GRID (always visible on mobile) ═══ */}
      <div className="wp-mobile-grid" style={{ padding: "32px var(--page-px) 0" }}>
        {filteredProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="wp-grid-card no-underline"
            data-cursor="view"
          >
            <div className="wp-grid-img-wrap reveal-clip">
              <div className="wp-grid-img-inner relative">
                <Image
                  src={PROJECT_IMAGES[project.slug] || "/images/projects/tedxtoronto/tedxtoronto.jpg"}
                  alt={project.name}
                  fill
                  sizes="100vw"
                  style={{ objectFit: "cover", pointerEvents: "none" }}
                />
              </div>
            </div>
            <div className="wp-grid-meta">
              {project.workType.split(",").map((cat) => (
                <button
                  key={cat.trim()}
                  className="wp-grid-cat-tag"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveFilter(cat.trim());
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {cat.trim()}
                </button>
              ))}
            </div>
            <h3 className="wp-grid-name">{project.name}</h3>
            <p className="wp-grid-desc-mobile">{project.shortDescription}</p>
          </Link>
        ))}
      </div>

      {/* ═══ DARK CTA ═══ */}
      <section
        className="css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "120px var(--page-px)",
          marginTop: "clamp(80px, 10vw, 140px)",
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
              Have a project in mind?
            </h2>
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
