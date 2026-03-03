"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════ */

const PROCESS_STEPS = [
  "Discovery",
  "Strategy",
  "Creative Direction",
  "Production",
  "Delivery",
];

const SERVICES = [
  {
    title: "Brand Identity and Visual Design",
    sentence: "The visual foundation your business operates on.",
    bullets: [
      "Logo systems and brand marks",
      "Color, typography, and visual language",
      "Brand guidelines and documentation",
      "Packaging and collateral design",
    ],
    linkText: "Explore Brand Identity",
    href: "/services/brand-identity",
  },
  {
    title: "Visual Media and Content Production",
    sentence: "Visual work built on strategy, not just aesthetics.",
    bullets: [
      "Brand films and short form video",
      "Photography and art direction",
      "Campaign direction and visual storytelling",
      "Social and digital content systems",
    ],
    linkText: "Explore Visual Media",
    href: "/services/visual-media",
  },
  {
    title: "Digital Design and Experience",
    sentence: "Your digital presence should convert, not just exist.",
    bullets: [
      "Website design and development direction",
      "Interface and digital layout systems",
      "Content architecture and structure",
      "Ongoing digital design support",
    ],
    linkText: "Explore Digital Design",
    href: "/services/digital-design",
  },
  {
    title: "Creative Strategy and Systems",
    sentence: "The thinking that makes everything else consistent.",
    bullets: [
      "Brand positioning and clarity workshops",
      "Creative direction frameworks",
      "Content and communication strategy",
      "AI supported workflow integration",
    ],
    linkText: "Explore Creative Strategy",
    href: "/services/creative-strategy",
  },
];

const PROJECTS = [
  {
    name: "TEDxToronto Visual Identity",
    label: "Client Project",
    sentence:
      "Event branding and visual system for one of Canada\u2019s largest TEDx events.",
    href: "/work/tedxtoronto",
  },
  {
    name: "Meridian Financial Group",
    label: "Studio Exploration",
    sentence:
      "Brand identity system for a mid-market financial services firm.",
    href: "/work/meridian",
  },
  {
    name: "Soulbound Publication",
    label: "Client Project",
    sentence:
      "Publication cover design and art direction for a leadership book.",
    href: "/work/soulbound",
  },
  {
    name: "Nomad Kitchen",
    label: "Studio Exploration",
    sentence:
      "Brand identity and packaging for a modern South Asian food brand.",
    href: "/work/nomad-kitchen",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "It was a pleasure collaborating with House of Singh Studios during TEDxToronto. They brought intention to every creative decision and helped foster a team culture rooted in clarity and design excellence.",
    author: "Yanina, People and Culture, TEDxToronto",
  },
  {
    quote:
      "In a world of overdesigned noise, House of Singh Studios creates work that feels clear, intentional and grounded. Their creative process mirrors the kind of structure we value in finance.",
    author: "Keval, CPA and Controller, Ferrari",
  },
  {
    quote:
      "Crafting a publication cover that reflects the essence of a book is rare. House of Singh Studios brought clarity, intention and elegance to the process.",
    author: "Siddhartha Sharma, Author, Speaker, Leadership Coach",
  },
  {
    quote:
      "House of Singh Studios approaches creative work with the kind of operational clarity that is rare in this space. From timelines to communication, every step felt aligned and intentional.",
    author: "Lovejot, Director, Planning and Logistics",
  },
];

const STAT_TARGETS = [75, 10, 12];
const STAT_LABELS = [
  "Projects delivered across identity, media, and digital.",
  "Years of professional creative practice.",
  "Industries served.",
];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/* ═══════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════ */

