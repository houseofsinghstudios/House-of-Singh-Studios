"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Button from "@/components/ui/Button";
import {
  initScrollFallbacks,
  cleanScrollFallbacks,
} from "@/lib/scroll-fallback";

gsap.registerPlugin(ScrollTrigger);

/* ── Stat config ── */
const STATS = [
  { target: 50, suffix: "+", label: "Projects delivered across identity, media, and digital." },
  { target: 12, suffix: "+", label: "Years of multidisciplinary practice." },
  { target: 8, suffix: "+", label: "Industries served." },
];

/* ── Process steps ── */
const STEPS = [
  { name: "Discovery", desc: "We learn your business, your market, and your goals before we design anything." },
  { name: "Strategy", desc: "We define positioning, audience, and visual direction so every creative decision has a reason behind it." },
  { name: "Creative Direction", desc: "We establish the visual language, tone, and systems that will define how your brand shows up." },
  { name: "Production", desc: "We build the assets, documentation, and deliverables with AI-assisted quality control at every step." },
  { name: "Delivery", desc: "You receive a complete brand system with guidelines, files, and the structure to maintain it without us." },
];

export default function AboutClient() {
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const processHeadingRef = useRef<HTMLHeadingElement>(null);
  const networkHeadingRef = useRef<HTMLHeadingElement>(null);
  const founderNameRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const numberRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const splitsRef = useRef<SplitType[]>([]);

  // ── Hero page load orchestration ──
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const label = hero.querySelector("[data-hero-label]");
    const heading = hero.querySelector("[data-hero-heading]") as HTMLElement;
    const body = hero.querySelector("[data-hero-body]");

    if (label) {
      gsap.set(label, { opacity: 0, y: 12 });
      tl.to(label, { opacity: 0.4, y: 0, duration: 0.4 }, 0);
    }

    if (heading) {
      const split = new SplitType(heading, { types: "words" });
      splitsRef.current.push(split);
      if (split.words) {
        gsap.set(split.words, { y: "100%", opacity: 0 });
        tl.to(split.words, { y: "0%", opacity: 1, stagger: 0.05, duration: 0.5 }, 0.15);
      }
    }

    if (body) {
      gsap.set(body, { opacity: 0, y: 16 });
      tl.to(body, { opacity: 0.7, y: 0, duration: 0.5 }, 0.6);
    }

    return () => { tl.kill(); };
  }, []);

  // ── Stats count-up ──
  useEffect(() => {
    const section = statsRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
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
                opacity: 0.6, y: 0, duration: 0.4,
                delay: i * 0.15 + 0.2, ease: "power3.out",
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
        y: "0%", opacity: 1, stagger: 0.04, duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 80%", once: true },
      });
    }
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
        y: "0%", opacity: 1, stagger: 0.04, duration: 0.5,
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
        y: "0%", opacity: 1, stagger: 0.05, duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 80%", once: true },
      });
    }
  }, []);

  // ── CTA entrance ──
  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;

    const heading = cta.querySelector("[data-cta-heading]") as HTMLElement;
    const sub = cta.querySelector("[data-cta-sub]");
    const btns = cta.querySelector("[data-cta-btns]");

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

      if (btns) {
        gsap.set(btns, { opacity: 0, y: 8 });
        tl.to(btns, { opacity: 1, y: 0, duration: 0.3 }, ">0.1");
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
      {/* ═══════════════════════ SECTION 1: STUDIO STORY ═══════════════════════ */}
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
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-primary)]"
          style={{ opacity: 0.4 }}
        >
          (About)
        </p>

        <h1
          data-hero-heading
          className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] mt-4 max-w-[800px] overflow-hidden"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.15 }}
        >
          Design should be structured, intentional, and commercially effective.
        </h1>

        <p
          data-hero-body
          className="font-[var(--sans)] font-normal text-[16px] leading-[1.75] text-[color:var(--text-primary)] max-w-[640px] mt-6"
          style={{ opacity: 0.7 }}
        >
          House of Singh Studios is a multidisciplinary design studio that builds brand identities, visual systems, and digital experiences for established businesses. The studio was founded on a direct premise: design is a business tool, not a creative exercise. Every project runs through a defined system. Every deliverable serves a business purpose. AI powers the production layer. Creative direction stays human.
        </p>
      </section>

      {/* ═══════════════════════ SECTION 2: STATS ═══════════════════════ */}
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

      {/* ═══════════════════════ SECTION 3: PROCESS ═══════════════════════ */}
      <section style={{ padding: "140px var(--page-px)" }}>
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-primary)] scroll-reveal-up"
          style={{ opacity: 0.4, marginBottom: 24 }}
        >
          (Process)
        </p>

        <h2
          ref={processHeadingRef}
          className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] overflow-hidden max-w-[800px]"
          style={{
            fontSize: "clamp(32px, 4vw, 56px)",
            lineHeight: 1.15,
            marginBottom: 24,
          }}
        >
          Five stages. One system. No surprises.
        </h2>

        <p
          className="font-[var(--sans)] font-normal text-[16px] leading-[1.75] text-[color:var(--text-primary)] max-w-[640px] scroll-reveal-up"
          style={{ opacity: 0.7, marginBottom: 64 }}
        >
          Every project moves through the same structured process regardless of scope. This is not a rigid formula. It is a framework that protects your investment and ensures nothing gets lost between strategy and execution.
        </p>

        {STEPS.map((step) => (
          <div
            key={step.name}
            className="about-process-step scroll-reveal-up"
          >
            <div>
              <p className="font-[var(--sans)] text-[15px] font-semibold text-[color:var(--text-primary)]">
                {step.name}
              </p>
            </div>
            <div>
              <p
                className="font-[var(--sans)] font-normal text-[15px] leading-[1.65] text-[color:var(--text-primary)]"
                style={{ opacity: 0.6 }}
              >
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ═══════════════════════ SECTION 4: CAPABILITIES NETWORK ═══════════════════════ */}
      <section style={{ padding: "140px var(--page-px)" }}>
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-primary)] scroll-reveal-up"
          style={{ opacity: 0.4, marginBottom: 24 }}
        >
          (Network)
        </p>

        <h2
          ref={networkHeadingRef}
          className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] overflow-hidden max-w-[800px]"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.15, marginBottom: 24 }}
        >
          Senior thinking on every brief.
        </h2>

        <p
          className="font-[var(--sans)] font-normal text-[16px] leading-[1.75] text-[color:var(--text-primary)] max-w-[640px] scroll-reveal-up"
          style={{ opacity: 0.7 }}
        >
          The studio works with a curated network of specialists and partners across brand strategy, visual design, video production, photography, development, and content. Each project is staffed deliberately. The right people for the right scope. Every collaborator operates under the same creative standards, documentation practices, and quality systems that define the studio&#39;s output.
        </p>
      </section>

      {/* ═══════════════════════ SECTION 5: FOUNDER ═══════════════════════ */}
      <section
        style={{
          padding: "140px var(--page-px)",
          borderTop: "1px solid rgba(26,26,26,0.08)",
        }}
      >
        <div className="about-founder-grid">
          {/* Photo placeholder */}
          <div>
            <div
              className="scroll-clip-reveal founder-photo-reveal"
              style={{
                aspectRatio: "3/4",
                overflow: "hidden",
                maxWidth: 480,
                background: "linear-gradient(180deg, #E8E5E0 0%, #D5D0CB 100%)",
              }}
            />
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
              className="font-[var(--sans)] text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.4, marginBottom: 24 }}
            >
              (Founder)
            </p>

            <h2
              ref={founderNameRef}
              className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] overflow-hidden"
              style={{
                fontSize: "clamp(28px, 3vw, 32px)",
                lineHeight: 1.15,
              }}
            >
              Maninder Singh
            </h2>

            <p
              className="font-[var(--sans)] font-normal text-[13px] uppercase tracking-[0.1em] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.5, marginTop: 4, marginBottom: 24 }}
            >
              Founder and Creative Director
            </p>

            <p
              className="font-[var(--sans)] font-normal leading-[1.75] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.7, fontSize: "clamp(15px, 1.1vw, 16px)" }}
            >
              Maninder Singh built House of Singh Studios, its creative standards, and the systems that power its operations. His practice spans brand identity, photography, creative strategy, and AI-integrated design across 14+ years. He is a member of RGD (Registered Graphic Designers) of Canada and served as Creative Director for TEDxToronto.
            </p>

            <p
              className="font-[var(--sans)] font-normal leading-[1.75] text-[color:var(--text-primary)] scroll-reveal-up"
              style={{ opacity: 0.5, marginTop: 16, fontSize: "clamp(15px, 1.1vw, 16px)" }}
            >
              Beyond the studio, Maninder pursues independent creative work spanning conceptual projects, photography, and cultural storytelling.
            </p>

            <p
              className="scroll-reveal-up"
              style={{ marginTop: 16 }}
            >
              <span
                className="font-[var(--sans)] text-[13px] uppercase tracking-[0.08em] text-[color:var(--text-primary)]"
              >
                Explore the full creative journey →{" "}
              </span>
              <a
                href="https://houseofsingh.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[var(--sans)] text-[13px] uppercase tracking-[0.08em] text-[color:var(--text-primary)] hover:underline"
                data-cursor="link"
              >
                houseofsingh.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <section
        ref={ctaRef}
        className="text-center"
        style={{ padding: "160px var(--page-px)" }}
      >
        <h2
          data-cta-heading
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] overflow-hidden"
          style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.1 }}
        >
          Start a project.
        </h2>
        <p
          data-cta-sub
          className="font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-primary)] max-w-[480px] mx-auto"
          style={{ margin: "24px auto 40px", opacity: 0.7 }}
        >
          We respond within 24 hours.
        </p>
        <div data-cta-btns className="flex flex-wrap justify-center gap-3">
          <Button href="#" data-cursor="link">
            Book a Discovery Call
          </Button>
          <Button href="/contact" variant="secondary" data-cursor="link">
            Start a Project
          </Button>
        </div>
      </section>
    </>
  );
}
