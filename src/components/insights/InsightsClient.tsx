"use client";

// A client component: the category filter and "Load more" keep their state in the browser. The
// cards, their order and the page links come from the server (src/lib/insights-cards.ts and
// src/lib/insights-listing.ts), shared with the paginated pages /insights/page/N.

import { useState, useMemo } from "react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import NextPageLink from "@/components/layout/NextPageLink";
import InsightsCta from "@/components/insights/InsightsCta";
import { InsightGridCard, PostMeta, type InsightCard } from "@/components/insights/InsightCards";
import { POSTS_PER_PAGE, isPlainLeftClick, orderForListing, pageHref } from "@/lib/insights-listing";
import "./insights.css";

interface InsightsClientProps {
  // Already in listing order: the hero first, then newest first.
  posts: InsightCard[];
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
    return orderForListing(posts.filter((p) => p.category === activeFilter));
  }, [posts, activeFilter]);

  // The hero: the newest Featured post, otherwise the newest (src/lib/insights-listing.ts).
  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1, visibleCount + 1);
  const hasMore = visibleCount + 1 < filteredPosts.length;
  // "Load more" is a real link to the next archive page, so crawlers reach every post; a plain left
  // click reveals the next cards in place instead, and any other click follows the link. The archive
  // pages have no category filter, so the link always points at the next page of all articles.
  const nextPage = Math.floor(visibleCount / POSTS_PER_PAGE) + 1;

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
      <div className="content-filter-sticky needs-js">
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
              {featuredPost.featuredImage && (
                <div className="ins-featured-img reveal-clip">
                  <div className="ins-featured-img-inner relative">
                    <Image
                      src={featuredPost.featuredImage.featuredUrl}
                      alt={
                        featuredPost.featuredImage?.alt || featuredPost.title
                      }
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 1200px"
                      // The listing's LCP: the featured post's image, fetched first.
                      fetchPriority="high"
                      loading="eager"
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
              </div>
            </Link>
          )}

          {/* Post grid */}
          {gridPosts.length > 0 && (
            <>
              <div className="ins-grid">
                {gridPosts.map((post, i) => (
                  <InsightGridCard key={post._id} post={post} index={i} />
                ))}
              </div>

              {hasMore && (
                <div className="ins-load-more">
                  <a
                    href={pageHref(nextPage)}
                    onClick={(event) => {
                      if (!isPlainLeftClick(event)) return;
                      event.preventDefault();
                      setVisibleCount((prev) => prev + POSTS_PER_PAGE);
                    }}
                    className="ins-load-more-btn no-underline"
                  >
                    Load more
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <NextPageLink current="/insights" />

      <InsightsCta />
    </div>
  );
}
