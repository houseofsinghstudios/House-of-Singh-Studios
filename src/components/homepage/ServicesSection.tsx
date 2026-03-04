"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES_SECTION } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 4: THE METHOD — "The Rotating Panel"
 *
 * Desktop: Stacking card panels with CSS SDA push-back.
 * Mobile: 75svh sticky cards with CSS SDA push-back + image reveal.
 * Tablet: 80svh sticky cards, two-column inner layout.
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

const BG_TINTS = ["#FAFAF7", "#F5F5FA", "#F5FAF5", "#FAF5F5"];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const w = window.innerWidth;
    setIsMobile(w <= 600);
    setIsTablet(w > 600 && w <= 900);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    // Firefox fallback for stacking push-back (all screen sizes)
    if (!CSS.supports("animation-timeline", "view()")) {
      const ctx = gsap.context(() => {
        const panels = section.querySelectorAll<HTMLElement>(".service-panel, .service-card-mobile");
        panels.forEach((panel, i) => {
          if (i < panels.length - 1) {
            ScrollTrigger.create({
              trigger: panels[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
              onUpdate: (self) => {
                const p = self.progress;
                const scale = isMobile ? 0.93 : 0.95;
                const brightness = isMobile ? 0.88 : 0.92;
                panel.style.transform = `scale(${1 - (1 - scale) * p}) translateY(${p * 20}px)`;
                panel.style.filter = `brightness(${1 - (1 - brightness) * p})`;
              },
            });
          }
        });
      }, section);
      return () => ctx.revert();
    }
  }, [isMobile]);

  // Mobile layout
  if (isMobile) {
    return (
      <section ref={sectionRef} className="m-section-wipe">
        <div style={{ padding: "40px var(--page-px) 0" }}>
          <EditorialLabel text="(Capabilities)" className="mb-4" />
        </div>

        {SERVICES_SECTION.items.map((service, i) => (
          <Link
            key={service.href}
            href={service.href}
            className="service-card-mobile"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "sticky",
              top: 56,
              minHeight: "75svh",
              padding: "40px var(--page-px)",
              background: BG_TINTS[i] || "var(--bg)",
              zIndex: i + 1,
              borderTop: "1px solid var(--border)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {/* Ghost number */}
            <span style={{
              fontFamily: "var(--serif)", fontSize: 56, fontWeight: 300,
              color: "var(--text-primary)", opacity: 0.06, lineHeight: 1,
            }}>
              0{i + 1}
            </span>

            {/* Service name */}
            <h3 style={{
              fontFamily: "var(--serif)", fontWeight: 600,
              fontSize: "clamp(26px, 6vw, 34px)", lineHeight: 1.15,
              color: "var(--text-primary)", margin: "8px 0 0",
              viewTransitionName: `service-${service.href.split("/").pop()}`,
            }}>
              {service.title}
            </h3>

            {/* Description */}
            <p style={{
              fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400,
              color: "var(--text-muted)", lineHeight: 1.55, marginTop: 16,
              display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {service.sentence}
            </p>

            {/* Deliverables */}
            <p style={{
              fontFamily: "var(--sans)", fontSize: 13, fontWeight: 400,
              color: "var(--text-faint)", marginTop: 12,
            }}>
              {(SERVICE_DESCRIPTIONS[service.title] || []).slice(0, 3).join(" · ")}
            </p>

            {/* Image placeholder with reveal */}
            <div className="m-image-reveal" style={{
              width: "100%", aspectRatio: "4/3", marginTop: 24,
              background: `linear-gradient(155deg, ${BG_TINTS[i]}, var(--bg-shift))`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase",
                letterSpacing: "0.12em", color: "var(--text-faint)",
              }}>
                {service.title.split(" ")[0]} Image
              </span>
            </div>

            {/* Learn More */}
            <span style={{
              fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
              color: "var(--text-primary)", marginTop: 20,
              display: "inline-block", minHeight: 44, lineHeight: "44px",
            }}>
              Learn More &rarr;
            </span>
          </Link>
        ))}
      </section>
    );
  }

  // Tablet layout
  if (isTablet) {
    return (
      <section ref={sectionRef} className="m-section-wipe">
        <div style={{ padding: "40px var(--page-px) 0" }}>
          <EditorialLabel text="(Capabilities)" className="mb-4" />
        </div>

        {SERVICES_SECTION.items.map((service, i) => (
          <div
            key={service.href}
            className="service-card-mobile"
            style={{
              position: "sticky",
              top: 64,
              minHeight: "80svh",
              display: "flex",
              alignItems: "center",
              padding: "40px var(--page-px)",
              background: BG_TINTS[i] || "var(--bg)",
              zIndex: i + 1,
              borderTop: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", gap: 40, width: "100%", alignItems: "center" }}>
              {/* Left 55%: Text */}
              <div style={{ flex: "0 0 55%" }}>
                <span style={{
                  fontFamily: "var(--sans)", fontSize: 12, fontWeight: 400,
                  textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)",
                }}>
                  0{i + 1}
                </span>
                <h3 style={{
                  fontFamily: "var(--serif)", fontWeight: 600,
                  fontSize: "clamp(28px, 3.5vw, 48px)", lineHeight: 1.15,
                  color: "var(--text-primary)", margin: "12px 0 0",
                  viewTransitionName: `service-${service.href.split("/").pop()}`,
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontFamily: "var(--sans)", fontSize: 16, fontWeight: 400,
                  color: "var(--text-muted)", lineHeight: 1.6, marginTop: 16,
                }}>
                  {service.sentence}
                </p>
                <Link href={service.href} className="arrow-link no-underline" style={{
                  display: "inline-block", marginTop: 28, minHeight: 44,
                }}>
                  <span style={{
                    fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: "var(--text-primary)",
                  }}>
                    Learn More <span className="arrow-icon">&rarr;</span>
                  </span>
                </Link>
              </div>

              {/* Right 45%: Image */}
              <div className="m-image-reveal" style={{
                flex: "0 0 45%", aspectRatio: "3/4",
                background: `linear-gradient(155deg, ${BG_TINTS[i]}, var(--bg-shift))`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
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

  // Desktop layout
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
            position: "sticky", top: 80,
            minHeight: "100vh", display: "flex", alignItems: "center",
            padding: "80px var(--page-px)",
            background: service.color, zIndex: i + 1,
          }}
        >
          <div style={{ display: "flex", gap: "clamp(40px, 6vw, 80px)", width: "100%", alignItems: "center" }}>
            <div style={{ flex: "0 0 50%" }}>
              <span style={{
                fontFamily: "var(--sans)", fontSize: 12, fontWeight: 400,
                textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)",
              }}>
                0{i + 1}
              </span>
              <h3 style={{
                fontFamily: "var(--serif)", fontWeight: 600,
                fontSize: "clamp(28px, 3.5vw, 48px)", lineHeight: 1.15,
                color: "var(--text-primary)", margin: "12px 0 0",
                viewTransitionName: `service-${service.href.split("/").pop()}`,
              }}>
                {service.title}
              </h3>
              <p style={{
                fontFamily: "var(--sans)", fontSize: 16, fontWeight: 400,
                color: "var(--text-muted)", lineHeight: 1.6, marginTop: 16, maxWidth: 400,
              }}>
                {service.sentence}
              </p>
              <ul style={{
                listStyle: "none", padding: 0, margin: "24px 0 0",
                display: "flex", flexDirection: "column", gap: 8,
              }}>
                {(SERVICE_DESCRIPTIONS[service.title] || []).map((item, j) => (
                  <li key={j} style={{
                    fontFamily: "var(--sans)", fontSize: 14, fontWeight: 400, color: "var(--text-faint)",
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={service.href} className="arrow-link no-underline" data-cursor="link" style={{ display: "inline-block", marginTop: 28 }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                  Learn More <span className="arrow-icon">&rarr;</span>
                </span>
              </Link>
            </div>

            <div data-cursor="distort" style={{
              flex: "0 0 50%", aspectRatio: "4/5",
              background: `linear-gradient(155deg, ${service.color}, var(--bg-shift))`,
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            }}>
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
