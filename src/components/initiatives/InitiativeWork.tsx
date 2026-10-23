// The work on a program page: the /work grid and cards, unchanged. Without projects: the quiet
// empty line if one is given, otherwise nothing. The desktop grid shows from 1024px, the phone
// grid below it, as on /work.
import type { Project } from "@/data/projects";
import { WorkGridCard, WorkMobileCard } from "@/components/work/WorkCards";

export default function InitiativeWork({ projects, empty }: { projects: Project[]; empty?: string }) {
  if (projects.length === 0) return empty ? <p className="init-empty css-reveal">{empty}</p> : null;
  return (
    <>
      <div className="wp-content init-work">
        <div className="wp-grid">
          {projects.map((project, i) => (
            <WorkGridCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
      <div className="wp-mobile-grid init-work">
        {projects.map((project) => (
          <WorkMobileCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
