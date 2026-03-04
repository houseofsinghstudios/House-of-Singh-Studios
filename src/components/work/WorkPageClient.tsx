"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import SplitType from "split-type";
import { projects } from "@/data/projects";

const FILTERS = [
  "All",
  "Brand Identity",
  "Visual Media",
  "Digital Design",
  "Creative Strategy",
];

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

  const crossfadeImage = useCallback((newIdx: number) => {
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
  }, []);

  const handleHover = useCallback(
    (idx: number) => {
      setActiveIdx(idx);
      crossfadeImage(idx);
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
        tl.to(btns, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 }, 0.55);
      }

      if (listRef.current) {
        const rows = listRef.current.querySelectorAll(".project-row");
        gsap.set(rows, { opacity: 0, y: 25 });
        tl.to(rows, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 }, 0.65);
      }

      if (imgPanelRef.current) {
        gsap.set(imgPanelRef.current, { opacity: 0, scale: 0.96 });
        tl.to(imgPanelRef.current, { opacity: 1, scale: 1, duration: 0.6 }, 0.7);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

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
          style={{ fontSize: "clamp(40px, 5vw, 68px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
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
        className="flex flex-wrap gap-3"
        style={{ padding: "40px var(--page-px) 0" }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="filter-btn"
            style={{
              background: activeFilter === f ? "var(--text-primary)" : "transparent",
              color: activeFilter === f ? "var(--bg)" : "var(--text-muted)",
              border: "1px solid var(--border)",
              borderColor: activeFilter === f ? "var(--text-primary)" : "var(--border)",
              padding: "9px 18px",
              fontFamily: "var(--sans)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Split container */}
      <div className="split-container">
        {/* Left panel */}
        <div ref={listRef} className="split-left">
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="project-row"
              data-cursor="expand"
              onMouseEnter={() => handleHover(i)}
            >
              <span className="project-row-number">{project.number}</span>
              <span className="project-row-name">{project.name}</span>
              <span className="project-row-meta">
                {project.categories.join(", ")} &mdash; {project.year}
              </span>
            </Link>
          ))}
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
    </div>
  );
}
