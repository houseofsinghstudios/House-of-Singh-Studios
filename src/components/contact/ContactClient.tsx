"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      message: formData.get("message"),
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

  // ── Hero animation ──
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let split: SplitType | null = null;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const label = hero.querySelector("[data-hero-label]");
    const heading = hero.querySelector("[data-hero-heading]") as HTMLElement;
    const sub = hero.querySelector("[data-hero-sub]");

    if (label) {
      gsap.set(label, { opacity: 0, y: 12 });
      tl.to(label, { opacity: 0.4, y: 0, duration: 0.4 }, 0);
    }

    if (heading) {
      split = new SplitType(heading, { types: "words" });
      if (split.words) {
        gsap.set(split.words, { y: "100%", opacity: 0 });
        tl.to(split.words, { y: "0%", opacity: 1, stagger: 0.06, duration: 0.6 }, 0.15);
      }
    }

    if (sub) {
      gsap.set(sub, { opacity: 0, y: 12 });
      tl.to(sub, { opacity: 0.6, y: 0, duration: 0.4 }, 0.6);
    }

    return () => {
      tl.kill();
      if (split) split.revert();
    };
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="flex flex-col justify-center px-[var(--page-px)]"
        style={{ minHeight: "100vh" }}
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
          className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] mt-4 overflow-hidden max-w-[800px]"
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
                </div>
                <div>
                  <label className="contact-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="contact-input"
                  />
                </div>
                <div>
                  <label className="contact-label">Company (optional)</label>
                  <input
                    type="text"
                    name="company"
                    className="contact-input"
                  />
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
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="contact-submit disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send Brief"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* RIGHT: Book a call */}
        <div className="contact-col-right">
          <h2
            className="font-[var(--serif)] font-normal text-[color:var(--text-primary)]"
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

          <a
            href="#"
            className="contact-submit inline-block mt-6"
            data-cursor="link"
          >
            Book a Discovery Call
          </a>

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

      {/* ── BOTTOM LINE ── */}
      <div className="px-[var(--page-px)] pb-24">
        <p
          className="font-[var(--sans)] font-normal text-[14px] text-[color:var(--text-primary)] text-center"
          style={{ opacity: 0.35 }}
        >
          Based in Toronto. Working with businesses across North America.
        </p>
      </div>
    </>
  );
}
