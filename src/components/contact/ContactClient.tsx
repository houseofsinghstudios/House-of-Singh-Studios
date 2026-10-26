"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { PLACEMENTS } from "@/lib/project-planner/content";
import { startHref } from "@/lib/project-planner/start-links";
import NextPageLink from "@/components/layout/NextPageLink";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { STUDIO_EMAIL } from "@/lib/constants/contact";
import { BUDGET_OPTIONS } from "@/lib/lead";
import { NOMINATION_PLACEHOLDER, NOMINATION_SERVICES, isNomination } from "@/lib/initiatives/nominations";

export default function ContactClient({ initialService = "" }: { initialService?: string }) {
  const [submitted, setSubmitted] = useState(false);
  // A suggestion or nomination needs no budget, and asks about the brand or organization instead.
  const [service, setService] = useState(initialService);
  const nominating = isNomination(service);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Browsers match :focus-visible on text fields and selects even after a mouse click. The focus
  // ring is for keyboard users, so a pointer press holds it back until the next Tab.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const onPointer = () => form.setAttribute("data-pointer-focus", "");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") form.removeAttribute("data-pointer-focus");
    };
    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [submitted]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      service: formData.get("service"),
      budget: formData.get("budget"),
      message: formData.get("message"),
      honeypot: formData.get("honeypot"),
    };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* ── HERO (~50vh) ── */}
      <section
        className="flex flex-col justify-end px-[var(--page-px)]"
        style={{ minHeight: "50vh", paddingTop: "var(--hero-pt)", paddingBottom: 80 }}
      >
        <p
          data-hero-label
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-primary)]"
          style={{ opacity: 0.4 }}
        >
          (Contact)
        </p>

        <h1
          data-hero-heading
          className="reveal-text font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] mt-4 overflow-hidden max-w-[800px]"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.15 }}
        >
          Start a conversation.
        </h1>

        <p
          data-hero-sub
          className="font-[var(--sans)] font-normal text-[16px] leading-[1.75] text-[color:var(--text-primary)] max-w-[600px] mt-6"
          style={{ opacity: 0.6 }}
        >
          Whether you are building a new brand or refining an existing one, the first step is the same. Tell us about your project.
        </p>

        <p className="font-[var(--sans)] font-normal text-[14px] leading-[1.65] text-[color:var(--text-primary)] mt-4" style={{ opacity: 0.6 }}>
          {PLACEMENTS.contactLead}{" "}
          <Link href={startHref("contact")} className="underline underline-offset-4">{PLACEMENTS.contactLink}</Link>
        </p>
      </section>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <section className="contact-columns px-[var(--page-px)] pb-20">
        {/* LEFT: Form */}
        <div className="contact-col-left">
          {submitted ? (
            <p
              className="font-[var(--sans)] font-normal text-[16px] leading-[1.75] text-[color:var(--text-primary)]"
              style={{ opacity: 0.7 }}
            >
              Thank you. We have received your brief.
            </p>
          ) : (
            <>
              {error && (
                <p
                  role="alert"
                  className="font-[var(--sans)] font-normal text-[14px] leading-[1.65] mb-6"
                  style={{ color: "rgba(139, 0, 0, 0.8)" }}
                >
                  Something went wrong. Please try again or email us directly at{" "}
                  <a href={`mailto:${STUDIO_EMAIL}`} className="underline">
                    {STUDIO_EMAIL}
                  </a>
                  .
                </p>
              )}
              {/* post to /api/lead: a submit before JavaScript loads can never fall back to GET and put details in the URL */}
              <form ref={formRef} method="post" action="/api/lead" onSubmit={handleSubmit} className="flex flex-col gap-8" data-clarity-mask="True">
                <div>
                  <label htmlFor="contact-name" className="contact-label">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    className="contact-input"
                  />
                  <span className="focus-line" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="contact-label">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    className="contact-input"
                  />
                  <span className="focus-line" />
                </div>
                <div>
                  <label htmlFor="contact-service" className="contact-label">Service interest</label>
                  <select
                    id="contact-service"
                    name="service"
                    className="contact-input"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >
                    <option value="" disabled>Select a service</option>
                    <option value="Brand Identity">Brand Identity and Visual Design</option>
                    <option value="Visual Media">Visual Media and Content Production</option>
                    <option value="Digital Design">Digital Design and Experience</option>
                    <option value="Creative Strategy">Creative Strategy and Systems</option>
                    <option value="Multiple Services">Multiple Services</option>
                    <option value="Not sure">Not sure yet</option>
                    <option value={NOMINATION_SERVICES.parallel}>{NOMINATION_SERVICES.parallel}</option>
                    <option value={NOMINATION_SERVICES.commons}>{NOMINATION_SERVICES.commons}</option>
                  </select>
                  <span className="focus-line" />
                </div>
                {!nominating && (
                  <div>
                    <label htmlFor="contact-budget" className="contact-label">Budget range (CAD), optional</label>
                    <select
                      id="contact-budget"
                      name="budget"
                      className="contact-input"
                      defaultValue=""
                      aria-describedby="contact-budget-help"
                    >
                      <option value="" disabled>Select a range</option>
                      {BUDGET_OPTIONS.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                    <span className="focus-line" />
                    <p id="contact-budget-help" className="contact-helper">Projects start from $1,000.</p>
                  </div>
                )}
                <div>
                  <label htmlFor="contact-message" className="contact-label">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    className="contact-textarea"
                    placeholder={nominating ? NOMINATION_PLACEHOLDER : "Tell us about your project, your timeline, and what you are looking for."}
                  />
                  <span className="focus-line" />
                </div>
                <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                  <label htmlFor="contact-honeypot">Do not fill this field</label>
                  <input id="contact-honeypot" type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
                </div>
                <div>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* RIGHT: Book a call */}
        <div className="contact-col-right">
          <h2
            className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)]"
            style={{ fontSize: "clamp(24px, 2.5vw, 28px)", lineHeight: 1.2 }}
          >
            Prefer to talk?
          </h2>

          <p
            className="font-[var(--sans)] font-normal text-[15px] leading-[1.65] text-[color:var(--text-primary)] mt-4"
            style={{ opacity: 0.6 }}
          >
            Book a discovery call. We will discuss your brand, your goals, and whether we are the right fit.
          </p>

          <Button href={DISCOVERY_CALL_URL} className="mt-6" data-cursor="link" target="_blank" rel="noopener noreferrer">
            Book a Discovery Call
          </Button>

          <div className="mt-8">
            <p
              className="font-[var(--sans)] font-normal text-[14px] text-[color:var(--text-primary)]"
              style={{ opacity: 0.5 }}
            >
              Or email us directly
            </p>
            <a
              href={`mailto:${STUDIO_EMAIL}`}
              className="font-[var(--sans)] font-normal text-[14px] text-[color:var(--text-primary)] hover:underline"
              style={{ opacity: 0.5 }}
              data-cursor="link"
            >
              {STUDIO_EMAIL}
            </a>
          </div>
        </div>
      </section>

      <NextPageLink current="/contact" />
    </>
  );
}
