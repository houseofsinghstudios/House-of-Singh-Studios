"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { Link } from "next-view-transitions";
import Image from "next/image";
import {
  initScrollFallbacks,
  cleanScrollFallbacks,
} from "@/lib/scroll-fallback";
import { urlFor } from "@/lib/sanity/image";
import { calculateReadTime } from "@/lib/read-time";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  excerpt?: string;
  category?: string;
  featuredImage?: {
    asset?: {
      _id: string;
      url: string;
      metadata?: { dimensions?: { width: number; height: number }; lqip?: string };
    };
    alt?: string;
  };
  body?: Array<{ _type: string; children?: Array<{ text?: string }> }>;
}

interface InsightsClientProps {
  posts: Post[];
  categories: string[];
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function InsightsClient({
  posts,
  categories,
}: InsightsClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const splitsRef = useRef<SplitType[]>([]);

  // Page load orchestration
  useEffect(() => {
    initScrollFallbacks();

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Label fade in
    if (labelRef.current) {
      gsap.set(labelRef.current, { opacity: 0, y: 12 });
      tl.to(labelRef.current, { opacity: 0.5, y: 0, duration: 0.4 }, 0);
    }

    // Heading SplitType
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

    return () => {
      cleanScrollFallbacks();
      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];
      tl.kill();
    };
  }, []);

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* ── SECTION 1: HERO ── */}
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
          (Insights)
        </p>
        <h1
          ref={headingRef}
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: "clamp(38px, 5vw, 72px)",
            lineHeight: 1.1,
            maxWidth: 900,
            color: "var(--text-primary)",
            margin: 0,
            overflow: "hidden",
          }}
        >
          Thinking, frameworks, and perspective on brand, design, and creative
          systems.
        </h1>
      </section>

      {/* ── SECTION 2: CATEGORY FILTER BAR ── */}
      <div
        className="insights-filter-bar scroll-reveal-up"
        style={{ padding: "0 var(--page-px)", marginTop: 80, marginBottom: 60 }}
      >
        <button
          className={`filter-pill${activeCategory === "all" ? " active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-pill${activeCategory === cat ? " active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── SECTION 3: POSTS GRID ── */}
      <section style={{ padding: "0 var(--page-px) 120px" }}>
        {filteredPosts.length > 0 ? (
          <div className="insights-grid">
            {filteredPosts.map((post) => {
              const readTime = calculateReadTime(post.body);
              return (
                <Link
                  key={post._id}
                  href={`/insights/${post.slug.current}`}
                  className="post-card"
                >
                  {/* Image */}
                  {post.featuredImage?.asset && (
                    <div className="post-card-image scroll-clip-reveal">
                      <Image
                        src={urlFor(post.featuredImage)
                          .width(800)
                          .height(450)
                          .url()}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                        {...(post.featuredImage.asset.metadata?.lqip
                          ? {
                              placeholder: "blur",
                              blurDataURL:
                                post.featuredImage.asset.metadata.lqip,
                            }
                          : {})}
                      />
                    </div>
                  )}

                  {/* Meta row */}
                  <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 0 }}>
                    {post.category && (
                      <span
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          opacity: 0.5,
                        }}
                      >
                        {post.category}
                      </span>
                    )}
                    {post.category && post.publishedAt && (
                      <span
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 11,
                          opacity: 0.3,
                          margin: "0 8px",
                        }}
                      >
                        —
                      </span>
                    )}
                    {post.publishedAt && (
                      <span
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 11,
                          opacity: 0.5,
                        }}
                      >
                        {formatDate(post.publishedAt)}
                      </span>
                    )}
                    {readTime > 0 && post.publishedAt && (
                      <>
                        <span
                          style={{
                            fontFamily: "var(--sans)",
                            fontSize: 11,
                            opacity: 0.3,
                            margin: "0 8px",
                          }}
                        >
                          —
                        </span>
                        <span className="read-time">{readTime} min read</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h2
                    className="post-card-title scroll-reveal-up"
                    style={{
                      fontFamily: "var(--serif)",
                      fontWeight: 600,
                      fontSize: "clamp(24px, 3vw, 36px)",
                      lineHeight: 1.15,
                      marginTop: 12,
                      color: "var(--text-primary)",
                    }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p
                      className="scroll-reveal-up"
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: 16,
                        lineHeight: 1.6,
                        opacity: 0.6,
                        marginTop: 12,
                        maxWidth: 540,
                      }}
                    >
                      {post.excerpt.length > 160
                        ? post.excerpt.slice(0, 160) + "..."
                        : post.excerpt}
                    </p>
                  )}

                  {/* Read link */}
                  <span
                    className="read-link"
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginTop: 16,
                      color: "var(--text-primary)",
                      opacity: 0.5,
                    }}
                  >
                    Read
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                opacity: 0.4,
                marginBottom: 16,
              }}
            >
              (No posts yet)
            </p>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: 1.2,
                opacity: 0.6,
              }}
            >
              Content is on its way.
            </h2>
          </div>
        )}
      </section>

      {/* ── SECTION 4: CTA BAND ── */}
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
