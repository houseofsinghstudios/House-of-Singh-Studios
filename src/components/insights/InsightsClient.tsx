"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import EditorialLabel from "@/components/ui/EditorialLabel";
import Button from "@/components/ui/Button";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  featuredImage?: { asset?: { _ref?: string }; alt?: string };
  category?: string;
  publishedAt?: string;
  readingTime?: number;
  featured?: boolean;
  tags?: string[];
}

interface InsightsClientProps {
  posts: Post[];
  categories?: string[];
}

const POSTS_PER_PAGE = 6;

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function PostMeta({ category, date, readingTime }: { category?: string; date?: string; readingTime?: number }) {
  const parts: string[] = [];
  if (category) parts.push(category);
  if (date) parts.push(formatDate(date));
  if (readingTime) parts.push(`${readingTime} min read`);
  return (
    <p className="insights-post-meta">
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && <span className="insights-meta-dot">&middot;</span>}
          {part}
        </span>
      ))}
    </p>
  );
}

export default function InsightsClient({ posts }: InsightsClientProps) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Separate featured post from the rest
  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const gridPosts = posts.filter((p) => p._id !== featuredPost?._id);
  const visiblePosts = gridPosts.slice(0, visibleCount);
  const hasMore = visibleCount < gridPosts.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="insights-page">
        <div className="insights-hero" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 var(--page-px)" }}>
          <EditorialLabel text="Insights" className="mb-4" />
          <h1 className="insights-hero-heading" data-hero-heading>
            Thinking, frameworks, and perspective on brand, design, and creative systems.
          </h1>
        </div>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(80px, 10vw, 140px) var(--page-px)", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: 16, color: "var(--text-muted)" }}>
            No insights published yet. Check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="insights-page">
      {/* Hero */}
      <div className="insights-hero" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 var(--page-px)" }}>
        <EditorialLabel text="Insights" className="mb-4" />
        <h1 className="insights-hero-heading" data-hero-heading>
          Thinking, frameworks, and perspective on brand, design, and creative systems.
        </h1>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 var(--page-px)" }}>
        <div className="insights-divider" />
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="insights-featured css-reveal" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 var(--page-px)" }}>
          <Link
            href={`/insights/${featuredPost.slug?.current}`}
            className="insights-featured-link"
            data-cursor="view"
          >
            {featuredPost.featuredImage && (
              <div className="insights-featured-image reveal-clip">
                <Image
                  src={urlFor(featuredPost.featuredImage).width(1200).height(675).url()}
                  alt={featuredPost.featuredImage?.alt || featuredPost.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                />
              </div>
            )}
            <div className="insights-featured-content">
              <PostMeta
                category={featuredPost.category}
                date={featuredPost.publishedAt}
                readingTime={featuredPost.readingTime}
              />
              <h2 className="insights-featured-title">
                {featuredPost.title}
              </h2>
              {featuredPost.excerpt && (
                <p className="insights-featured-excerpt">{featuredPost.excerpt}</p>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Divider */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 var(--page-px)" }}>
        <div className="insights-divider" />
      </div>

      {/* Post Grid */}
      {visiblePosts.length > 0 && (
        <div className="insights-grid-section" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 var(--page-px)" }}>
          <div className="insights-grid reveal-stagger-parent">
            {visiblePosts.map((post) => (
              <Link
                key={post._id}
                href={`/insights/${post.slug?.current}`}
                className="insights-card"
                data-cursor="view"
              >
                {post.featuredImage && (
                  <div className="insights-card-image">
                    <div className="insights-card-image-inner">
                      <Image
                        src={urlFor(post.featuredImage).width(600).height(375).url()}
                        alt={post.featuredImage?.alt || post.title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                )}
                <PostMeta
                  category={post.category}
                  date={post.publishedAt}
                  readingTime={post.readingTime}
                />
                <h3 className="insights-card-title">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="insights-load-more">
              <button
                onClick={loadMore}
                className="insights-load-more-btn"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dark CTA */}
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
              Start a project.
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
              Start a Project
            </Button>
            <Button
              href="/contact"
              variant="secondary-inverted"
              data-cursor="link"
            >
              Book a Discovery Call
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
            Toronto, Canada &middot; studio@houseofsingh.com &middot; Mon — Fri, 9am — 6pm EST
          </p>
        </div>
      </section>
    </div>
  );
}
