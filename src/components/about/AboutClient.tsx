"use client";

import { useEffect, useRef } from "react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";

/* ── Stat config ── */
const STATS = [
  { target: 50, suffix: "+", label: "Projects delivered across identity, media, and digital." },
  { target: 12, suffix: "+", label: "Years of multidisciplinary practice." },
  { target: 8, suffix: "+", label: "Industries served." },
];

/* ── Process steps ── */
const STEPS = [
  { name: "Discovery", desc: "We learn your business, your market, and your goals before we design anything." },
  { name: "Strategy", desc: "We define positioning, audience, and visual direction so every creative decision has a reason behind it." },
  { name: "Creative Direction", desc: "We establish the visual language, tone, and systems that will define how your brand shows up." },
  { name: "Production", desc: "We build the assets, documentation, and deliverables with AI-assisted quality control at every step." },
  { name: "Delivery", desc: "You receive a complete brand system with guidelines, files, and the structure to maintain it without us." },
];

const SERVICE_CATEGORIES = [
  "Brand Identity",
  "Visual Media",
  "Digital Design",
  "Creative Strategy",
];

export default function AboutClient() {
  const statsRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  // ── Stats count-up ──
  useEffect(() => {
    const section = statsRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rafIds: number[] = [];

    numberRefs.current.forEach((el, i) => {
      if (el) el.textContent = prefersReducedMotion ? `${STATS[i].target}${STATS[i].suffix}` : `0${STATS[i].suffix}`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        STATS.forEach((stat, i) => {
          const numEl = numberRefs.current[i];
          if (!numEl) return;

          if (prefersReducedMotion) {
            numEl.textContent = `${stat.target}${stat.suffix}`;
            return;
          }

          const delay = i * 150;
          const duration = 1500;

          setTimeout(() => {
            const startTime = performance.now();
            const el = numEl!;

            function tick(now: number) {
              const elapsed = now - startTime;
              const t = Math.min(elapsed / duration, 1);
              const progress = 1 - Math.pow(1 - t, 3);
              el.textContent = `${Math.round(progress * stat.target)}${stat.suffix}`;

              if (t < 1) {
                rafIds.push(requestAnimationFrame(tick));
              }
            }

            rafIds.push(requestAnimationFrame(tick));
          }, delay);
        });

        descRefs.current.forEach((el) => {
          if (el) {
            el.style.opacity = "0.6";
            el.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      rafIds.forEach((id) => cancelAnimationFrame(id));
    };
  }, []);

  return (
    <>
      {/* ═══ HERO (~50vh) ═══ */}
      <section
        style={{
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "140px var(--page-px) 80px",
        }}
      >
        <p
          data-hero-label
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-muted)]"
        >
          (About)
        </p>

        <h1
          data-hero-heading
          className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] mt-4 max-w-[800px] overflow-hidden"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.15 }}
        >
          Design should be structured, intentional, and commercially effective.
        </h1>

        <p
          data-hero-body
          className="font-[var(--sans)] font-normal text-[16px] leading-[1.75] text-[color:var(--text-primary)] max-w-[640px] mt-6"
          style={{ opacity: 0.7 }}
        >
          House of Singh Studios is a multidisciplinary design studio that builds brand identities, visual systems, and digital experiences for established businesses. The studio was founded on a direct premise: design is a business tool, not a creative exercise. Every project runs through a defined system. Every deliverable serves a business purpose. AI powers the production layer. Creative direction stays human.
        </p>
      </section>

      {/* ═══ SECTION 01: WHAT WE DO ═══ */}
      <section
        className="css-reveal"
        style={{
          padding: "clamp(80px, 10vw, 140px) var(--page-px)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <EditorialLabel text="01 — What We Do" className="mb-10" />

        <div
          className="about-capabilities-row css-reveal"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(16px, 2vw, 32px)",
            marginBottom: "clamp(32px, 4vw, 48px)",
          }}
        >
          {SERVICE_CATEGORIES.map((cat, i) => (
            <span
              key={cat}
              className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)]"
              style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
            >
              {cat}{i < SERVICE_CATEGORIES.length - 1 && (
                <span className="text-[color:var(--text-muted)]" style={{ margin: "0 clamp(8px, 1vw, 16px)" }}>/</span>
              )}
            </span>
          ))}
        </div>

        <p
          className="font-[var(--sans)] font-normal text-[16px] leading-[1.75] text-[color:var(--text-primary)] max-w-[640px]"
          style={{ opacity: 0.7, marginBottom: 24 }}
        >
          Four capabilities. One studio. Every service connects to measurable business outcomes — from identity systems to content production to digital experiences.
        </p>

        <Link
          href="/services"
          className="arrow-link no-underline"
          data-cursor="link"
        >
          <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
            View our services <span className="arrow-icon">&rarr;</span>
          </span>
        </Link>
      </section>

      {/* ═══ SECTION 02: PROCESS ═══ */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px)" }}>
        <EditorialLabel text="02 — Process" className="scroll-reveal-up mb-6" />

        <h2
          className="css-reveal font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] overflow-hidden max-w-[800px]"
          style={{
            fontSize: "clamp(32px, 4vw, 56px)",
            lineHeight: 1.15,
            marginBottom: 24,
          }}
        >
          Five stages. One system. No surprises.
        </h2>

        <p
          className="font-[var(--sans)] font-normal text-[16px] leading-[1.75] text-[color:var(--text-primary)] max-w-[640px] scroll-reveal-up"
          style={{ opacity: 0.7, marginBottom: 64 }}
        >
          Every project moves through the same structured process regardless of scope. This is not a rigid formula. It is a framework that protects your investment and ensures nothing gets lost between strategy and execution.
        </p>

        {STEPS.map((step) => (
          <div
            key={step.name}
            className="about-process-step scroll-reveal-up"
          >
            <div>
              <p className="font-[var(--sans)] text-[15px] font-medium text-[color:var(--text-primary)]">
                {step.name}
              </p>
            </div>
            <div>
              <p
                className="font-[var(--sans)] font-normal text-[15px] leading-[1.65] text-[color:var(--text-primary)]"
                style={{ opacity: 0.6 }}
              >
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ═══ SECTION 03: NETWORK ═══ */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px)" }}>
        <EditorialLabel text="03 — Network" className="scroll-reveal-up mb-6" />

        <h2
          className="css-reveal font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] overflow-hidden max-w-[800px]"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.15, marginBottom: 24 }}
        >
          Senior thinking on every brief.
        </h2>

        <p
          className="font-[var(--sans)] font-normal text-[16px] leading-[1.75] text-[color:var(--text-primary)] max-w-[640px] scroll-reveal-up"
          style={{ opacity: 0.7 }}
        >
          The studio works with a curated network of specialists and partners across brand strategy, visual design, video production, photography, development, and content. Each project is staffed deliberately. The right people for the right scope. Every collaborator operates under the same creative standards, documentation practices, and quality systems that define the studio&#39;s output.
        </p>
      </section>

      {/* ═══ SECTION 04: FOUNDER ═══ */}
      <section
        style={{
          padding: "clamp(80px, 10vw, 140px) var(--page-px)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <EditorialLabel text="04 — Founder" className="scroll-reveal-up mb-6" />

        <div className="about-founder-grid">
          {/* Founder photo */}
          <div>
            <div
              className="scroll-clip-reveal founder-photo-reveal"
              style={{
                aspectRatio: "3/4",
                overflow: "hidden",
                maxWidth: 480,
                position: "relative",
              }}
            >
              <Image
                src="/images/studio/studio.jpg"
                alt="Maninder Singh — Founder and Creative Director"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Bio */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2
              className="css-reveal font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] overflow-hidden"
              style={{
                fontSize: "clamp(28px, 3vw, 32px)",
                lineHeight: 1.15,
              }}
            >
              Maninder Singh
            </h2>

            <p
              className="font-[var(--sans)] font-normal text-[13px] uppercase tracking-[0.1em] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.5, marginTop: 4, marginBottom: 24 }}
            >
              Founder and Creative Director
            </p>

            <p
              className="font-[var(--sans)] font-normal leading-[1.75] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.7, fontSize: "clamp(15px, 1.1vw, 16px)" }}
            >
              Maninder Singh built House of Singh Studios, its creative standards, and the systems that power its operations. His practice spans brand identity, photography, creative strategy, and AI-integrated design across 14+ years. He is a member of RGD (Registered Graphic Designers) of Canada and served as Creative Director for TEDxToronto.
            </p>

            <p
              className="font-[var(--sans)] font-normal leading-[1.75] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.5, marginTop: 16, fontSize: "clamp(15px, 1.1vw, 16px)" }}
            >
              Beyond the studio, Maninder pursues independent creative work spanning conceptual projects, photography, and cultural storytelling.
            </p>

            <p
              className="scroll-reveal-up"
              style={{ marginTop: 16 }}
            >
              <span
                className="font-[var(--sans)] text-[13px] uppercase tracking-[0.08em] text-[color:var(--text-primary)]"
              >
                Explore the full creative journey →{" "}
              </span>
              <a
                href="https://houseofsingh.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[var(--sans)] text-[13px] uppercase tracking-[0.08em] text-[color:var(--text-primary)] hover:underline"
                data-cursor="link"
              >
                houseofsingh.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 05: STATS ═══ */}
      <section
        ref={statsRef}
        className="css-reveal"
        style={{
          padding: "clamp(80px, 10vw, 140px) var(--page-px)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <EditorialLabel text="05 — Results" className="mb-10" />

        <div className="about-stats-grid">
          {STATS.map((stat, i) => (
            <div key={i}>
              <p
                ref={(el) => { numberRefs.current[i] = el; }}
                className="font-[var(--sans)] font-medium leading-none text-[color:var(--text-primary)] m-0"
                style={{ fontSize: "clamp(36px, 4vw, 52px)" }}
              >
                {stat.target}{stat.suffix}
              </p>
              <p
                ref={(el) => { descRefs.current[i] = el; }}
                className="font-[var(--sans)] font-normal text-sm leading-[1.5] text-[color:var(--text-primary)]"
                style={{ opacity: 0, marginTop: 12, maxWidth: 200, transform: "translateY(10px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DARK CTA ═══ */}
      <section
        className="css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "120px var(--page-px)",
        }}
      >
        <div className="cta-dark-grid">
          <div>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                opacity: 0.4,
                marginBottom: 24,
              }}
            >
              (Next Step)
            </p>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 500,
                fontSize: "clamp(48px, 6vw, 80px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--bg)",
                margin: 0,
              }}
            >
              Start a project.
            </h2>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 16,
                lineHeight: 1.6,
                opacity: 0.5,
                marginTop: 20,
              }}
            >
              We respond within 24 hours.
            </p>
          </div>

          <div className="cta-dark-buttons">
            <Button href="/contact" variant="primary-inverted" data-cursor="link">
              Book a Discovery Call
            </Button>
            <Button href="/contact" variant="secondary-inverted" data-cursor="link">
              Start a Project
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
