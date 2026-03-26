"use client";

import { useState, useCallback } from "react";
import { Link } from "next-view-transitions";
import Button from "@/components/ui/Button";

/* ── Comparison table rows ── */
const COMPARISON_ROWS = [
  {
    label: "Research",
    trad: "2 to 3 weeks of manual competitive analysis.",
    us: "3 to 5 days. AI accelerates research. We interpret.",
  },
  {
    label: "Concepts",
    trad: "3 to 5 directions. Limited by bandwidth.",
    us: "More explored, best refined. AI generates. We direct.",
  },
  {
    label: "Quality",
    trad: "Manual review. Errors slip through.",
    us: "AI checks every asset against brand system. Then we review.",
  },
  {
    label: "Revisions",
    trad: "Multiple rounds. Each takes days.",
    us: "Fewer rounds. Issues caught before you see them.",
  },
  {
    label: "Timeline",
    trad: "12 to 16 weeks.",
    us: "8 to 12 weeks. Same depth. Less wasted time.",
  },
  {
    label: "Team",
    trad: "Account manager + junior + senior. You pay for layers.",
    us: "Senior direction from day one. AI handles production.",
  },
];

/* ── Proof bar stats ── */
const PROOF_STATS = [
  {
    value: "37%",
    width: 37,
    text: "Higher originality when human direction is combined with AI.",
    source: "AI Flywheel, 2025",
  },
  {
    value: "85%",
    width: 85,
    text: "Of AI initiatives fail from poor direction, not poor tools.",
    source: "Forbes / Gartner, 2025",
  },
  {
    value: "89%",
    width: 89,
    text: "Of designers report AI improved their workflow when integrated properly.",
    source: "Foundation Capital, 2025",
  },
];

/* ── Outcome columns ── */
const OUTCOMES = [
  {
    title: "Faster delivery.",
    body: "8 to 12 weeks instead of 12 to 16. AI eliminates bottlenecks in research, iteration, and production without cutting corners.",
  },
  {
    title: "Sharper consistency.",
    body: "AI checks every deliverable against your brand system before it reaches you. Fewer errors. Fewer revision rounds.",
  },
  {
    title: "Senior thinking only.",
    body: "No junior designers learning on your project. AI handles production tasks. You work with decision makers from day one.",
  },
];

/* ── Sample scores for brand pulse mockup ── */
const PULSE_SCORES = [
  { label: "Visual consistency", score: 78, fill: "var(--text-primary)" },
  { label: "Messaging clarity", score: 52, fill: "var(--text-muted)" },
  { label: "Digital presence", score: 34, fill: "var(--text-muted)" },
];