export default function Home() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statValues, setStatValues] = useState([0, 0, 0]);
  const [statsCounted, setStatsCounted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselTimer = useRef<ReturnType<typeof setInterval>>(undefined);

  /* ── Scroll-reveal observer ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const raf = requestAnimationFrame(() => {
      document
        .querySelectorAll(".scroll-reveal")
        .forEach((el) => observer.observe(el));
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  /* ── Stats intersection trigger ── */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsCounted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Stats count-up animation ── */
  useEffect(() => {
    if (!statsCounted) return;

    const duration = 1200;
    const staggers = [0, 100, 200];
    const starts = staggers.map((s) => performance.now() + s);

    function tick() {
      const now = performance.now();
      const vals = STAT_TARGETS.map((target, i) => {
        const elapsed = now - starts[i];
        if (elapsed <= 0) return 0;
        const progress = Math.min(elapsed / duration, 1);
        return Math.round(target * easeOutCubic(progress));
      });

      setStatValues(vals);

      if (vals.some((v, i) => v < STAT_TARGETS[i])) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [statsCounted]);

  /* ── Testimonial carousel ── */
  const resetTimer = useCallback(() => {
    if (carouselTimer.current) clearInterval(carouselTimer.current);
    carouselTimer.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (carouselTimer.current) clearInterval(carouselTimer.current);
    };
  }, [resetTimer]);

  function goTo(i: number) {
    setActiveSlide(i);
    resetTimer();
  }
  function goNext() {
    setActiveSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    resetTimer();
  }
  function goPrev() {
    setActiveSlide(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
    resetTimer();
  }

  /* ═══════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════ */

  return (
    <>
      {/* ═══ SECTION 1 : HERO ═══ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 var(--page-px) 80px",
        }}
      >
        <p
          className="editorial-label reveal-up"
          style={{ animationDelay: "0.1s", marginBottom: 24 }}
        >
          (Creative Direction Studio.)
        </p>

        <div style={{ maxWidth: 800 }}>
          <h1
            className="reveal-up"
            style={{
              animationDelay: "0.2s",
              fontFamily: "var(--serif)",
              fontWeight: 600,
              fontSize: "clamp(44px, 6.2vw, 80px)",
              lineHeight: 1.08,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            We build brands that
            <br />
            think, adapt, and scale.
          </h1>

          <p
            className="reveal-up"
            style={{
              animationDelay: "0.35s",
              marginTop: 32,
              fontFamily: "var(--sans)",
              fontWeight: 400,
              fontSize: 18,
              lineHeight: 1.6,
              color: "var(--text-muted)",
              maxWidth: 560,
            }}
          >
            A multidisciplinary design studio powered by AI systems and led by
            creative direction.
          </p>

          <p
            className="reveal-up"
            style={{
              animationDelay: "0.5s",
              marginTop: 20,
              fontFamily: "var(--sans)",
              fontWeight: 300,
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--text-faint)",
              maxWidth: 560,
            }}
          >
            We deliver brand identity, visual media, digital design, and
            creative strategy for businesses across North America.
          </p>

          <div
            className="reveal-up"
            style={{
              animationDelay: "0.65s",
              marginTop: 48,
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <Link href="/work" className="btn-primary">
              View Projects
            </Link>
            <Link href="/contact" className="btn-secondary">
              Start a Project
            </Link>
          </div>
        </div>

        <div
          className="reveal-up"
          style={{
            animationDelay: "0.9s",
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p className="editorial-label">(Scroll.)</p>
          <div className="scroll-track">
            <div className="scroll-thumb" />
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 : THE ARGUMENT ═══ */}
      <section style={{ padding: "160px var(--page-px)" }}>
        <p
          className="editorial-label scroll-reveal"
          style={{ marginBottom: 24 }}
        >
          (The Problem.)
        </p>

        <h2
          className="scroll-reveal"
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
            maxWidth: 800,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Your business has evolved. Your brand has not.
        </h2>

        <p
          className="scroll-reveal"
          style={{
            marginTop: 36,
            fontFamily: "var(--sans)",
            fontWeight: 400,
            fontSize: 17,
            lineHeight: 1.65,
            color: "var(--text-secondary)",
            maxWidth: 640,
          }}
        >
          Your revenue has changed. Your team has changed. Your market position
          has changed. But your brand still reflects an earlier version of your
          business. Your website says one thing. Your marketing materials say
          another. No two touchpoints feel like the same business. There is no
          system holding it together, and every new campaign widens the gap.
        </p>

        <p
          className="scroll-reveal"
          style={{
            marginTop: 80,
            marginBottom: 40,
            fontFamily: "var(--sans)",
            fontWeight: 500,
            fontSize: "clamp(22px, 2vw, 28px)",
            color: "var(--text-primary)",
            transitionDelay: "0.2s",
          }}
        >
          We fix that.
        </p>

        <p
          className="scroll-reveal"
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 400,
            fontSize: 17,
            lineHeight: 1.65,
            color: "var(--text-secondary)",
            maxWidth: 640,
            transitionDelay: "0.2s",
          }}
        >
          Every project at House of Singh Studios moves through five stages. AI
          accelerates research and production. Creative direction stays human.
          You know what you are getting, when you are getting it, and what it
          costs before we start.
        </p>

        {/* Process steps */}
        <div
          className="scroll-reveal process-steps"
          style={{
            marginTop: 48,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            transitionDelay: "0.3s",
          }}
        >
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step}
              style={{ display: "flex", alignItems: "center" }}
            >
              {i > 0 && <div className="process-connector" />}
              <span
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 500,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.13em",
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 3 : STATS ═══ */}
      <section ref={statsRef} style={{ padding: "140px var(--page-px)" }}>
        <p
          className="editorial-label scroll-reveal"
          style={{ marginBottom: 48 }}
        >
          (Studio.)
        </p>

        <div className="stats-grid">
          {STAT_TARGETS.map((_, i) => (
            <div
              key={i}
              className="scroll-reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <p
                style={{
                  fontFamily: "var(--serif)",
                  fontWeight: 600,
                  fontSize: "clamp(52px, 5.5vw, 76px)",
                  lineHeight: 1,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                {statValues[i]}+
              </p>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "var(--text-muted)",
                  marginTop: 12,
                }}
              >
                {STAT_LABELS[i]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 4 : SERVICES ═══ */}
      <section style={{ padding: "160px var(--page-px)" }}>
        <p
          className="editorial-label scroll-reveal"
          style={{ marginBottom: 24 }}
        >
          (Capabilities.)
        </p>

        <h2
          className="scroll-reveal"
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            lineHeight: 1.15,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Four capabilities. One studio.
        </h2>

        <p
          className="scroll-reveal"
          style={{
            marginTop: 16,
            fontFamily: "var(--sans)",
            fontWeight: 400,
            fontSize: 17,
            color: "var(--text-muted)",
            maxWidth: 560,
          }}
        >
          Every service is built to solve a business problem, not just look
          good.
        </p>

        <div className="services-grid" style={{ marginTop: 72 }}>
          {SERVICES.map((service, i) => (
            <div
              key={service.href}
              className="scroll-reveal"
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: 28,
                transitionDelay: `${i < 2 ? 0 : 0.1}s`,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--serif)",
                  fontWeight: 600,
                  fontSize: "clamp(22px, 2vw, 28px)",
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                {service.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "var(--text-secondary)",
                  marginTop: 14,
                }}
              >
                {service.sentence}
              </p>
              <ul className="service-bullets" style={{ marginTop: 18 }}>
                {service.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Link
                href={service.href}
                className="arrow-link"
                style={{
                  marginTop: 22,
                  display: "inline-block",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 500,
                    fontSize: 13,
                    color: "var(--text-primary)",
                  }}
                >
                  {service.linkText} <span className="arrow-icon">&rarr;</span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 5 : FEATURED WORK ═══ */}
      <section style={{ padding: "160px var(--page-px)" }}>
        <p
          className="editorial-label scroll-reveal"
          style={{ marginBottom: 24 }}
        >
          (Portfolio.)
        </p>

        <h2
          className="scroll-reveal"
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            lineHeight: 1.15,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Selected Work
        </h2>

        <div className="work-grid" style={{ marginTop: 64 }}>
          {PROJECTS.map((project, i) => (
            <Link
              key={project.href}
              href={project.href}
              className="project-card scroll-reveal"
              style={{
                display: "block",
                textDecoration: "none",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div
                style={{
                  aspectRatio: "4 / 3",
                  overflow: "hidden",
                  background:
                    "linear-gradient(145deg, #E8E8E3, #D8D8D3)",
                }}
              >
                <div
                  className="project-image-inner"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#999",
                    }}
                  >
                    Project Image
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 500,
                    fontSize: 16,
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  {project.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 400,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#999",
                    marginTop: 6,
                  }}
                >
                  {project.label}
                </p>
                <p
                  className="project-sentence"
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 400,
                    fontSize: 14,
                    color: "var(--text-muted)",
                  }}
                >
                  {project.sentence}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div
          className="scroll-reveal"
          style={{ marginTop: 48, transitionDelay: "0.3s" }}
        >
          <Link
            href="/work"
            className="arrow-link"
            style={{ textDecoration: "none" }}
          >
            <span
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 500,
                fontSize: 13,
                color: "var(--text-primary)",
              }}
            >
              View All Projects <span className="arrow-icon">&rarr;</span>
            </span>
          </Link>
        </div>
      </section>

      {/* ═══ SECTION 6 : TESTIMONIALS ═══ */}
      <section
        style={{
          padding: "140px var(--page-px)",
          background: "var(--bg-shift)",
          textAlign: "center",
        }}
      >
        <p
          className="editorial-label scroll-reveal"
          style={{ marginBottom: 32 }}
        >
          (Clients.)
        </p>

        {/* Decorative opening quotation mark */}
        <div
          className="scroll-reveal"
          style={{
            fontFamily: "var(--serif)",
            fontSize: 120,
            lineHeight: 1,
            color: "#E0E0DB",
            userSelect: "none",
            marginBottom: -20,
          }}
        >
          &ldquo;
        </div>

        {/* Carousel */}
        <div
          className="scroll-reveal"
          style={{ transitionDelay: "0.2s" }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`carousel-slide${i === activeSlide ? " active" : ""}`}
              >
                <blockquote
                  style={{
                    fontFamily: "var(--serif)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    fontSize: "clamp(22px, 2.2vw, 30px)",
                    lineHeight: 1.45,
                    color: "var(--text-primary)",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {t.quote}
                </blockquote>
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 400,
                    fontSize: 14,
                    color: "var(--text-muted)",
                    marginTop: 28,
                  }}
                >
                  &mdash; {t.author}
                </p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <button
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="carousel-arrow"
            >
              &larr;
            </button>

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    background:
                      i === activeSlide
                        ? "var(--text-primary)"
                        : "var(--border)",
                    transition: "background 0.3s ease",
                  }}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              aria-label="Next testimonial"
              className="carousel-arrow"
            >
              &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7 : FINAL CTA ═══ */}
      <section style={{ padding: "200px var(--page-px)", textAlign: "center" }}>
        <p
          className="editorial-label scroll-reveal"
          style={{ marginBottom: 24 }}
        >
          (Next Step.)
        </p>

        <h2
          className="scroll-reveal"
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            lineHeight: 1.15,
            color: "var(--text-primary)",
            margin: "0 auto",
            transitionDelay: "0.1s",
          }}
        >
          Ready to build a brand that holds up?
        </h2>

        <p
          className="scroll-reveal"
          style={{
            marginTop: 20,
            fontFamily: "var(--sans)",
            fontWeight: 400,
            fontSize: 17,
            color: "var(--text-muted)",
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
            transitionDelay: "0.2s",
          }}
        >
          Whether you are refining an existing brand or building from scratch,
          the first step is a conversation.
        </p>

        <div
          className="scroll-reveal"
          style={{ marginTop: 44, transitionDelay: "0.3s" }}
        >
          <Link href="/contact" className="btn-primary">
            Start a Project
          </Link>
        </div>
      </section>

      {/* ═══ Component Styles ═══ */}
      <style>{`
        /* Process connector */
        .process-connector {
          width: 48px;
          height: 1px;
          background: #999;
          margin: 0 12px;
          flex-shrink: 0;
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        /* Services grid */
        .services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 56px;
          row-gap: 60px;
        }

        /* Service bullets */
        .service-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .service-bullets li {
          padding-left: 16px;
          position: relative;
          font-family: var(--sans);
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .service-bullets li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #999;
        }

        /* Arrow link */
        .arrow-link {
          text-decoration: none;
        }
        .arrow-icon {
          display: inline-block;
          transition: transform 0.25s ease;
        }
        .arrow-link:hover .arrow-icon {
          transform: translateX(6px);
        }

        /* Work grid */
        .work-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }

        /* Project card hover effects */
        .project-card .project-image-inner {
          transition: transform 0.5s ease;
        }
        .project-card:hover .project-image-inner {
          transform: scale(1.03);
        }
        .project-card .project-sentence {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.4s ease, margin-top 0.4s ease;
          margin-top: 0;
        }
        .project-card:hover .project-sentence {
          max-height: 60px;
          opacity: 1;
          margin-top: 8px;
        }

        /* Testimonial carousel */
        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
        }
        .carousel-slide.active {
          position: relative;
          opacity: 1;
          pointer-events: auto;
        }
        .carousel-arrow {
          font-size: 20px;
          color: #999;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          transition: color 0.2s ease;
          font-family: var(--sans);
          line-height: 1;
        }
        .carousel-arrow:hover {
          color: var(--text-primary);
        }

        /* ── Mobile (< 900px) ── */
        @media (max-width: 899px) {
          .process-connector {
            width: 24px;
            margin: 0 6px;
          }
          .process-steps {
            gap: 8px 0;
          }
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .services-grid {
            grid-template-columns: 1fr;
          }
          .work-grid {
            grid-template-columns: 1fr;
          }
          .project-card .project-sentence {
            max-height: none;
            opacity: 1;
            margin-top: 8px;
          }
        }
      `}</style>
    </>
  );
}
