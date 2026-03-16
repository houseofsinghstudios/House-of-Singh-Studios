"use client";

import { useState, useMemo } from "react";
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

  return (
    <div>
      {/* Hero */}
      <section
        style={{ padding: "180px var(--page-px) 40px", minHeight: "50vh" }}
        className="flex flex-col justify-end"
      >
        <p data-hero-label className="editorial-label mb-6">
          (Portfolio)
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <h1
            data-hero-heading
            className="font-[var(--sans)] font-medium tracking-[-0.03em] text-[color:var(--text-primary)] m-0"
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              lineHeight: 1.05,
            }}
          >
            Work
          </h1>
          <span
            className="font-[var(--sans)] text-[color:var(--text-muted)]"
            style={{
              fontSize: 12,
              verticalAlign: "super",
              position: "relative",
              top: "-0.6em",
            }}
          >
            ({projects.length})
          </span>
        </div>
        <p
          data-hero-sub
          className="font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-muted)] m-0"
          style={{ maxWidth: 480, lineHeight: 1.6, marginTop: 16 }}
        >
          Brand identities, visual narratives, and digital experiences for
          businesses ready to show up differently.
        </p>
      </section>

      {/* Filters + View Toggle */}
      <div
        style={{
          padding: "40px var(--page-px) 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="work-filter-row" style={{ padding: 0 }}>
          {filterCategories.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`work-filter-btn${activeFilter === f ? " active" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* View toggle - desktop only */}
        <div className="work-view-toggle">
          <button
            onClick={() => setViewMode("list")}
            className={`work-view-btn${viewMode === "list" ? " active" : ""}`}
          >
            LIST
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`work-view-btn${viewMode === "grid" ? " active" : ""}`}
          >
            GRID
          </button>
        </div>
      </div>

      {/* LIST VIEW */}
      <div
        className="work-list-view"
        style={{
          padding: "40px var(--page-px) 0",
          display: viewMode === "list" ? "block" : "none",
          opacity: viewMode === "list" ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {filteredProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="work-list-row css-reveal no-underline"
            data-cursor="view"
          >
            <span
              className="work-list-name"
              style={{
                viewTransitionName: `project-${project.slug}`,
              }}
            >
              {project.name}
            </span>
            <span className="work-list-tags">
              {project.workType
                .split(",")
                .map((t) => t.trim())
                .join(" — ")}
            </span>
            <span className="work-list-year">{project.year}</span>
          </Link>
        ))}
      </div>

      {/* GRID VIEW */}
      <div
        className="work-card-grid"
        style={{
          padding: "60px var(--page-px) 0",
          display: viewMode === "grid" ? "grid" : "none",
          opacity: viewMode === "grid" ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {filteredProjects.map((project, i) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className={`work-card css-reveal no-underline${i % 2 !== 0 ? " work-card-offset" : ""}`}
            data-cursor="view"
          >
            <div className="work-card-image-wrap">
              <div className="work-card-image-inner relative">
                <Image
                  src={PROJECT_IMAGES[project.slug] || "/images/projects/tedxtoronto/tedxtoronto.jpg"}
                  alt={project.name}
                  fill
                  sizes="(max-width: 899px) 100vw, 50vw"
                  style={{ objectFit: "cover", pointerEvents: "none" }}
                />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <p
                className="font-[var(--sans)] text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-muted)] m-0"
              >
                {project.workType
                  .split(",")
                  .map((t) => t.trim())
                  .join(" — ")}
              </p>
              <h3
                className="font-[var(--sans)] font-medium text-[16px] tracking-[-0.01em] text-[color:var(--text-primary)] m-0 mt-2"
              >
                {project.name}
              </h3>
              <p
                className="font-[var(--sans)] font-normal text-[14px] text-[color:var(--text-secondary)] m-0 mt-2"
                style={{ lineHeight: 1.6 }}
              >
                {project.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile grid (always shown on mobile, replaces toggle) */}
      <div
        className="work-mobile-grid"
        style={{ padding: "40px var(--page-px) 0" }}
      >
        {filteredProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="work-card css-reveal no-underline"
            data-cursor="view"
          >
            <div className="work-card-image-wrap">
              <div className="work-card-image-inner relative">
                <Image
                  src={PROJECT_IMAGES[project.slug] || "/images/projects/tedxtoronto/tedxtoronto.jpg"}
                  alt={project.name}
                  fill
                  sizes="100vw"
                  style={{ objectFit: "cover", pointerEvents: "none" }}
                />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <p
                className="font-[var(--sans)] text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-muted)] m-0"
              >
                {project.workType
                  .split(",")
                  .map((t) => t.trim())
                  .join(" — ")}
              </p>
              <h3
                className="font-[var(--sans)] font-medium text-[16px] tracking-[-0.01em] text-[color:var(--text-primary)] m-0 mt-2"
              >
                {project.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Dark CTA */}
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
