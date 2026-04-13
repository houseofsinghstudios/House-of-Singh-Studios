"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import type { Project } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

interface WorkSectionProps {
  projects: Project[];
}

export default function WorkSection({ projects }: WorkSectionProps) {
  return (
    <section
      className="css-reveal work-section-mobile"
      style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px)" }}
    >
      {/* Header row */}
      <div
        className="css-reveal"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "clamp(32px, 4vw, 48px)",
        }}
      >
        <EditorialLabel text="(01) Featured Work" />
        <Link href="/work" className="arrow-link no-underline" data-cursor="link">
          <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
            View all projects <span className="arrow-icon">&rarr;</span>
          </span>
        </Link>
      </div>

      {/* 2-column card grid */}
      <div className="featured-work-grid">
        {projects.map((project) => (
          <Link
            key={project.href}
            href={project.href}
            className="featured-work-item css-reveal no-underline"
          >
            <div className="featured-work-img-wrap reveal-clip" data-cursor="view">
              <div className="featured-work-img-inner relative">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  priority={project === projects[0]}
                  sizes="(max-width: 767px) 100vw, 50vw"
                  style={{
                    objectFit: "cover",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
            <p className="featured-work-tags">
              {project.label
                .split(",")
                .map((tag) => tag.trim())
                .join(" — ")}
            </p>
            <div className="featured-work-text-swap">
              <h3
                className="featured-work-name"
                style={{
                  viewTransitionName: `project-${project.href.split("/").pop()}`,
                }}
              >
                {project.name}
              </h3>
              <p className="featured-work-desc">{project.sentence}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
