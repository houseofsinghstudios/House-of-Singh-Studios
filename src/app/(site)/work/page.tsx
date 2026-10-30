import type { Metadata } from "next";
import { DEFAULT_SHARE_IMAGE, WEBSITE_OG } from "@/lib/seo";
import WorkPageClient from "@/components/work/WorkPageClient";
import { workCard } from "@/components/work/WorkCards";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { getAllProjects, getWorkTypeFilters } from "@/lib/sanity/projects";
import { PAGE_DESCRIPTIONS } from "@/lib/page-descriptions";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: 'Brand Identity Portfolio, Toronto | House of Singh Studios' },
  description: PAGE_DESCRIPTIONS.work,
  alternates: { canonical: 'https://studios.houseofsingh.com/work' },
  openGraph: {
    ...WEBSITE_OG,
    title: 'Brand Identity Portfolio, Toronto | House of Singh Studios',
    description: 'Brand identities, visual narratives, and digital experiences. View our portfolio.',
    url: 'https://studios.houseofsingh.com/work',
    images: [DEFAULT_SHARE_IMAGE],
  },
};

export default async function WorkPage() {
  // Card fields only: the grid shows titles, tags and images, so the case study text stays here.
  const projects = (await getAllProjects()).map(workCard);
  const filters = getWorkTypeFilters();

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Work', url: 'https://studios.houseofsingh.com/work' },
      ]} />
      <WorkPageClient projects={projects} filters={filters} />
    </>
  );
}
