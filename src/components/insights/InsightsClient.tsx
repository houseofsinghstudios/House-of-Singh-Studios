"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import Button from "@/components/ui/Button";
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

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="flex flex-col justify-end px-[var(--page-px)]"
        style={{ minHeight: "50vh", paddingBottom: 80 }}
      >
        <p
          data-hero-label
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-primary)] mb-5"
          style={{ opacity: 0.4 }}
        >
          (Insights)
        </p>
        <h1
          data-hero-heading
          className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] overflow-hidden"
          style={{
            fontSize: "clamp(32px, 4vw, 56px)",
            lineHeight: 1.15,
            maxWidth: 900,
            margin: 0,
          }}
        >
          Thinking, frameworks, and perspective on brand, design, and creative
          systems.
        </h1>
      </section>

      {/* ── FILTER BAR ── */}
      <div
        className="insights-filter-bar css-reveal"
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

      {/* ── POSTS GRID ── */}
      <section
        className="css-reveal"
        style={{ padding: "0 var(--page-px) 120px" }}
      >
        {filteredPosts.length > 0 ? (
          <div className="insights-grid">
            {filteredPosts.map((post) => {
              const readTime = calculateReadTime(post.body);
              return (
                <Link
                  key={post._id}
                  href={`/insights/${post.slug.current}`}
                  className="post-card no-underline"
                  data-cursor="view"
                >
                  {post.featuredImage?.asset && (
                    <div className="post-card-image reveal-clip">
                      <Image
                        src={urlFor(post.featuredImage).width(800).height(450).url()}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                        {...(post.featuredImage.asset.metadata?.lqip
                          ? { placeholder: "blur", blurDataURL: post.featuredImage.asset.metadata.lqip }
                          : {})}
                      />
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: 20,
                      display: "flex",
                      alignItems: "center",
                      gap: 0,
                    }}
                  >
                    {post.category && (
                      <span
                        className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em]"
                        style={{ opacity: 0.5 }}
                      >
                        {post.category}
                      </span>
                    )}
                    {post.category && post.publishedAt && (
                      <span
                        className="font-[var(--sans)] text-[11px]"
                        style={{ opacity: 0.3, margin: "0 8px" }}
                      >
                        —
                      </span>
                    )}
                    {post.publishedAt && (
                      <span
                        className="font-[var(--sans)] text-[11px]"
                        style={{ opacity: 0.5 }}
                      >
                        {formatDate(post.publishedAt)}
                      </span>
                    )}
                    {readTime > 0 && post.publishedAt && (
                      <>
                        <span
                          className="font-[var(--sans)] text-[11px]"
                          style={{ opacity: 0.3, margin: "0 8px" }}
                        >
                          —
                        </span>
                        <span className="read-time">{readTime} min read</span>
                      </>
                    )}
                  </div>

                  <h2
                    className="post-card-title font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)]"
                    style={{
                      fontSize: "clamp(20px, 2.5vw, 28px)",
                      lineHeight: 1.2,
                      marginTop: 12,
                    }}
                  >
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p
                      className="font-[var(--sans)] text-[14px]"
                      style={{
                        lineHeight: 1.6,
                        color: "var(--text-secondary)",
                        marginTop: 10,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.excerpt}
                    </p>
                  )}

                  <span
                    className="read-link font-[var(--sans)] text-[13px] uppercase tracking-[0.1em] text-[color:var(--text-primary)]"
                    style={{ marginTop: 16, opacity: 0.5 }}
                  >
                    Read
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p
              className="font-[var(--sans)] text-[11px] uppercase tracking-[0.12em]"
              style={{ color: "var(--text-muted)", marginBottom: 16 }}
            >
              (No posts yet)
            </p>
            <p
              className="font-[var(--sans)] font-medium tracking-[-0.02em]"
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: 1.2,
                color: "var(--text-muted)",
              }}
            >
              Content is on its way.
            </p>
          </div>
        )}
      </section>

      {/* ── CTA (dark inverted) ── */}
      <section
        className="cta-section-mobile css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "120px var(--page-px)",
        }}
      >
        <div className="cta-dark-grid">
          <div className="css-reveal">
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                opacity: 0.4,
                marginBottom: 24,
              }}
            >
              (Next Step)
            </p>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 500,
                fontSize: "clamp(48px, 6vw, 80px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--bg)",
                margin: 0,
              }}
            >
              Ready to build a brand that works?
            </h2>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 16,
                lineHeight: 1.6,
                opacity: 0.5,
                marginTop: 20,
              }}
            >
              We respond within 24 hours.
            </p>
          </div>
          <div className="cta-dark-buttons css-reveal">
            <Button
              href="/contact"
              variant="primary-inverted"
              data-cursor="link"
            >
              Book a Discovery Call
            </Button>
            <Button
              href="/contact"
              variant="secondary-inverted"
              data-cursor="link"
            >
              Start a Project
            </Button>
          </div>
        </div>
        <div
          className="css-reveal"
          style={{
            borderTop: "1px solid rgba(247, 246, 245, 0.12)",
            marginTop: 80,
            paddingTop: 24,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 13,
              fontWeight: 400,
              color: "var(--bg)",
              opacity: 0.3,
              margin: 0,
            }}
          >
            50+ projects delivered across 8 industries in 12+ years.
          </p>
        </div>
      </section>
    </>
  );
}
