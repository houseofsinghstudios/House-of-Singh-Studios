"use client";

import { useEffect, useState } from "react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";
import NextPageLink from "@/components/layout/NextPageLink";

interface AboutData {
  aboutStudioImage?: { asset: { _id: string; url: string; metadata?: { lqip?: string } }; hotspot?: { x: number; y: number }; crop?: any };
  aboutFounderImage?: { asset: { _id: string; url: string; metadata?: { lqip?: string } }; hotspot?: { x: number; y: number }; crop?: any };
  aboutFounderName?: string;
  aboutFounderRole?: string;
  aboutFounderBio?: string;
  aboutFounderBioSecondary?: string;
}

/* ── Process steps ── */
const STEPS = [
  { name: "Discovery", desc: "We learn your business, your market, and your goals before we design anything." },
  { name: "Strategy", desc: "We define positioning, audience, and visual direction so every creative decision has a reason behind it." },
  { name: "Creative Direction", desc: "We establish the visual language, tone, and systems that will define how your brand shows up." },
  { name: "Production", desc: "We build the assets, documentation, and deliverables with AI-assisted quality control at every step." },
  { name: "Delivery", desc: "You receive a complete brand system with guidelines, files, and the structure to maintain it without us." },
];

/* ── Contrast columns ── */
const WHAT_WE_ARE = [
  "A structured studio with defined processes and senior-level thinking on every brief.",
  "AI-powered workflow that delivers faster, with fewer revisions, at lower overhead.",
  "A curated network that assembles the right specialists for every scope.",
  "Direct access to decision makers. No account managers. No layers.",
];

const WHAT_WE_ARE_NOT = [
  "Not a traditional agency with bloated teams and six-month timelines.",
  "Not an AI tool company. We are a design studio that uses AI internally.",
  "Not a freelancer. We operate as a structured studio, not a solo practitioner.",
  "Not a template shop. Every engagement is built from strategic thinking.",
];

/* ── Team roles ── */
const TEAM_ROLES = [
  "Brand Strategist",
  "Visual Designer",
  "Developer",
  "Photographer",
  "Content Strategist",
  "Motion Designer",
];

