import type { Metadata } from "next";
import SliderDiagnostic from "@/components/SliderDiagnostic";

export const metadata: Metadata = {
  title: "Services — House of Singh Studios",
  description:
    "Brand identity, visual media, digital design, and creative strategy for established businesses. Find out where your brand stands.",
};

export default function ServicesPage() {
  return (
    <section style={{ padding: "160px var(--page-px) clamp(80px, 10vw, 140px)" }}>
      <p
        className="editorial-label"
        data-hero-label
        style={{ marginBottom: 32, letterSpacing: "0.18em", fontSize: 10 }}
      >
        (Services)
      </p>
      <SliderDiagnostic />
    </section>
  );
}
