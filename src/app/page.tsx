import HeroSection from "@/components/homepage/HeroSection";
import WorkSection from "@/components/homepage/WorkSection";
import ArgumentSection from "@/components/homepage/ArgumentSection";
import ServicesSection from "@/components/homepage/ServicesSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import StatsSection from "@/components/homepage/StatsSection";
import NextPageLink from "@/components/layout/NextPageLink";
import CtaSection from "@/components/homepage/CtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WorkSection />
      <ArgumentSection />
      <ServicesSection />
      <TestimonialsSection />
      <StatsSection />
      <NextPageLink />
      <CtaSection />
    </>
  );
}
