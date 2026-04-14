"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import DiagnosticTrigger from "@/components/DiagnosticTrigger";
import ServiceProjectCard from "@/components/services/ServiceProjectCard";
import type { ServiceProject } from "@/lib/sanity/projects";

const BLOCKS = [
  {
    number: "01",
    label: "Brand Identity",
    name: "Brand Identity and Visual Design",
    description:
      "Your business has grown. Your brand has not kept up. Prospects compare you to competitors with sharper visuals and walk away. We build complete visual systems that make your business look as established as it actually is.",
    slug: "brand-identity",
    serviceCategory: "brand-identity",
    deliverables: [
      "Brand Strategy and Positioning",
      "Brand Naming",
      "Logo System",
      "Typography System",
      "Color Architecture",
      "Brand Guidelines",
      "Collateral Suite",
      "Packaging Design",
      "Art Direction",
    ],
    fallbackImage: {
      src: "/images/projects/tedxtoronto/tedxtoronto.jpg",
      alt: "TEDxToronto visual identity system",
    },
    fallbackTags: "Brand Identity",
    fallbackName: "TEDxToronto Visual Identity",
  },
  {
    number: "02",
    label: "Visual Media",
    name: "Visual Media and Content Production",
    description:
      "Your content looks different on every platform. Nothing connects. We direct and produce brand photography, video, and content systems that hold together across every channel.",
    slug: "visual-media",
    serviceCategory: "visual-media",
    deliverables: [
      "Brand Photography",
      "Video Production",
      "Short Form Content",
      "Social Content Systems",
      "Creative Direction",
      "Script and Narrative",
    ],
    fallbackImage: {
      src: "/images/projects/soulbound/soulbound.jpg",
      alt: "Soulbound publication design",
    },
    fallbackTags: "Publication Design — Art Direction",
    fallbackName: "Soulbound Publication",
  },
  {
    number: "03",
    label: "Digital Design",
    name: "Digital Design and Experience",
    description:
      "Your website exists. But it does not work for your business. People browse for 30 seconds and leave. We design digital experiences where every page has a job.",
    slug: "digital-design",
    serviceCategory: "digital-design",
    deliverables: [
      "UX Research",
      "Information Architecture",
      "Wireframing",
      "UI Design",
      "Interaction Design",
      "Responsive Design",
      "Development Direction",
      "Post-Launch Support",
    ],
    fallbackImage: null,
    fallbackTags: "Digital Design",
    fallbackName: "Coming Soon",
  },
  {
    number: "04",
    label: "Creative Strategy",
    name: "Creative Strategy and Systems",
    description:
      "Your team makes brand decisions without a playbook. Marketing, agencies, freelancers — they all interpret your brand differently. We build the framework that lets your team operate without you.",
    slug: "creative-strategy",
    serviceCategory: "creative-strategy",
    deliverables: [
      "Brand Audit",
      "Positioning",
      "Audience Discovery",
      "Brand Voice",
      "Creative Frameworks",
      "Content Strategy",
      "Brand Governance",
    ],
    fallbackImage: null,
    fallbackTags: "Creative Strategy",
    fallbackName: "Coming Soon",
  },
];

interface Props {
  projectsByCategory?: Record<string, ServiceProject[]>;
}

export default function ServicesClient({ projectsByCategory }: Props) {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section
        style={{
          padding: "var(--hero-pt) var(--page-px) clamp(64px, 8vw, 100px)",
        }}
      >
        <p
          className="editorial-label svc-hero-stagger"
          style={{ margin: "0 0 16px" }}
        >
          (Services)
        </p>
        <h1
          className="svc-hero-stagger"
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 500,
            fontSize: "clamp(28px, 4vw, 48px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: "var(--text-primary)",
            margin: "0 0 20px",
            maxWidth: 620,
          }}
        >
          We solve brand problems for established businesses.
        </h1>
        <p
          className="svc-hero-stagger"
          style={{
            fontFamily: "var(--sans)",
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            margin: 0,
            maxWidth: 440,
          }}
        >
          Four capabilities. Find the one that sounds like yours.
        </p>
      </section>

      {/* ═══ SERVICE BLOCKS ═══ */}
      <section style={{ padding: "0 var(--page-px) clamp(64px, 8vw, 120px)" }}>
        {BLOCKS.map((block) => (
          <div key={block.slug} className="svc-block css-reveal">
            {/* Left column */}
            <div className="svc-block-left">
              <p className="svc-block-label">
                ({block.number}) {block.label}
              </p>
              <h2 className="svc-block-name">{block.name}</h2>
              <p className="svc-block-desc">{block.description}</p>
              <p className="svc-del-label">Deliverables</p>
              <ul className="svc-del-list">
                {block.deliverables.map((d) => (
                  <li key={d} className="svc-del-item">
                    {d}
                  </li>
                ))}
              </ul>
              <Link
                href={`/services/${block.slug}`}
                className="svc-block-btn"
                style={{ marginTop: 32 }}
                data-cursor="link"
              >
                Learn More
              </Link>
            </div>

            {/* Right column */}
            <div className="svc-block-right">
              {(() => {
                const sanityProjects = projectsByCategory?.[block.serviceCategory] || [];
                if (sanityProjects.length > 0) {
                  return <ServiceProjectCard projects={sanityProjects} />;
                }
                if (block.fallbackImage) {
                  return (
                    <>
                      <div className="svc-block-img">
                        <Image
                          src={block.fallbackImage.src}
                          alt={block.fallbackImage.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="svc-block-proj-meta">
                        <p className="svc-block-proj-tags">{block.fallbackTags}</p>
                        <p className="svc-block-proj-name">{block.fallbackName}</p>
                      </div>
                    </>
                  );
                }
                return (
                  <>
                    <div className="svc-block-img-placeholder">
                      <span>Project image coming soon</span>
                    </div>
                    <div className="svc-block-proj-meta">
                      <p className="svc-block-proj-tags">{block.fallbackTags}</p>
                      <p className="svc-block-proj-name">{block.fallbackName}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        ))}
      </section>

      {/* ═══ DIAGNOSTIC TRIGGER ═══ */}
      <div style={{ padding: "clamp(56px, 8vw, 100px) var(--page-px) 0" }}>
        <DiagnosticTrigger />
      </div>
    </>
  );
}
