import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getServiceBySlug } from "@/data/services";
import ServiceDetailClient from "@/components/services/ServiceDetailClient";

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
      title: `${service.name} — House of Singh Studios`,
      description: service.tagline,
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
  return <ServiceDetailClient slug={slug} />;
}
