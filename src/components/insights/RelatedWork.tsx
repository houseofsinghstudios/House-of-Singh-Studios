// "Related work" at the end of an article, before the newsletter: up to two case studies in the
// service page's project card style, then the article's services as links in the meta label style,
// inside the article column. Hidden when there is neither.
import { Link } from "next-view-transitions";
import ProjectCardRow from "@/components/work/ProjectCardRow";
import type { ServiceProject } from "@/lib/sanity/projects";
import type { ServiceLink } from "@/components/casestudy/CaseStudyTemplate";

export default function RelatedWork({ projects, services }: { projects: ServiceProject[]; services: ServiceLink[] }) {
  if (projects.length === 0 && services.length === 0) return null;
  return (
    <section className="art-related-work" aria-labelledby="related-work-label" style={{ padding: "0 var(--page-px)" }}>
      <div className="art-body">
        <p id="related-work-label" className="editorial-label css-reveal" style={{ margin: "0 0 24px" }}>
          (Related work)
        </p>
        {projects.length > 0 && <ProjectCardRow projects={projects} />}
        {services.length > 0 && (
          <div className="art-related-services css-reveal">
            <span className="cs-meta-label">Related services</span>
            <span className="dtags">
              {services.map((s) => (
                <Link key={s.href} href={s.href} className="dtag cs-service-link" data-cursor="link">
                  {s.label}
                </Link>
              ))}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
