"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { services } from "@/data/services";
import { useIsMobile } from "@/lib/use-is-mobile";
import { initScrollFallbacks, cleanScrollFallbacks } from "@/lib/scroll-fallback";
import OGLCanvas from "@/components/OGLCanvas";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesOverviewClient() {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // ── Hero page load orchestration ──
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let split: SplitType | null = null;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const label = hero.querySelector("[data-hero-label]");
    const heading = hero.querySelector("[data-hero-heading]") as HTMLElement;
    const sub = hero.querySelector("[data-hero-sub]");
    const indicator = hero.querySelector("[data-hero-indicator]");

    if (label) {
      gsap.set(label, { opacity: 0, y: 12 });
      tl.to(label, { opacity: 0.5, y: 0, duration: 0.4 }, 0);
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
      tl.to(sub, { opacity: 0.7, y: 0, duration: 0.4 }, 0.6);
    }

    if (indicator) {
      gsap.set(indicator, { opacity: 0 });
      tl.to(indicator, { opacity: 0.3, duration: 0.4 }, 0.8);
    }

    return () => {
      tl.kill();
      if (split) split.revert();
    };
  }, []);

  // ── Pinned horizontal scroll (desktop only) ──
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -75,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.2,
          start: "top top",
          end: () => "+=" + window.innerWidth * 3,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(3, Math.floor(self.progress * 4));
            setActivePanel(idx);
          },
          onEnter: () => {
            if (progressRef.current) progressRef.current.style.opacity = "1";
          },
          onLeave: () => {
            if (progressRef.current) progressRef.current.style.opacity = "0";
          },
          onEnterBack: () => {
            if (progressRef.current) progressRef.current.style.opacity = "1";
          },
          onLeaveBack: () => {
            if (progressRef.current) progressRef.current.style.opacity = "0";
          },
        },
      });
      tweenRef.current = tween;

      // Panel entrance animations via containerAnimation
      const panels = track.querySelectorAll<HTMLElement>(".service-panel");
      panels.forEach((panel) => {
        const name = panel.querySelector("[data-panel-name]") as HTMLElement;
        const desc = panel.querySelector("[data-panel-desc]");
        const items = panel.querySelectorAll("[data-panel-item]");
        const link = panel.querySelector("[data-panel-link]");
        const imgWrap = panel.querySelector("[data-panel-img]");
        const caption = panel.querySelector("[data-panel-caption]");

        const ptl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left center",
            toggleActions: "play none none reverse",
          },
        });

        if (name) {
          const nameSplit = new SplitType(name, { types: "words" });
          if (nameSplit.words) {
            gsap.set(nameSplit.words, { y: "100%", opacity: 0 });
            ptl.to(nameSplit.words, { y: "0%", opacity: 1, stagger: 0.05, duration: 0.5, ease: "power3.out" }, 0);
          }
        }

        if (desc) {
          gsap.set(desc, { opacity: 0, y: 16 });
          ptl.to(desc, { opacity: 0.75, y: 0, duration: 0.4 }, 0.2);
        }

        if (items.length) {
          gsap.set(items, { opacity: 0, y: 12 });
          ptl.to(items, { opacity: 1, y: 0, stagger: 0.06, duration: 0.4 }, 0.3);
        }

        if (link) {
          gsap.set(link, { opacity: 0 });
          ptl.to(link, { opacity: 1, duration: 0.3 }, 0.5);
        }

        if (imgWrap) {
          gsap.set(imgWrap, { clipPath: "inset(8% 6% 8% 6%)" });
          ptl.to(imgWrap, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.out" }, 0.1);
        }

        if (caption) {
          gsap.set(caption, { opacity: 0 });
          ptl.to(caption, { opacity: 0.4, duration: 0.3 }, 0.6);
        }
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  // ── CTA ScrollTrigger ──
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

  const scrollToPanel = useCallback((idx: number) => {
    if (!sectionRef.current || isMobile) return;
    const st = tweenRef.current?.scrollTrigger;
    if (!st) return;
    const start = st.start as number;
    const end = st.end as number;
    const target = start + ((end - start) * idx) / 4;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, [isMobile]);

  return (
    <>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 var(--page-px)" }}
      >
        <p
          data-hero-label
          className="font-[var(--sans)] text-xs uppercase tracking-[0.15em] text-[color:var(--text-primary)]"
          style={{ opacity: 0.5 }}
        >
          (Services)
        </p>

        <h1
          data-hero-heading
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] mt-4 overflow-hidden"
          style={{ fontSize: "clamp(44px, 6vw, 84px)", lineHeight: 1.05 }}
        >
          Four capabilities. One studio.
        </h1>

        <p
          data-hero-sub
          className="font-[var(--sans)] font-normal text-[17px] leading-[1.65] text-[color:var(--text-primary)] max-w-[540px] mt-8"
          style={{ opacity: 0.7 }}
        >
          Every service is built to solve a business problem, not just look good.
        </p>

        <div
          data-hero-indicator
          className="flex flex-col items-center mt-auto mb-12"
          style={{ opacity: 0.3 }}
        >
          <div style={{ width: 1, height: 48, background: "var(--text-primary)", opacity: 0.3 }} />
          <p className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] mt-3" style={{ opacity: 0.3 }}>
            Scroll to explore
          </p>
        </div>
      </section>

      {/* ── PINNED HORIZONTAL SCROLL (desktop) / VERTICAL CARDS (mobile) ── */}
      <section ref={sectionRef}>
        <div
          ref={trackRef}
          style={
            isMobile
              ? { display: "flex", flexDirection: "column" }
              : { display: "flex", width: "400vw", height: "100vh" }
          }
        >
          {services.map((service, i) => (
            <div key={service.slug} className="service-panel">
              {/* LEFT: text */}
              <div className="service-panel-text">
                <span
                  className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)]"
                  style={{
                    fontSize: "clamp(100px, 12vw, 160px)",
                    opacity: 0.06,
                    position: "absolute",
                    top: 60,
                    left: "var(--page-px)",
                    pointerEvents: "none",
                    lineHeight: 1,
                  }}
                >
                  {service.number}
                </span>

                <h2
                  data-panel-name
                  className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] overflow-hidden"
                  style={{
                    fontSize: "clamp(36px, 4.5vw, 64px)",
                    lineHeight: 1.1,
                    marginBottom: 24,
                    viewTransitionName: `service-${service.slug}`,
                  }}
                >
                  {isMobile ? `${service.number} — ${service.name}` : service.name}
                </h2>

                <p
                  data-panel-desc
                  className="font-[var(--sans)] font-normal text-[17px] leading-[1.65] text-[color:var(--text-primary)] max-w-[440px]"
                  style={{ opacity: 0.75, marginBottom: 40 }}
                >
                  {service.description}
                </p>

                <div>
                  {service.deliverables.slice(0, 4).map((d) => (
                    <div
                      key={d.name}
                      data-panel-item
                      className="font-[var(--sans)] font-normal text-[15px] leading-[1.5]"
                      style={{ padding: "12px 0", borderTop: "1px solid rgba(26,26,26,0.1)" }}
                    >
                      {d.name}
                    </div>
                  ))}
                </div>

                <Link
                  data-panel-link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 mt-8 font-[var(--sans)] font-medium text-sm uppercase tracking-[0.1em] text-[color:var(--text-primary)] no-underline"
                  style={{ transition: "letter-spacing 0.3s" }}
                  data-cursor="expand"
                >
                  Explore Service
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </div>

              {/* RIGHT: image */}
              <div className="service-panel-image" data-panel-img>
                {isMobile ? (
                  <div
                    className="scroll-clip-reveal w-full h-full"
                    style={{ background: service.gradient }}
                  />
                ) : (
                  <OGLCanvas
                    imageSrc={service.gradient}
                    className="w-full h-full"
                  />
                )}
                <p
                  data-panel-caption
                  className="font-[var(--sans)] text-[11px] uppercase tracking-[0.1em] text-[color:var(--text-primary)]"
                  style={{ position: "absolute", bottom: 24, left: 24, opacity: 0.4 }}
                >
                  ({service.name})
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROGRESS INDICATOR (desktop only) ── */}
      {!isMobile && (
        <div
          ref={progressRef}
          style={{
            position: "fixed",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: 0,
            transition: "opacity 0.3s",
          }}
        >
          {services.map((s, i) => (
            <button
              key={s.slug}
              onClick={() => scrollToPanel(i)}
              aria-label={`Go to ${s.name}`}
              className={`scroll-progress-dot${i === activePanel ? " active" : ""}`}
              data-cursor="link"
            />
          ))}
          <span
            className="font-[var(--sans)] text-[11px] uppercase tracking-[0.1em] text-[color:var(--text-primary)]"
            style={{ opacity: 0.5 }}
          >
            {services[activePanel]?.name.split(" ").slice(0, 2).join(" ")}
          </span>
        </div>
      )}

      {/* ── CTA BAND ── */}
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
          Ready to start?
        </h2>
        <p
          data-cta-sub
          className="font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-primary)] max-w-[480px] mx-auto"
          style={{ margin: "24px auto 40px", opacity: 0.7 }}
        >
          Whether you are building a new brand or refining an existing one, the first step is the same.
        </p>
        <Link
          data-cta-btn
          href="/contact"
          className="font-[var(--sans)] font-medium text-sm uppercase tracking-[0.12em] text-[color:var(--text-primary)] no-underline"
          style={{ borderBottom: "1px solid var(--text-primary)", paddingBottom: 4 }}
          data-cursor="link"
        >
          Start a Project
        </Link>
      </section>
    </>
  );
}
