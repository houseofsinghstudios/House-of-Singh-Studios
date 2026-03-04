"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { projects } from "@/data/projects";
import ProjectRow from "./ProjectRow";
import HoverImage from "./HoverImage";

const FILTERS = [
  "All",
  "Brand Identity",
  "Visual Media",
  "Digital Design",
  "Creative Strategy",
];

export default function WorkPageClient() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Label fade up
      if (labelRef.current) {
        gsap.set(labelRef.current, { opacity: 0, y: 16 });
        tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0.1);
      }

      // Heading character reveal
      if (headingRef.current) {
        const split = new SplitType(headingRef.current, { types: "chars" });
        if (split.chars) {
          gsap.set(split.chars, { opacity: 0, y: 30 });
          tl.to(
            split.chars,
            {
              opacity: 1,
              y: 0,
              stagger: 0.02,
              duration: 0.5,
            },
            0.15
          );
        }
      }

      // Supporting text
      if (supportRef.current) {
        gsap.set(supportRef.current, { opacity: 0, y: 16 });
        tl.to(supportRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.45);
      }

      // Filter buttons
      if (filtersRef.current) {
        const btns = filtersRef.current.querySelectorAll("button");
        gsap.set(btns, { opacity: 0, y: 12 });
        tl.to(btns, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 }, 0.55);
      }

      // Project rows
      if (listRef.current) {
        const rows = listRef.current.querySelectorAll(".project-row");
        gsap.set(rows, { opacity: 0, y: 25 });
        tl.to(rows, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 }, 0.65);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const hoveredGradient =
    hoveredIdx !== null
      ? projects[hoveredIdx].gradient
      : "linear-gradient(155deg, #D8D2CA, #C8BFB4)";

  return (
    <div ref={sectionRef}>
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
          }}
        >
          Work that holds up.
        </h1>
        <p
          ref={supportRef}
          className="mt-6 font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-muted)]"
          style={{ maxWidth: 480 }}
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
              background:
                activeFilter === f ? "var(--text-primary)" : "transparent",
              color: activeFilter === f ? "var(--bg)" : "var(--text-primary)",
              border: "1px solid var(--border)",
              borderColor:
                activeFilter === f
                  ? "var(--text-primary)"
                  : "var(--border)",
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

      {/* Project List */}
      <div
        ref={listRef}
        style={{
          borderTop: "1px solid var(--border)",
          margin: "40px var(--page-px) 0",
          paddingBottom: 160,
        }}
      >
        {projects.map((project, i) => (
          <ProjectRow
            key={project.slug}
            {...project}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          />
        ))}
      </div>

      {/* Floating hover image — hidden on mobile via the component */}
      <HoverImage gradient={hoveredGradient} visible={hoveredIdx !== null} />
    </div>
  );
}
