import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ProjectPlanner from "@/components/project-planner/ProjectPlanner";
import { PAGE } from "@/lib/project-planner/content";
import { parseBegin, parseService } from "@/lib/project-planner/start-links";
import { getPlannerCaseStudies } from "@/lib/sanity/projects";
import { studioTitle, WEBSITE_OG } from "@/lib/seo";

const URL = "https://studios.houseofsingh.com/start";

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.description,
  alternates: { canonical: URL },
  openGraph: { ...WEBSITE_OG, title: studioTitle(PAGE.title), description: PAGE.description, url: URL },
};

type Props = { searchParams: Promise<{ service?: string | string[]; begin?: string | string[] }> };

// Related work is read on the server and handed to the planner (it shows no prices). ?service= preselects
// one known service and ?begin=1 opens the first question; anything else is ignored.
export default async function StartPage({ searchParams }: Props) {
  const { service, begin } = await searchParams;
  const initialService = parseService(service);
  const related = await getPlannerCaseStudies();

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://studios.houseofsingh.com" },
        { name: PAGE.title, url: URL },
      ]} />
      <section style={{ padding: "var(--hero-pt) var(--page-px) clamp(80px, 10vw, 140px)" }}>
        <ProjectPlanner related={related} initialService={initialService} begin={parseBegin(begin)} />
      </section>
    </>
  );
}
