import HeroSection from "@/components/homepage/HeroSection";
import WorkSection from "@/components/homepage/WorkSection";
import ArgumentSection from "@/components/homepage/ArgumentSection";
import VisualBreakSection from "@/components/homepage/VisualBreakSection";
import ServicesSection from "@/components/homepage/ServicesSection";
import StatsSection from "@/components/homepage/StatsSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import CtaSection from "@/components/homepage/CtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WorkSection />
      <ArgumentSection />
      <VisualBreakSection />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