export default function AILabClient() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (email.trim()) setSubmitted(true);
    },
    [email]
  );

  return (
    <>
      {/* ═══ SECTION 1: HERO ═══ */}
      <section
        className="css-reveal"
        style={{
          padding: "var(--hero-pt) var(--page-px) clamp(48px, 6vw, 80px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <p
          data-hero-label
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            margin: "0 0 16px",
          }}
        >
          (AI)
        </p>
        <h1
          data-hero-heading
          className="font-[var(--sans)]"
          style={{
            fontSize: "clamp(28px, 4.5vw, 48px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--text-primary)",
            margin: "0 0 20px",
            maxWidth: 620,
          }}
        >
          AI handles production. Creative direction stays human.
        </h1>
        <p
          data-hero-sub
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            maxWidth: 520,
            margin: 0,
          }}
        >
          You are not paying for AI. You are paying for the judgment that tells
          AI what to do, the taste that knows when to override it, and the
          system that makes everything hold together. AI makes us faster. It
          does not make us replaceable.
        </p>
      </section>

      {/* ═══ SECTION 2: COMPARISON TABLE ═══ */}
      <section
        className="css-reveal"
        style={{ padding: "clamp(48px, 6vw, 80px) var(--page-px)" }}
      >
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            margin: "0 0 16px",
          }}
        >
          (What changes for you)
        </p>
        <h2
          className="font-[var(--sans)]"
          style={{
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 500,
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
            color: "var(--text-primary)",
            margin: "0 0 40px",
            maxWidth: 500,
          }}
        >
          Working with a traditional studio versus working with us.
        </h2>

        {/* Header row */}
        <div className="ai-compare-row ai-compare-header">
          <div className="ai-compare-label" />
          <div className="ai-compare-trad">Traditional studio</div>
          <div className="ai-compare-us">House of Singh</div>
        </div>

        {/* Data rows */}
        {COMPARISON_ROWS.map((row, i) => (
          <div key={i} className="ai-compare-row ai-compare-data">
            <div className="ai-compare-label">{row.label}</div>
            <div className="ai-compare-trad">{row.trad}</div>
            <div className="ai-compare-us">{row.us}</div>
          </div>
        ))}
      </section>

      {/* ═══ SECTION 3: THE ARGUMENT (dark full-bleed) ═══ */}
      <section
        className="css-reveal"
        style={{
          background: "var(--text-primary)",
          padding: "clamp(64px, 10vw, 120px) var(--page-px)",
        }}
      >
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            margin: "0 0 32px",
          }}
        >
          (The creative direction argument)
        </p>
        <div className="ai-argument-grid">
          <div>
            <h2
              className="font-[var(--sans)]"
              style={{
                fontSize: "clamp(24px, 3.5vw, 40px)",
                fontWeight: 500,
                lineHeight: 1.15,
                color: "var(--bg)",
                margin: 0,
              }}
            >
              AI can generate a logo in 30 seconds. It cannot tell you if it is
              right.
            </h2>
          </div>
          <div>
            <p
              style={{
                fontSize: 14,
                color: "rgba(247, 246, 245, 0.65)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Right means: right for your market, right for your audience, right
              for where your business is heading in three years. AI is trained on
              what exists. Creative direction imagines what should exist. Research
              confirms that human-AI collaboration scores 37% higher on
              originality than AI working alone. That gap is not going away. That
              gap is creative direction.
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(247, 246, 245, 0.35)",
                fontStyle: "italic",
                marginTop: 16,
              }}
            >
              AI Flywheel, State of AI in Design, 2025. Nielsen Norman Group,
              2025.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: PROOF BAR ═══ */}
      <section
        className="css-reveal"
        style={{ padding: "clamp(48px, 6vw, 80px) var(--page-px)" }}
      >
        <div className="ai-proof-grid">
          {PROOF_STATS.map((stat, i) => (
            <div key={i} className="ai-proof-col">
              <p className="ai-proof-num">{stat.value}</p>
              <div className="ai-proof-bar">
                <div
                  className="ai-proof-bar-fill"
                  style={{ width: `${stat.width}%` }}
                />
              </div>
              <p className="ai-proof-text">{stat.text}</p>
              <p className="ai-proof-source">{stat.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 5: THE OUTCOME ═══ */}
      <section
        className="css-reveal"
        style={{ padding: "clamp(48px, 6vw, 80px) var(--page-px)" }}
      >
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            margin: "0 0 16px",
          }}
        >
          (The outcome)
        </p>
        <h2
          className="font-[var(--sans)]"
          style={{
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 500,
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
            color: "var(--text-primary)",
            margin: "0 0 40px",
            maxWidth: 460,
          }}
        >
          What this actually means for your project.
        </h2>

        <div className="ai-outcome-grid">
          {OUTCOMES.map((o, i) => (
            <div key={i} className="ai-outcome-col">
              <p className="ai-outcome-title">{o.title}</p>
              <p className="ai-outcome-body">{o.body}</p>
            </div>
          ))}
        </div>
        <div style={{ borderBottom: "1px solid var(--border)" }} />
      </section>

      {/* ═══ SECTION 6: BRAND PULSE CHECK ═══ */}
      <section
        className="css-reveal"
        style={{ padding: "clamp(48px, 6vw, 80px) var(--page-px)" }}
      >
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            margin: "0 0 16px",
          }}
        >
          (Brand Pulse Check)
        </p>
        <div className="ai-pulse-grid">
          {/* Left column: heading + form */}
          <div>
            <h2
              className="font-[var(--sans)]"
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                color: "var(--text-primary)",
                margin: "0 0 12px",
              }}
            >
              How strong is your brand?
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                margin: "0 0 32px",
                maxWidth: 400,
              }}
            >
              Our AI analyzes your brand&apos;s visual consistency, messaging
              clarity, and digital presence. Free. Instant. Launching soon.
            </p>

            {!submitted ? (
              <form onSubmit={handleNotify} className="ai-pulse-form">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ai-pulse-input"
                  required
                />
                <button type="submit" className="ai-pulse-btn">
                  Notify me
                </button>
              </form>
            ) : (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                We&apos;ll email you when Brand Pulse Check goes live.
              </p>
            )}

            {!submitted && (
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 12,
                }}
              >
                We will email you when Brand Pulse Check goes live.
              </p>
            )}
          </div>

          {/* Right column: sample result mockup */}
          <div className="ai-pulse-mockup">
            <p className="ai-pulse-mockup-label">Sample result preview</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {PULSE_SCORES.map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {s.label}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {s.score}
                    </span>
                  </div>
                  <div className="ai-pulse-bar-track">
                    <div
                      className="ai-pulse-bar-fill"
                      style={{ width: `${s.score}%`, background: s.fill }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border)",
                marginTop: 20,
                paddingTop: 8,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Your digital presence is the weakest area. A structured content
                architecture would improve conversion and reduce bounce rate.
              </p>
            </div>
          </div>
        </div>
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            marginTop: "clamp(48px, 6vw, 80px)",
          }}
        />
      </section>

      {/* ═══ SECTION 7: STUDIO GUIDE TEASER ═══ */}
      <section
        className="css-reveal"
        style={{ padding: "clamp(48px, 6vw, 80px) var(--page-px)" }}
      >
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            margin: "0 0 12px",
          }}
        >
          (Studio Guide)
        </p>
        <p
          className="font-[var(--sans)]"
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 8px",
          }}
        >
          Have a question about working with us?
        </p>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            margin: 0,
            maxWidth: 480,
          }}
        >
          Our AI-powered Studio Guide can answer questions about services,
          process, and pricing. Coming soon.
        </p>
      </section>

      {/* ═══ SECTION 8: DARK CTA ═══ */}
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
              (Next step)
            </p>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 500,
                fontSize: "clamp(22px, 3vw, 32px)",
                lineHeight: 1.2,
                letterSpacing: "-0.025em",
                color: "var(--bg)",
                margin: 0,
                maxWidth: 520,
              }}
            >
              Ready to see what AI-powered creative direction looks like?
            </h2>
          </div>

          <div className="cta-dark-buttons css-reveal">
            <Button
              href="/contact"
              variant="primary-inverted"
              data-cursor="link"
            >
              Book a Discovery Call
            </Button>
            <Button href="/work" variant="secondary-inverted" data-cursor="link">
              View Our Work
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
