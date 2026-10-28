// A row of project cards: the service page's Related work cards (image, name, type and subtitle).
// Used on service pages and, two at most, at the end of each article.
import { Link } from "next-view-transitions";
import Image from "next/image";
import ProjectTypeLabel from "@/components/work/ProjectTypeLabel";
import { projectTypeLabel } from "@/lib/initiatives/types";
import type { ServiceProject } from "@/lib/sanity/projects";

export default function ProjectCardRow({ projects }: { projects: ServiceProject[] }) {
  return (
    <div className="svcd-work-grid">
      {projects.map((work, i) => (
        <Link
          key={work.slug}
          href={`/work/${work.slug}`}
          className="svcd-work-card css-reveal"
          data-cursor="view"
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          <div className="svcd-work-img reveal-clip">
            {work.image && (
              <Image
                src={work.image}
                alt={work.name}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
          <p className="svcd-work-name">{work.name}</p>
          {(work.subtitle || projectTypeLabel(work.projectType)) && (
            <p className="svcd-work-cat">
              <ProjectTypeLabel type={work.projectType} />
              {projectTypeLabel(work.projectType) && work.subtitle ? " · " : ""}
              {work.subtitle}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
