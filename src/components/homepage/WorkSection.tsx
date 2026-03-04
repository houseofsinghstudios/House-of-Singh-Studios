"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION 2: THE PROOF — "Scroll Cinema"
 *
 * Horizontal scroll sequence pinned to viewport.
 * 4 projects, each 100vw wide. Vertical scroll → horizontal movement.
 * Each project: left 45% text, right 55% image with OGL shader.
 */
export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      // Pin the section and drive horizontal scroll
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
            // Update ghost counter
            const activeIdx = Math.round(self.progress * (totalPanels - 1));
            if (counterRef.current) {
              counterRef.current.textContent = String(activeIdx + 1).padStart(2, "0");
            }

            // Per-panel fade transitions
            const panels = track.querySelectorAll<HTMLElement>(".cinema-panel");
            panels.forEach((panel, i) => {
              const panelProgress = self.progress * (totalPanels - 1) - i;
              const textEl = panel.querySelector<HTMLElement>(".cinema-text");
              const imgEl = panel.querySelector<HTMLElement>(".cinema-image");

              if (textEl) {
                if (panelProgress < -0.3) {
                  // Not yet visible
                  textEl.style.opacity = "0";
                  textEl.style.transform = "translateX(40px)";
                } else if (panelProgress > 0.7) {
                  // Scrolled past
                  textEl.style.opacity = "0";
                  textEl.style.transform = "translateX(-40px)";
                } else {
                  textEl.style.opacity = "1";
                  textEl.style.transform = "translateX(0)";
                }
              }

              if (imgEl) {
                // Desaturate as it scrolls away
                const desat = Math.max(0, Math.min(1, Math.abs(panelProgress) * 1.5));
                imgEl.style.filter = `saturate(${1 - desat * 0.7})`;
              }
            });
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-reveal-wipe"
      style={{ overflow: "hidden" }}
    >
      {/* Ghost counter */}
      <div style={{
        position: "absolute", top: 40, left: "var(--page-px)", zIndex: 10,
      }}>
        <EditorialLabel text="Selected Work" className="mb-4" />
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          width: `${PROJECTS.length * 100}vw`,
          height: "100vh",
        }}
      >
        {PROJECTS.map((project, i) => (
          <div
            key={project.href}
            className="cinema-panel"
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              padding: "0 var(--page-px)",
              position: "relative",
            }}
          >
            {/* Left 45%: Text */}
            <div
              className="cinema-text"
              style={{
                flex: "0 0 45%",
                paddingRight: 60,
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              {/* Ghost number */}
              <span style={{
                fontFamily: "var(--serif)", fontSize: 120, fontWeight: 300,
                color: "var(--text-primary)", opacity: 0.08,
                lineHeight: 1, display: "block", marginBottom: -20,
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3
                className="project-title"
                style={{
                  fontFamily: "var(--serif)", fontWeight: 600,
                  fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.1,
                  color: "var(--text-primary)", margin: 0,
                  viewTransitionName: `project-${project.href.split("/").pop()}`,
                }}
              >
                <Link
                  href={project.href}
                  className="no-underline"
                  data-cursor="view"
                  style={{ color: "inherit" }}
                >
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
                color: "var(--text-muted)", maxWidth: 380,
                lineHeight: 1.6, marginTop: 16,
              }}>
                {project.sentence}
              </p>

              <Link
                href={project.href}
                className="arrow-link no-underline"
                data-cursor="link"
                style={{ marginTop: 24, display: "inline-block" }}
              >
                <span style={{
                  fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
                  color: "var(--text-primary)",
                }}>
                  View Project <span className="arrow-icon">&rarr;</span>
                </span>
              </Link>
            </div>

            {/* Right 55%: Image */}
            <div
              className="cinema-image"
              data-cursor="distort"
              style={{
                flex: "0 0 55%",
                height: "80vh",
                background: project.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                transition: "filter 0.5s ease",
              }}
            >
              <div style={{
                width: "60%", height: "60%",
                border: `1px solid ${project.accent}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <div style={{
                  width: "70%", height: "70%",
                  border: `1px solid ${project.accent}55`,
                }} />
                <div style={{
                  position: "absolute", width: 40, height: 40, borderRadius: "50%",
                  background: `${project.accent}22`, border: `1px solid ${project.accent}44`,
                }} />
              </div>
              <span style={{
                position: "absolute", fontFamily: "var(--sans)", fontSize: 11,
                textTransform: "uppercase", letterSpacing: "0.12em",
                color: `${project.accent}88`,
              }}>
                {project.name.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Persistent counter overlay */}
      <div style={{
        position: "absolute", bottom: 40, left: "var(--page-px)", zIndex: 10,
        fontFamily: "var(--sans)", fontSize: 12, color: "var(--text-faint)",
        letterSpacing: "0.08em",
      }}>
        <span ref={counterRef} style={{ fontWeight: 600, color: "var(--text-primary)" }}>01</span>
        <span> / {String(PROJECTS.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
