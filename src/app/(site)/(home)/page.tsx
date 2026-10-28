import type { Metadata } from "next";
import HeroSection from "@/components/homepage/HeroSection";
import WorkSection from "@/components/homepage/WorkSection";
import ArgumentSection from "@/components/homepage/ArgumentSection";
import ServicesSection from "@/components/homepage/ServicesSection";
import ToolBand from "@/components/homepage/ToolBand";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import ProofSection from "@/components/homepage/ProofSection";
import NextPageLink from "@/components/layout/NextPageLink";
import CtaSection from "@/components/homepage/CtaSection";
import { getFeaturedProjects } from "@/lib/sanity/projects";

export const revalidate = 60;

// Search and share text leads with brand identity and design. The share image is the file based
// opengraph-image.tsx beside this page, in the (home) group so no other page inherits it.
// Next copies the openGraph title and description into the twitter card.
export const metadata: Metadata = {
  // absolute: this page sits below the root layout's title template, which would otherwise append the studio name twice.
  title: { absolute: 'House of Singh Studios | Branding and Design Studio, Toronto' },
  description: 'We design brand identities that change how a business is seen, chosen and valued. Websites and visual media from a design studio in Toronto.',
  alternates: { canonical: 'https://studios.houseofsingh.com' },
  openGraph: {
    title: 'House of Singh Studios | Branding and Design Studio, Toronto',
    description: 'Brand identity that changes how a business is seen, chosen and valued.',
    url: 'https://studios.houseofsingh.com',
  },
};

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      <HeroSection />
      <WorkSection projects={featuredProjects} />
      <ArgumentSection />
      <ServicesSection />
      <ToolBand />
      <TestimonialsSection />
      <ProofSection />
      <NextPageLink current="/" />
      <CtaSection />
    </>
  );
}
