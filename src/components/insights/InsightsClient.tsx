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
      {/* ── SECTION 1: HERO ── */}
      <section
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
          data-hero-heading
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 500,
            fontSize: "clamp(38px, 5vw, 72px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
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
                  {post.featuredImage?.asset && (
                    <div className="post-card-image scroll-clip-reveal">
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

                  <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 0 }}>
                    {post.category && (
                      <span style={{ fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.5 }}>
                        {post.category}
                      </span>
                    )}
                    {post.category && post.publishedAt && (
                      <span style={{ fontFamily: "var(--sans)", fontSize: 11, opacity: 0.3, margin: "0 8px" }}>—</span>
                    )}
                    {post.publishedAt && (
                      <span style={{ fontFamily: "var(--sans)", fontSize: 11, opacity: 0.5 }}>
                        {formatDate(post.publishedAt)}
                      </span>
                    )}
                    {readTime > 0 && post.publishedAt && (
                      <>
                        <span style={{ fontFamily: "var(--sans)", fontSize: 11, opacity: 0.3, margin: "0 8px" }}>—</span>
                        <span className="read-time">{readTime} min read</span>
                      </>
                    )}
                  </div>

                  <h2
                    className="post-card-title scroll-reveal-up"
                    style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.15, letterSpacing: "-0.02em", marginTop: 12, color: "var(--text-primary)" }}
                  >
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p
                      className="scroll-reveal-up"
                      style={{ fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1.6, opacity: 0.6, marginTop: 12, maxWidth: 540 }}
                    >
                      {post.excerpt.length > 160 ? post.excerpt.slice(0, 160) + "..." : post.excerpt}
                    </p>
                  )}

                  <span
                    className="read-link"
                    style={{ fontFamily: "var(--sans)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 16, color: "var(--text-primary)", opacity: 0.5 }}
                  >
                    Read
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontFamily: "var(--sans)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.4, marginBottom: 16 }}>
              (No posts yet)
            </p>
            <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.2, letterSpacing: "-0.02em", opacity: 0.6 }}>
              Content is on its way.
            </h2>
          </div>
        )}
      </section>

      {/* ── SECTION 4: CTA BAND ── */}
      <section style={{ padding: "120px var(--page-px)", background: "var(--bg-shift)", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.4, marginBottom: 20 }}>
          (Start a project)
        </p>
        <h2
          className="scroll-reveal-up"
          style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(32px, 4.5vw, 60px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0 }}
        >
          Ready to build a brand that works?
        </h2>
        <Button
          href="/contact"
          variant="text"
          className="scroll-reveal-up"
          data-cursor="link"
        >
          Get in touch
        </Button>
      </section>
    </>
  );
}
