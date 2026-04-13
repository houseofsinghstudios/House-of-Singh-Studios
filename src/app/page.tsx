import type { Metadata } from "next";
import HeroSection from "@/components/homepage/HeroSection";
import WorkSection from "@/components/homepage/WorkSection";
import ArgumentSection from "@/components/homepage/ArgumentSection";
import ServicesSection from "@/components/homepage/ServicesSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import StatsSection from "@/components/homepage/StatsSection";
import NextPageLink from "@/components/layout/NextPageLink";
import CtaSection from "@/components/homepage/CtaSection";
import { getFeaturedProjects } from "@/lib/sanity/projects";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'House of Singh Studios — AI Powered Design Studio Toronto',
  description: 'A design studio powered by AI systems and led by creative direction. We build brand identities, visual systems, and digital experiences for established businesses.',
  alternates: { canonical: 'https://studios.houseofsingh.com' },
  openGraph: {
    title: 'House of Singh Studios — AI Powered Design Studio Toronto',
    description: 'A design studio powered by AI systems and led by creative direction. We build brand identities, visual systems, and digital experiences for established businesses.',
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
      <TestimonialsSection />
      <StatsSection />
      <NextPageLink />
      <CtaSection />
    </>
  );
}
