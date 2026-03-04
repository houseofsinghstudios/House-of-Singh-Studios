"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import Link from "next/link";
import BrandPulseCheck from "./BrandPulseCheck";
import {
  initScrollFallbacks,
  cleanScrollFallbacks,
} from "@/lib/scroll-fallback";

export default function AILabClient() {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);
  const splitsRef = useRef<SplitType[]>([]);

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

  return (
    <>
      {/* ── SECTION 1: HERO ── */}
      <section
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
          (AI Lab)
        </p>
        <h1
          ref={headingRef}
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: "clamp(48px, 7vw, 96px)",
            lineHeight: 1.05,
            color: "var(--text-primary)",
            margin: 0,
            overflow: "hidden",
          }}
        >
          AI Lab
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
          This is where AI meets creative direction. We build with it. We test
          with it. And we use it to deliver better work, faster, without agency
          overhead.
        </p>
      </section>

      {/* ── SECTION 2: BRAND PULSE CHECK ── */}
      <BrandPulseCheck />

      {/* ── SECTION 3: HOW AI POWERS THE STUDIO ── */}
      <section style={{ padding: "120px var(--page-px)" }}>
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
          (How It Works)
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
          Better work. Faster. Without agency overhead.
        </h2>
        <div style={{ maxWidth: 740, marginTop: 24 }}>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 17,
              lineHeight: 1.7,
              opacity: 0.7,
            }}
          >
            AI is integrated across our entire workflow. It accelerates
            research, generates initial asset explorations, runs quality control
            checks, and automates operational tasks that traditionally add weeks
            to project timelines.
          </p>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 17,
              lineHeight: 1.7,
              opacity: 0.7,
              marginTop: 16,
            }}
          >
            For you, this means: faster turnaround without rushed work. Fewer
            revisions because consistency is built into the system. And a leaner
            operation that does not pass bloated overhead costs on to clients.
          </p>
        </div>

        {/* Two-column split */}
        <div className="ai-capabilities-grid">
          <div className="scroll-reveal-up">
            <p className="ai-capabilities-label">(What AI Handles)</p>
            <p className="ai-capabilities-item">
              Research and competitive analysis acceleration
            </p>
            <p className="ai-capabilities-item">
              Initial asset exploration and variation generation
            </p>
            <p className="ai-capabilities-item">
              Quality control and brand consistency checks
            </p>
            <p className="ai-capabilities-item">
              Workflow automation and project operations
            </p>
            <p className="ai-capabilities-item">
              Content structuring and documentation
            </p>
          </div>
          <div className="scroll-reveal-up">
            <p className="ai-capabilities-label">(What Stays Human)</p>
            <p className="ai-capabilities-item">
              Creative direction and brand strategy
            </p>
            <p className="ai-capabilities-item">
              Client relationships and communication
            </p>
            <p className="ai-capabilities-item">
              Taste, judgment, and cultural context
            </p>
            <p className="ai-capabilities-item">
              Final creative decisions on every deliverable
            </p>
            <p className="ai-capabilities-item">
              Quality standards and approval
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: THE CREATIVE DIRECTION ARGUMENT ── */}
      <section
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
          (Why It Matters)
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
            maxWidth: 800,
          }}
        >
          AI can generate assets. It cannot build a brand.
        </h2>
        <div className="scroll-reveal-up" style={{ maxWidth: 740, marginTop: 32 }}>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 17,
              lineHeight: 1.7,
              opacity: 0.7,
            }}
          >
            Every business now has access to AI tools that can generate logos,
            write copy, and produce images. The tools are available to everyone.
            The output looks the same.
          </p>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 17,
              lineHeight: 1.7,
              opacity: 0.7,
              marginTop: 16,
            }}
          >
            A brand is not a collection of generated assets. A brand is a
            system: a point of view, a visual language, a set of decisions about
            how a business shows up across every touchpoint. That requires
            judgment, taste, cultural understanding, and a framework that holds
            up under pressure.
          </p>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 17,
              lineHeight: 1.7,
              opacity: 0.7,
              marginTop: 16,
            }}
          >
            House of Singh Studios provides the creative direction layer. We use
            AI to move faster and work more efficiently. But the decisions that
            define your brand are made by people who understand what makes a
            brand work commercially, not just visually.
          </p>
        </div>
      </section>

      {/* ── SECTION 5: AI IN YOUR WORKFLOW (CLIENT C SEED) ── */}
      <section style={{ padding: "120px var(--page-px)" }}>
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
          (For Your Business)
        </p>
        <h2
          className="scroll-reveal-up"
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: "clamp(28px, 3.5vw, 42px)",
            lineHeight: 1.15,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          AI in Your Creative Workflow
        </h2>
        <div className="scroll-reveal-up" style={{ maxWidth: 740, marginTop: 20 }}>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 17,
              lineHeight: 1.7,
              opacity: 0.7,
            }}
          >
            If your team is exploring how to integrate AI into your own creative
            operations, we can help. As part of our Creative Strategy and
            Systems service, we offer guidance on tool selection, workflow
            design, and implementation that fits your business rather than
            replacing your team.
          </p>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 17,
              lineHeight: 1.7,
              opacity: 0.7,
              marginTop: 16,
            }}
          >
            This is not a standalone product. It is a capability we bring to
            client engagements where it adds value.
          </p>
          <Link
            href="/contact"
            style={{
              fontFamily: "var(--sans)",
              fontSize: 14,
              borderBottom: "1px solid var(--text-primary)",
              paddingBottom: 4,
              textDecoration: "none",
              color: "var(--text-primary)",
              transition: "opacity 0.3s ease",
              display: "inline-block",
              marginTop: 28,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
          >
            Talk to Us About Creative Strategy
          </Link>
        </div>
      </section>

      {/* ── SECTION 6: CTA BAND ── */}
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
