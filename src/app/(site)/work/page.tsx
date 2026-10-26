import type { Metadata } from "next";
import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";
import WorkPageClient from "@/components/work/WorkPageClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { getAllProjects, getWorkTypeFilters } from "@/lib/sanity/projects";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Work',
  description: 'Brand identities, visual narratives, and digital experiences for businesses ready to show up differently. View our portfolio.',
  alternates: { canonical: 'https://studios.houseofsingh.com/work' },
  openGraph: {
    title: 'Work — House of Singh Studios',
    description: 'Brand identities, visual narratives, and digital experiences. View our portfolio.',
    url: 'https://studios.houseofsingh.com/work',
    images: [DEFAULT_SHARE_IMAGE],
  },
};

export default async function WorkPage() {
  const projects = await getAllProjects();
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
