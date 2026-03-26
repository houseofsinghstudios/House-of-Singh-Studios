"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { PROJECTS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function WorkSection() {
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

      {/* 4-column card grid */}
      <div className="featured-work-grid">
        {PROJECTS.map((project) => (
          <Link
            key={project.href}
            href={project.href}
            className="featured-work-item css-reveal no-underline"
            data-cursor="view"
          >
            <div className="featured-work-img-wrap reveal-clip">
              <div className="featured-work-img-inner relative">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  priority={project === PROJECTS[0]}
                  sizes="(max-width: 599px) 100vw, (max-width: 899px) 50vw, 25vw"
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
            <h3
              className="featured-work-name"
              style={{
                viewTransitionName: `project-${project.href.split("/").pop()}`,
              }}
            >
              {project.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