/* ── Toronto clock helper ── */
function getTorontoTime(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function AboutClient({ aboutData }: { aboutData?: AboutData }) {
  /* ── Clock state ── */
  const [clockTime, setClockTime] = useState(() => getTorontoTime());

  useEffect(() => {
    const id = setInterval(() => setClockTime(getTorontoTime()), 60000);
    return () => clearInterval(id);
  }, []);

  const [hours, minutes] = clockTime.split(":");

  return (
    <>
      {/* ═══ HERO (~50vh) ═══ */}
      <section
        style={{
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "var(--hero-pt) var(--page-px) 64px",
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
          className="reveal-text font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] mt-4 max-w-[800px] overflow-hidden"
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

        {/* Location + Live Clock */}
        <div
          data-hero-clock
          style={{
            borderTop: "1px solid var(--text-muted)",
            marginTop: 24,
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="about-clock-location">Toronto, Canada</span>
          <span className="about-clock-time">
            EST {hours}<span className="about-clock-colon">:</span>{minutes}
          </span>
        </div>
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

        <div className="reveal-stagger-parent">
          {STEPS.map((step, i) => (
            <div
              key={step.name}
              className="about-process-step scroll-reveal-up"
            >
              <div className="about-process-step-left">
                <span className="about-process-ghost">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-[var(--sans)] text-[15px] font-medium text-[color:var(--text-primary)] about-process-name">
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
        </div>

        {/* AI differentiator line */}
        <div
          className="css-reveal"
          style={{
            borderTop: "1px solid var(--text-muted)",
            paddingTop: 32,
            marginTop: 0,
          }}
        >
          <p
            className="font-[var(--sans)] font-normal text-[color:var(--text-secondary)]"
            style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 560 }}
          >
            AI handles research, asset generation, and workflow management at every stage. Creative direction stays human.
          </p>
        </div>
      </section>

      {/* ═══ SECTION 05: "NOT AN AGENCY" POSITIONING ═══ */}
      <section
        className="css-reveal"
        style={{
          padding: "clamp(64px, 8vw, 120px) var(--page-px)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <EditorialLabel text="03 — How We Are Different" className="scroll-reveal-up mb-6" />

          <h2
            className="css-reveal font-[var(--sans)] font-medium text-[color:var(--text-primary)]"
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: 48,
            }}
          >
            A studio, not an agency.
          </h2>

          <div className="about-contrast-grid">
            {/* Left: What we are */}
            <div className="about-contrast-col-left reveal-stagger-parent">
              <p className="about-contrast-heading">What we are</p>
              {WHAT_WE_ARE.map((s) => (
                <p key={s} className="about-contrast-statement scroll-reveal-up">{s}</p>
              ))}
            </div>

            {/* Right: What we are not */}
            <div className="about-contrast-col-right reveal-stagger-parent">
              <p className="about-contrast-heading">What we are not</p>
              {WHAT_WE_ARE_NOT.map((s) => (
                <p key={s} className="about-contrast-statement scroll-reveal-up">{s}</p>
              ))}
            </div>
          </div>

          {/* Mobile divider is handled via CSS */}
        </div>
      </section>

      {/* ═══ SECTION 06: NETWORK ═══ */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px)" }}>
        <EditorialLabel text="04 — Network" className="scroll-reveal-up mb-6" />

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

      {/* ═══ SECTION 07: FULL-WIDTH IMAGE BREAK ═══ */}
      <div
        className="about-image-break reveal-clip"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 var(--page-px)",
        }}
      >
        <div className="about-image-break-inner">
          <Image
            src={aboutData?.aboutStudioImage?.asset?.url || "/images/studio/studio.jpg"}
            alt="House of Singh Studios workspace"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            style={{ objectFit: "cover" }}
            placeholder={aboutData?.aboutStudioImage?.asset?.metadata?.lqip ? "blur" : undefined}
            blurDataURL={aboutData?.aboutStudioImage?.asset?.metadata?.lqip || undefined}
          />
        </div>
      </div>

      {/* ═══ SECTION 08: FOUNDER ═══ */}
      <section
        style={{
          padding: "clamp(80px, 10vw, 140px) var(--page-px)",
          borderTop: "1px solid var(--text-muted)",
        }}
      >
        <EditorialLabel text="05 — Founder" className="scroll-reveal-up mb-6" />

        <div className="about-founder-grid">
          {/* Founder photo */}
          <div>
            <div
              className="scroll-clip-reveal founder-photo-reveal reveal-clip"
              style={{
                aspectRatio: "4/5",
                overflow: "hidden",
                maxWidth: 480,
                position: "relative",
              }}
            >
              <Image
                src={aboutData?.aboutFounderImage?.asset?.url || "/images/studio/studio.jpg"}
                alt={`${aboutData?.aboutFounderName || "Maninder Singh"} — ${aboutData?.aboutFounderRole || "Founder and Creative Director"}`}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                style={{ objectFit: "cover" }}
                placeholder={aboutData?.aboutFounderImage?.asset?.metadata?.lqip ? "blur" : undefined}
                blurDataURL={aboutData?.aboutFounderImage?.asset?.metadata?.lqip || undefined}
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
              {aboutData?.aboutFounderName || "Maninder Singh"}
            </h2>

            <p
              className="font-[var(--sans)] font-normal text-[13px] uppercase tracking-[0.1em] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.5, marginTop: 4, marginBottom: 24 }}
            >
              {aboutData?.aboutFounderRole || "Founder and Creative Director"}
            </p>

            <p
              className="font-[var(--sans)] font-normal leading-[1.75] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.7, fontSize: "clamp(15px, 1.1vw, 16px)" }}
            >
              {aboutData?.aboutFounderBio || "Maninder Singh built House of Singh Studios, its creative standards, and the systems that power its operations. His practice spans brand identity, photography, creative strategy, and AI-integrated design across 14+ years. He is a member of RGD (Registered Graphic Designers) of Canada and served as Creative Director for TEDxToronto."}
            </p>

            <p
              className="font-[var(--sans)] font-normal leading-[1.75] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.5, marginTop: 16, fontSize: "clamp(15px, 1.1vw, 16px)" }}
            >
              {aboutData?.aboutFounderBioSecondary || "Beyond the studio, Maninder pursues independent creative work spanning conceptual projects, photography, and cultural storytelling."}
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

      {/* ═══ SECTION 09: TEAM/NETWORK PLACEHOLDER ═══ */}
      <section
        className="css-reveal"
        style={{
          padding: "clamp(64px, 8vw, 120px) var(--page-px)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <EditorialLabel text="06 — Collaborators" className="scroll-reveal-up mb-6" />

          <h2
            className="css-reveal font-[var(--sans)] font-medium text-[color:var(--text-primary)]"
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            The right people for every brief.
          </h2>

          <p
            className="font-[var(--sans)] font-normal text-[color:var(--text-secondary)] scroll-reveal-up"
            style={{ fontSize: 15, lineHeight: 1.6, maxWidth: 560, marginBottom: 48 }}
          >
            The studio works with a curated network of specialists across brand strategy, visual design, video production, photography, development, and content. Each engagement assembles the right team for the scope.
          </p>

          <div className="about-team-grid reveal-stagger-parent">
            {TEAM_ROLES.map((role) => (
              <div key={role} className="about-team-card scroll-reveal-up">
                <div className="about-team-card-square" />
                <p className="about-team-card-role">{role}</p>
                <p className="about-team-card-label">Network</p>
              </div>
            ))}
          </div>

          {/* Careers CTA */}
          <div className="about-careers-cta scroll-reveal-up">
            <span className="about-careers-text">Think you belong here? Send your portfolio.</span>
            <Link href="/careers" className="about-careers-link" data-cursor="link">
              View Careers <span className="about-careers-arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
      <NextPageLink />

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
          </div>

          <div className="cta-dark-buttons">
            <Button href="https://cal.com/houseofsinghstudios/hr" variant="primary-inverted" data-cursor="link" target="_blank" rel="noopener noreferrer">
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
