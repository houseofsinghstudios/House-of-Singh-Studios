"use client";

import Link from "next/link";

/**
 * SECTION 6: THE INVITATION — "The Quiet Close"
 *
 * Deliberately stark and still. No animation. No parallax. No shader.
 * Maximum contrast through restraint after all the motion above.
 * The OGL grain canvas intensity drops to near zero here (handled by GrainCanvas).
 */
export default function CtaSection() {
  return (
    <section
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
          fontSize: "clamp(36px, 5vw, 64px)",
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
          fontSize: 14,
          color: "var(--text-faint)",
          marginTop: 16,
        }}
      >
        We respond within 24 hours.
      </p>

      <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
        <Link
          href="/contact"
          className="btn-primary"
          data-cursor="magnetic"
        >
          Book a Call
        </Link>
        <Link
          href="/contact"
          className="btn-secondary"
          data-cursor="magnetic"
        >
          Send a Brief
        </Link>
      </div>
    </section>
  );
}
