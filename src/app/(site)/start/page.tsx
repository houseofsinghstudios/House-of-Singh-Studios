import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ProjectPlanner from "@/components/project-planner/ProjectPlanner";
import { PAGE } from "@/lib/project-planner/content";
import { loadPublishedPricing } from "@/lib/project-planner/pricing";
import { parseBegin, parseService } from "@/lib/project-planner/start-links";
import { getPlannerCaseStudies } from "@/lib/sanity/projects";
import { studioTitle } from "@/lib/seo";

const URL = "https://studios.houseofsingh.com/start";

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.description,
  alternates: { canonical: URL },
  openGraph: { title: studioTitle(PAGE.title), description: PAGE.description, url: URL },
};

type Props = { searchParams: Promise<{ service?: string | string[]; begin?: string | string[] }> };

// Prices and related work are read on the server and handed to the planner. ?service= preselects
// one known service and ?begin=1 opens the first question; anything else is ignored.
export default async function StartPage({ searchParams }: Props) {
  const { service, begin } = await searchParams;
  const initialService = parseService(service);
  const [pricing, related] = await Promise.all([loadPublishedPricing(), getPlannerCaseStudies()]);

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://studios.houseofsingh.com" },
        { name: PAGE.title, url: URL },
      ]} />
      <section style={{ padding: "var(--hero-pt) var(--page-px) clamp(80px, 10vw, 140px)" }}>
        <ProjectPlanner pricing={pricing} related={related} initialService={initialService} begin={parseBegin(begin)} />
      </section>
    </>
  );
}
