import type { Metadata } from "next";
import EditorialLabel from "@/components/ui/EditorialLabel";
import SliderDiagnostic from "@/components/SliderDiagnostic";

export const metadata: Metadata = {
  title: "Services — House of Singh Studios",
  description:
    "Brand identity, visual media, digital design, and creative strategy for established businesses. Find out where your brand stands.",
};

export default function ServicesPage() {
  return (
    <>
      <section
        className="flex flex-col justify-center px-[var(--page-px)]"
        style={{ minHeight: "60vh", paddingTop: 140 }}
      >
        <EditorialLabel data-hero-label text="Services" />

        <h1
          data-hero-heading
          className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] mt-4 overflow-hidden"
          style={{ fontSize: "clamp(44px, 6vw, 84px)", lineHeight: 1.05 }}
        >
          Where does your brand stand?
        </h1>

        <p
          data-hero-sub
          className="font-[var(--sans)] font-normal text-[color:var(--text-secondary)] max-w-[540px] mt-6"
          style={{ fontSize: "clamp(14px, 1.1vw, 16px)", lineHeight: 1.7 }}
        >
          Move the sliders. Be honest. We will show you where to focus.
        </p>
      </section>

      <section style={{ padding: "0 var(--page-px) clamp(80px, 10vw, 140px)" }}>
        <SliderDiagnostic />
      </section>
    </>
  );
}
