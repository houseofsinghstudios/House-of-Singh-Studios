"use client";

import { useState, useCallback, useMemo } from "react";
import { Link } from "next-view-transitions";
import { projects, getWorkTypeFilters } from "@/data/projects";
import Button from "@/components/ui/Button";

export default function WorkPageClient() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeIdx, setActiveIdx] = useState(0);
  const prevIdx = { current: 0 };

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

  const crossfadeImage = useCallback(
    (newIdx: number) => {
      if (newIdx === prevIdx.current) return;
      const panel = document.querySelector(".split-img-panel");
      if (!panel) return;

      const imgs = panel.querySelectorAll<HTMLElement>(".split-img-item");
      const outgoing = imgs[prevIdx.current];
      const incoming = imgs[newIdx];

      if (outgoing) {
        outgoing.style.transition = "opacity 0.3s ease";
        outgoing.style.opacity = "0";
      }
      if (incoming) {
        incoming.style.transition = "none";
        incoming.style.opacity = "0";
        incoming.style.transform = "translateY(8px) scale(1.03)";
        requestAnimationFrame(() => {
          incoming.style.transition = "opacity 0.5s ease, transform 0.5s ease";
          incoming.style.opacity = "1";
          incoming.style.transform = "translateY(0) scale(1)";
        });
      }
      prevIdx.current = newIdx;
    },
    []
  );

  const handleHover = useCallback(
    (globalIdx: number) => {
      setActiveIdx(globalIdx);
      crossfadeImage(globalIdx);
    },
    [crossfadeImage]
  );

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "180px var(--page-px) 40px" }}>
        <p data-hero-label className="editorial-label mb-6">
          (Portfolio)
        </p>
        <h1
          data-hero-heading
          className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] m-0"
          style={{
            fontSize: "clamp(40px, 5vw, 68px)",
            lineHeight: 1.1,
          }}
        >
          Work that holds up.
        </h1>
        <p
          data-hero-sub
          className="font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-muted)] m-0"
          style={{ maxWidth: 480, lineHeight: 1.6, marginTop: 16 }}
        >
          Brand identities, visual narratives, and digital experiences for
          businesses ready to show up differently.
        </p>
      </section>

      {/* Filters */}
      <div
        className="work-filter-row"
        style={{ padding: "40px var(--page-px) 0" }}
      >
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

      {/* Split container */}
      <div className="split-container">
        {/* Left panel */}
        <div className="split-left">
          {filteredProjects.map((project) => {
            const globalIdx = projects.indexOf(project);
            return (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="project-row"
                data-cursor="view"
                onMouseEnter={() => handleHover(globalIdx)}
              >
                <span className="project-row-number">{project.number}</span>
                <span className="project-row-name">{project.name}</span>
                <span className="project-row-meta">{project.workType}</span>
              </Link>
            );
          })}
        </div>

        {/* Right panel — sticky image */}
        <div className="split-right">
          <div className="split-img-panel">
            {projects.map((project, i) => (
              <div
                key={project.slug}
                className="split-img-item"
                style={{
                  background: project.gradient,
                  opacity: i === 0 ? 1 : 0,
                }}
              >
                <span
                  className="font-[var(--sans)] text-xs uppercase tracking-[0.12em]"
                  style={{ color: "rgba(0,0,0,0.25)" }}
                >
                  {project.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
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
          Have a project in mind?
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
