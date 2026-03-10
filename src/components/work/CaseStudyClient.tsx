"use client";

import { useEffect, useRef } from "react";
import { Link } from "next-view-transitions";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import type { Project } from "@/data/projects";
import { getNextProject } from "@/data/projects";
import {
  initScrollFallbacks,
  cleanScrollFallbacks,
} from "@/lib/scroll-fallback";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_GRADIENTS = {
  hero: "linear-gradient(155deg, #DDD8D2, #CFC8C0)",
  pair1a: "linear-gradient(155deg, #D8DDE2, #C8CFD4)",
  pair1b: "linear-gradient(155deg, #DDE2D8, #CFD4C8)",
  full1: "linear-gradient(155deg, #E2DDD8, #CFC8C2)",
};

interface CaseStudyClientProps {
  project: Project;
}

export default function CaseStudyClient({ project }: CaseStudyClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaLineRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);

  const next = getNextProject(project.slug);

  useEffect(() => {
    initScrollFallbacks();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (titleRef.current) {
        const split = new SplitType(titleRef.current, { types: "words" });
        if (split.words) {
          gsap.set(split.words, { opacity: 0, y: "100%" });
          tl.to(
            split.words,
            { opacity: 1, y: "0%", stagger: 0.08, duration: 0.6 },
            0.1
          );
        }
      }

      if (metaLineRef.current) {
        gsap.set(metaLineRef.current, { opacity: 0, y: 10 });
        tl.to(
          metaLineRef.current,
          { opacity: 0.35, y: 0, duration: 0.3 },
          0.5
        );
      }

      if (descRef.current) {
        gsap.set(descRef.current, { opacity: 0, y: 16 });
        tl.to(descRef.current, { opacity: 0.6, y: 0, duration: 0.4 }, 0.6);
      }

      if (heroImgRef.current) {
        tl.fromTo(
          heroImgRef.current,
          { clipPath: "inset(8% 8% 8% 8%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 },
          0.8
        );
        const inner = heroImgRef.current.querySelector(".hero-img-inner");
        if (inner) {
          tl.fromTo(inner, { scale: 1.15 }, { scale: 1, duration: 1.2 }, 0.8);
        }
      }

      // Content sections scroll triggers
      containerRef.current
        ?.querySelectorAll(".case-content-section")
        .forEach((sec) => {
          gsap.fromTo(
            sec,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: sec, start: "top 80%" },
            }
          );
        });

      // Gallery reveals
      containerRef.current
        ?.querySelectorAll<HTMLElement>(".gallery-full")
        .forEach((img) => {
          gsap.fromTo(
            img,
            { clipPath: "inset(6% 4% 6% 4%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: img, start: "top 85%" },
            }
          );
        });

      containerRef.current
        ?.querySelectorAll<HTMLElement>(".gallery-pair-item")
        .forEach((img, i) => {
          const delay = (i % 2) * 0.15;
          gsap.fromTo(
            img,
            { clipPath: "inset(8% 6% 8% 6%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.9,
              delay,
              ease: "power3.out",
              scrollTrigger: { trigger: img, start: "top 85%" },
            }
          );
        });
    }, containerRef);

    return () => {
      cleanScrollFallbacks();
      ctx.revert();
    };
  }, [project]);

  return (
    <div ref={containerRef}>
      {/* ═══ SECTION 1: PROJECT HEADER ═══ */}
      <section
        className="flex flex-col justify-end px-[var(--page-px)]"
        style={{ minHeight: "100vh", paddingBottom: 80 }}
      >
        <h1
          ref={titleRef}
          className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] m-0 overflow-hidden"
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.1,
            viewTransitionName: `project-${project.slug}`,
          }}
        >
          {project.name}
        </h1>
        <p
          ref={metaLineRef}
          className="font-[var(--sans)] text-[12px] uppercase tracking-[0.1em] text-[color:var(--text-primary)] mt-4"
          style={{ opacity: 0.35 }}
        >
          {project.workType} &mdash; {project.origin}
        </p>
        <p
          ref={descRef}
          className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)] max-w-[640px] mt-4"
          style={{ opacity: 0.6, lineHeight: 1.75 }}
        >
          {project.description}
        </p>
      </section>

      {/* ═══ SECTION 2: HERO IMAGE ═══ */}
      <div
        ref={heroImgRef}
        style={{
          margin: "0 var(--page-px)",
          aspectRatio: "16/9",
          overflow: "hidden",
          clipPath: "inset(8% 8% 8% 8%)",
        }}
      >
        <div
          className="hero-img-inner"
          style={{
            width: "100%",
            height: "100%",
            background: GALLERY_GRADIENTS.hero,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "scale(1.15)",
          }}
        >
          <span className="editorial-label" style={{ color: "#999" }}>
            Project Image
          </span>
        </div>
      </div>

      {/* ═══ SECTION 3: THE BUSINESS ═══ */}
      <section
        className="case-content-section"
        style={{ padding: "120px var(--page-px)", opacity: 0 }}
      >
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-6"
          style={{ opacity: 0.4 }}
        >
          {project.sections.business.label}
        </p>
        <div className="max-w-[640px]">
          {project.sections.business.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)]"
              style={{
                lineHeight: 1.75,
                opacity: 0.7,
                marginBottom:
                  i < project.sections.business.paragraphs.length - 1
                    ? 24
                    : 0,
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 4: THE CHALLENGE ═══ */}
      <section
        className="case-content-section"
        style={{
          padding: "120px var(--page-px)",
          background: "var(--bg-shift)",
          opacity: 0,
        }}
      >
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-6"
          style={{ opacity: 0.4 }}
        >
          {project.sections.challenge.label}
        </p>
        <div className="max-w-[640px]">
          {project.sections.challenge.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)]"
              style={{
                lineHeight: 1.75,
                opacity: 0.7,
                marginBottom:
                  i < project.sections.challenge.paragraphs.length - 1
                    ? 24
                    : 0,
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 5: THE APPROACH ═══ */}
      <section
        className="case-content-section"
        style={{ padding: "120px var(--page-px)", opacity: 0 }}
      >
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-6"
          style={{ opacity: 0.4 }}
        >
          {project.sections.approach.label}
        </p>
        <div className="max-w-[640px]">
          {project.sections.approach.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)]"
              style={{
                lineHeight: 1.75,
                opacity: 0.7,
                marginBottom:
                  i < project.sections.approach.paragraphs.length - 1
                    ? 24
                    : 0,
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 6: DELIVERABLES ═══ */}
      <section
        className="case-content-section"
        style={{
          padding: "120px var(--page-px)",
          background: "var(--bg-shift)",
          opacity: 0,
        }}
      >
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-6"
          style={{ opacity: 0.4 }}
        >
          {project.sections.deliverables.label}
        </p>
        <div
          style={{
            borderLeft: "3px solid rgba(26, 26, 26, 0.1)",
            paddingLeft: 24,
          }}
        >
          {project.deliverablesList.map((item, i) => (
            <p
              key={i}
              className="font-[var(--sans)] text-[15px] text-[color:var(--text-primary)]"
              style={{
                opacity: 0.7,
                lineHeight: 1.5,
                marginBottom:
                  i < project.deliverablesList.length - 1 ? 8 : 0,
              }}
            >
              {item}
            </p>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 7: THE RESULT ═══ */}
      <section
        className="case-content-section"
        style={{ padding: "120px var(--page-px)", opacity: 0 }}
      >
        <p
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-primary)] mb-6"
          style={{ opacity: 0.4 }}
        >
          {project.sections.result.label}
        </p>
        <div className="max-w-[640px]">
          {project.sections.result.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-[var(--sans)] text-[16px] text-[color:var(--text-primary)]"
              style={{
                lineHeight: 1.75,
                opacity: 0.7,
                marginBottom:
                  i < project.sections.result.paragraphs.length - 1
                    ? 24
                    : 0,
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 8: IMAGE GALLERY ═══ */}
      <div
        style={{
          padding: "0 var(--page-px)",
          display: "grid",
          gap: 24,
        }}
      >
        <div
          className="gallery-pair-container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <div
            className="gallery-pair-item"
            style={{
              aspectRatio: "4/3",
              overflow: "hidden",
              clipPath: "inset(8% 6% 8% 6%)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: GALLERY_GRADIENTS.pair1a,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="editorial-label" style={{ color: "#999" }}>
                Gallery Image
              </span>
            </div>
          </div>
          <div
            className="gallery-pair-item"
            style={{
              aspectRatio: "4/3",
              overflow: "hidden",
              clipPath: "inset(8% 6% 8% 6%)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: GALLERY_GRADIENTS.pair1b,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="editorial-label" style={{ color: "#999" }}>
                Gallery Image
              </span>
            </div>
          </div>
        </div>

        <div
          className="gallery-full"
          style={{
            aspectRatio: "16/9",
            overflow: "hidden",
            clipPath: "inset(6% 4% 6% 4%)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: GALLERY_GRADIENTS.full1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="editorial-label" style={{ color: "#999" }}>
              Gallery Image
            </span>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 9: NEXT PROJECT ═══ */}
      <section
        className="text-center"
        style={{
          padding: "120px var(--page-px)",
          borderTop: "1px solid var(--border)",
          marginTop: 80,
        }}
      >
        <p className="editorial-label mb-6">(Next Project)</p>
        <Link
          href={`/work/${next.slug}`}
          className="next-project-link no-underline inline-block"
          data-cursor="expand"
        >
          <h2
            className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] m-0"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              transition: "letter-spacing 0.5s ease",
            }}
          >
            {next.name} &rarr;
          </h2>
        </Link>
      </section>

      {/* ═══ SECTION 10: CTA ═══ */}
      <section
        className="text-center"
        style={{
          padding: "120px var(--page-px)",
          background: "var(--bg-shift)",
        }}
      >
        <h2
          className="scroll-reveal-up font-[var(--serif)] font-normal text-[color:var(--text-primary)]"
          style={{
            fontSize: "clamp(32px, 4.5vw, 60px)",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Start a project.
        </h2>
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
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
          >
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
}
