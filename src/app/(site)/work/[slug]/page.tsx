import type { Metadata } from "next";
import { getAllProjects, getProjectBySlug, getProjectDetailBySlug } from "@/lib/sanity/projects";
import CaseStudyClient from "@/components/work/CaseStudyClient";
import { notFound } from "next/navigation";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { DEFAULT_SHARE_IMAGE, bareTitle, studioTitle } from "@/lib/seo";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  const title = bareTitle(project.seoTitle, project.name);
  return {
    title,
    description: project.seoDescription,
    alternates: { canonical: `https://studios.houseofsingh.com/work/${slug}` },
    openGraph: {
      title: studioTitle(title),
      description: project.seoDescription,
      url: `https://studios.houseofsingh.com/work/${slug}`,
      // The project's cover, cropped to 1200x630, with the project title as alt text.
      images: project.shareImage
        ? [{ url: project.shareImage, width: 1200, height: 630, alt: project.name }]
        : [DEFAULT_SHARE_IMAGE],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const detail = await getProjectDetailBySlug(slug);

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Work', url: 'https://studios.houseofsingh.com/work' },
        { name: project.name, url: `https://studios.houseofsingh.com/work/${slug}` },
      ]} />
      <CaseStudyClient project={project} detail={detail} />
    </>
  );
}
