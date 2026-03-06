"use client";

import { useEffect, useRef } from "react";
import { Link } from "next-view-transitions";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import OGLCanvas from "@/components/OGLCanvas";
import { useIsMobile } from "@/lib/use-is-mobile";
import {
  initScrollFallbacks,
  cleanScrollFallbacks,
} from "@/lib/scroll-fallback";

gsap.registerPlugin(ScrollTrigger);

/* ── Stat config ── */
const STATS = [
  { target: 110, suffix: "+", label: "Projects delivered across identity, media, and digital." },
  { target: 12, suffix: "+", label: "Years of multidisciplinary practice." },
  { target: 15, suffix: "+", label: "Industries served." },
];

/* ── Process steps ── */
const STEPS = [
  { num: "01", name: "Discovery", desc: "We learn your business, your audience, and your goals. No assumptions. Interviews, audits, and competitive analysis." },
  { num: "02", name: "Strategy", desc: "We define the positioning, the scope, and the creative direction. You approve the plan before any production starts." },
  { num: "03", name: "Creative Direction", desc: "Concepts, references, and creative frameworks. We establish the visual and strategic direction with your input." },
  { num: "04", name: "Production", desc: "The work gets built. Checkpoints at defined intervals. AI handles production speed. Human judgment handles quality." },
  { num: "05", name: "Delivery", desc: "Final deliverables, documentation, and handoff. Your team has everything they need to use the system independently." },
];

