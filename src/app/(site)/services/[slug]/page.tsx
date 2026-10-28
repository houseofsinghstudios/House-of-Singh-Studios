import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getServiceBySlug } from "@/data/services";
import ServiceDetailClient from "@/components/services/ServiceDetailClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";
import { AREA_SERVED, SERVICE_TERMS, orgRef } from "@/lib/schema";
import { getAllProjectsGroupedByService } from "@/lib/sanity/projects";
import { getArticleCards } from "@/lib/sanity/articles";
import { articleLine, relatedThinking } from "@/lib/linking";

// Same as /services: newly imported projects appear here within a minute, without a deploy.
export const revalidate = 60;

const serviceSchemaMap: Record<string, { name: string; description: string; breadcrumbName: string; deliverables: string[] }> = {
  "brand-identity": {
    name: "Brand Identity and Visual Design",
    description: "Logo systems, typography, colour architecture, brand guidelines, and visual language that holds across every touchpoint.",
    breadcrumbName: "Brand Identity",
    deliverables: ["Brand Strategy and Positioning", "Logo System", "Typography System", "Colour Architecture", "Brand Guidelines"],
  },
  "visual-media": {
    name: "Visual Media and Content Production",
    description: "Brand photography, video production, social content systems, and visual storytelling with strategic intent.",
    breadcrumbName: "Visual Media",
    deliverables: ["Brand Photography", "Video Production", "Social Content Systems", "Creative Direction"],
  },
  "digital-design": {
    name: "Digital Design and Experience",
    description: "Website design direction, interface systems, content architecture, and ongoing digital design support.",
    breadcrumbName: "Digital Design",
    deliverables: ["UX Research", "UI Design", "Responsive Design", "Development Direction"],
  },
  "creative-strategy": {
    name: "Creative Strategy and Systems",
    description: "Brand positioning, creative direction frameworks, content strategy, and brand governance.",
    breadcrumbName: "Creative Strategy",
    deliverables: ["Brand Audit", "Positioning", "Content Strategy", "Brand Governance"],
  },
};

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const service = getServiceBySlug(slug);
    if (!service) return { title: "Service Not Found" };
    // seoTitle is complete, studio name included, so the title template adds nothing.
    return {
      title: { absolute: service.seoTitle },
      description: service.seoDescription,
      alternates: { canonical: `https://studios.houseofsingh.com/services/${slug}` },
      openGraph: {
        title: service.seoTitle,
        description: service.seoDescription,
        url: `https://studios.houseofsingh.com/services/${slug}`,
        images: [DEFAULT_SHARE_IMAGE],
      },
    };
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  const schema = serviceSchemaMap[slug];
  // Real case studies from Sanity that list this service. Empty if none, or if Sanity is unreachable.
  const [grouped, articleCards] = await Promise.all([getAllProjectsGroupedByService(), getArticleCards()]);
  const projects = grouped[slug] || [];
  // "Related thinking": two or three articles chosen by slug in src/lib/linking.ts.
  const articles = relatedThinking(slug, articleCards).map((a) => ({ ...a, line: articleLine(a.slug, a.line) }));
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Services', url: 'https://studios.houseofsingh.com/services' },
        { name: schema?.breadcrumbName || service.name, url: `https://studios.houseofsingh.com/services/${slug}` },
      ]} />
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": schema.name,
              "serviceType": SERVICE_TERMS[slug],
              "description": schema.description,
              "provider": orgRef,
              "url": `https://studios.houseofsingh.com/services/${slug}`,
              "areaServed": AREA_SERVED,
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": `${schema.name} Deliverables`,
                "itemListElement": schema.deliverables.map(d => ({
                  "@type": "Offer",
                  "itemOffered": { "@type": "Service", "name": d }
                }))
              }
            })
          }}
        />
      )}
      <ServiceDetailClient slug={slug} projects={projects} articles={articles} />
    </>
  );
}
