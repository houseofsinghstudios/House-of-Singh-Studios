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

// The project's own image, or none: a card without one shows the Cloudy White placeholder at the same
// size (the frame's ground in work-cards.css and .svc-block-img), never another project's photo.
export function projectImage(project: Pick<WorkCard, "image">): string | null {
  return project.image || null;
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
  const src = projectImage(project);
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
          {src && (
            <Image
              src={src}
              alt={project.name}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              style={{ objectFit: "cover", pointerEvents: "none" }}
            />
          )}
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
  const src = projectImage(project);
  return (
    <IntentLink
      href={`/work/${project.slug}`}
      className="wp-grid-card no-underline"
    >
      <div className="wp-grid-img-wrap reveal-clip" data-cursor="view">
        <div className="wp-grid-img-inner relative">
          {src && (
            <Image
              src={src}
              alt={project.name}
              fill
              sizes="100vw"
              style={{ objectFit: "cover", pointerEvents: "none" }}
            />
          )}
        </div>
      </div>
      <DisciplineTags tags={projectTags(project)} projectType={project.projectType} className="wp-grid-meta" />
      <h3 className="wp-grid-name">{project.name}</h3>
      <p className="wp-grid-desc-mobile">{project.shortDescription}</p>
    </IntentLink>
  );
}
