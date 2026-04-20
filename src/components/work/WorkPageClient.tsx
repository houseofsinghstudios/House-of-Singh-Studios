"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import type { Project } from "@/data/projects";
import type { DisciplineFilter } from "@/lib/sanity/projects";
import Button from "@/components/ui/Button";
import NextPageLink from "@/components/layout/NextPageLink";

const FALLBACK_IMAGES: Record<string, string> = {
  tedxtoronto: "/images/projects/tedxtoronto/tedxtoronto.jpg",
  meridian: "/images/projects/meridian/meridian.jpg",
  soulbound: "/images/projects/soulbound/soulbound.jpg",
  "nomad-kitchen": "/images/projects/nomad-kitchen/nomad-kitchen.jpg",
};

function projectImage(project: Project): string {
  return project.image || FALLBACK_IMAGES[project.slug] || "/images/projects/tedxtoronto/tedxtoronto.jpg";
}

const DISCIPLINE_LABELS: Record<string, string> = {
  "brand-identity": "Brand Identity",
  packaging: "Packaging",
  publication: "Publication",
  "art-direction": "Art Direction",
  website: "Website",
  video: "Video",
  photography: "Photography",
  "social-content": "Social Content",
  strategy: "Strategy",
};

function projectTags(project: Project): { value: string; label: string }[] {
  if (project.disciplines && project.disciplines.length > 0) {
    return project.disciplines.map((d) => ({
      value: d,
      label: DISCIPLINE_LABELS[d] || d,
    }));
  }
  return project.workType.split(",").map((t) => {
    const trimmed = t.trim();
    return { value: trimmed, label: trimmed };
  });
}

type ViewMode = "list" | "grid";

interface WorkPageClientProps {
  projects: Project[];
  filters: DisciplineFilter[];
}

