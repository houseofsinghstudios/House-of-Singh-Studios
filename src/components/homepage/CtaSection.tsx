"use client";

import Link from "next/link";

/**
 * SECTION 6: THE INVITATION — "The Quiet Close"
 *
 * Deliberately stark and still. No animation. No parallax. No shader.
 * Mobile: 70svh, stacked full-width buttons.
 * Tablet: Buttons side by side.
 * Desktop: Same minimal centered layout.
 */
export default function CtaSection() {
  return (
    <section
      className="cta-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--section-py) var(--page-px)",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--serif)",
          fontWeight: 400,
          fontSize: "clamp(28px, 5vw, 64px)",
          lineHeight: 1.15,
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        Start a project.
      </h2>

      <p
        style={{
          fontFamily: "var(--sans)",
          fontWeight: 400,
          fontSize: "clamp(13px, 1.2vw, 14px)",
          color: "var(--text-faint)",
          marginTop: 12,
        }}
      >
        We respond within 24 hours.
      </p>

      {/* Desktop/Tablet: side by side. Mobile: stacked via CSS */}
      <div className="cta-mobile-buttons" style={{
        display: "flex",
        gap: 16,
        marginTop: 36,
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        <Link
          href="/contact"
          className="btn-primary cta-button"
          data-cursor="magnetic"
        >
          Book a Call
        </Link>
        <Link
          href="/contact"
          className="btn-secondary cta-button"
          data-cursor="magnetic"
        >
          Send a Brief
        </Link>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .cta-section {
            min-height: 70svh !important;
          }
        }
      `}</style>
    </section>
  );
}