export default function AboutClient() {
  const isMobile = useIsMobile();

  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const processHeadingRef = useRef<HTMLHeadingElement>(null);
  const networkHeadingRef = useRef<HTMLHeadingElement>(null);
  const founderNameRef = useRef<HTMLHeadingElement>(null);
  const aiQuoteRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const numberRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  // Collect all SplitType instances for cleanup
  const splitsRef = useRef<SplitType[]>([]);

  // ── Hero page load orchestration ──
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const label = hero.querySelector("[data-hero-label]");
    const heading = hero.querySelector("[data-hero-heading]") as HTMLElement;

    if (label) {
      gsap.set(label, { opacity: 0, y: 12 });
      tl.to(label, { opacity: 0.5, y: 0, duration: 0.4 }, 0);
    }

    if (heading) {
      const split = new SplitType(heading, { types: "words" });
      splitsRef.current.push(split);
      if (split.words) {
        gsap.set(split.words, { y: "100%", opacity: 0 });
        tl.to(
          split.words,
          { y: "0%", opacity: 1, stagger: 0.05, duration: 0.5 },
          0.15,
        );
      }
    }

    return () => { tl.kill(); };
  }, []);

  // ── Stats count-up ──
  useEffect(() => {
    const section = statsRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Set initial states
      numberRefs.current.forEach((el, i) => {
        if (el) el.textContent = `0${STATS[i].suffix}`;
      });
      descRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 10 });
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          STATS.forEach((stat, i) => {
            const numEl = numberRefs.current[i];
            if (!numEl) return;

            const obj = { val: 0 };
            gsap.to(obj, {
              val: stat.target,
              duration: 1.5,
              ease: "power2.out",
              delay: i * 0.15,
              onUpdate: () => {
                numEl.textContent = `${Math.round(obj.val)}${stat.suffix}`;
              },
            });
          });

          descRefs.current.forEach((el, i) => {
            if (el) {
              gsap.to(el, {
                opacity: 0.6,
                y: 0,
                duration: 0.4,
                delay: i * 0.15 + 0.2,
                ease: "power3.out",
              });
            }
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // ── Process heading SplitType ──
  useEffect(() => {
    const heading = processHeadingRef.current;
    if (!heading) return;

    const split = new SplitType(heading, { types: "words" });
    splitsRef.current.push(split);

    if (split.words) {
      gsap.set(split.words, { y: "100%", opacity: 0 });
      gsap.to(split.words, {
        y: "0%",
        opacity: 1,
        stagger: 0.04,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 80%", once: true },
      });
    }

    return () => { /* cleaned up in master cleanup */ };
  }, []);

  // ── Network heading SplitType ──
  useEffect(() => {
    const heading = networkHeadingRef.current;
    if (!heading) return;

    const split = new SplitType(heading, { types: "words" });
    splitsRef.current.push(split);

    if (split.words) {
      gsap.set(split.words, { y: "100%", opacity: 0 });
      gsap.to(split.words, {
        y: "0%",
        opacity: 1,
        stagger: 0.04,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 80%", once: true },
      });
    }
  }, []);

  // ── Founder name SplitType ──
  useEffect(() => {
    const heading = founderNameRef.current;
    if (!heading) return;

    const split = new SplitType(heading, { types: "words" });
    splitsRef.current.push(split);

    if (split.words) {
      gsap.set(split.words, { y: "100%", opacity: 0 });
      gsap.to(split.words, {
        y: "0%",
        opacity: 1,
        stagger: 0.05,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 80%", once: true },
      });
    }
  }, []);

  // ── AI quote SplitType ──
  useEffect(() => {
    const quote = aiQuoteRef.current;
    if (!quote) return;

    const split = new SplitType(quote, { types: "words" });
    splitsRef.current.push(split);

    if (split.words) {
      gsap.set(split.words, { y: "100%", opacity: 0 });
      gsap.to(split.words, {
        y: "0%",
        opacity: 1,
        stagger: 0.03,
        duration: 0.4,
        ease: "power3.out",
        scrollTrigger: { trigger: quote, start: "top 80%", once: true },
      });
    }

    // AI link fade
    const link = quote.parentElement?.querySelector("[data-ai-link]");
    if (link) {
      gsap.set(link, { opacity: 0, y: 8 });
      gsap.to(link, {
        opacity: 0.6,
        y: 0,
        duration: 0.3,
        ease: "power3.out",
        scrollTrigger: { trigger: link, start: "top 85%", once: true },
      });
    }
  }, []);

  // ── CTA entrance ──
  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;

    const heading = cta.querySelector("[data-cta-heading]") as HTMLElement;
    const sub = cta.querySelector("[data-cta-sub]");
    const btn = cta.querySelector("[data-cta-btn]");

    let split: SplitType | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: cta, start: "top 75%", once: true },
        defaults: { ease: "power3.out" },
      });

      if (heading) {
        split = new SplitType(heading, { types: "words" });
        splitsRef.current.push(split);
        if (split.words) {
          gsap.set(split.words, { y: "100%", opacity: 0 });
          tl.to(split.words, { y: "0%", opacity: 1, stagger: 0.04, duration: 0.5 }, 0);
        }
      }

      if (sub) {
        gsap.set(sub, { opacity: 0, y: 12 });
        tl.to(sub, { opacity: 0.7, y: 0, duration: 0.4 }, ">");
      }

      if (btn) {
        gsap.set(btn, { opacity: 0, y: 8 });
        tl.to(btn, { opacity: 1, y: 0, duration: 0.3 }, ">0.1");
      }
    }, cta);

    return () => ctx.revert();
  }, []);

  // ── Scroll fallbacks + master cleanup ──
  useEffect(() => {
    initScrollFallbacks();
    return () => {
      cleanScrollFallbacks();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      splitsRef.current.forEach((s) => {
        try { s.revert(); } catch { /* already reverted */ }
      });
      splitsRef.current = [];
    };
  }, []);

  return (
    <>
      {/* ═══════════════════════ SECTION 1: HERO ═══════════════════════ */}
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
          data-hero-label
          className="font-[var(--sans)] text-xs uppercase tracking-[0.15em] text-[color:var(--text-primary)]"
          style={{ opacity: 0.5 }}
        >
          (About)
        </p>

        <h1
          data-hero-heading
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] mt-4 max-w-[900px] overflow-hidden"
          style={{ fontSize: "clamp(38px, 5vw, 72px)", lineHeight: 1.1 }}
        >
          Design should be structured, intentional, and commercially effective.
        </h1>
      </section>

      {/* ═══════════════════════ SECTION 2: STUDIO STORY ═══════════════════════ */}
      <section style={{ padding: "120px var(--page-px)" }}>
        <div style={{ maxWidth: 740 }}>
          <p
            className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] scroll-reveal-up"
            style={{ opacity: 0.4, marginBottom: 24 }}
          >
            (Studio)
          </p>

          <p
            className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] scroll-reveal-up"
            style={{ fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.45 }}
          >
            House of Singh Studios is a multidisciplinary design studio that
            builds brand identities, visual narratives, and digital experiences
            for established businesses. The studio was founded on a direct
            premise: design should be structured, intentional, and commercially
            effective. Every project runs through a defined system. Every
            deliverable serves a business purpose.
          </p>

          <p
            className="font-[var(--sans)] font-normal text-[17px] leading-[1.65] text-[color:var(--text-primary)] scroll-reveal-up"
            style={{ opacity: 0.75, marginTop: 32, maxWidth: 600, animationDelay: "0.15s" }}
          >
            We are not a traditional agency with layers of account managers and
            inflated timelines. We are a system-led studio where creative
            direction, structured processes, and modern tools work together to
            produce work that holds up across every medium.
          </p>
        </div>
      </section>

      {/* ═══════════════════════ SECTION 3: THE NUMBERS ═══════════════════════ */}
      <section
        ref={statsRef}
        style={{
          padding: "80px var(--page-px)",
          borderTop: "1px solid rgba(26,26,26,0.08)",
          borderBottom: "1px solid rgba(26,26,26,0.08)",
        }}
      >
        <div className="about-stats-grid">
          {STATS.map((stat, i) => (
            <div key={i}>
              <p
                ref={(el) => { numberRefs.current[i] = el; }}
                className="font-[var(--serif)] font-semibold leading-none text-[color:var(--text-primary)] m-0"
                style={{ fontSize: "clamp(36px, 4vw, 52px)" }}
              >
                0{stat.suffix}
              </p>
              <p
                ref={(el) => { descRefs.current[i] = el; }}
                className="font-[var(--sans)] font-normal text-sm leading-[1.5] text-[color:var(--text-primary)]"
                style={{ opacity: 0.6, marginTop: 12, maxWidth: 200 }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ SECTION 4: HOW WE WORK ═══════════════════════ */}
      <section
        className="bg-[var(--bg-shift)]"
        style={{ padding: "120px var(--page-px)" }}
      >
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] scroll-reveal-up"
          style={{ opacity: 0.4, marginBottom: 48 }}
        >
          (Process)
        </p>

        <h2
          ref={processHeadingRef}
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] overflow-hidden"
          style={{
            fontSize: "clamp(28px, 3.5vw, 44px)",
            lineHeight: 1.15,
            marginBottom: 64,
          }}
        >
          Every project moves through five stages.
        </h2>

        {STEPS.map((step) => (
          <div
            key={step.num}
            className="about-process-step scroll-reveal-up"
          >
            <div>
              <span
                className="font-[var(--serif)] font-semibold text-[24px] text-[color:var(--text-primary)]"
                style={{ opacity: 0.3 }}
              >
                {step.num}
              </span>
            </div>
            <div>
              {isMobile ? (
                <h3 className="font-[var(--serif)] font-semibold text-[24px] text-[color:var(--text-primary)] mb-2">
                  {step.num} — {step.name}
                </h3>
              ) : (
                <h3 className="font-[var(--serif)] font-semibold text-[24px] text-[color:var(--text-primary)] mb-2">
                  {step.name}
                </h3>
              )}
              <p
                className="font-[var(--sans)] font-normal text-base leading-[1.65] text-[color:var(--text-primary)]"
                style={{ opacity: 0.7, maxWidth: 540 }}
              >
                {step.desc}
              </p>
            </div>
          </div>
        ))}

        <p
          className="font-[var(--sans)] font-normal italic text-base text-[color:var(--text-primary)] scroll-reveal-up"
          style={{ opacity: 0.5, marginTop: 48, maxWidth: 540 }}
        >
          AI handles research, asset generation, and workflow management.
          Creative direction stays human.
        </p>
      </section>

      {/* ═══════════════════════ SECTION 5: CAPABILITIES NETWORK ═══════════════════════ */}
      <section style={{ padding: "120px var(--page-px)" }}>
        <div className="about-network-grid">
          <div>
            <p
              className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.4, marginBottom: 24 }}
            >
              (Network)
            </p>

            <h2
              ref={networkHeadingRef}
              className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] overflow-hidden"
              style={{ fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.15 }}
            >
              Senior-level thinking applied to every brief.
            </h2>
          </div>

          <div>
            <p
              className="font-[var(--sans)] font-normal text-[17px] leading-[1.65] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.75 }}
            >
              The studio works with a select network of specialists across
              strategy, design, production, and technology. Each engagement
              assembles the right team for the scope. No inflated headcount. No
              junior designers learning on your project.
            </p>

            <p
              className="font-[var(--sans)] font-normal text-[17px] leading-[1.65] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.75, marginTop: 24 }}
            >
              This structure means you get focused expertise without agency
              overhead. The people working on your project are the people making
              the decisions.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION 6: FOUNDER ═══════════════════════ */}
      <section
        style={{
          padding: "120px var(--page-px)",
          borderTop: "1px solid rgba(26,26,26,0.08)",
        }}
      >
        <div className="about-founder-grid">
          {/* Photo */}
          <div>
            <div
              className="scroll-clip-reveal"
              style={{ aspectRatio: "3/4", overflow: "hidden", maxWidth: 480 }}
              data-cursor="link"
            >
              {isMobile ? (
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      "linear-gradient(180deg, #3A3A3A 0%, #1A1A1A 100%)",
                  }}
                />
              ) : (
                <OGLCanvas
                  imageSrc="linear-gradient(180deg, #3A3A3A 0%, #1A1A1A 100%)"
                  className="w-full h-full"
                />
              )}
            </div>
            <p
              className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)]"
              style={{ opacity: 0.4, marginTop: 16 }}
            >
              Maninder Singh
            </p>
          </div>

          {/* Bio */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p
              className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.4, marginBottom: 24 }}
            >
              (Founder)
            </p>

            <h2
              ref={founderNameRef}
              className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] overflow-hidden"
              style={{
                fontSize: "clamp(28px, 3.5vw, 44px)",
                lineHeight: 1.15,
                marginBottom: 8,
              }}
            >
              Maninder Singh
            </h2>

            <p
              className="font-[var(--sans)] font-normal text-[15px] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.5, marginBottom: 32 }}
            >
              Founder and Creative Director
            </p>

            <p
              className="font-[var(--sans)] font-normal text-[17px] leading-[1.65] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.75 }}
            >
              Maninder built House of Singh Studios, its creative standards, and
              the systems that power its operations. His work spans brand
              identity, photography, film, and creative strategy across 12+ years
              and 15+ industries.
            </p>

            <p
              className="font-[var(--sans)] font-normal text-[17px] leading-[1.65] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.75, marginTop: 24 }}
            >
              The studio is built on a belief that design should serve business
              outcomes, not designer egos. Every system, every process, and every
              creative decision is structured to deliver measurable results.
            </p>

            <a
              href="https://houseofsingh.com"
              target="_blank"
              rel="noopener"
              className="font-[var(--sans)] font-medium text-sm uppercase tracking-[0.1em] text-[color:var(--text-primary)] no-underline scroll-reveal-up"
              style={{
                marginTop: 32,
                borderBottom: "1px solid var(--text-primary)",
                paddingBottom: 4,
                display: "inline-block",
              }}
              data-cursor="link"
            >
              Full creative identity and personal brand
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION 7: AI POSITIONING ═══════════════════════ */}
      <section
        className="bg-[var(--bg-shift)] text-center"
        style={{ padding: "100px var(--page-px)" }}
      >
        <p
          ref={aiQuoteRef}
          className="font-[var(--serif)] font-normal italic text-[color:var(--text-primary)] overflow-hidden"
          style={{
            fontSize: "clamp(22px, 2.8vw, 30px)",
            lineHeight: 1.4,
            maxWidth: 680,
            margin: "0 auto",
            opacity: 0.85,
          }}
        >
          AI is built into how we work. It makes every project faster, more
          consistent, and more efficient. But creative direction is always human.
        </p>

        <Link
          data-ai-link
          href="/ai"
          className="font-[var(--sans)] font-medium text-[13px] uppercase tracking-[0.1em] text-[color:var(--text-primary)] no-underline"
          style={{
            marginTop: 32,
            borderBottom: "1px solid var(--text-primary)",
            paddingBottom: 4,
            opacity: 0.6,
            display: "inline-block",
          }}
          data-cursor="link"
        >
          Learn how AI powers the studio
        </Link>
      </section>

      {/* ═══════════════════════ SECTION 8: CTA BAND ═══════════════════════ */}
      <section
        ref={ctaRef}
        className="text-center"
        style={{ padding: "120px var(--page-px)" }}
      >
        <h2
          data-cta-heading
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] overflow-hidden"
          style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.1 }}
        >
          Have a project in mind?
        </h2>
        <p
          data-cta-sub
          className="font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-primary)] max-w-[480px] mx-auto"
          style={{ margin: "24px auto 40px", opacity: 0.7 }}
        >
          Tell us about your business and we will show you what is possible.
        </p>
        <Link
          data-cta-btn
          href="/contact"
          className="font-[var(--sans)] font-medium text-sm uppercase tracking-[0.12em] text-[color:var(--text-primary)] no-underline"
          style={{
            borderBottom: "1px solid var(--text-primary)",
            paddingBottom: 4,
          }}
          data-cursor="link"
        >
          Start a Project
        </Link>
      </section>
    </>
  );
}
