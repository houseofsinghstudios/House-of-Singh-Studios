import type { Metadata } from "next";
import { Suspense } from "react";
import { Link } from "next-view-transitions";
import { DEFAULT_SHARE_IMAGE, WEBSITE_OG } from "@/lib/seo";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import Button from "@/components/ui/Button";
import NextPageLink from "@/components/layout/NextPageLink";
import WorkIndex, { WorkIndexFromUrl } from "@/components/work/index/WorkIndex";
import type { WorkItem } from "@/components/work/index/types";
import { getIndexProjects } from "@/lib/sanity/projects";
import { heroImageUrl } from "@/lib/sanity/image";
import { heroObjectPosition } from "@/lib/homepage-hero";
import { projectMeta, workKindLabel, type IndexProject } from "@/lib/work-index";
import { projectTypeLabel } from "@/lib/initiatives/types";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { PAGE_DESCRIPTIONS } from "@/lib/page-descriptions";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: 'Brand Identity Portfolio, Toronto | House of Singh Studios' },
  description: PAGE_DESCRIPTIONS.work,
  // Every /work address (?for= and ?in= included) points here: the choices only reorder the list.
  alternates: { canonical: 'https://studios.houseofsingh.com/work' },
  openGraph: {
    ...WEBSITE_OG,
    title: 'Brand Identity Portfolio, Toronto | House of Singh Studios',
    description: 'Brand identities, visual narratives, and digital experiences. View our portfolio.',
    url: 'https://studios.houseofsingh.com/work',
    images: [DEFAULT_SHARE_IMAGE],
  },
};

// What the browser gets for each project: finished image URLs (the Studio crop applied), cropped
// proportions and focal points, and the words already chosen. No case study text.
function toWorkItem(project: IndexProject, index: number): WorkItem {
  return {
    slug: project.slug,
    title: project.title,
    number: index + 1,
    sector: project.sector,
    disciplines: project.disciplines,
    meta: projectMeta(project),
    year: project.year,
    typeLabel: projectTypeLabel(project.projectType),
    kind: workKindLabel(project.projectType),
    line: project.line,
    images: project.images.map((image, i) => {
      const c = image.crop;
      return {
        src: heroImageUrl(image),
        width: Math.round(image.width * (c ? 1 - c.left - c.right : 1)),
        height: Math.round(image.height * (c ? 1 - c.top - c.bottom : 1)),
        alt: image.alt,
        // The blurred placeholder for the first image only: the one the window opens on.
        ...(i === 0 && image.lqip ? { lqip: image.lqip } : {}),
        position: heroObjectPosition(image),
      };
    }),
  };
}

export default async function WorkPage() {
  const items = (await getIndexProjects()).map(toWorkItem);
  const count = String(items.length).padStart(2, "0");

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Work', url: 'https://studios.houseofsingh.com/work' },
      ]} />
      <section className="wi-page">
        <p className="editorial-label wi-count">Work ({count})</p>
        <h1 className="sr-only">Work: brand identity, packaging, websites and photography by House of Singh Studios, Toronto</h1>
        {/* The choices live in the address (?for= and ?in=). Until the browser reads it, and in the
            page source, the whole list shows in the default order, every project an h3 link. */}
        <Suspense fallback={<WorkIndex items={items} choice={{}} />}>
          <WorkIndexFromUrl items={items} />
        </Suspense>
      </section>

      <p className="wp-initiatives-note">
        Some projects are Explorations or Parallel concepts.{" "}
        <Link href="/initiatives" className="underline underline-offset-4" data-cursor="link">About our initiatives.</Link>
      </p>

      <NextPageLink current="/work" />

      <section
        className="css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "120px var(--page-px)",
          marginTop: "clamp(80px, 10vw, 140px)",
        }}
      >
        <div className="cta-centered">
          <p className="cta-label">(Next Step)</p>
          <h2 className="cta-heading">Have a project in mind?</h2>
          <div className="cta-buttons">
            <Button href={DISCOVERY_CALL_URL} variant="primary-inverted" data-cursor="link" target="_blank" rel="noopener noreferrer">
              Book a Discovery Call
            </Button>
            <Button href="/start" variant="secondary-inverted" data-cursor="link">
              Start a Project
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
