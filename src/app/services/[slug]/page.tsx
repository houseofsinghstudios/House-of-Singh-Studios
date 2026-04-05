import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getServiceBySlug } from "@/data/services";
import ServiceDetailClient from "@/components/services/ServiceDetailClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const serviceSchemaMap: Record<string, { name: string; description: string; breadcrumbName: string; deliverables: string[] }> = {
  "brand-identity": {
    name: "Brand Identity and Visual Design",
    description: "Logo systems, typography, color architecture, brand guidelines, and visual language that holds across every touchpoint.",
    breadcrumbName: "Brand Identity",
    deliverables: ["Brand Strategy and Positioning", "Logo System", "Typography System", "Color Architecture", "Brand Guidelines"],
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
    return {
      title: service.seoTitle,
      description: service.seoDescription,
      alternates: { canonical: `https://studios.houseofsingh.com/services/${slug}` },
      openGraph: {
        title: service.seoTitle,
        description: service.seoDescription,
        url: `https://studios.houseofsingh.com/services/${slug}`,
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
              "description": schema.description,
              "provider": {
                "@type": "LocalBusiness",
                "name": "House of Singh Studios",
                "url": "https://studios.houseofsingh.com"
              },
              "url": `https://studios.houseofsingh.com/services/${slug}`,
              "areaServed": ["Toronto", "Canada", "North America"],
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
      <ServiceDetailClient slug={slug} />
    </>
  );
}
