"use client";

import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";
import BrandPulseCheck from "@/components/ai/BrandPulseCheck";

const PROCESS_STAGES = [
  {
    name: "Discovery",
    role: "AI accelerates research, competitor analysis, and market scanning so we start with deeper context in less time.",
  },
  {
    name: "Strategy",
    role: "AI processes audience data and positioning inputs to surface patterns that sharpen strategic decisions.",
  },
  {
    name: "Creative Direction",
    role: "AI generates visual explorations and concept variations that the creative director evaluates, refines, or discards. Speed without compromise.",
  },
  {
    name: "Production",
    role: "AI handles asset generation, file preparation, and consistency checks across deliverables. Quality control is automated, not manual.",
  },
  {
    name: "Delivery",
    role: "AI assists in documentation, guideline formatting, and system organization so the final handoff is structured and complete.",
  },
];

export default function AILabClient() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="flex flex-col justify-end px-[var(--page-px)]"
        style={{ minHeight: "50vh", paddingBottom: 80 }}
      >
        <p
          data-hero-label
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-primary)] mb-5"
          style={{ opacity: 0.4 }}
        >
          (AI Lab)
        </p>
        <h1
          data-hero-heading
          className="reveal-text font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] overflow-hidden"
          style={{
            fontSize: "clamp(32px, 4vw, 56px)",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          AI is built into how we work.
        </h1>
        <p
          data-hero-sub
          className="font-[var(--sans)] font-normal text-[16px] text-[color:var(--text-primary)] max-w-[640px] mt-6"
          style={{ lineHeight: 1.75, opacity: 0.7 }}
        >
          Every project benefits from AI at the production layer. Research
          acceleration. Asset generation. Quality control. Workflow automation.
          The result is faster delivery, sharper consistency, and fewer
          revisions.
          <br />
          <br />
          But creative direction is always human. AI does not make brand
          decisions. We do.
        </p>
      </section>

      {/* ── SECTION (01): THE CREATIVE DIRECTION ARGUMENT ── */}
      <hr className="hos-divider" />
      <section
        className="css-reveal"
        style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px)" }}
      >
        <EditorialLabel text="01 — The Argument" className="mb-6" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "55% 45%",
            gap: "clamp(32px, 4vw, 64px)",
            alignItems: "start",
          }}
          className="ai-argument-grid"
        >
          {/* Left column */}
          <div className="css-reveal">
            <h2
              className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)]"
              style={{
                fontSize: "clamp(28px, 3.5vw, 48px)",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              AI can generate assets. It cannot build a brand.
            </h2>
            <p
              className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)] max-w-[640px] mt-8"
              style={{ lineHeight: 1.75, opacity: 0.7 }}
            >
              A brand requires judgment, taste, cultural context, and a system.
              AI cannot determine what your brand should stand for. It cannot
              read a room or understand why a particular typeface feels right for
              your industry.
              <br />
              <br />
              That is creative direction. That is what we provide.
            </p>
          </div>

          {/* Right column — pull quote */}
          <div
            className="css-reveal"
            style={{
              display: "flex",
              alignItems: "center",
              minHeight: "100%",
            }}
          >
            <p
              className="font-[var(--sans)] font-medium"
              style={{
                fontSize: 24,
                lineHeight: 1.4,
                color: "var(--text-secondary)",
                opacity: 0.5,
                margin: 0,
              }}
            >
              AI handles production. We handle meaning.
            </p>
          </div>
        </div>
      </section>
      <hr className="hos-divider" />

      {/* ── SECTION (02): HOW AI POWERS THE PROCESS ── */}
      <section
        className="css-reveal"
        style={{
          padding: "clamp(80px, 10vw, 140px) var(--page-px)",
          background: "var(--bg-shift)",
        }}
      >
        <EditorialLabel text="02 — How AI Powers the Process" className="mb-6" />
        <h2
          className="css-reveal font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)]"
          style={{
            fontSize: "clamp(28px, 3.5vw, 48px)",
            lineHeight: 1.1,
            margin: 0,
            marginBottom: 48,
          }}
        >
          What AI does at each stage.
        </h2>

        <div className="ai-process-list reveal-stagger-parent">
          {PROCESS_STAGES.map((stage) => (
            <div key={stage.name} className="ai-process-row">
              <div className="ai-process-name">{stage.name}</div>
              <div className="ai-process-role">{stage.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION (03): BRAND PULSE CHECK ── */}
      <section
        className="css-reveal"
        style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px)" }}
      >
        <EditorialLabel text="03 — Brand Pulse Check" className="mb-6" />
        <h2
          className="css-reveal font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)]"
          style={{
            fontSize: "clamp(28px, 3.5vw, 48px)",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          How strong is your brand?
        </h2>
        <p
          className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)] max-w-[640px] mt-4"
          style={{ opacity: 0.6, lineHeight: 1.75 }}
        >
          Our AI analyzes your brand&apos;s visual consistency, messaging
          clarity, and digital presence. Answer five questions. Get your results.
        </p>
        <div className="mt-12">
          <BrandPulseCheck />
        </div>
      </section>

      {/* ── SECTION (04): STUDIO GUIDE TEASER ── */}
      <section
        className="css-reveal"
        style={{ padding: "0 var(--page-px) 80px" }}
      >
        <p
          className="font-[var(--sans)] text-[14px]"
          style={{ color: "var(--text-muted)", margin: 0 }}
        >
          Looking for answers about our services, process, or pricing?
        </p>
        <p
          className="font-[var(--sans)] text-[14px] mt-1"
          style={{ color: "var(--text-muted)", margin: 0, marginTop: 4 }}
        >
          The Studio Guide is an AI assistant trained on everything we do.
          Coming soon.
        </p>
      </section>

      {/* ── CTA (dark inverted) ── */}
      <section
        className="cta-section-mobile css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "120px var(--page-px)",
        }}
      >
        <div className="cta-dark-grid">
          <div className="css-reveal">
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
          <div className="cta-dark-buttons css-reveal">
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
        <div
          className="css-reveal"
          style={{
            borderTop: "1px solid rgba(247, 246, 245, 0.12)",
            marginTop: 80,
            paddingTop: 24,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 13,
              fontWeight: 400,
              color: "var(--bg)",
              opacity: 0.3,
              margin: 0,
            }}
          >
            50+ projects delivered across 8 industries in 12+ years.
          </p>
        </div>
      </section>
    </>
  );
}
