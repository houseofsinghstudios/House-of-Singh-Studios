import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ParallelPage from "@/components/initiatives/ParallelPage";
import CommonsPage from "@/components/initiatives/CommonsPage";
import { COMMONS, PARALLEL } from "@/lib/initiatives/content";
import { BUILT_PAGES, programmePage, type BuiltPage } from "@/lib/initiatives/pages";
import { getInitiatives } from "@/lib/sanity/initiatives";
import { getProjectsByType } from "@/lib/sanity/projects";
import { DEFAULT_SHARE_IMAGE, STUDIO_NAME, studioTitle } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

const SITE = "https://studios.houseofsingh.com";
const COPY: Record<BuiltPage, { title: string; description: string }> = { parallel: PARALLEL, commons: COMMONS };

// Parallel and Commons are prerendered. Any other slug, Foundry included, is resolved on request
// and is a 404 unless that initiative is visible, has a page and its page is built.
export function generateStaticParams() {
  return BUILT_PAGES.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const initiative = programmePage(slug, await getInitiatives());
  if (!initiative) return {};
  const copy = COPY[initiative.slug];
  const title = initiative.seoTitle || copy.title;
  const description = initiative.seoDescription || copy.description;
  const url = `${SITE}/initiatives/${slug}`;
  // A title that already names the studio skips the root title template, so the name appears once.
  const named = title.includes(STUDIO_NAME);
  return {
    title: named ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { title: named ? title : studioTitle(title), description, url, images: [DEFAULT_SHARE_IMAGE] },
  };
}

export default async function ProgrammePage({ params }: Props) {
  const { slug } = await params;
  const initiative = programmePage(slug, await getInitiatives());
  if (!initiative) notFound();
  const projects = (await getProjectsByType([initiative.slug]))[initiative.slug];

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: SITE },
        { name: "Initiatives", url: `${SITE}/initiatives` },
        { name: initiative.name, url: `${SITE}/initiatives/${slug}` },
      ]} />
      {initiative.slug === "parallel" ? (
        <ParallelPage projects={projects} />
      ) : (
        <CommonsPage projects={projects} recognitions={initiative.recognitions} />
      )}
    </>
  );
}
