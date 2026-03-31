"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";

const LENSES = [
  {
    number: "01",
    label: "Build the brand",
    heading: "Strategy, identity, and the systems that hold everything together.",
    body: "Before anything visual exists, the thinking has to be right. We define what your brand stands for, how it behaves, and how it should look — then build the system that makes it real across every touchpoint.",
    deliverables: [
      "Brand Positioning and Strategy",
      "Brand Naming",
      "Logo Systems and Brand Marks",
      "Typography System",
      "Color Architecture",
      "Brand Guidelines and Documentation",
      "Creative Direction Frameworks",
      "Visual Consistency Systems",
      "AI Workflow Integration",
    ],
    image: {
      src: "/images/projects/tedxtoronto/tedxtoronto.jpg",
      alt: "TEDxToronto visual identity system",
      category: "Brand Identity",
      name: "TEDxToronto Visual Identity",
    },
    workLink: "/work",
  },
  {
    number: "02",
    label: "Show the brand",
    heading: "Photography, film, digital platforms, and the content that fills them.",
    body: "A brand system means nothing if it is not visible. We produce the visual content and design the digital platforms that put your brand in front of the people who matter — with strategic intent, not decoration.",
    deliverables: [
      "Brand Photography and Art Direction",
      "Campaign Films and Short-form Video",
      "Social Content Systems",
      "Website Design Direction",
      "Interface and Layout Systems",
      "Content Architecture",
      "Ongoing Digital Design Support",
    ],
    image: {
      src: "/images/projects/soulbound/soulbound.jpg",
      alt: "Soulbound publication design",
      category: "Publication Design",
      name: "Soulbound Publication",
    },
    workLink: "/work",
  },
];

export default function ServicesClient() {
  const parallaxRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    function onScroll() {
      parallaxRefs.current.forEach((wrap) => {
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const windowH = window.innerHeight;
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const offset = (progress - 0.5) * 20;
        const img = wrap.querySelector(".svc-parallax-img") as HTMLElement;
        if (img) img.style.transform = `translateY(${-10 + offset}%)`;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Hero */}
      <section style={{ padding: "var(--hero-pt) var(--page-px) clamp(80px, 10vw, 140px)" }}>
        <p className="editorial-label css-reveal" style={{ margin: "0 0 24px" }}>(Services)</p>
        <h1 className="svc-hero-heading css-reveal">
          We work through two lenses. Both lead to the same place: a brand that performs.
        </h1>
      </section>

      {/* Lenses */}
      <section style={{ padding: "0 var(--page-px)" }}>
        {LENSES.map((lens, i) => (
          <div key={lens.number}>
            {i > 0 && <div className="svc-lens-divider" />}
            <div className="svc-lens" style={i > 0 ? { paddingTop: "clamp(100px, 12vw, 140px)" } : undefined}>
              <p className="editorial-label css-reveal" style={{ marginBottom: "clamp(40px, 5vw, 48px)" }}>
                ({lens.number}) {lens.label}
              </p>

              <div className="svc-lens-grid">
                {/* Left: scrolling text */}
                <div className="svc-lens-text">
                  <h2 className="svc-lens-heading css-reveal">{lens.heading}</h2>
                  <p className="svc-lens-body css-reveal">{lens.body}</p>
                  <p className="svc-lens-del-label css-reveal">Deliverables</p>
                  <div className="svc-lens-del-list">
                    {lens.deliverables.map((d, j) => (
                      <p key={j} className="svc-lens-del-item css-reveal">{d}</p>
                    ))}
                  </div>
                  <div className="css-reveal" style={{ marginTop: "clamp(32px, 4vw, 40px)" }}>
                    <Link href={lens.workLink} className="svc-lens-link" data-cursor="link">
                      See related work <span className="svc-lens-link-arrow">→</span>
                    </Link>
                  </div>
                </div>

                {/* Right: sticky image with parallax */}
                <div className="svc-lens-image-col">
                  <div
                    className="svc-parallax-wrap"
                    ref={(el) => { if (el) parallaxRefs.current[i] = el; }}
                  >
                    <div className="svc-parallax-img">
                      <Image
                        src={lens.image.src}
                        alt={lens.image.alt}
                        fill
                        sizes="50vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <p className="svc-lens-img-cat">{lens.image.category}</p>
                    <p className="svc-lens-img-name">{lens.image.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div style={{ height: "clamp(80px, 10vw, 120px)" }} />
      </section>
    </>
  );
}
