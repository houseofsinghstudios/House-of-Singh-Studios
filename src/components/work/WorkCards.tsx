// The /work project cards, shared with the Initiatives pages. No hooks, so they render in server and
// client components alike. onSelect turns the discipline tags into filter buttons (the /work page).
import { Link } from "next-view-transitions";
import Image from "next/image";
import type { Project } from "@/data/projects";
import DisciplineTags, { type DisciplineTag } from "@/components/work/DisciplineTags";
import { disciplineLabel } from "@/lib/disciplines";
import "./work-cards.css";

// What a card shows. The /work page sends only these fields to the browser, never a case study's
// text (see workCard).
export type WorkCard = Pick<Project, "slug" | "name" | "image" | "workType" | "shortDescription" | "disciplines" | "projectType">;

export function workCard({ slug, name, image, workType, shortDescription, disciplines, projectType }: Project): WorkCard {
  return { slug, name, image, workType, shortDescription, disciplines, projectType };
}

const FALLBACK_IMAGES: Record<string, string> = {
  tedxtoronto: "/images/projects/tedxtoronto/tedxtoronto.jpg",
};

export function projectImage(project: WorkCard): string {
  return project.image || FALLBACK_IMAGES[project.slug] || "/images/projects/tedxtoronto/tedxtoronto.jpg";
}

export function projectTags(project: WorkCard): DisciplineTag[] {
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
  onSelect?: (value: string) => void;
  // The card title's heading level: 2 where the cards sit straight under the page's h1 (/work),
  // 3 inside a section that has its own h2 (the Initiatives pages). The look is the same.
  headingLevel?: 2 | 3;
}

// Desktop grid card (1024px and wider), in .wp-grid.
export function WorkGridCard({ project, index, onSelect, headingLevel = 3 }: CardProps & { index: number }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link
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
      <DisciplineTags tags={projectTags(project)} projectType={project.projectType} className="wp-grid-meta" onSelect={onSelect} />
      <div className="wp-grid-text-swap">
        <Heading
          className="wp-grid-name"
          style={{ viewTransitionName: `project-${project.slug}` }}
        >
          {project.name}
        </Heading>
        <p className="wp-grid-desc">{project.shortDescription}</p>
      </div>
    </Link>
  );
}

// Phone and tablet card (below 1024px), in .wp-mobile-grid.
export function WorkMobileCard({ project, onSelect, headingLevel = 3 }: CardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link
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
      <DisciplineTags tags={projectTags(project)} projectType={project.projectType} className="wp-grid-meta" onSelect={onSelect} />
      <Heading className="wp-grid-name">{project.name}</Heading>
      <p className="wp-grid-desc-mobile">{project.shortDescription}</p>
    </Link>
  );
}
