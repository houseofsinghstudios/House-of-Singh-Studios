"use client";
// A client component: the careers page's open roles (each a RoleCard that opens and closes) and the
// apply form, which sends to /api/careers.

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import NextPageLink from "@/components/layout/NextPageLink";
import { STUDIO_EMAIL } from "@/lib/constants/contact";
import { trackOnce } from "@/lib/analytics";
import { createSubmissionKeeper } from "@/lib/submission-id";
import { usePointerFocusFlag } from "@/lib/use-pointer-focus";
import RoleCard, { type Role } from "./RoleCard";
import "./careers.css";

interface CareersClientProps {
  roles: Role[];
}

export default function CareersClient({ roles }: CareersClientProps) {
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const inFlight = useRef(false);
  // The submission id: the same for retries of the same application, so n8n can drop a duplicate.
  const [submission] = useState(() => createSubmissionKeeper());
  const [formState, setFormState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    portfolioUrl: "",
    message: "",
  });

  const formSectionRef = useRef<HTMLDivElement>(null);
  // Keyboard focus shows a 2px rule on each field; a mouse or touch press holds it back (careers.css).
  const formRef = useRef<HTMLFormElement>(null);
  usePointerFocusFlag(formRef, formState);

  function toggleRole(slug: string) {
    setExpandedRole((prev) => (prev === slug ? null : slug));
  }

  function handleApplyClick(roleTitle: string) {
    setFormData((prev) => ({ ...prev, role: roleTitle }));
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  // The hidden field only a bot fills in. Sent to the API, which ignores the application if set.
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) return;
    // A ref, not state: a second submit can arrive before the disabled button renders.
    if (inFlight.current) return;
    inFlight.current = true;
    const id = submission.idFor({ ...formData, honeypot });

    setFormState("submitting");
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, honeypot, submissionId: id }),
      });
      if (res.ok) {
        submission.done();
        setFormState("success");
        // Kept apart from leads, and never for the bot trap. No name, email or message.
        if (!honeypot) trackOnce("job_application", id);
        setFormData({
          name: "",
          email: "",
          role: "",
          portfolioUrl: "",
          message: "",
        });
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <>
      {/* ── SECTION 1: HERO ── */}
      <section
        style={{
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "var(--hero-pt) var(--page-px) 60px",
        }}
      >
        <p
          data-hero-label
          style={{
            fontFamily: "var(--sans)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--text-label)",
            marginBottom: 20,
          }}
        >
          (Careers)
        </p>
        <h1
          data-hero-heading
          className="reveal-text"
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 500,
            fontSize: "clamp(38px, 5vw, 72px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: 900,
            color: "var(--text-primary)",
            margin: 0,
            overflow: "hidden",
          }}
        >
          Build brands that hold up. With us.
        </h1>
        <p
          data-hero-sub
          style={{
            fontFamily: "var(--sans)",
            fontSize: 17,
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            maxWidth: 600,
            marginTop: 24,
          }}
        >
          House of Singh Studios works with a trusted network of designers,
          strategists, and producers. Every engagement assembles the right team
          for the scope. If your work is sharp and your thinking is clear, we
          want to hear from you.
        </p>
      </section>

      {/* ── SECTION 2: OPEN ROLES ── */}
      <section style={{ padding: "80px var(--page-px) 0" }}>
        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-label)",
            marginBottom: 12,
          }}
        >
          (Network roles)
        </p>
        {roles.length > 0 && (
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 14,
              color: "var(--text-secondary)",
              marginBottom: 40,
            }}
          >
            {roles.length} network position{roles.length !== 1 ? "s" : ""}
          </p>
        )}

        {roles.length > 0 ? (
          <div className="reveal-stagger-parent">
            {roles.map((role) => (
              <RoleCard
                key={role._id}
                role={role}
                isOpen={expandedRole === role.slug.current}
                onToggle={() => toggleRole(role.slug.current)}
                onApply={() => handleApplyClick(role.title)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--text-label)",
                marginBottom: 16,
              }}
            >
              (No open roles)
            </p>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 500,
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                // The empty state's colour, Accessible Ash (CLAUDE.md Layer 7), not dimmed Obsidian.
                color: "var(--text-label)",
              }}
            >
              We are always looking for sharp thinkers.
            </h2>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 16,
                color: "var(--text-secondary)",
                marginTop: 12,
              }}
            >
              Send us your portfolio. If the work speaks, we will find the
              project.
            </p>
          </div>
        )}
      </section>

      {/* ── SECTION 3: APPLICATION FORM ── */}
      <section
        ref={formSectionRef}
        className="surface-cloudy"
        data-clarity-mask="True"
        style={{
          padding: "120px var(--page-px)",
          background: "var(--bg-shift)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-label)",
            marginBottom: 24,
          }}
        >
          (Apply)
        </p>
        <h2
          className="scroll-reveal-up"
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 500,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Start here.
        </h2>
        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: 16,
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            maxWidth: 560,
            marginTop: 16,
          }}
        >
          Tell us who you are and share your strongest work. We review every
          application.
        </p>

        <div style={{ marginTop: 48, maxWidth: 600 }}>
          {formState === "success" ? (
            <div>
              <h3
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 500,
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                Application received.
              </h3>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 16,
                  color: "var(--text-secondary)",
                  marginTop: 12,
                }}
              >
                We review every submission. If your work fits a current or
                future project, we will be in touch.
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} method="post" action="/api/careers" data-clarity-mask="True">
              {/* Without JavaScript the browser posts the form to the route, which answers with a written
                  page (src/lib/no-script-page.ts), so the details never go into a page address. */}
              <div className="careers-form-field">
                <label htmlFor="careers-name" className="careers-form-label">Name</label>
                <input
                  id="careers-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="careers-form-input"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div className="careers-form-field">
                <label htmlFor="careers-email" className="careers-form-label">Email</label>
                <input
                  id="careers-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="careers-form-input"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <div className="careers-form-field">
                <label htmlFor="careers-role" className="careers-form-label">Role</label>
                {roles.length > 0 ? (
                  <select
                    id="careers-role"
                    name="role"
                    required
                    className="careers-form-select"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, role: e.target.value }))
                    }
                  >
                    <option value="">Select a role</option>
                    {roles.map((r) => (
                      <option key={r._id} value={r.title}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="careers-role"
                    name="role"
                    type="text"
                    required
                    className="careers-form-input"
                    placeholder="What kind of work do you do?"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, role: e.target.value }))
                    }
                  />
                )}
              </div>
              <div className="careers-form-field">
                <label htmlFor="careers-portfolio" className="careers-form-label">Portfolio</label>
                <input
                  id="careers-portfolio"
                  name="portfolioUrl"
                  type="url"
                  className="careers-form-input"
                  placeholder="https://your-portfolio.com"
                  value={formData.portfolioUrl}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      portfolioUrl: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="careers-form-field">
                <label htmlFor="careers-message" className="careers-form-label">Message</label>
                <textarea
                  id="careers-message"
                  name="message"
                  className="careers-form-textarea"
                  rows={4}
                  placeholder="Tell us about yourself and the kind of work you want to do."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, message: e.target.value }))
                  }
                />
              </div>
              <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                <label htmlFor="careers-honeypot">Do not fill this field</label>
                <input
                  id="careers-honeypot"
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="careers-submit-btn"
                disabled={formState === "submitting"}
              >
                {formState === "submitting"
                  ? "Sending..."
                  : "Submit application"}
              </button>
              {formState === "error" && (
                <p
                  role="alert"
                  className="form-error"
                >
                  Something went wrong. Please try again or email us at{" "}
                  {STUDIO_EMAIL}
                </p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* ── SECTION 4: HOW WE WORK ── */}
      <section style={{ padding: "120px var(--page-px)" }}>
        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-label)",
            marginBottom: 32,
          }}
        >
          (How we work)
        </p>
        <div className="how-we-work-grid">
          <div className="scroll-reveal-up">
            <h3 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Senior thinking on every brief.
            </h3>
            <p style={{ fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", marginTop: 12 }}>
              No junior designers learning on client projects. Every collaborator brings experience that shapes the work from day one.
            </p>
          </div>
          <div className="scroll-reveal-up">
            <h3 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Systems, not chaos.
            </h3>
            <p style={{ fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", marginTop: 12 }}>
              Every project moves through defined stages: discovery, strategy, creative direction, production, delivery. You will always know where things stand.
            </p>
          </div>
          <div className="scroll-reveal-up">
            <h3 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              AI handles production. You handle judgment.
            </h3>
            <p style={{ fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", marginTop: 12 }}>
              We use AI for research, asset generation, and workflow management. Creative direction stays human. Your taste, your decisions, your standards.
            </p>
          </div>
          <div className="scroll-reveal-up">
            <h3 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Remote first, driven by outcomes.
            </h3>
            <p style={{ fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)", marginTop: 12 }}>
              We work with specialists across cities and time zones. What matters is the quality of the output and the clarity of the communication.
            </p>
          </div>
        </div>
      </section>

      <NextPageLink current="/careers" />

      {/* ── SECTION 5: DARK CTA ── */}
      <section
        className="css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "120px var(--page-px)",
        }}
      >
        <div className="cta-centered">
          <p className="cta-label">(Get in touch)</p>
          <h2 className="cta-heading">Not ready to apply yet.</h2>
          <div className="cta-buttons">
            <Button href="/contact" variant="primary-inverted" data-cursor="link">
              Get in touch
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
