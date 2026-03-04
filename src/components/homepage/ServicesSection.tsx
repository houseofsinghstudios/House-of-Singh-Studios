"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES_SECTION } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 4: THE METHOD — "The Rotating Panel"
 *
 * Stacking card panels. Each service stacks on top of the previous.
 * CSS SDA handles the push-back animation on supported browsers.
 * GSAP ScrollTrigger fallback for Firefox.
 * Each panel has a slightly different background tint.
 */

const SERVICE_DESCRIPTIONS: Record<string, string[]> = {
  "Brand Identity and Visual Design": [
    "Logo systems and visual marks",
    "Typography selection and hierarchy",
    "Color systems and palettes",
    "Brand guidelines documentation",
    "Collateral templates",
  ],
  "Visual Media and Content Production": [
    "Photography art direction",
    "Video concept and production",
    "Motion graphics and animation",
    "Social media visual systems",
    "Campaign creative",
  ],
  "Digital Design and Experience": [
    "Website design and development",
    "Product interface design",
    "Interaction design",
    "Design systems for digital",
    "Conversion optimization",
  ],
  "Creative Strategy and Systems": [
    "Brand strategy and positioning",
    "Creative direction frameworks",
    "Content strategy",
    "Campaign planning",
    "Brand architecture",
  ],
};

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    // Firefox fallback for stacking push-back
    if (!CSS.supports("animation-timeline", "view()")) {
      const ctx = gsap.context(() => {
        const panels = section.querySelectorAll<HTMLElement>(".service-panel");
        panels.forEach((panel, i) => {
          if (i < panels.length - 1) {
            ScrollTrigger.create({
              trigger: panels[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
              onUpdate: (self) => {
                const p = self.progress;
                panel.style.transform = `scale(${1 - p * 0.05}) translateY(${p * 20}px)`;
                panel.style.filter = `brightness(${1 - p * 0.08})`;
              },
            });
          }
        });
      }, section);

      return () => ctx.revert();
    }
  }, []);

  return (
    <section ref={sectionRef} className="section-reveal-wipe">
      <div style={{ padding: "40px var(--page-px) 0" }}>
        <EditorialLabel text="(Capabilities)" className="mb-4" />
      </div>

      {SERVICES_SECTION.items.map((service, i) => (
        <div
          key={service.href}
          className="service-panel"
          style={{
            position: "sticky",
            top: 80,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            padding: "80px var(--page-px)",
            background: service.color,
            zIndex: i + 1,
          }}
        >
          <div style={{ display: "flex", gap: "clamp(40px, 6vw, 80px)", width: "100%", alignItems: "center" }}>
            {/* Left 50%: Text */}
            <div style={{ flex: "0 0 50%" }}>
              <span style={{
                fontFamily: "var(--sans)", fontSize: 12, fontWeight: 400,
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "var(--text-faint)",
              }}>
                0{i + 1}
              </span>

              <h3
                style={{
                  fontFamily: "var(--serif)", fontWeight: 600,
                  fontSize: "clamp(28px, 3.5vw, 48px)", lineHeight: 1.15,
                  color: "var(--text-primary)", margin: "12px 0 0",
                  viewTransitionName: `service-${service.href.split("/").pop()}`,
                }}
              >
                {service.title}
              </h3>

              <p style={{
                fontFamily: "var(--sans)", fontSize: 16, fontWeight: 400,
                color: "var(--text-muted)", lineHeight: 1.6, marginTop: 16, maxWidth: 400,
              }}>
                {service.sentence}
              </p>

              {/* Deliverables list */}
              <ul style={{
                listStyle: "none", padding: 0, margin: "24px 0 0",
                display: "flex", flexDirection: "column", gap: 8,
              }}>
                {(SERVICE_DESCRIPTIONS[service.title] || []).map((item, j) => (
                  <li key={j} style={{
                    fontFamily: "var(--sans)", fontSize: 14, fontWeight: 400,
                    color: "var(--text-faint)",
                  }}>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={service.href}
                className="arrow-link no-underline"
                data-cursor="link"
                style={{ display: "inline-block", marginTop: 28 }}
              >
                <span style={{
                  fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
                  color: "var(--text-primary)",
                }}>
                  Learn More <span className="arrow-icon">&rarr;</span>
                </span>
              </Link>
            </div>

            {/* Right 50%: Image placeholder */}
            <div
              data-cursor="distort"
              style={{
                flex: "0 0 50%",
                aspectRatio: "4/5",
                background: `linear-gradient(155deg, ${service.color}, var(--bg-shift))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <span style={{
                fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase",
                letterSpacing: "0.12em", color: "var(--text-faint)",
              }}>
                {service.title.split(" ")[0]} Image
              </span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
