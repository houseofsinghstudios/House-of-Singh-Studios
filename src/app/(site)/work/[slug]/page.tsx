import type { Metadata } from "next";
import { getAllProjects, getProjectBySlug, getProjectDetailBySlug } from "@/lib/sanity/projects";
import CaseStudyClient from "@/components/work/CaseStudyClient";
import { notFound } from "next/navigation";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { bareTitle, DEFAULT_SHARE_IMAGE, studioTitle, WEBSITE_OG } from "@/lib/seo";
import { servicesForDisciplines } from "@/lib/linking";
import { SERVICE_TERMS, orgRef } from "@/lib/schema";
import { disciplineLabel } from "@/lib/disciplines";
import { jsonLd } from "@/lib/json-ld";

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
      ...WEBSITE_OG,
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
  // Only when Sanity answered and has no such case study: a failed read throws instead
  // (src/lib/sanity/resilience.ts), so the last good page stays.
  if (!project) notFound();

  const detail = await getProjectDetailBySlug(slug);
  // "Services delivered": the service pages this project demonstrates, from its discipline tags.
  const services = servicesForDisciplines(project.disciplines).map((s) => ({ href: `/services/${s}`, label: SERVICE_TERMS[s] }));

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Work', url: 'https://studios.houseofsingh.com/work' },
        { name: project.name, url: `https://studios.houseofsingh.com/work/${slug}` },
      ]} />
      {/* The project as a creative work by the studio. Exploration projects say so in their genre. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.name,
            description: project.seoDescription || project.description,
            ...(project.shareImage || project.image ? { image: project.shareImage || project.image } : {}),
            creator: orgRef,
            about: { "@type": "Thing", name: project.name },
            genre: [
              ...(project.projectType === "exploration" ? ["Exploration"] : []),
              ...(project.disciplines || []).map(disciplineLabel),
            ],
            url: `https://studios.houseofsingh.com/work/${slug}`,
          }),
        }}
      />
      <CaseStudyClient project={project} detail={detail} services={services} />
    </>
  );
}
