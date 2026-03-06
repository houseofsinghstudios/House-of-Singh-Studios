"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "next-view-transitions";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { getServiceBySlug } from "@/data/services";
import { useIsMobile } from "@/lib/use-is-mobile";
import { initScrollFallbacks, cleanScrollFallbacks } from "@/lib/scroll-fallback";
import OGLCanvas from "@/components/OGLCanvas";

gsap.registerPlugin(ScrollTrigger);

export default function ServiceDetailClient({ slug }: { slug: string }) {
  const service = getServiceBySlug(slug);
  const isMobile = useIsMobile();

  const heroRef = useRef<HTMLElement>(null);
  const deliverablesRef = useRef<HTMLElement>(null);
  const impactRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const processTrackRef = useRef<HTMLDivElement>(null);
  const idealRef = useRef<HTMLElement>(null);
  const relatedRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const [processStep, setProcessStep] = useState(0);

  // ── Hero page load ──
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let split: SplitType | null = null;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const label = hero.querySelector("[data-label]");
    const name = hero.querySelector("[data-name]") as HTMLElement;
    const tagline = hero.querySelector("[data-tagline]");
    const imgWrap = hero.querySelector("[data-hero-img]");
    const imgInner = hero.querySelector("[data-hero-img-inner]");

    if (label) {
      gsap.set(label, { opacity: 0, y: 12 });
      tl.to(label, { opacity: 0.5, y: 0, duration: 0.4 }, 0);
    }

    if (name) {
      split = new SplitType(name, { types: "words" });
      if (split.words) {
        gsap.set(split.words, { y: "100%", opacity: 0 });
        tl.to(split.words, { y: "0%", opacity: 1, stagger: 0.08, duration: 0.5 }, 0.1);
      }
    }

    if (tagline) {
      gsap.set(tagline, { opacity: 0, y: 12 });
      tl.to(tagline, { opacity: 0.7, y: 0, duration: 0.4 }, 0.5);
    }

    if (imgWrap) {
      gsap.set(imgWrap, { clipPath: "inset(8%)" });
      tl.to(imgWrap, { clipPath: "inset(0%)", duration: 1.2, ease: "power2.out" }, 0.6);
    }
    if (imgInner) {
      gsap.set(imgInner, { scale: 1.15 });
      tl.to(imgInner, { scale: 1, duration: 1.2, ease: "power2.out" }, 0.6);
    }

    return () => {
      tl.kill();
      if (split) split.revert();
    };
  }, []);

  // ── Deliverables: GSAP fallback for highlight ──
  useEffect(() => {
    const section = deliverablesRef.current;
    if (!section) return;

    // Only apply GSAP fallback if CSS scroll-driven animations not supported
    if (typeof CSS !== "undefined" && CSS.supports?.("animation-timeline", "view()")) return;

    const ctx = gsap.context(() => {
      section.querySelectorAll<HTMLElement>(".deliverable-item").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 70%",
          end: "bottom 30%",
          onEnter: () => el.classList.add("is-active"),
          onLeave: () => el.classList.remove("is-active"),
          onEnterBack: () => el.classList.add("is-active"),
          onLeaveBack: () => el.classList.remove("is-active"),
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // ── Impact section ──
  useEffect(() => {
    const section = impactRef.current;
    if (!section) return;

    let split: SplitType | null = null;
    const ctx = gsap.context(() => {
      const quote = section.querySelector("[data-quote]") as HTMLElement;
      const paragraphs = section.querySelectorAll("[data-paragraph]");

      if (quote) {
        split = new SplitType(quote, { types: "words" });
        if (split.words) {
          gsap.set(split.words, { y: "100%", opacity: 0 });
          gsap.to(split.words, {
            y: "0%", opacity: 1, stagger: 0.03, duration: 0.5, ease: "power3.out",
            scrollTrigger: { trigger: quote, start: "top 75%", once: true },
          });
        }
      }

      paragraphs.forEach((p, i) => {
        gsap.set(p, { opacity: 0, y: 20 });
        gsap.to(p, {
          opacity: 0.75, y: 0, duration: 0.5, delay: i * 0.15, ease: "power3.out",
          scrollTrigger: { trigger: p, start: "top 80%", once: true },
        });
      });
    }, section);

    return () => {
      ctx.revert();
      if (split) split.revert();
    };
  }, []);

  // ── Process horizontal scroll (desktop) ──
  useEffect(() => {
    if (isMobile) return;
    const section = processRef.current;
    const track = processTrackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -80,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => "+=" + window.innerWidth * 2.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProcessStep(Math.min(4, Math.floor(self.progress * 5)));
          },
        },
      });

      // Progress bar
      const bar = section.querySelector("[data-progress-bar]") as HTMLElement;
      if (bar) {
        gsap.to(bar, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scrub: true,
            start: "top top",
            end: () => "+=" + window.innerWidth * 2.5,
          },
        });
      }

      // Panel entrance animations
      track.querySelectorAll<HTMLElement>(".process-panel").forEach((panel) => {
        const name = panel.querySelector("[data-step-name]") as HTMLElement;
        const desc = panel.querySelector("[data-step-desc]");

        const ptl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left center",
            toggleActions: "play none none reverse",
          },
        });

        if (name) {
          gsap.set(name, { y: 30, opacity: 0 });
          ptl.to(name, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0);
        }
        if (desc) {
          gsap.set(desc, { opacity: 0, y: 16 });
          ptl.to(desc, { opacity: 0.7, y: 0, duration: 0.4 }, 0.15);
        }
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  // ── Ideal client ──
  useEffect(() => {
    const section = idealRef.current;
    if (!section) return;

    let split: SplitType | null = null;
    const ctx = gsap.context(() => {
      const label = section.querySelector("[data-ideal-label]");
      const text = section.querySelector("[data-ideal-text]") as HTMLElement;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
        defaults: { ease: "power3.out" },
      });

      if (label) {
        gsap.set(label, { opacity: 0 });
        tl.to(label, { opacity: 0.4, duration: 0.3 }, 0);
      }

      if (text) {
        split = new SplitType(text, { types: "words" });
        if (split.words) {
          gsap.set(split.words, { y: "100%", opacity: 0 });
          tl.to(split.words, { y: "0%", opacity: 1, stagger: 0.03, duration: 0.4 }, 0.1);
        }
      }
    }, section);

    return () => {
      ctx.revert();
      if (split) split.revert();
    };
  }, []);

  // ── Related work entrance ──
  useEffect(() => {
    const section = relatedRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      section.querySelectorAll<HTMLElement>(".related-work-card").forEach((card) => {
        const imgWrap = card.querySelector("[data-rw-img]");
        const textBlock = card.querySelector("[data-rw-text]");

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 80%", once: true },
          defaults: { ease: "power3.out" },
        });

        if (imgWrap) {
          gsap.set(imgWrap, { clipPath: "inset(8% 6%)" });
          tl.to(imgWrap, { clipPath: "inset(0%)", duration: 0.8 }, 0);
        }

        if (textBlock) {
          gsap.set(textBlock, { opacity: 0, y: 20 });
          tl.to(textBlock, { opacity: 1, y: 0, duration: 0.5 }, 0.2);
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // ── CTA ──
  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;

    let split: SplitType | null = null;
    const ctx = gsap.context(() => {
      const heading = cta.querySelector("[data-cta-heading]") as HTMLElement;
      const sub = cta.querySelector("[data-cta-sub]");
      const btn = cta.querySelector("[data-cta-btn]");

      const tl = gsap.timeline({
        scrollTrigger: { trigger: cta, start: "top 75%", once: true },
        defaults: { ease: "power3.out" },
      });

      if (heading) {
        split = new SplitType(heading, { types: "words" });
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

    return () => {
      ctx.revert();
      if (split) split.revert();
    };
  }, []);

  // ── Scroll fallbacks ──
  useEffect(() => {
    initScrollFallbacks();
    return () => cleanScrollFallbacks();
  }, []);

  if (!service) return null;

  return (
    <>
      {/* ═══ SCENE 1: SERVICE HERO ═══ */}
      <section
        ref={heroRef}
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 var(--page-px) 80px" }}
      >
        <p
          data-label
          className="font-[var(--sans)] text-xs uppercase tracking-[0.15em] text-[color:var(--text-primary)]"
          style={{ opacity: 0.5 }}
        >
          (Service)
        </p>

        <h1
          data-name
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] mt-3 overflow-hidden"
          style={{
            fontSize: "clamp(44px, 6vw, 84px)",
            lineHeight: 1.05,
            viewTransitionName: `service-${service.slug}`,
          }}
        >
          {service.name}
        </h1>

        <p
          data-tagline
          className="font-[var(--sans)] font-normal text-[19px] text-[color:var(--text-primary)] max-w-[560px] mt-5"
          style={{ opacity: 0.7 }}
        >
          {service.tagline}
        </p>

        <div
          data-hero-img
          style={{ width: "100%", height: "50vh", marginTop: 48, overflow: "hidden" }}
        >
          <div data-hero-img-inner style={{ width: "100%", height: "100%" }}>
            {isMobile ? (
              <div className="w-full h-full" style={{ background: service.gradient }} />
            ) : (
              <OGLCanvas imageSrc={service.gradient} className="w-full h-full" />
            )}
          </div>
        </div>
      </section>

      {/* ═══ SCENE 2: DELIVERABLES ═══ */}
      <section
        ref={deliverablesRef}
        style={{ padding: "120px var(--page-px)" }}
      >
        <div
          style={
            isMobile
              ? {}
              : { display: "grid", gridTemplateColumns: "300px 1fr", gap: 80 }
          }
        >
          <div style={isMobile ? { marginBottom: 40 } : { position: "sticky", top: 140, alignSelf: "start" }}>
            <p className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)]" style={{ opacity: 0.4 }}>
              (Deliverables)
            </p>
            <h2 className="font-[var(--serif)] font-semibold text-[28px] text-[color:var(--text-primary)] mt-3">
              What You Get
            </h2>
          </div>

          <div>
            {service.deliverables.map((d) => (
              <div key={d.name} className="deliverable-item">
                <h3 className="font-[var(--serif)] font-semibold text-[24px] text-[color:var(--text-primary)] mb-3">
                  {d.name}
                </h3>
                <p className="font-[var(--sans)] font-normal text-base leading-[1.65] text-[color:var(--text-primary)] max-w-[540px]" style={{ opacity: 0.7 }}>
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SCENE 3: WHY IT MATTERS ═══ */}
      <section
        ref={impactRef}
        className="bg-[var(--bg-shift)]"
        style={{ padding: "120px var(--page-px)" }}
      >
        <div
          style={
            isMobile
              ? {}
              : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }
          }
        >
          <blockquote
            data-quote
            className="font-[var(--serif)] font-semibold italic text-[color:var(--text-primary)] overflow-hidden"
            style={{ fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.25, margin: 0, padding: 0 }}
          >
            {service.impact.quote}
          </blockquote>

          <div style={isMobile ? { marginTop: 40 } : {}}>
            {service.impact.paragraphs.map((p, i) => (
              <p
                key={i}
                data-paragraph
                className="font-[var(--sans)] font-normal text-[17px] leading-[1.65] text-[color:var(--text-primary)]"
                style={{ opacity: 0.75, marginBottom: i < service.impact.paragraphs.length - 1 ? 24 : 0 }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div
          className="scroll-clip-reveal"
          style={{ width: "100%", height: "40vh", marginTop: 80, overflow: "hidden" }}
        >
          {isMobile ? (
            <div className="w-full h-full" style={{ background: service.gradient }} />
          ) : (
            <OGLCanvas imageSrc={service.gradient} className="w-full h-full" />
          )}
        </div>
      </section>

      {/* ═══ SCENE 4: PROCESS ═══ */}
      <section ref={processRef}>
        {isMobile ? (
          /* Mobile: vertical steps */
          <div style={{ padding: "80px var(--page-px)" }}>
            <p className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-8" style={{ opacity: 0.4 }}>
              (Process)
            </p>
            {service.process.map((step) => (
              <div
                key={step.step}
                className="process-panel scroll-reveal-up"
              >
                <p className="font-[var(--sans)] text-xs uppercase tracking-[0.15em] text-[color:var(--text-primary)]" style={{ opacity: 0.4 }}>
                  Step {step.step}
                </p>
                <h3
                  className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] mt-2"
                  style={{ fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.1 }}
                >
                  {step.name}
                </h3>
                <p className="font-[var(--sans)] font-normal text-[17px] leading-[1.65] text-[color:var(--text-primary)] mt-5" style={{ opacity: 0.7 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop: horizontal scroll */
          <div
            ref={processTrackRef}
            style={{ display: "flex", width: "500vw", height: "100vh" }}
          >
            {service.process.map((step) => (
              <div key={step.step} className="process-panel">
                <span
                  className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)]"
                  style={{
                    fontSize: "clamp(80px, 10vw, 140px)",
                    opacity: 0.06,
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: "calc(var(--page-px) + 40px)",
                    pointerEvents: "none",
                    lineHeight: 1,
                  }}
                >
                  {step.step}
                </span>

                <div style={{ maxWidth: 480 }}>
                  <p className="font-[var(--sans)] text-xs uppercase tracking-[0.15em] text-[color:var(--text-primary)]" style={{ opacity: 0.4 }}>
                    Step {step.step}
                  </p>
                  <h3
                    data-step-name
                    className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] mt-2"
                    style={{ fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.1 }}
                  >
                    {step.name}
                  </h3>
                  <p
                    data-step-desc
                    className="font-[var(--sans)] font-normal text-[17px] leading-[1.65] text-[color:var(--text-primary)] mt-5"
                    style={{ opacity: 0.7 }}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 60,
                    left: "var(--page-px)",
                    right: "var(--page-px)",
                  }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-[var(--sans)] text-[11px] text-[color:var(--text-primary)]" style={{ opacity: 0.4 }}>
                      Process
                    </span>
                    <span className="font-[var(--sans)] text-[11px] text-[color:var(--text-primary)]" style={{ opacity: 0.4 }}>
                      {processStep + 1}/05
                    </span>
                  </div>
                  <div style={{ height: 2, background: "rgba(26,26,26,0.08)", position: "relative" }}>
                    <div
                      data-progress-bar
                      style={{
                        height: 2,
                        background: "var(--text-primary)",
                        transformOrigin: "left",
                        transform: "scaleX(0)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══ SCENE 5: IDEAL CLIENT ═══ */}
      <section
        ref={idealRef}
        className="text-center"
        style={{ padding: "160px var(--page-px)" }}
      >
        <p
          data-ideal-label
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)]"
          style={{ opacity: 0.4 }}
        >
          (Ideal Client)
        </p>
        <p
          data-ideal-text
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] max-w-[640px] mx-auto mt-5 overflow-hidden"
          style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.35 }}
        >
          {service.idealClient}
        </p>
      </section>

      {/* ═══ SCENE 6: RELATED WORK ═══ */}
      <section
        ref={relatedRef}
        style={{ padding: "80px var(--page-px) 120px" }}
      >
        <p className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-10" style={{ opacity: 0.4 }}>
          (Related Work)
        </p>

        {service.relatedWork.map((work) => (
          <div key={work.slug} className="related-work-card">
            <div
              data-rw-img
              style={{ aspectRatio: "4/3", overflow: "hidden" }}
              data-cursor="expand"
            >
              {isMobile ? (
                <div className="scroll-clip-reveal w-full h-full" style={{ background: work.gradient }} />
              ) : (
                <OGLCanvas imageSrc={work.gradient} className="w-full h-full" />
              )}
            </div>

            <div data-rw-text style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3 className="font-[var(--serif)] font-semibold text-[28px] text-[color:var(--text-primary)]">
                {work.name}
              </h3>
              <p className="font-[var(--sans)] font-normal text-sm text-[color:var(--text-primary)] mt-1" style={{ opacity: 0.5 }}>
                {work.client}
              </p>
              <p className="font-[var(--sans)] font-normal text-base text-[color:var(--text-primary)] mt-4" style={{ opacity: 0.7 }}>
                {work.result}
              </p>
              <Link
                href={`/work/${work.slug}`}
                className="font-[var(--sans)] font-medium text-[13px] uppercase tracking-[0.1em] text-[color:var(--text-primary)] no-underline mt-6 inline-block"
                style={{ borderBottom: "1px solid var(--text-primary)" }}
                data-cursor="link"
              >
                View Case Study
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ═══ SCENE 7: CTA BAND ═══ */}
      <section
        ref={ctaRef}
        className="bg-[var(--bg-shift)] text-center"
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
          style={{ borderBottom: "1px solid var(--text-primary)", paddingBottom: 4 }}
          data-cursor="magnetic"
        >
          Start a Project
        </Link>
      </section>
    </>
  );
}
