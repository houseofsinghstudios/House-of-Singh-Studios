"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import NextPageLink from "@/components/layout/NextPageLink";

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      service: formData.get("service"),
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
          Whether you are building a new brand or refining an existing one, the first step is the same. Tell us about your project and we will respond within 24 hours.
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
              Thank you. We have received your brief and will respond within 24 hours.
            </p>
          ) : (
            <>
              {error && (
                <p
                  className="font-[var(--sans)] font-normal text-[14px] leading-[1.65] mb-6"
                  style={{ color: "rgba(139, 0, 0, 0.8)" }}
                >
                  Something went wrong. Please try again or email us directly at{" "}
                  <a href="mailto:studio@houseofsingh.com" className="underline">
                    studio@houseofsingh.com
                  </a>
                  .
                </p>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div>
                  <label className="contact-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="contact-input"
                  />
                  <span className="focus-line" />
                </div>
                <div>
                  <label className="contact-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="contact-input"
                  />
                  <span className="focus-line" />
                </div>
                <div>
                  <label className="contact-label">Service interest</label>
                  <select
                    name="service"
                    className="contact-input"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a service</option>
                    <option value="Brand Identity">Brand Identity and Visual Design</option>
                    <option value="Visual Media">Visual Media and Content Production</option>
                    <option value="Digital Design">Digital Design and Experience</option>
                    <option value="Creative Strategy">Creative Strategy and Systems</option>
                    <option value="Not sure">Not sure yet</option>
                  </select>
                  <span className="focus-line" />
                </div>
                <div>
                  <label className="contact-label">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="contact-textarea"
                    placeholder="Tell us about your project, your timeline, and what you are looking for."
                  />
                  <span className="focus-line" />
                </div>
                <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                  <label>Do not fill this field</label>
                  <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
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
            Book a 30-minute discovery call. We will discuss your brand, your goals, and whether we are the right fit.
          </p>

          <Button href="https://cal.com" className="mt-6" data-cursor="link">
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
              href="mailto:studio@houseofsingh.com"
              className="font-[var(--sans)] font-normal text-[14px] text-[color:var(--text-primary)] hover:underline"
              style={{ opacity: 0.5 }}
              data-cursor="link"
            >
              studio@houseofsingh.com
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT DETAILS GRID ── */}
      <section
        className="css-reveal px-[var(--page-px)] pb-24"
        style={{ borderTop: "1px solid var(--border)", paddingTop: 48 }}
      >
        <div className="contact-details-grid">
          <div>
            <p
              className="font-[var(--sans)] text-[11px] uppercase tracking-[0.1em] text-[color:var(--text-muted)] m-0 mb-2"
            >
              Email
            </p>
            <a
              href="mailto:studio@houseofsingh.com"
              className="font-[var(--sans)] text-[15px] text-[color:var(--text-primary)] no-underline hover:underline"
              data-cursor="link"
            >
              studio@houseofsingh.com
            </a>
          </div>
          <div className="contact-details-divider" />
          <div>
            <p
              className="font-[var(--sans)] text-[11px] uppercase tracking-[0.1em] text-[color:var(--text-muted)] m-0 mb-2"
            >
              Location
            </p>
            <p className="font-[var(--sans)] text-[15px] text-[color:var(--text-primary)] m-0">
              Toronto, Canada
            </p>
          </div>
          <div className="contact-details-divider" />
          <div>
            <p
              className="font-[var(--sans)] text-[11px] uppercase tracking-[0.1em] text-[color:var(--text-muted)] m-0 mb-2"
            >
              Hours
            </p>
            <p className="font-[var(--sans)] text-[15px] text-[color:var(--text-primary)] m-0">
              Mon — Fri, 9am — 6pm EST
            </p>
          </div>
        </div>
      </section>

      <NextPageLink />
    </>
  );
}
