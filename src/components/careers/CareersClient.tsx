"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextReactComponents } from "@portabletext/react";
import {
  initScrollFallbacks,
  cleanScrollFallbacks,
} from "@/lib/scroll-fallback";

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
          fontFamily: "var(--serif)",
          fontWeight: 600,
          fontSize: "clamp(22px, 2.8vw, 30px)",
          lineHeight: 1.2,
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
          fontWeight: 600,
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
      <strong style={{ fontWeight: 600 }}>{children}</strong>
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
            borderBottom: "1px solid rgba(26, 26, 26, 0.3)",
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
  const [applicationRole, setApplicationRole] = useState("");
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

  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const splitsRef = useRef<SplitType[]>([]);

  // Page load orchestration
  useEffect(() => {
    initScrollFallbacks();

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (labelRef.current) {
      gsap.set(labelRef.current, { opacity: 0, y: 12 });
      tl.to(labelRef.current, { opacity: 0.5, y: 0, duration: 0.4 }, 0);
    }

    if (headingRef.current) {
      const split = new SplitType(headingRef.current, { types: "words" });
      splitsRef.current.push(split);
      if (split.words) {
        gsap.set(split.words, { opacity: 0, y: "100%" });
        tl.to(
          split.words,
          { opacity: 1, y: "0%", duration: 0.6, stagger: 0.05 },
          0.15
        );
      }
    }

    if (supportRef.current) {
      gsap.set(supportRef.current, { opacity: 0, y: 20 });
      tl.to(supportRef.current, { opacity: 0.6, y: 0, duration: 0.5 }, 0.6);
    }

    return () => {
      cleanScrollFallbacks();
      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];
      tl.kill();
    };
  }, []);

  // Sync applicationRole → formData.role
  useEffect(() => {
    if (applicationRole) {
      setFormData((prev) => ({ ...prev, role: applicationRole }));
    }
  }, [applicationRole]);

  function toggleRole(slug: string) {
    setExpandedRole((prev) => (prev === slug ? null : slug));
  }

  function handleApplyClick(roleTitle: string) {
    setApplicationRole(roleTitle);
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
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 var(--page-px) 100px",
        }}
      >
        <p
          ref={labelRef}
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
          ref={headingRef}
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: "clamp(38px, 5vw, 72px)",
            lineHeight: 1.1,
            maxWidth: 900,
            color: "var(--text-primary)",
            margin: 0,
            overflow: "hidden",
          }}
        >
          Build brands that hold up. With us.
        </h1>
        <p
          ref={supportRef}
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
          <div>
            {roles.map((role) => {
              const isExpanded = expandedRole === role.slug.current;
              return (
                <div
                  key={role._id}
                  className="role-card scroll-reveal-up"
                >
                  {/* Header */}
                  <div
                    className="role-card-header"
                    onClick={() => toggleRole(role.slug.current)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2
                        className="role-card-title"
                        style={{
                          fontFamily: "var(--serif)",
                          fontWeight: 600,
                          fontSize: "clamp(24px, 3vw, 36px)",
                          lineHeight: 1.15,
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

                  {/* Expandable body */}
                  <div
                    className={`role-card-body${isExpanded ? " expanded" : ""}`}
                  >
                    <div className="role-card-body-inner">
                      {/* Summary */}
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

                      {/* Full description (Portable Text) */}
                      {role.description && (
                        <div style={{ marginTop: 24 }}>
                          <PortableText
                            value={role.description}
                            components={roleTextComponents}
                          />
                        </div>
                      )}

                      {/* Responsibilities */}
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

                      {/* Requirements */}
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

                      {/* Nice to have */}
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

                      {/* Apply button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyClick(role.title);
                        }}
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
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity =
                            "0.6";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity = "1";
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
          /* Empty state */
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
                fontFamily: "var(--serif)",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: 1.2,
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
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            lineHeight: 1.1,
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
                  fontFamily: "var(--serif)",
                  fontWeight: 400,
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  lineHeight: 1.2,
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
              {/* Name */}
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

              {/* Email */}
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

              {/* Role */}
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

              {/* Portfolio URL */}
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

              {/* Message */}
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

              {/* Submit */}
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
                  hello@houseofsingh.com
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
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 600,
                fontSize: "clamp(22px, 2.8vw, 30px)",
                lineHeight: 1.2,
              }}
            >
              Senior thinking on every brief.
            </h3>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 16,
                lineHeight: 1.6,
                opacity: 0.6,
                marginTop: 12,
              }}
            >
              No junior designers learning on client projects. Every
              collaborator brings experience that shapes the work from day one.
            </p>
          </div>
          <div className="scroll-reveal-up">
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 600,
                fontSize: "clamp(22px, 2.8vw, 30px)",
                lineHeight: 1.2,
              }}
            >
              Systems, not chaos.
            </h3>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 16,
                lineHeight: 1.6,
                opacity: 0.6,
                marginTop: 12,
              }}
            >
              Every project moves through defined stages: discovery, strategy,
              creative direction, production, delivery. You will always know
              where things stand.
            </p>
          </div>
          <div className="scroll-reveal-up">
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 600,
                fontSize: "clamp(22px, 2.8vw, 30px)",
                lineHeight: 1.2,
              }}
            >
              AI handles production. You handle judgment.
            </h3>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 16,
                lineHeight: 1.6,
                opacity: 0.6,
                marginTop: 12,
              }}
            >
              We use AI for research, asset generation, and workflow management.
              Creative direction stays human. Your taste, your decisions, your
              standards.
            </p>
          </div>
          <div className="scroll-reveal-up">
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 600,
                fontSize: "clamp(22px, 2.8vw, 30px)",
                lineHeight: 1.2,
              }}
            >
              Remote-first, outcome-driven.
            </h3>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 16,
                lineHeight: 1.6,
                opacity: 0.6,
                marginTop: 12,
              }}
            >
              We work with specialists across cities and time zones. What
              matters is the quality of the output and the clarity of the
              communication.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CTA BAND ── */}
      <section
        style={{
          padding: "120px var(--page-px)",
          background: "var(--bg-shift)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            opacity: 0.4,
            marginBottom: 20,
          }}
        >
          (Start a project)
        </p>
        <h2
          className="scroll-reveal-up"
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: "clamp(32px, 4.5vw, 60px)",
            lineHeight: 1.1,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Ready to build a brand that works?
        </h2>
        <Link
          href="/contact"
          className="scroll-reveal-up"
          style={{
            fontFamily: "var(--sans)",
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginTop: 32,
            display: "inline-block",
            color: "var(--text-primary)",
            textDecoration: "none",
            borderBottom: "1px solid var(--text-primary)",
            paddingBottom: 4,
            transition: "opacity 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.6";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
        >
          Get in touch
        </Link>
      </section>
    </>
  );
}
