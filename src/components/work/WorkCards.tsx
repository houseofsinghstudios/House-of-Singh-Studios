// The project cards on the Initiatives programme pages (once the /work grid). No hooks, so they render
// in server and client components alike.
import IntentLink from "@/components/IntentLink";
import Image from "next/image";
import type { Project } from "@/data/projects";
import DisciplineTags, { type DisciplineTag } from "@/components/work/DisciplineTags";
import { disciplineLabel } from "@/lib/disciplines";
import "./work-cards.css";

// What a card shows.
type WorkCard = Pick<Project, "slug" | "name" | "image" | "workType" | "shortDescription" | "disciplines" | "projectType">;

const FALLBACK_IMAGES: Record<string, string> = {
  tedxtoronto: "/images/projects/tedxtoronto/tedxtoronto.jpg",
};

export function projectImage(project: WorkCard): string {
  return project.image || FALLBACK_IMAGES[project.slug] || "/images/projects/tedxtoronto/tedxtoronto.jpg";
}

function projectTags(project: WorkCard): DisciplineTag[] {
  if (project.disciplines && project.disciplines.length > 0) {
    return project.disciplines.map((d) => ({ value: d, label: disciplineLabel(d) }));
  }
  return project.workType.split(",").map((t) => {
    const trimmed = t.trim();
    return { value: trimmed, label: trimmed };
  });
}

interface CardProps {
  project: WorkCard;
}

// Desktop grid card (1024px and wider), in .wp-grid.
export function WorkGridCard({ project, index }: CardProps & { index: number }) {
  return (
    <IntentLink
      href={`/work/${project.slug}`}
      className="wp-grid-card no-underline"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className="wp-grid-img-wrap reveal-clip"
        data-cursor="view"
        style={{ viewTransitionName: `project-image-${project.slug}` }}
      >
        <div className="wp-grid-img-inner relative">
          <Image
            src={projectImage(project)}
            alt={project.name}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            style={{ objectFit: "cover", pointerEvents: "none" }}
          />
        </div>
      </div>
      <DisciplineTags tags={projectTags(project)} projectType={project.projectType} className="wp-grid-meta" />
      <div className="wp-grid-text-swap">
        <h3
          className="wp-grid-name"
          style={{ viewTransitionName: `project-${project.slug}` }}
        >
          {project.name}
        </h3>
        <p className="wp-grid-desc">{project.shortDescription}</p>
      </div>
    </IntentLink>
  );
}

// Phone and tablet card (below 1024px), in .wp-mobile-grid.
export function WorkMobileCard({ project }: CardProps) {
  return (
    <IntentLink
      href={`/work/${project.slug}`}
      className="wp-grid-card no-underline"
    >
      <div className="wp-grid-img-wrap reveal-clip" data-cursor="view">
        <div className="wp-grid-img-inner relative">
          <Image
            src={projectImage(project)}
            alt={project.name}
            fill
            sizes="100vw"
            style={{ objectFit: "cover", pointerEvents: "none" }}
          />
        </div>
      </div>
      <DisciplineTags tags={projectTags(project)} projectType={project.projectType} className="wp-grid-meta" />
      <h3 className="wp-grid-name">{project.name}</h3>
      <p className="wp-grid-desc-mobile">{project.shortDescription}</p>
    </IntentLink>
  );
}
