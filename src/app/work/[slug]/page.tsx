import type { Metadata } from "next";
import { projects, getProjectBySlug } from "@/data/projects";
import CaseStudyClient from "@/components/work/CaseStudyClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.seoTitle,
    description: project.seoDescription,
    alternates: { canonical: `https://studios.houseofsingh.com/work/${slug}` },
    openGraph: {
      title: project.seoTitle,
      description: project.seoDescription,
      url: `https://studios.houseofsingh.com/work/${slug}`,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <CaseStudyClient project={project} />;
}
