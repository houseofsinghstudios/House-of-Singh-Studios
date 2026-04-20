"use client";

import { useState, useMemo } from "react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import Button from "@/components/ui/Button";
import NextPageLink from "@/components/layout/NextPageLink";

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
}

const POSTS_PER_PAGE = 6;

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function PostMeta({
  category,
  date,
  readingTime,
}: {
  category?: string;
  date?: string;
  readingTime?: number;
}) {
  const parts: string[] = [];
  if (category) parts.push(category);
  if (date) parts.push(formatDate(date));
  if (readingTime) parts.push(`${readingTime} min read`);
  return (
    <p className="ins-meta">
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && <span className="ins-meta-dot">&middot;</span>}
          {part}
        </span>
      ))}
    </p>
  );
}

export default function InsightsClient({ posts }: InsightsClientProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Derive unique categories from posts
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["All", ...Array.from(cats)];
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (activeFilter === "All") return posts;
    return posts.filter((p) => p.category === activeFilter);
  }, [posts, activeFilter]);

  // Featured = first filtered post
  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1, visibleCount + 1);
  const hasMore = visibleCount + 1 < filteredPosts.length;

  // Reset pagination on filter change
  const handleFilter = (f: string) => {
    setActiveFilter(f);
    setVisibleCount(POSTS_PER_PAGE);
  };

  if (!posts || posts.length === 0) {
    return (
      <div>
        <section className="ins-hero">
          <p
            className="editorial-label css-reveal"
            style={{ margin: "0 0 16px", transitionDelay: "0ms" }}
          >
            (Insights)
          </p>
          <h1
            className="ins-heading css-reveal"
            style={{ transitionDelay: "100ms" }}
          >
            Thinking, frameworks, and perspective.
          </h1>
          <p
            className="ins-sub css-reveal"
            style={{ transitionDelay: "200ms" }}
          >
            On brand, design, and creative systems.
          </p>
        </section>
        <div
          style={{
            padding: "clamp(80px, 10vw, 140px) var(--page-px)",
            textAlign: "center",
          }}
        >
          <p className="ins-empty">No insights published yet. Check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="ins-hero">
        <p
          className="editorial-label css-reveal"
          style={{ margin: "0 0 16px", transitionDelay: "0ms" }}
        >
          (Insights)
        </p>
        <h1
          className="ins-heading css-reveal"
          style={{ transitionDelay: "100ms" }}
        >
          Thinking, frameworks, and perspective.
        </h1>
        <p
          className="ins-sub css-reveal"
          style={{ transitionDelay: "200ms" }}
        >
          On brand, design, and creative systems.
        </p>
      </section>

      {/* ═══ FILTER BAR ═══ */}
      <div className="content-filter-sticky">
        <div className="content-filter-row">
          {categories.map((f) => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`content-filter${activeFilter === f ? " content-filter--active" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ POST CONTENT ═══ */}
      {filteredPosts.length === 0 ? (
        <div
          style={{
            padding: "clamp(80px, 10vw, 140px) var(--page-px)",
            textAlign: "center",
          }}
        >
          <p className="ins-empty">No posts in this category yet.</p>
        </div>
      ) : (
        <div
          style={{
            padding: "clamp(40px, 5vw, 64px) var(--page-px) clamp(64px, 8vw, 120px)",
          }}
        >
          {/* Featured post (first) */}
          {featuredPost && (
            <Link
              href={`/insights/${featuredPost.slug?.current}`}
              className="ins-featured css-reveal no-underline"
              data-cursor="view"
            >
              {featuredPost.featuredImage?.asset && (
                <div className="ins-featured-img reveal-clip">
                  <div className="ins-featured-img-inner relative">
                    <Image
                      src={urlFor(featuredPost.featuredImage)
                        .width(1200)
                        .height(675)
                        .url()}
                      alt={
                        featuredPost.featuredImage?.alt || featuredPost.title
                      }
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 1200px"
                      priority
                    />
                  </div>
                </div>
              )}
              <div className="ins-featured-content">
                <PostMeta
                  category={featuredPost.category}
                  date={featuredPost.publishedAt}
                  readingTime={featuredPost.readingTime}
                />
                <h2 className="ins-featured-title">{featuredPost.title}</h2>
                {featuredPost.excerpt && (
                  <p className="ins-featured-excerpt">
                    {featuredPost.excerpt}
                  </p>
                )}
              </div>
            </Link>
          )}

          {/* Post grid */}
          {gridPosts.length > 0 && (
            <>
              <div className="ins-grid">
                {gridPosts.map((post, i) => (
                  <Link
                    key={post._id}
                    href={`/insights/${post.slug?.current}`}
                    className="ins-card css-reveal no-underline"
                    data-cursor="view"
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    {post.featuredImage?.asset && (
                      <div className="ins-card-img reveal-clip">
                        <div className="ins-card-img-inner relative">
                          <Image
                            src={urlFor(post.featuredImage)
                              .width(600)
                              .height(338)
                              .url()}
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
                    <h3 className="ins-card-title">{post.title}</h3>
                    {post.excerpt && (
                      <p className="ins-card-excerpt">{post.excerpt}</p>
                    )}
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className="ins-load-more">
                  <button
                    onClick={() =>
                      setVisibleCount((prev) => prev + POSTS_PER_PAGE)
                    }
                    className="ins-load-more-btn"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <NextPageLink />

      {/* ═══ DARK CTA ═══ */}
      <section
        className="css-reveal"
        style={{
          background: "var(--text-secondary)",
          color: "var(--bg)",
          padding: "120px var(--page-px)",
        }}
      >
        <div className="cta-dark-grid">
          <div>
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
              Have a project in mind?
            </h2>
          </div>
          <div className="cta-dark-buttons">
            <Button
              href="https://cal.com/houseofsinghstudios/hr"
              variant="primary-inverted"
              data-cursor="link"
              target="_blank"
              rel="noopener noreferrer"
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
      </section>
    </div>
  );
}
