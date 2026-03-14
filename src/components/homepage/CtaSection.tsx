"use client";

import Button from "@/components/ui/Button";

export default function CtaSection() {
  return (
    <section
      className="cta-section-mobile css-reveal"
      style={{
        background: "var(--text-primary)",
        color: "var(--bg)",
        padding: "120px var(--page-px)",
      }}
    >
      {/* ── Main two-column layout ── */}
      <div className="cta-dark-grid">
        {/* Left: editorial content */}
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

        {/* Right: stacked buttons */}
        <div className="cta-dark-buttons css-reveal">
          <Button href="/contact" variant="primary-inverted" data-cursor="link">
            Book a Discovery Call
          </Button>
          <Button href="/contact" variant="secondary-inverted" data-cursor="link">
            Start a Project
          </Button>
        </div>
      </div>

      {/* ── Bottom credibility line ── */}
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
  );
}
