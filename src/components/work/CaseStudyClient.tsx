"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import type { Project } from "@/data/projects";
import { getNextProject } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

function parseNumber(str: string): { num: number; prefix: string; suffix: string } {
  const match = str.match(/^([^0-9]*)([0-9,]+)(.*)$/);
  if (!match) return { num: 0, prefix: "", suffix: str };
  return {
    prefix: match[1],
    num: parseInt(match[2].replace(/,/g, ""), 10),
    suffix: match[3],
  };
}

function formatNumber(n: number, original: string): string {
  const { prefix, suffix } = parseNumber(original);
  const formatted = n.toLocaleString("en-US");
  return `${prefix}${formatted}${suffix}`;
}

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
        tl.to(items, { opacity: 1, y: 0, stagger: 0.06, duration: 0.3 }, 0.6);
      }

      // Hero image clip-path reveal
      if (heroImgRef.current) {
        tl.fromTo(
          heroImgRef.current,
          { clipPath: "inset(8% 8% 8% 8%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
          },
          0.8
        );
        const inner = heroImgRef.current.querySelector(".hero-img-inner");
        if (inner) {
          tl.fromTo(inner, { scale: 1.15 }, { scale: 1, duration: 1.2 }, 0.8);
        }
      }

      // Content sections scroll triggers
      const sections = containerRef.current?.querySelectorAll(".case-content-section");
      sections?.forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 80%",
            },
          }
        );
      });

      // Gallery image clip-path reveals
      const galleryFull = containerRef.current?.querySelectorAll(".gallery-full");
      galleryFull?.forEach((img) => {
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

      const galleryPaired = containerRef.current?.querySelectorAll(".gallery-pair-item");
      galleryPaired?.forEach((img, i) => {
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
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate() {
            el.textContent = `${prefix}${Math.round(obj.val).toLocaleString("en-US")}${suffix}`;
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [project]);

  const sectionEntries = [
    { key: "business", label: "The Business", data: project.sections.business },
    { key: "challenge", label: "The Challenge", data: project.sections.challenge },
    { key: "approach", label: "Our Approach", data: project.sections.approach },
    { key: "deliverables", label: "Deliverables", data: project.sections.deliverables },
  ];

  const galleryGradients = [
    "linear-gradient(135deg, #E8E5E0, #D8D5D0)",
    "linear-gradient(135deg, #E0E3E8, #D0D3D8)",
    "linear-gradient(135deg, #E3E8E0, #D3D8D0)",
  ];

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
            background: project.gradient,
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

      {/* Content Sections with Gallery Images between them */}
      {sectionEntries.map((sec, idx) => (
        <div key={sec.key}>
          <section
            className="case-content-section"
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr",
              gap: 80,
              padding: "100px var(--page-px)",
              opacity: 0,
            }}
          >
            <div className="case-sticky-label" style={{ position: "sticky", top: 140, alignSelf: "start" }}>
              <p className="editorial-label mb-4">({sec.label})</p>
              <h2
                className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
                style={{ fontSize: 26 }}
              >
                {sec.data.title}
              </h2>
            </div>
            <div style={{ maxWidth: 600 }}>
              {sec.data.paragraphs.map((p, pi) => (
                <p
                  key={pi}
                  className="font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-secondary)] m-0"
                  style={{
                    lineHeight: 1.75,
                    marginTop: pi > 0 ? 28 : 0,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* Gallery image after each section except last */}
          {idx < sectionEntries.length - 1 && (
            idx % 2 === 0 ? (
              /* Full-width gallery */
              <div
                className="gallery-full"
                style={{
                  margin: "0 var(--page-px)",
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
                    background: galleryGradients[idx] || galleryGradients[0],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "scale(1.1)",
                  }}
                >
                  <span className="editorial-label" style={{ color: "#999" }}>
                    Gallery Image
                  </span>
                </div>
              </div>
            ) : (
              /* Paired gallery */
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  margin: "0 var(--page-px)",
                }}
              >
                {[0, 1].map((gi) => (
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
                        background: galleryGradients[gi + 1] || galleryGradients[0],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: "scale(1.1)",
                      }}
                    >
                      <span className="editorial-label" style={{ color: "#999" }}>
                        Gallery Image
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      ))}

      {/* Results */}
      <section
        className="case-content-section"
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 80,
          padding: "100px var(--page-px)",
          background: "var(--bg-shift)",
          opacity: 0,
        }}
      >
        <div className="case-sticky-label" style={{ position: "sticky", top: 140, alignSelf: "start" }}>
          <p className="editorial-label mb-4">(Results)</p>
          <h2
            className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
            style={{ fontSize: 26 }}
          >
            Impact
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
            className="mt-12"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px 60px",
            }}
          >
            {project.results.map((r, i) => (
              <div key={i}>
                <p
                  ref={(el) => { statRefs.current[i] = el; }}
                  className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] m-0"
                  style={{ fontSize: "clamp(32px, 3.5vw, 48px)" }}
                >
                  {r.number}
                </p>
                <p className="mt-2 font-[var(--sans)] font-normal text-[13px] text-[color:var(--text-muted)] m-0">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Project */}
      <section className="text-center" style={{ padding: "120px var(--page-px)" }}>
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
        <p className="editorial-label mt-4">
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
        <p className="mt-6 font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-muted)]" style={{ maxWidth: 520, margin: "24px auto 0" }}>
          Whether you are refining an existing brand or building from scratch,
          the first step is a conversation.
        </p>
        <Link href="/contact" className="btn-primary mt-10 inline-flex">
          Start a Project
        </Link>
      </section>
    </div>
  );
}
