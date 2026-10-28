// "Related work" at the end of an article, before the newsletter: up to two case studies in the
// service page's project card style, inside the article column. Hidden when there are none.
import ProjectCardRow from "@/components/work/ProjectCardRow";
import type { ServiceProject } from "@/lib/sanity/projects";

export default function RelatedWork({ projects }: { projects: ServiceProject[] }) {
  if (projects.length === 0) return null;
  return (
    <section className="art-related-work" aria-labelledby="related-work-label" style={{ padding: "0 var(--page-px)" }}>
      <div className="art-body">
        <p id="related-work-label" className="editorial-label css-reveal" style={{ margin: "0 0 24px" }}>
          (Related work)
        </p>
        <ProjectCardRow projects={projects} />
      </div>
    </section>
  );
}