export default function WorkPageClient({ projects, filters }: WorkPageClientProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [viewTransition, setViewTransition] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [mouseY, setMouseY] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filterCategories = useMemo(
    () => [{ value: "All", label: "All" }, ...filters],
    [filters]
  );

  const activeFilterLabel = useMemo(() => {
    if (activeFilter === "All") return "All Projects";
    const match = filterCategories.find((f) => f.value === activeFilter);
    return match ? match.label : activeFilter;
  }, [activeFilter, filterCategories]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter(
      (p) => p.disciplines && p.disciplines.includes(activeFilter)
    );
  }, [activeFilter, projects]);

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

  const toggleFilter = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
    if (isFilterOpen) {
      setFiltersVisible(false);
      setIsFilterOpen(false);
    } else {
      setIsFilterOpen(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFiltersVisible(true));
      });
    }
  }, [isFilterOpen]);

  const selectFilter = useCallback((value: string) => {
    setActiveFilter(value);
    setFiltersVisible(false);
    collapseTimerRef.current = setTimeout(() => {
      setIsFilterOpen(false);
      collapseTimerRef.current = null;
    }, 200);
  }, []);

  const hoveredProject = hoveredSlug
    ? filteredProjects.find((p) => p.slug === hoveredSlug)
    : null;
  const hoveredImage = hoveredProject ? projectImage(hoveredProject) : null;

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
          style={{ transitionDelay: "200ms", marginBottom: 48 }}
        >
          Brand identities, visual narratives, and digital experiences for
          businesses ready to show up differently.
        </p>
      </section>

      {/* ═══ UNIFIED COLLAPSIBLE FILTER ═══ */}
      <div className="wf" style={{ padding: "0 var(--page-px)" }}>
        {/* Bar */}
        <div className="wf-bar">
          <button
            className="wf-trigger"
            onClick={toggleFilter}
            aria-expanded={isFilterOpen}
          >
            <span className="wf-label">{activeFilterLabel}</span>
            <span
              className={`wf-icon${isFilterOpen ? " wf-icon--open" : ""}`}
            >
              +
            </span>
          </button>

          <div className="wf-toggle">
            <button
              onClick={() => switchView("grid")}
              className={`wf-view${viewMode === "grid" ? " wf-view--active" : ""}`}
            >
              Grid
            </button>
            <span className="wf-sep">|</span>
            <button
              onClick={() => switchView("list")}
              className={`wf-view${viewMode === "list" ? " wf-view--active" : ""}`}
            >
              List
            </button>
          </div>
        </div>

        {/* Panel */}
        <div
          className={`wf-panel${isFilterOpen ? " wf-panel--open" : ""}`}
        >
          <div className="wf-filters">
            {filterCategories.map((f, i) => (
              <button
                key={f.value}
                className={`wf-item${activeFilter === f.value ? " wf-item--active" : ""}${filtersVisible ? " wf-item--show" : ""}`}
                style={{ transitionDelay: filtersVisible ? `${i * 40}ms` : "0ms" }}
                onClick={() => selectFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ PROJECT CONTENT ═══ */}
      <div
        className={`wp-content${viewTransition ? " wp-content--exiting" : ""}`}
        style={{ padding: "40px var(--page-px) 0" }}
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
                style={{ transitionDelay: `${i * 60}ms` }}
                onMouseEnter={() => setHoveredSlug(project.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                onMouseMove={(e) => setMouseY(e.clientY)}
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
                  {projectTags(project).map((t) => t.label).join(" — ")}
                </span>
                <span className="wp-list-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            ))}

            {/* Floating image preview (desktop only) */}
            {hoveredImage && (
              <div
                className="wp-list-preview"
                style={{ top: mouseY - 150 }}
              >
                <Image
                  src={hoveredImage}
                  alt=""
                  fill
                  sizes="280px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
          </div>
        ) : (
          /* ── GRID VIEW ── */
          <div className="wp-grid">
            {filteredProjects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="wp-grid-card no-underline"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div
                  className="wp-grid-img-wrap reveal-clip"
                  data-cursor="view"
                  style={{ viewTransitionName: `project-image-${project.slug}` }}
                >
                  <div className="wp-grid-img-inner relative">
                    <Image
                      src={projectImage(project)}
                      alt={project.name}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      style={{ objectFit: "cover", pointerEvents: "none" }}
                    />
                  </div>
                </div>
                <div className="wp-grid-meta">
                  {projectTags(project).map((tag) => (
                    <button
                      key={tag.value}
                      className="wp-grid-cat-tag"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveFilter(tag.value);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
                <div className="wp-grid-text-swap">
                  <h3
                    className="wp-grid-name"
                    style={{ viewTransitionName: `project-${project.slug}` }}
                  >
                    {project.name}
                  </h3>
                  <p className="wp-grid-desc">{project.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ═══ MOBILE GRID (always visible on mobile) ═══ */}
      <div className="wp-mobile-grid" style={{ padding: "40px var(--page-px) 0" }}>
        {filteredProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="wp-grid-card no-underline"
          >
            <div className="wp-grid-img-wrap reveal-clip" data-cursor="view">
              <div className="wp-grid-img-inner relative">
                <Image
                  src={projectImage(project)}
                  alt={project.name}
                  fill
                  sizes="100vw"
                  style={{ objectFit: "cover", pointerEvents: "none" }}
                />
              </div>
            </div>
            <div className="wp-grid-meta">
              {projectTags(project).map((tag) => (
                <button
                  key={tag.value}
                  className="wp-grid-cat-tag"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveFilter(tag.value);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {tag.label}
                </button>
              ))}
            </div>
            <h3 className="wp-grid-name">{project.name}</h3>
            <p className="wp-grid-desc-mobile">{project.shortDescription}</p>
          </Link>
        ))}
      </div>

      <NextPageLink />

      {/* ═══ DARK CTA ═══ */}
      <section
        className="css-reveal"
        style={{
          background: "var(--text-secondary)",
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
            <Button href="https://cal.com/houseofsinghstudios/hr" variant="primary-inverted" data-cursor="link" target="_blank" rel="noopener noreferrer">
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
