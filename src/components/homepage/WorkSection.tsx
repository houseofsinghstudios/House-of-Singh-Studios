"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 2: THE PROOF — "Scroll Cinema"
 *
 * Desktop: Horizontal scroll sequence pinned to viewport.
 * Mobile: Vertical full-width cards with viewport spotlight + CSS image reveal.
 * Tablet: Two-column grid with image reveal.
 */
export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
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

    // Mobile/Tablet: Viewport spotlight
    if (isMobile || isTablet) {
      const cards = section.querySelectorAll<HTMLElement>(".work-card-mobile");
      if (!cards.length) return;

      let rafId = 0;
      function updateSpotlight() {
        const viewportCenter = window.innerHeight / 2;
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const distance = Math.abs(cardCenter - viewportCenter);
          const maxDistance = window.innerHeight * 0.6;
          const proximity = 1 - Math.min(distance / maxDistance, 1);
          card.style.opacity = String(0.4 + proximity * 0.6);
          card.style.transform = `scale(${0.97 + proximity * 0.03})`;
        });
        rafId = requestAnimationFrame(updateSpotlight);
      }

      rafId = requestAnimationFrame(updateSpotlight);
      return () => cancelAnimationFrame(rafId);
    }

    // Desktop: Horizontal scroll cinema
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const totalPanels = PROJECTS.length;
      const scrollDistance = (totalPanels - 1) * window.innerWidth;

      gsap.to(track, {
        x: () => -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          end: () => `+=${scrollDistance}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const activeIdx = Math.round(self.progress * (totalPanels - 1));
            if (counterRef.current) {
              counterRef.current.textContent = String(activeIdx + 1).padStart(2, "0");
            }
            const panels = track.querySelectorAll<HTMLElement>(".cinema-panel");
            panels.forEach((panel, i) => {
              const panelProgress = self.progress * (totalPanels - 1) - i;
              const textEl = panel.querySelector<HTMLElement>(".cinema-text");
              const imgEl = panel.querySelector<HTMLElement>(".cinema-image");
              if (textEl) {
                if (panelProgress < -0.3) {
                  textEl.style.opacity = "0";
                  textEl.style.transform = "translateX(40px)";
                } else if (panelProgress > 0.7) {
                  textEl.style.opacity = "0";
                  textEl.style.transform = "translateX(-40px)";
                } else {
                  textEl.style.opacity = "1";
                  textEl.style.transform = "translateX(0)";
                }
              }
              if (imgEl) {
                const desat = Math.max(0, Math.min(1, Math.abs(panelProgress) * 1.5));
                imgEl.style.filter = `saturate(${1 - desat * 0.7})`;
              }
            });
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile, isTablet]);

  // Mobile/Tablet: Vertical card layout
  if (isMobile || isTablet) {
    return (
      <section ref={sectionRef} className="m-section-wipe" style={{ padding: "80px 0" }}>
        <div style={{ padding: "0 var(--page-px)", marginBottom: 32, textAlign: "center" }}>
          <EditorialLabel text="(Selected Work)" />
        </div>

        <div style={{
          display: isTablet ? "grid" : "flex",
          gridTemplateColumns: isTablet ? "1fr 1fr" : undefined,
          gap: isTablet ? 20 : undefined,
          flexDirection: isMobile ? "column" : undefined,
          padding: isTablet ? "0 var(--page-px)" : undefined,
        }}>
          {PROJECTS.map((project, i) => (
            <Link
              key={project.href}
              href={project.href}
              className="work-card-mobile"
              style={{
                display: "block", textDecoration: "none", color: "inherit",
                marginBottom: isMobile ? 64 : 0,
              }}
            >
              {/* Image with CSS SDA reveal */}
              <div style={{
                width: "100%", aspectRatio: isTablet ? "4/3" : "3/2",
                overflow: "hidden", background: project.color,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div className="m-image-reveal" style={{
                  width: "100%", height: "100%", background: project.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    fontFamily: "var(--sans)", fontSize: 11,
                    textTransform: "uppercase", letterSpacing: "0.12em",
                    color: `${project.accent}88`,
                  }}>
                    {project.name.split(" ")[0]}
                  </span>
                </div>
              </div>

              {/* Card info */}
              <div className="m-fade-up" style={{ padding: isMobile ? "20px var(--page-px)" : "16px 0" }}>
                <span style={{
                  fontFamily: "var(--serif)", fontSize: 48, fontWeight: 300,
                  color: "var(--text-primary)", opacity: 0.08, lineHeight: 1, display: "block",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{
                  fontFamily: "var(--serif)", fontWeight: 600, fontSize: 24,
                  color: "var(--text-primary)", display: "block", marginTop: 4,
                }}>
                  {project.name}
                </span>
                <span style={{
                  fontFamily: "var(--sans)", fontSize: 11, fontWeight: 400,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  color: "var(--text-faint)", display: "block", marginTop: 6,
                }}>
                  {project.label}
                </span>
                <span style={{
                  fontFamily: "var(--sans)", fontSize: 14, fontWeight: 400,
                  color: "var(--text-muted)", display: "block", marginTop: 8, lineHeight: 1.5,
                }}>
                  {project.sentence}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", padding: "44px var(--page-px)" }}>
          <Link href="/work" className="m-fade-up" style={{
            fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
            textTransform: "uppercase", letterSpacing: "0.06em",
            color: "var(--text-primary)", textDecoration: "none",
            display: "inline-block", padding: "12px 0", minHeight: 44,
          }}>
            View All Projects &rarr;
          </Link>
        </div>
      </section>
    );
  }

  // Desktop layout
  return (
    <section ref={sectionRef} className="section-reveal-wipe" style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 40, left: "var(--page-px)", zIndex: 10 }}>
        <EditorialLabel text="Selected Work" className="mb-4" />
      </div>

      <div ref={trackRef} style={{ display: "flex", width: `${PROJECTS.length * 100}vw`, height: "100vh" }}>
        {PROJECTS.map((project, i) => (
          <div key={project.href} className="cinema-panel" style={{
            width: "100vw", height: "100vh", display: "flex", alignItems: "center",
            padding: "0 var(--page-px)", position: "relative",
          }}>
            <div className="cinema-text" style={{
              flex: "0 0 45%", paddingRight: 60,
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}>
              <span style={{
                fontFamily: "var(--serif)", fontSize: 120, fontWeight: 300,
                color: "var(--text-primary)", opacity: 0.08,
                lineHeight: 1, display: "block", marginBottom: -20,
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="project-title" style={{
                fontFamily: "var(--serif)", fontWeight: 600,
                fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.1,
                color: "var(--text-primary)", margin: 0,
                viewTransitionName: `project-${project.href.split("/").pop()}`,
              }}>
                <Link href={project.href} className="no-underline" data-cursor="view" style={{ color: "inherit" }}>
                  {project.name}
                </Link>
              </h3>
              <p style={{
                fontFamily: "var(--sans)", fontSize: 12, fontWeight: 400,
                textTransform: "uppercase", letterSpacing: "0.06em",
                color: "var(--text-faint)", marginTop: 12,
              }}>
                {project.label}
              </p>
              <p style={{
                fontFamily: "var(--sans)", fontSize: 16, fontWeight: 400,
                color: "var(--text-muted)", maxWidth: 380, lineHeight: 1.6, marginTop: 16,
              }}>
                {project.sentence}
              </p>
              <Link href={project.href} className="arrow-link no-underline" data-cursor="link" style={{ marginTop: 24, display: "inline-block" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                  View Project <span className="arrow-icon">&rarr;</span>
                </span>
              </Link>
            </div>
            <div className="cinema-image" data-cursor="distort" style={{
              flex: "0 0 55%", height: "80vh", background: project.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden", transition: "filter 0.5s ease",
            }}>
              <div style={{
                width: "60%", height: "60%", border: `1px solid ${project.accent}33`,
                display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
              }}>
                <div style={{ width: "70%", height: "70%", border: `1px solid ${project.accent}55` }} />
                <div style={{
                  position: "absolute", width: 40, height: 40, borderRadius: "50%",
                  background: `${project.accent}22`, border: `1px solid ${project.accent}44`,
                }} />
              </div>
              <span style={{
                position: "absolute", fontFamily: "var(--sans)", fontSize: 11,
                textTransform: "uppercase", letterSpacing: "0.12em", color: `${project.accent}88`,
              }}>
                {project.name.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position: "absolute", bottom: 40, left: "var(--page-px)", zIndex: 10,
        fontFamily: "var(--sans)", fontSize: 12, color: "var(--text-faint)", letterSpacing: "0.08em",
      }}>
        <span ref={counterRef} style={{ fontWeight: 600, color: "var(--text-primary)" }}>01</span>
        <span> / {String(PROJECTS.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
