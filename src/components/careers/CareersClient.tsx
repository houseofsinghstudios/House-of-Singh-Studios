"use client";

import { useState, useRef } from "react";
import { PortableText } from "@portabletext/react";
import Button from "@/components/ui/Button";
import NextPageLink from "@/components/layout/NextPageLink";
import type { PortableTextReactComponents } from "@portabletext/react";

/* ── Department label map ── */
const DEPARTMENT_LABELS: Record<string, string> = {
  "brand-identity": "Brand Identity and Visual Design",
  "visual-media": "Visual Media and Content Production",
  "digital-design": "Digital Design and Experience",
  "creative-strategy": "Creative Strategy and Systems",
  operations: "Operations",
};

const TYPE_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  freelance: "Freelance",
};

/* ── Portable Text for role description ── */
/* eslint-disable @typescript-eslint/no-explicit-any */
const roleTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }: any) => (
      <p
        style={{
          fontFamily: "var(--sans)",
          fontSize: 16,
          lineHeight: 1.6,
          opacity: 0.7,
          marginBottom: 16,
        }}
      >
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h3
        style={{
          fontFamily: "var(--sans)",
          fontWeight: 500,
          fontSize: "clamp(22px, 2.8vw, 30px)",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          marginTop: 32,
          marginBottom: 16,
        }}
      >
        {children}
      </h3>
    ),
    h3: ({ children }: any) => (
      <h4
        style={{
          fontFamily: "var(--sans)",
          fontWeight: 500,
          fontSize: "clamp(16px, 2vw, 20px)",
          lineHeight: 1.3,
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        {children}
      </h4>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong style={{ fontWeight: 500 }}>{children}</strong>
    ),
    em: ({ children }: any) => (
      <em style={{ fontStyle: "italic" }}>{children}</em>
    ),
    link: ({ children, value }: any) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          style={{
            color: "var(--text-primary)",
            borderBottom: "1px solid var(--border)",
            textDecoration: "none",
          }}
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: any) => (
      <ul
        style={{ listStyleType: "disc", paddingLeft: 24, marginBottom: 16 }}
      >
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol
        style={{ listStyleType: "decimal", paddingLeft: 24, marginBottom: 16 }}
      >
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li
        style={{
          fontFamily: "var(--sans)",
          fontSize: 16,
          lineHeight: 1.6,
          opacity: 0.7,
          marginBottom: 6,
        }}
      >
        {children}
      </li>
    ),
    number: ({ children }: any) => (
      <li
        style={{
          fontFamily: "var(--sans)",
          fontSize: 16,
          lineHeight: 1.6,
          opacity: 0.7,
          marginBottom: 6,
        }}
      >
        {children}
      </li>
    ),
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ── Types ── */
interface Role {
  _id: string;
  title: string;
  slug: { current: string };
  department: string;
  type: string;
  location?: string;
  summary: string;
  description?: Array<{ _type: string; children?: Array<{ text?: string }> }>;
  responsibilities?: string[];
  requirements?: string[];
  niceToHave?: string[];
  publishedAt?: string;
}

interface CareersClientProps {
  roles: Role[];
}

export default function CareersClient({ roles }: CareersClientProps) {
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
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

  function toggleRole(slug: string) {
    setExpandedRole((prev) => (prev === slug ? null : slug));
  }

  function handleApplyClick(roleTitle: string) {
    setFormData((prev) => ({ ...prev, role: roleTitle }));
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    if (!formData.name || !formData.email || !formData.role) return;

    setFormState("submitting");
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormState("success");
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
            opacity: 0.5,
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
            opacity: 0.6,
            maxWidth: 600,
            marginTop: 24,
          }}
        >
          House of Singh Studios works with a curated network of designers,
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
            opacity: 0.4,
            marginBottom: 12,
          }}
        >
          (Open Roles)
        </p>
        {roles.length > 0 && (
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 14,
              opacity: 0.5,
              marginBottom: 40,
            }}
          >
            {roles.length} open position{roles.length !== 1 ? "s" : ""}
          </p>
        )}

        {roles.length > 0 ? (
          <div className="reveal-stagger-parent">
            {roles.map((role) => {
              const isExpanded = expandedRole === role.slug.current;
              return (
                <div
                  key={role._id}
                  className="role-card"
                >
                  <div
                    className="role-card-header"
                    onClick={() => toggleRole(role.slug.current)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2
                        className="role-card-title"
                        style={{
                          fontFamily: "var(--sans)",
                          fontWeight: 500,
                          fontSize: "clamp(24px, 3vw, 36px)",
                          lineHeight: 1.15,
                          letterSpacing: "-0.02em",
                          color: "var(--text-primary)",
                          margin: 0,
                        }}
                      >
                        {role.title}
                      </h2>
                      <p
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 12,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          opacity: 0.4,
                          marginTop: 6,
                        }}
                      >
                        {DEPARTMENT_LABELS[role.department] || role.department}
                        {" / "}
                        {TYPE_LABELS[role.type] || role.type}
                      </p>
                    </div>
                    <div className="role-card-meta">
                      {role.location && (
                        <span
                          style={{
                            fontFamily: "var(--sans)",
                            fontSize: 13,
                            opacity: 0.5,
                          }}
                        >
                          {role.location}
                        </span>
                      )}
                      <span
                        className={`role-card-toggle${isExpanded ? " expanded" : ""}`}
                      >
                        +
                      </span>
                    </div>
                  </div>

                  <div
                    className={`role-card-body${isExpanded ? " expanded" : ""}`}
                  >
                    <div className="role-card-body-inner">
                      <p
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 17,
                          lineHeight: 1.6,
                          opacity: 0.7,
                        }}
                      >
                        {role.summary}
                      </p>

                      {role.description && (
                        <div style={{ marginTop: 24 }}>
                          <PortableText
                            value={role.description}
                            components={roleTextComponents}
                          />
                        </div>
                      )}

                      {role.responsibilities &&
                        role.responsibilities.length > 0 && (
                          <div style={{ marginTop: 32 }}>
                            <p
                              style={{
                                fontFamily: "var(--sans)",
                                fontSize: 11,
                                textTransform: "uppercase",
                                letterSpacing: "0.12em",
                                opacity: 0.4,
                                marginBottom: 12,
                              }}
                            >
                              (What you will do)
                            </p>
                            {role.responsibilities.map((item, i) => (
                              <p
                                key={i}
                                style={{
                                  fontFamily: "var(--sans)",
                                  fontSize: 16,
                                  lineHeight: 1.6,
                                  opacity: 0.7,
                                  marginBottom: 8,
                                }}
                              >
                                — {item}
                              </p>
                            ))}
                          </div>
                        )}

                      {role.requirements && role.requirements.length > 0 && (
                        <div style={{ marginTop: 28 }}>
                          <p
                            style={{
                              fontFamily: "var(--sans)",
                              fontSize: 11,
                              textTransform: "uppercase",
                              letterSpacing: "0.12em",
                              opacity: 0.4,
                              marginBottom: 12,
                            }}
                          >
                            (What you bring)
                          </p>
                          {role.requirements.map((item, i) => (
                            <p
                              key={i}
                              style={{
                                fontFamily: "var(--sans)",
                                fontSize: 16,
                                lineHeight: 1.6,
                                opacity: 0.7,
                                marginBottom: 8,
                              }}
                            >
                              — {item}
                            </p>
                          ))}
                        </div>
                      )}

                      {role.niceToHave && role.niceToHave.length > 0 && (
                        <div style={{ marginTop: 28 }}>
                          <p
                            style={{
                              fontFamily: "var(--sans)",
                              fontSize: 11,
                              textTransform: "uppercase",
                              letterSpacing: "0.12em",
                              opacity: 0.4,
                              marginBottom: 12,
                            }}
                          >
                            (Nice to have)
                          </p>
                          {role.niceToHave.map((item, i) => (
                            <p
                              key={i}
                              style={{
                                fontFamily: "var(--sans)",
                                fontSize: 16,
                                lineHeight: 1.6,
                                opacity: 0.7,
                                marginBottom: 8,
                              }}
                            >
                              — {item}
                            </p>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyClick(role.title);
                        }}
                        className="apply-role-btn"
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 13,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          background: "none",
                          border: "none",
                          borderBottom: "1px solid var(--text-primary)",
                          paddingBottom: 4,
                          paddingTop: 0,
                          paddingLeft: 0,
                          paddingRight: 0,
                          marginTop: 32,
                          cursor: "pointer",
                          color: "var(--text-primary)",
                          transition: "opacity 0.3s ease",
                          display: "inline-block",
                        }}
                      >
                        Apply for this role
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                opacity: 0.4,
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
                opacity: 0.6,
              }}
            >
              We are always looking for sharp thinkers.
            </h2>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 16,
                opacity: 0.5,
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
            opacity: 0.4,
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
            opacity: 0.5,
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
                  opacity: 0.6,
                  marginTop: 12,
                }}
              >
                We review every submission. If your work fits a current or
                future project, we will be in touch.
              </p>
            </div>
          ) : (
            <>
              <div className="careers-form-field">
                <label className="careers-form-label">Name</label>
                <input
                  type="text"
                  className="careers-form-input"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div className="careers-form-field">
                <label className="careers-form-label">Email</label>
                <input
                  type="email"
                  className="careers-form-input"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <div className="careers-form-field">
                <label className="careers-form-label">Role</label>
                {roles.length > 0 ? (
                  <select
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
                    type="text"
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
                <label className="careers-form-label">Portfolio</label>
                <input
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
                <label className="careers-form-label">Message</label>
                <textarea
                  className="careers-form-textarea"
                  rows={4}
                  placeholder="Tell us about yourself and the kind of work you want to do."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, message: e.target.value }))
                  }
                />
              </div>
              <button
                className="careers-submit-btn"
                disabled={formState === "submitting"}
                onClick={handleSubmit}
              >
                {formState === "submitting"
                  ? "Sending..."
                  : "Submit Application"}
              </button>
              {formState === "error" && (
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 13,
                    color: "#8B0000",
                    marginTop: 12,
                  }}
                >
                  Something went wrong. Please try again or email us at
                  studio@houseofsingh.com
                </p>
              )}
            </>
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
            opacity: 0.4,
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
            <p style={{ fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1.6, opacity: 0.6, marginTop: 12 }}>
              No junior designers learning on client projects. Every collaborator brings experience that shapes the work from day one.
            </p>
          </div>
          <div className="scroll-reveal-up">
            <h3 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Systems, not chaos.
            </h3>
            <p style={{ fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1.6, opacity: 0.6, marginTop: 12 }}>
              Every project moves through defined stages: discovery, strategy, creative direction, production, delivery. You will always know where things stand.
            </p>
          </div>
          <div className="scroll-reveal-up">
            <h3 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              AI handles production. You handle judgment.
            </h3>
            <p style={{ fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1.6, opacity: 0.6, marginTop: 12 }}>
              We use AI for research, asset generation, and workflow management. Creative direction stays human. Your taste, your decisions, your standards.
            </p>
          </div>
          <div className="scroll-reveal-up">
            <h3 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Remote-first, outcome-driven.
            </h3>
            <p style={{ fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1.6, opacity: 0.6, marginTop: 12 }}>
              We work with specialists across cities and time zones. What matters is the quality of the output and the clarity of the communication.
            </p>
          </div>
        </div>
      </section>

      <NextPageLink />

      {/* ── SECTION 5: DARK CTA ── */}
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
              (Start a project)
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
              Ready to build a brand that works?
            </h2>
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
