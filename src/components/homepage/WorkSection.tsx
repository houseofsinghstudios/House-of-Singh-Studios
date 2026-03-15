"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { PROJECTS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function WorkSection() {
  const featured = PROJECTS.slice(0, 3);

  return (
    <section
      className="css-reveal work-section-mobile"
      style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px)" }}
    >
      <div className="css-reveal">
        <EditorialLabel text="01 — Featured Work" className="mb-6" />
      </div>

      <div className="mt-8">
        {featured.map((project) => (
          <Link
            key={project.href}
            href={project.href}
            className="featured-work-card css-reveal no-underline"
            data-cursor="view"
          >
            <div className="featured-work-card-img">
              <div className="featured-work-card-img-inner relative">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(max-width: 899px) 100vw, 60vw"
                  style={{
                    objectFit: "cover",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
            <div className="featured-work-card-info">
              <p className="featured-work-card-tags">
                {project.label.split(",").map((tag) => tag.trim()).join(" — ")}
              </p>
              <h3
                className="featured-work-card-name"
                style={{
                  viewTransitionName: `project-${project.href.split("/").pop()}`,
                }}
              >
                {project.name}
              </h3>
              <p className="featured-work-card-desc">{project.sentence}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="css-reveal mt-12" style={{ textAlign: "right" }}>
        <Link href="/work" className="arrow-link no-underline" data-cursor="link">
          <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
            View all projects <span className="arrow-icon">&rarr;</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
