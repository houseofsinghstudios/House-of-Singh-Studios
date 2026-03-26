import type { Metadata } from "next";
import ServiceScrollSection from "@/components/services/ServiceScrollSection";
import ServicesUnpackedAccordion from "@/components/services/ServicesUnpackedAccordion";
import Button from "@/components/ui/Button";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services — House of Singh Studios",
  description:
    "Brand identity, visual media, digital design, and creative strategy for established businesses ready to invest in how they show up.",
};

const SERVICE_IMAGES: Record<
  string,
  { src: string; alt: string; projectName: string; projectCategory: string }[]
> = {
  "brand-identity": [
    {
      src: "/images/projects/tedxtoronto/tedxtoronto.jpg",
      alt: "TEDxToronto visual identity system",
      projectName: "TEDxToronto Visual Identity",
      projectCategory: "Brand Identity",
    },
  ],
  "visual-media": [
    {
      src: "/images/projects/meridian/meridian.jpg",
      alt: "Meridian Financial Group brand photography",
      projectName: "Meridian Financial Group",
      projectCategory: "Brand Identity",
    },
  ],
  "digital-design": [
    {
      src: "/images/projects/soulbound/soulbound.jpg",
      alt: "Soulbound publication design",
      projectName: "Soulbound Publication",
      projectCategory: "Publication Design",
    },
  ],
  "creative-strategy": [
    {
      src: "/images/projects/nomad-kitchen/nomad-kitchen.jpg",
      alt: "Nomad Kitchen brand identity and packaging",
      projectName: "Nomad Kitchen",
      projectCategory: "Brand Identity · Packaging",
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section
        style={{
          padding:
            "var(--hero-pt) var(--page-px) clamp(64px, 8vw, 100px)",
        }}
      >
        <p
          className="editorial-label css-reveal"
          style={{ margin: "0 0 16px", transitionDelay: "0ms" }}
        >
          (Services)
        </p>
        <h1
          className="svc-v2-heading css-reveal"
          style={{ transitionDelay: "100ms" }}
        >
          Every service solves a business problem.
        </h1>
        <p
          className="svc-v2-sub css-reveal"
          style={{ transitionDelay: "200ms" }}
        >
          Four capabilities. One studio. Every service connects to measurable
          business outcomes.
        </p>
        <p
          className="svc-v2-scroll css-reveal"
          style={{ transitionDelay: "300ms" }}
        >
          (Scroll)
        </p>
      </section>

      {/* ═══ SERVICE BLOCKS (sticky scroll theater — do not modify) ═══ */}
      <section
        className="svc-theater-container"
        style={{ padding: "0 var(--page-px) clamp(64px, 8vw, 120px)" }}
      >
        {services.map((svc, i) => (
          <div key={svc.slug}>
            {i > 0 && <hr className="svc-theater-divider" />}
            <ServiceScrollSection
              number={svc.number}
              name={svc.name}
              headline={svc.tagline}
              body={svc.description}
              deliverables={svc.deliverables.map((d) => d.name)}
              slug={svc.slug}
              images={SERVICE_IMAGES[svc.slug] || []}
              isFirst={i === 0}
            />
          </div>
        ))}
      </section>

      {/* ═══ SERVICES UNPACKED ═══ */}
      <section
        className="css-reveal"
        style={{
          background: "var(--bg-shift)",
          padding: "clamp(64px, 8vw, 120px) var(--page-px)",
        }}
      >
        <p className="editorial-label" style={{ margin: "0 0 12px" }}>
          (Services unpacked)
        </p>
        <h2 className="su-heading">Detailed capabilities.</h2>
        <ServicesUnpackedAccordion />
      </section>

      {/* ═══ CTA ═══ */}
      <section
        className="svc-v2-cta css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "clamp(80px, 10vw, 160px) var(--page-px)",
        }}
      >
        <div className="svc-v2-cta-grid">
          <div>
            <p className="svc-v2-cta-label">(Next step)</p>
            <h2 className="svc-v2-cta-heading">
              Ready to see which service fits your business?
            </h2>
            <p className="svc-v2-cta-sub">We respond within 24 hours.</p>
          </div>
          <div className="svc-v2-cta-buttons">
            <Button
              href="/contact"
              variant="primary-inverted"
              data-cursor="link"
            >
              Book a Discovery Call
            </Button>
            <Button
              href="/contact"
              variant="secondary-inverted"
              data-cursor="link"
            >
              Start a Project
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
