import HeroSection from "@/components/homepage/HeroSection";
import ArgumentSection from "@/components/homepage/ArgumentSection";
import VisualBreakSection from "@/components/homepage/VisualBreakSection";
import StatsSection from "@/components/homepage/StatsSection";
import ServicesSection from "@/components/homepage/ServicesSection";
import WorkSection from "@/components/homepage/WorkSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import CtaSection from "@/components/homepage/CtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ArgumentSection />
      <VisualBreakSection />
      <StatsSection />
      <ServicesSection />
      <WorkSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
