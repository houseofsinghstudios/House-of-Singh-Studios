"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import type { Project } from "@/data/projects";
import { getNextProject } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

function parseNumber(str: string): {
  num: number;
  prefix: string;
  suffix: string;
} {
  const match = str.match(/^([^0-9]*)([0-9,]+)(.*)$/);
  if (!match) return { num: 0, prefix: "", suffix: str };
  return {
    prefix: match[1],
    num: parseInt(match[2].replace(/,/g, ""), 10),
    suffix: match[3],
  };
}

const GALLERY_GRADIENTS = {
  hero: "linear-gradient(155deg, #DDD8D2, #CFC8C0)",
  pair1a: "linear-gradient(155deg, #D8DDE2, #C8CFD4)",
  pair1b: "linear-gradient(155deg, #DDE2D8, #CFD4C8)",
  full1: "linear-gradient(155deg, #E2DDD8, #CFC8C2)",
  pair2a: "linear-gradient(155deg, #E0DCD6, #D2CEC6)",
  pair2b: "linear-gradient(155deg, #D6DCE0, #C6CED2)",
  full2: "linear-gradient(155deg, #DDD8D2, #CFC8C0)",
};

interface CaseStudyClientProps {
  project: Project;
}

export default function CaseStudyClient({ project }: CaseStudyClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const next = getNextProject(project.slug);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Label
      if (labelRef.current) {
        gsap.set(labelRef.current, { opacity: 0, y: 16 });
        tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0.1);
      }

      // Title word reveal
      if (titleRef.current) {
        const split = new SplitType(titleRef.current, { types: "words" });
        if (split.words) {
          gsap.set(split.words, { opacity: 0, y: "100%" });
          tl.to(
            split.words,
            { opacity: 1, y: "0%", stagger: 0.08, duration: 0.6 },
            0.2
          );
        }
      }

      // Description
      if (descRef.current) {
        gsap.set(descRef.current, { opacity: 0, y: 16 });
        tl.to(descRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.5);
      }

      // Meta items
      if (metaRef.current) {
        const items = metaRef.current.querySelectorAll(".meta-item");
        gsap.set(items, { opacity: 0, y: 12 });
        tl.to(
          items,
          { opacity: 1, y: 0, stagger: 0.06, duration: 0.3 },
          0.6
        );
      }

      // Hero image clip-path reveal
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
      const sections =
        containerRef.current?.querySelectorAll(".case-content-section");
      sections?.forEach((sec) => {
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

      // Gallery full-width clip reveals
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
          const inner = img.querySelector(".gallery-inner");
          if (inner) {
            gsap.fromTo(
              inner,
              { scale: 1.1 },
              {
                scale: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: { trigger: img, start: "top 85%" },
              }
            );
          }
        });

      // Gallery paired clip reveals
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
          const inner = img.querySelector(".gallery-inner");
          if (inner) {
            gsap.fromTo(
              inner,
              { scale: 1.1 },
              {
                scale: 1,
                duration: 0.9,
                delay,
                ease: "power3.out",
                scrollTrigger: { trigger: img, start: "top 85%" },
              }
            );
          }
        });

      // Results count-up
      project.results.forEach((result, i) => {
        const el = statRefs.current[i];
        if (!el) return;
        const { num, prefix, suffix } = parseNumber(result.number);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: num,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
          onUpdate() {
            el.textContent = `${prefix}${Math.round(obj.val).toLocaleString("en-US")}${suffix}`;
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [project]);

  const sectionEntries = [
    { key: "business", data: project.sections.business },
    { key: "challenge", data: project.sections.challenge },
    { key: "approach", data: project.sections.approach },
    { key: "deliverables", data: project.sections.deliverables },
  ];

  // Gallery items between sections:
  // After business (idx 0): paired
  // After challenge (idx 1): full-width
  // After approach (idx 2): paired
  // After deliverables: full-width (before results)
  const galleryAfterSection: Record<
    number,
    | { type: "paired"; gradients: [string, string] }
    | { type: "full"; gradient: string }
  > = {
    0: { type: "paired", gradients: [GALLERY_GRADIENTS.pair1a, GALLERY_GRADIENTS.pair1b] },
    1: { type: "full", gradient: GALLERY_GRADIENTS.full1 },
    2: { type: "paired", gradients: [GALLERY_GRADIENTS.pair2a, GALLERY_GRADIENTS.pair2b] },
    3: { type: "full", gradient: GALLERY_GRADIENTS.full2 },
  };

  return (
    <div ref={containerRef}>
      {/* Hero */}
      <section style={{ padding: "180px var(--page-px) 0" }}>
        <p ref={labelRef} className="editorial-label mb-6">
          (Case Study)
        </p>
        <h1
          ref={titleRef}
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
          style={{
            fontSize: "clamp(44px, 6vw, 84px)",
            lineHeight: 1.06,
            letterSpacing: "-0.025em",
            overflow: "hidden",
          }}
        >
          {project.name}
        </h1>
        <p
          ref={descRef}
          className="mt-6 font-[var(--sans)] font-normal text-[18px] text-[color:var(--text-muted)]"
          style={{ maxWidth: 560 }}
        >
          {project.description}
        </p>
      </section>

      {/* Meta Row */}
      <div
        ref={metaRef}
        className="case-meta-row"
        style={{
          padding: "48px var(--page-px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {[
          { label: "Client", value: project.client },
          { label: "Services", value: project.services },
          { label: "Industry", value: project.industry },
          { label: "Year", value: project.year },
        ].map((m) => (
          <div key={m.label} className="meta-item">
            <p className="font-[var(--sans)] text-[11px] font-normal uppercase tracking-[0.08em] text-[color:var(--text-faint)] m-0">
              {m.label}
            </p>
            <p className="mt-2 font-[var(--sans)] text-[15px] font-normal text-[color:var(--text-primary)] m-0">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Hero Image */}
      <div
        ref={heroImgRef}
        style={{
          margin: "56px var(--page-px) 0",
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

      {/* Content sections + gallery interleaved */}
      {sectionEntries.map((sec, idx) => (
        <div key={sec.key}>
          <section
            className="case-content-section"
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr",
              gap: 80,
              padding: "120px var(--page-px)",
              opacity: 0,
            }}
          >
            <div
              className="case-sticky-label"
              style={{ position: "sticky", top: 140, alignSelf: "start" }}
            >
              <p className="editorial-label mb-2">{sec.data.label}</p>
              <h2
                className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
                style={{ fontSize: 26, lineHeight: 1.25, marginTop: 6 }}
              >
                {sec.data.title}
              </h2>
            </div>
            <div style={{ maxWidth: 600 }}>
              {sec.data.paragraphs.map((p, pi) => (
                <p
                  key={pi}
                  className="font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-secondary)] m-0"
                  style={{ lineHeight: 1.75, marginBottom: pi < sec.data.paragraphs.length - 1 ? 24 : 0 }}
                >
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* Gallery after this section */}
          {galleryAfterSection[idx] &&
            (galleryAfterSection[idx].type === "paired" ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  padding: "0 var(--page-px)",
                  marginBottom: 20,
                }}
                className="gallery-pair-container"
              >
                {(
                  galleryAfterSection[idx] as {
                    type: "paired";
                    gradients: [string, string];
                  }
                ).gradients.map((g, gi) => (
                  <div
                    key={gi}
                    className="gallery-pair-item"
                    style={{
                      aspectRatio: "4/3",
                      overflow: "hidden",
                      clipPath: "inset(8% 6% 8% 6%)",
                    }}
                  >
                    <div
                      className="gallery-inner"
                      style={{
                        width: "100%",
                        height: "100%",
                        background: g,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: "scale(1.1)",
                      }}
                    >
                      <span
                        className="editorial-label"
                        style={{ color: "#999" }}
                      >
                        Gallery Image
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="gallery-full"
                style={{
                  padding: "0 var(--page-px)",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    aspectRatio: "16/9",
                    overflow: "hidden",
                    clipPath: "inset(6% 4% 6% 4%)",
                  }}
                >
                  <div
                    className="gallery-inner"
                    style={{
                      width: "100%",
                      height: "100%",
                      background: (
                        galleryAfterSection[idx] as {
                          type: "full";
                          gradient: string;
                        }
                      ).gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: "scale(1.1)",
                    }}
                  >
                    <span
                      className="editorial-label"
                      style={{ color: "#999" }}
                    >
                      Gallery Image
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ))}

      {/* Results */}
      <section
        className="case-content-section"
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 80,
          padding: "120px var(--page-px)",
          background: "var(--bg-shift)",
          opacity: 0,
        }}
      >
        <div
          className="case-sticky-label"
          style={{ position: "sticky", top: 140, alignSelf: "start" }}
        >
          <p className="editorial-label mb-2">(Results)</p>
          <h2
            className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
            style={{ fontSize: 26, lineHeight: 1.25, marginTop: 6 }}
          >
            The outcome
          </h2>
        </div>
        <div style={{ maxWidth: 600 }}>
          <p
            className="font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-secondary)] m-0"
            style={{ lineHeight: 1.75 }}
          >
            {project.resultSummary}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              marginTop: 48,
            }}
          >
            {project.results.map((r, i) => (
              <div key={i}>
                <p
                  ref={(el) => {
                    statRefs.current[i] = el;
                  }}
                  className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
                  style={{
                    fontSize: "clamp(36px, 4vw, 52px)",
                    lineHeight: 1,
                  }}
                >
                  {r.number}
                </p>
                <p
                  className="font-[var(--sans)] font-normal text-sm text-[color:var(--text-muted)] m-0"
                  style={{ marginTop: 10 }}
                >
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Project */}
      <section
        className="text-center"
        style={{
          padding: "100px var(--page-px)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <p className="editorial-label mb-6">(Next Project)</p>
        <Link
          href={`/work/${next.slug}`}
          className="next-project-link no-underline inline-block"
          data-cursor="expand"
        >
          <h2
            className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              transition: "letter-spacing 0.5s ease",
            }}
          >
            {next.name}
          </h2>
        </Link>
        <p className="editorial-label" style={{ marginTop: 12 }}>
          {next.categories.join(", ")}
        </p>
      </section>

      {/* CTA Band */}
      <section
        className="text-center"
        style={{
          borderTop: "1px solid var(--border)",
          padding: "100px var(--page-px)",
        }}
      >
        <h2
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
          style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}
        >
          Have a project in mind?
        </h2>
        <p
          className="font-[var(--sans)] font-normal text-[16px] text-[color:var(--text-muted)] m-0"
          style={{ maxWidth: 520, margin: "14px auto 0", lineHeight: 1.6 }}
        >
          Whether you are refining an existing brand or building from scratch,
          the first step is a conversation.
        </p>
        <Link
          href="/contact"
          className="btn-primary inline-flex"
          style={{ marginTop: 28 }}
        >
          Start a Project
        </Link>
      </section>
    </div>
  );
}
