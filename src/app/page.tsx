import HeroSection from "@/components/homepage/HeroSection";
import WorkSection from "@/components/homepage/WorkSection";
import ArgumentSection from "@/components/homepage/ArgumentSection";
import ServicesSection from "@/components/homepage/ServicesSection";
import StatsSection from "@/components/homepage/StatsSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import CtaSection from "@/components/homepage/CtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ArgumentSection />
      <ServicesSection />
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--border)",
          margin: "0 var(--page-px)",
        }}
      />
      <StatsSection />
      <WorkSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
