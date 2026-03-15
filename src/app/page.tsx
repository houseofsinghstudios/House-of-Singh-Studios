import HeroSection from "@/components/homepage/HeroSection";
import WorkSection from "@/components/homepage/WorkSection";
import ArgumentSection from "@/components/homepage/ArgumentSection";
import ServicesSection from "@/components/homepage/ServicesSection";
import AboutPreview from "@/components/homepage/AboutPreview";
import ClientsSection from "@/components/homepage/ClientsSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import StatsSection from "@/components/homepage/StatsSection";
import CtaSection from "@/components/homepage/CtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WorkSection />
      <ArgumentSection />
      <ServicesSection />
      <AboutPreview />
      <ClientsSection />
      <TestimonialsSection />
      <StatsSection />
      <CtaSection />
    </>
  );
}
