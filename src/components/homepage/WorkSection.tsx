"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { PROJECTS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function WorkSection() {
  return (
    <section className="css-reveal work-section-mobile" style={{ padding: "120px var(--page-px) 160px" }}>
      <div className="css-reveal">
        <EditorialLabel text="Selected Work" className="mb-6" />
      </div>

      <div className="work-grid mt-8">
        {PROJECTS.map((project) => (
          <Link
            key={project.href}
            href={project.href}
            className="project-card css-reveal block no-underline"
            data-cursor="view"
          >
            <div
              className="project-img-wrap overflow-hidden relative"
              style={{ aspectRatio: "4/3", background: project.color }}
            >
              <div className="project-img-inner project-image-inner w-full h-full relative">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    objectFit: "cover",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
            <div className="mt-4">
              <p
                className="font-[var(--sans)] font-medium text-base text-[color:var(--text-primary)] m-0"
                style={{ viewTransitionName: `project-${project.href.split("/").pop()}` }}
              >
                {project.name}
              </p>
              <p className="mt-1.5 font-[var(--sans)] font-normal text-xs uppercase tracking-[0.08em] text-[#999]">
                {project.label}
              </p>
              <p className="project-sentence font-[var(--sans)] font-normal text-sm text-[color:var(--text-muted)]">
                {project.sentence}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="css-reveal mt-12">
        <Link href="/work" className="arrow-link no-underline" data-cursor="link">
          <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
            View All Projects <span className="arrow-icon">&rarr;</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
