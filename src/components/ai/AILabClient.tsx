"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { Link } from "next-view-transitions";
import {
  initScrollFallbacks,
  cleanScrollFallbacks,
} from "@/lib/scroll-fallback";

const PROCESS_STAGES = [
  {
    name: "Discovery",
    role: "AI accelerates research, competitor analysis, and market scanning so we start with deeper context in less time.",
  },
  {
    name: "Strategy",
    role: "AI processes audience data and positioning inputs to surface patterns that sharpen strategic decisions.",
  },
  {
    name: "Creative Direction",
    role: "AI generates visual explorations and concept variations that the creative director evaluates, refines, or discards. Speed without compromise.",
  },
  {
    name: "Production",
    role: "AI handles asset generation, file preparation, and consistency checks across deliverables. Quality control is automated, not manual.",
  },
  {
    name: "Delivery",
    role: "AI assists in documentation, guideline formatting, and system organization so the final handoff is structured and complete.",
  },
];

export default function AILabClient() {
  const heroRef = useRef<HTMLElement>(null);
  const splitsRef = useRef<SplitType[]>([]);

  const [pulseEmail, setPulseEmail] = useState("");
  const [pulseSubmitted, setPulseSubmitted] = useState(false);
  const [pulseSubmitting, setPulseSubmitting] = useState(false);

  async function handlePulseEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pulseEmail.trim()) return;
    setPulseSubmitting(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pulseEmail, source: "brand-pulse-waitlist" }),
      });
      setPulseSubmitted(true);
    } catch {
      // Silent fail
    } finally {
      setPulseSubmitting(false);
    }
  }

  useEffect(() => {
    initScrollFallbacks();

    const hero = heroRef.current;
    if (!hero) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const label = hero.querySelector("[data-hero-label]");
    const heading = hero.querySelector("[data-hero-heading]") as HTMLElement;
    const sub = hero.querySelector("[data-hero-sub]");

    if (label) {
      gsap.set(label, { opacity: 0, y: 12 });
      tl.to(label, { opacity: 0.4, y: 0, duration: 0.4 }, 0);
    }

    if (heading) {
      const split = new SplitType(heading, { types: "words" });
      splitsRef.current.push(split);
      if (split.words) {
        gsap.set(split.words, { y: "100%", opacity: 0 });
        tl.to(split.words, { y: "0%", opacity: 1, stagger: 0.06, duration: 0.6 }, 0.15);
      }
    }

    if (sub) {
      gsap.set(sub, { opacity: 0, y: 20 });
      tl.to(sub, { opacity: 0.7, y: 0, duration: 0.5 }, 0.6);
    }

    return () => {
      cleanScrollFallbacks();
      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];
      tl.kill();
    };
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="flex flex-col justify-end px-[var(--page-px)]"
        style={{ minHeight: "100vh", paddingBottom: 100 }}
      >
        <p
          data-hero-label
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-primary)] mb-5"
          style={{ opacity: 0.4 }}
        >
          (AI Lab)
        </p>
        <h1
          data-hero-heading
          className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] overflow-hidden"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.15, margin: 0 }}
        >
          AI is built into how we work.
        </h1>
        <p
          data-hero-sub
          className="font-[var(--sans)] font-normal text-[16px] text-[color:var(--text-primary)] max-w-[640px] mt-6"
          style={{ lineHeight: 1.75, opacity: 0.7 }}
        >
          Every project benefits from AI at the production layer. Research acceleration. Asset generation. Quality control. Workflow automation. The result is faster delivery, sharper consistency, and fewer revisions.
          <br /><br />
          But creative direction is always human. AI does not make brand decisions. We do.
        </p>
      </section>

      {/* ── SECTION 1: THE CREATIVE DIRECTION ARGUMENT ── */}
      <section style={{ padding: "120px var(--page-px)" }}>
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-6"
          style={{ opacity: 0.4 }}
        >
          (Why It Matters)
        </p>
        <h2
          className="scroll-reveal-up font-[var(--serif)] font-normal text-[color:var(--text-primary)]"
          style={{ fontSize: "clamp(28px, 3.5vw, 48px)", lineHeight: 1.1, margin: 0 }}
        >
          AI can generate assets. It cannot build a brand.
        </h2>
        <div className="max-w-[640px] mt-8">
          <p
            className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)]"
            style={{ lineHeight: 1.75, opacity: 0.7 }}
          >
            A brand requires judgment, taste, cultural context, and a system. AI cannot determine what your brand should stand for. It cannot read a room or understand why a particular typeface feels right for your industry.
            <br /><br />
            That is creative direction. That is what we provide.
            <br /><br />
            AI handles production. We handle meaning.
          </p>
        </div>
      </section>

      {/* ── SECTION 2: HOW AI POWERS THE PROCESS ── */}
      <section style={{ padding: "120px var(--page-px)", background: "var(--bg-shift)" }}>
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-6"
          style={{ opacity: 0.4 }}
        >
          (How It Works)
        </p>
        <h2
          className="scroll-reveal-up font-[var(--serif)] font-normal text-[color:var(--text-primary)] mb-12"
          style={{ fontSize: "clamp(28px, 3.5vw, 48px)", lineHeight: 1.1, margin: 0, marginBottom: 48 }}
        >
          What AI does at each stage.
        </h2>

        <div className="ai-process-list">
          {PROCESS_STAGES.map((stage) => (
            <div key={stage.name} className="ai-process-row scroll-reveal-up">
              <div className="ai-process-name">{stage.name}</div>
              <div className="ai-process-role">{stage.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: BRAND PULSE CHECK PLACEHOLDER ── */}
      <section style={{ padding: "120px var(--page-px)" }}>
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-6"
          style={{ opacity: 0.4 }}
        >
          (Brand Pulse Check)
        </p>
        <h2
          className="scroll-reveal-up font-[var(--serif)] font-normal text-[color:var(--text-primary)]"
          style={{ fontSize: "clamp(28px, 3.5vw, 48px)", lineHeight: 1.1, margin: 0 }}
        >
          How strong is your brand?
        </h2>
        <p
          className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)] max-w-[640px] mt-4"
          style={{ opacity: 0.6, lineHeight: 1.75 }}
        >
          Our AI analyzes your brand&apos;s visual consistency, messaging clarity, and digital presence. Enter your URL. Get your results.
        </p>

        {/* Placeholder container */}
        <div
          className="mt-8"
          style={{
            border: "1px solid rgba(26, 26, 26, 0.1)",
            padding: 48,
            textAlign: "center",
            maxWidth: 640,
          }}
        >
          <p
            className="font-[var(--sans)] text-[15px] text-[color:var(--text-primary)]"
            style={{ opacity: 0.4, margin: 0 }}
          >
            Brand Pulse Check is launching soon.
          </p>
          <p
            className="font-[var(--sans)] text-[14px] text-[color:var(--text-primary)] mt-2"
            style={{ opacity: 0.35 }}
          >
            Leave your email to be first in line.
          </p>

          {pulseSubmitted ? (
            <p
              className="font-[var(--sans)] text-[14px] text-[color:var(--text-primary)] mt-6"
              style={{ opacity: 0.5 }}
            >
              You&apos;re on the list. We&apos;ll be in touch.
            </p>
          ) : (
            <form onSubmit={handlePulseEmail} className="pulse-waitlist-form mt-6">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={pulseEmail}
                onChange={(e) => setPulseEmail(e.target.value)}
                className="pulse-waitlist-input"
              />
              <button
                type="submit"
                disabled={pulseSubmitting}
                className="pulse-waitlist-btn"
              >
                {pulseSubmitting ? "..." : "Notify Me"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── SECTION 4: STUDIO GUIDE TEASER ── */}
      <section style={{ padding: "0 var(--page-px) 80px" }}>
        <p
          className="font-[var(--sans)] text-[14px] text-[color:var(--text-primary)]"
          style={{ opacity: 0.4 }}
        >
          Looking for answers about our services, process, or pricing?
        </p>
        <p
          className="font-[var(--sans)] text-[14px] text-[color:var(--text-primary)] mt-1"
          style={{ opacity: 0.4 }}
        >
          The Studio Guide is an AI assistant trained on everything we do. Coming soon.
        </p>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "120px var(--page-px)",
          background: "var(--bg-shift)",
          textAlign: "center",
        }}
      >
        <h2
          className="scroll-reveal-up font-[var(--serif)] font-normal text-[color:var(--text-primary)]"
          style={{ fontSize: "clamp(32px, 4.5vw, 60px)", lineHeight: 1.1, margin: 0 }}
        >
          Start a project.
        </h2>
        <p
          className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)] mt-4"
          style={{ opacity: 0.6 }}
        >
          We respond within 24 hours.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
          <a
            href="#"
            className="contact-submit inline-block"
            data-cursor="link"
          >
            Book a Discovery Call
          </a>
          <Link
            href="/contact"
            className="inline-block font-[var(--sans)] text-[13px] uppercase tracking-[0.1em] text-[color:var(--text-primary)]"
            style={{
              padding: "16px 32px",
              border: "1px solid rgba(26, 26, 26, 0.2)",
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
            data-cursor="link"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.6"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            Start a Project
          </Link>
        </div>
      </section>
    </>
  );
}
