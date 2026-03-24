import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import DiagnosticTrigger from "@/components/DiagnosticTrigger";
import ServiceScrollSection from "@/components/services/ServiceScrollSection";
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
      <section
        className="svc-hero"
        style={{ padding: "140px var(--page-px) 64px" }}
      >
        <p className="svc-hero-label" data-hero-label>
          (Services)
        </p>
        <h1 className="svc-hero-heading" data-hero-heading>
          We solve brand problems for established businesses.
        </h1>
        <p className="svc-hero-sub" data-hero-sub>
          Four situations. Four solutions. Find the one that sounds like yours.
        </p>
        <DiagnosticTrigger />
      </section>

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

      <section
        className="svc-dark-cta"
        style={{
          background: "var(--text-primary)",
          padding: "80px var(--page-px)",
        }}
      >
        <p className="svc-dark-cta-text">Ready to start a conversation?</p>
        <div className="svc-dark-cta-btns">
          <Link href="/contact" className="svc-btn-light" data-cursor="link">
            Discovery Call
          </Link>
          <Link href="/packages" className="svc-btn-outline" data-cursor="link">
            Packages
          </Link>
        </div>
      </section>
    </>
  );
}
