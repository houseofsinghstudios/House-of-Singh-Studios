import type { Metadata } from "next";
import SliderDiagnostic from "@/components/SliderDiagnostic";

export const metadata: Metadata = {
  title: "Services — House of Singh Studios",
  description:
    "Brand identity, visual media, digital design, and creative strategy for established businesses. Find out where your brand stands.",
};

export default function ServicesPage() {
  return (
    <section style={{ padding: "160px var(--page-px) 0" }}>
      <p
        className="editorial-label"
        data-hero-label
        style={{ marginBottom: 16 }}
      >
        (Services)
      </p>
      <h1
        data-hero-heading
        className="font-[var(--sans)] font-medium text-[color:var(--text-primary)]"
        style={{
          fontSize: "clamp(32px, 4vw, 48px)",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        Where does your brand stand?
      </h1>
      <p
        data-hero-sub
        className="font-[var(--sans)] font-normal text-[color:var(--text-secondary)]"
        style={{ fontSize: 14, lineHeight: 1.6, marginTop: 12 }}
      >
        Move the sliders. Be honest.
      </p>
      <div style={{ marginTop: 40 }}>
        <SliderDiagnostic />
      </div>
    </section>
  );
}
