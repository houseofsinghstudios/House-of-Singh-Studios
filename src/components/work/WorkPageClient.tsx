"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link } from "next-view-transitions";
import { gsap } from "gsap";
import SplitType from "split-type";
import { projects, getWorkTypeFilters } from "@/data/projects";

export default function WorkPageClient() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const imgPanelRef = useRef<HTMLDivElement>(null);
  const prevIdx = useRef(0);

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
      const panel = imgPanelRef.current;
      if (!panel) return;

      const imgs = panel.querySelectorAll<HTMLElement>(".split-img-item");
      const outgoing = imgs[prevIdx.current];
      const incoming = imgs[newIdx];

      if (outgoing) {
        gsap.to(outgoing, { opacity: 0, duration: 0.3, ease: "power2.out" });
      }
      if (incoming) {
        gsap.fromTo(
          incoming,
          { opacity: 0, y: 8, scale: 1.03 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
        );
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (labelRef.current) {
        gsap.set(labelRef.current, { opacity: 0, y: 15 });
        tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0.1);
      }

      if (headingRef.current) {
        const split = new SplitType(headingRef.current, { types: "chars" });
        if (split.chars) {
          gsap.set(split.chars, { opacity: 0, y: 30 });
          tl.to(
            split.chars,
            { opacity: 1, y: 0, stagger: 0.02, duration: 0.5 },
            0.15
          );
        }
      }

      if (supportRef.current) {
        gsap.set(supportRef.current, { opacity: 0, y: 16 });
        tl.to(supportRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.45);
      }

      if (filtersRef.current) {
        const btns = filtersRef.current.querySelectorAll("button");
        gsap.set(btns, { opacity: 0, y: 12 });
        tl.to(
          btns,
          { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 },
          0.55
        );
      }

      if (listRef.current) {
        const rows = listRef.current.querySelectorAll(".project-row");
        gsap.set(rows, { opacity: 0, y: 25 });
        tl.to(
          rows,
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 },
          0.65
        );
      }

      if (imgPanelRef.current) {
        gsap.set(imgPanelRef.current, { opacity: 0, scale: 0.96 });
        tl.to(
          imgPanelRef.current,
          { opacity: 1, scale: 1, duration: 0.6 },
          0.7
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Re-animate rows when filter changes
  useEffect(() => {
    if (!listRef.current) return;
    const rows = listRef.current.querySelectorAll(".project-row");
    gsap.fromTo(
      rows,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.06, duration: 0.35, ease: "power3.out" }
    );
  }, [activeFilter]);

  return (
    <div ref={containerRef}>
      {/* Hero */}
      <section style={{ padding: "180px var(--page-px) 40px" }}>
        <p ref={labelRef} className="editorial-label mb-6">
          (Portfolio)
        </p>
        <h1
          ref={headingRef}
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
          style={{
            fontSize: "clamp(40px, 5vw, 68px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          Work that holds up.
        </h1>
        <p
          ref={supportRef}
          className="font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-muted)] m-0"
          style={{ maxWidth: 480, lineHeight: 1.6, marginTop: 16 }}
        >
          Brand identities, visual narratives, and digital experiences for
          businesses ready to show up differently.
        </p>
      </section>

      {/* Filters */}
      <div
        ref={filtersRef}
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
        <div ref={listRef} className="split-left">
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
          <div ref={imgPanelRef} className="split-img-panel">
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
          className="scroll-reveal-up font-[var(--serif)] font-normal text-[color:var(--text-primary)]"
          style={{
            fontSize: "clamp(32px, 4.5vw, 60px)",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Have a project in mind?
        </h2>
        <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
          <a
            href="#"
            className="contact-submit inline-block"
            data-cursor="link"
          >
            Book a Discovery Call
          </a>
          <Link
            href="/contact"
            className="inline-block font-[var(--sans)] text-[13px] uppercase tracking-[0.1em] text-[color:var(--text-primary)]"
            style={{
              padding: "16px 32px",
              border: "1px solid rgba(26, 26, 26, 0.2)",
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
            data-cursor="link"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
          >
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
}
