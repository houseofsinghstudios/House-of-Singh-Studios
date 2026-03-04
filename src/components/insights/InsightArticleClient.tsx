"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextReactComponents } from "@portabletext/react";
import {
  initScrollFallbacks,
  cleanScrollFallbacks,
} from "@/lib/scroll-fallback";
import { urlFor } from "@/lib/sanity/image";
import { calculateReadTime } from "@/lib/read-time";

interface PostImage {
  asset?: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: { width: number; height: number };
      lqip?: string;
    };
  };
  alt?: string;
}

interface AdjacentPost {
  title: string;
  slug: { current: string };
  category?: string;
}

interface RelatedPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  excerpt?: string;
  category?: string;
}

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  excerpt?: string;
  category?: string;
  featuredImage?: PostImage;
  body?: Array<{ _type: string; children?: Array<{ text?: string }> }>;
  previousPost?: AdjacentPost;
  nextPost?: AdjacentPost;
  relatedPosts?: RelatedPost[];
}

function formatDateLong(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const portableTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }: any) => (
      <p className="scroll-reveal-up" style={{
        fontFamily: "var(--sans)",
        fontSize: 17,
        lineHeight: 1.7,
        color: "var(--text-primary)",
        opacity: 0.85,
        marginBottom: 28,
      }}>
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h2 className="scroll-reveal-up" style={{
        fontFamily: "var(--serif)",
        fontWeight: 600,
        fontSize: "clamp(28px, 3.5vw, 42px)",
        lineHeight: 1.15,
        marginTop: 64,
        marginBottom: 24,
      }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="scroll-reveal-up" style={{
        fontFamily: "var(--sans)",
        fontWeight: 600,
        fontSize: "clamp(18px, 2vw, 22px)",
        lineHeight: 1.3,
        marginTop: 48,
        marginBottom: 16,
        letterSpacing: "-0.01em",
      }}>
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="scroll-reveal-up" style={{
        fontFamily: "var(--sans)",
        fontWeight: 600,
        fontSize: 16,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginTop: 40,
        marginBottom: 12,
        opacity: 0.7,
      }}>
        {children}
      </h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="scroll-reveal-up" style={{
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: "clamp(22px, 3vw, 32px)",
        lineHeight: 1.4,
        borderLeft: "2px solid rgba(26, 26, 26, 0.15)",
        paddingLeft: 32,
        margin: "48px 0",
      }}>
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ fontStyle: "italic" }}>{children}</em>,
    code: ({ children }: any) => (
      <code style={{
        background: "rgba(0, 0, 0, 0.04)",
        padding: "2px 6px",
        fontFamily: "monospace",
        fontSize: 15,
      }}>
        {children}
      </code>
    ),
    link: ({ children, value }: any) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          style={{
            color: "var(--text-primary)",
            borderBottom: "1px solid rgba(26, 26, 26, 0.3)",
            transition: "border-color 0.3s ease",
            textDecoration: "none",
          }}
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: any) => (
      <ul style={{ listStyleType: "disc", paddingLeft: 24, marginBottom: 28 }}>
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol style={{ listStyleType: "decimal", paddingLeft: 24, marginBottom: 28 }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li style={{
        fontFamily: "var(--sans)",
        fontSize: 17,
        lineHeight: 1.7,
        opacity: 0.85,
        marginBottom: 8,
      }}>
        {children}
      </li>
    ),
    number: ({ children }: any) => (
      <li style={{
        fontFamily: "var(--sans)",
        fontSize: 17,
        lineHeight: 1.7,
        opacity: 0.85,
        marginBottom: 8,
      }}>
        {children}
      </li>
    ),
  },
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <figure className="scroll-clip-reveal" style={{ margin: "40px 0 8px" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden" }}>
            <Image
              src={urlFor(value).width(1200).height(675).url()}
              alt={value.alt || ""}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          {value.alt && (
            <figcaption style={{
              fontFamily: "var(--sans)",
              fontSize: 12,
              opacity: 0.4,
              marginTop: 8,
            }}>
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function InsightArticleClient({ post }: { post: Post }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const splitsRef = useRef<SplitType[]>([]);

  const readTime = calculateReadTime(post.body);

  useEffect(() => {
    initScrollFallbacks();

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Meta row fade in
    if (metaRef.current) {
      gsap.set(metaRef.current, { opacity: 0, y: 12 });
      tl.to(metaRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0);
    }

    // Title SplitType
    if (titleRef.current) {
      const split = new SplitType(titleRef.current, { types: "words" });
      splitsRef.current.push(split);
      if (split.words) {
        gsap.set(split.words, { opacity: 0, y: "100%" });
        tl.to(
          split.words,
          { opacity: 1, y: "0%", duration: 0.6, stagger: 0.04 },
          0.1
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

  return (
    <>
      {/* ── ARTICLE HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 var(--page-px) 80px",
          position: "relative",
        }}
      >
        {/* Back link */}
        <Link
          href="/insights"
          style={{
            position: "absolute",
            top: 120,
            left: "var(--page-px)",
            fontFamily: "var(--sans)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            opacity: 0.5,
            color: "var(--text-primary)",
            textDecoration: "none",
            transition: "opacity 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.5";
          }}
        >
          Back to Insights
        </Link>

        {/* Meta row */}
        <div ref={metaRef} style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {post.category && (
            <span
              style={{
                fontFamily: "var(--sans)",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                opacity: 0.5,
              }}
            >
              ({post.category})
            </span>
          )}
          {post.category && post.publishedAt && (
            <span
              style={{
                fontFamily: "var(--sans)",
                fontSize: 12,
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
                fontSize: 12,
                opacity: 0.5,
              }}
            >
              {formatDateLong(post.publishedAt)}
            </span>
          )}
          {readTime > 0 && (
            <>
              <span
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 12,
                  opacity: 0.3,
                  margin: "0 8px",
                }}
              >
                —
              </span>
              <span
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 12,
                  opacity: 0.5,
                }}
              >
                {readTime} min read
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: "clamp(36px, 5.5vw, 80px)",
            lineHeight: 1.05,
            maxWidth: 1000,
            color: "var(--text-primary)",
            marginTop: 16,
            overflow: "hidden",
          }}
        >
          {post.title}
        </h1>
      </section>

      {/* ── HERO IMAGE ── */}
      {post.featuredImage?.asset && (
        <section style={{ padding: "0 var(--page-px)", marginTop: 60 }}>
          <div
            className="scroll-clip-reveal"
            style={{
              width: "100%",
              aspectRatio: "16/9",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src={urlFor(post.featuredImage).width(1600).height(900).url()}
              alt={post.featuredImage.alt || post.title}
              fill
              style={{ objectFit: "cover" }}
              priority
              {...(post.featuredImage.asset.metadata?.lqip
                ? {
                    placeholder: "blur",
                    blurDataURL: post.featuredImage.asset.metadata.lqip,
                  }
                : {})}
            />
          </div>
        </section>
      )}

      {/* ── BODY CONTENT ── */}
      {post.body && (
        <section style={{ padding: "80px var(--page-px) 120px" }}>
          <div className="article-body" style={{ maxWidth: 740 }}>
            <PortableText value={post.body} components={portableTextComponents} />
          </div>
        </section>
      )}

      {/* ── ARTICLE FOOTER ── */}
      <section style={{ padding: "0 var(--page-px)" }}>
        <div style={{ maxWidth: 740 }}>
          <div
            style={{
              borderTop: "1px solid rgba(26, 26, 26, 0.1)",
              marginTop: 80,
              paddingTop: 40,
            }}
          >
            <Link
              href="/insights"
              className="post-nav-link"
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-primary)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const arrow = e.currentTarget.querySelector(".post-nav-arrow");
                if (arrow) (arrow as HTMLElement).style.transform = "translateX(-4px)";
              }}
              onMouseLeave={(e) => {
                const arrow = e.currentTarget.querySelector(".post-nav-arrow");
                if (arrow) (arrow as HTMLElement).style.transform = "translateX(0)";
              }}
            >
              <span className="post-nav-arrow" style={{ display: "inline-block", transition: "transform 0.3s ease" }}>
                ←
              </span>
              Back to Insights
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEXT / PREVIOUS ── */}
      {(post.previousPost || post.nextPost) && (
        <section
          className="scroll-reveal-up"
          style={{ padding: "0 var(--page-px)", marginTop: 60 }}
        >
          <div className="post-nav">
            {/* Previous */}
            <div>
              {post.previousPost && (
                <Link
                  href={`/insights/${post.previousPost.slug.current}`}
                  className="post-nav-link"
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="post-nav-arrow" style={{ display: "inline-block", transition: "transform 0.3s ease" }}>
                      ←
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        opacity: 0.4,
                      }}
                    >
                      Previous
                    </span>
                  </div>
                  {post.previousPost.category && (
                    <p
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        opacity: 0.4,
                        marginTop: 8,
                      }}
                    >
                      {post.previousPost.category}
                    </p>
                  )}
                  <p
                    className="post-nav-title"
                    style={{
                      fontFamily: "var(--serif)",
                      fontWeight: 600,
                      fontSize: "clamp(20px, 2.5vw, 30px)",
                      lineHeight: 1.2,
                      marginTop: 8,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    {post.previousPost.title}
                  </p>
                </Link>
              )}
            </div>

            {/* Next */}
            <div style={{ textAlign: "right" }}>
              {post.nextPost && (
                <Link
                  href={`/insights/${post.nextPost.slug.current}`}
                  className="post-nav-link next"
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                    <span
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        opacity: 0.4,
                      }}
                    >
                      Next
                    </span>
                    <span className="post-nav-arrow" style={{ display: "inline-block", transition: "transform 0.3s ease" }}>
                      →
                    </span>
                  </div>
                  {post.nextPost.category && (
                    <p
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        opacity: 0.4,
                        marginTop: 8,
                      }}
                    >
                      {post.nextPost.category}
                    </p>
                  )}
                  <p
                    className="post-nav-title"
                    style={{
                      fontFamily: "var(--serif)",
                      fontWeight: 600,
                      fontSize: "clamp(20px, 2.5vw, 30px)",
                      lineHeight: 1.2,
                      marginTop: 8,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    {post.nextPost.title}
                  </p>
                </Link>
              )}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              borderTop: "1px solid rgba(26, 26, 26, 0.1)",
              marginTop: 60,
            }}
          />
        </section>
      )}

      {/* ── RELATED POSTS ── */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section style={{ padding: "80px var(--page-px) 120px" }}>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              opacity: 0.4,
              marginBottom: 32,
            }}
          >
            (Related)
          </p>
          <div className="related-grid">
            {post.relatedPosts.map((rp) => (
              <Link
                key={rp._id}
                href={`/insights/${rp.slug.current}`}
                className="scroll-reveal-up"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  transition: "opacity 0.3s ease",
                }}
              >
                {rp.category && (
                  <p
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      opacity: 0.4,
                    }}
                  >
                    {rp.category}
                  </p>
                )}
                <p
                  className="post-nav-title"
                  style={{
                    fontFamily: "var(--serif)",
                    fontWeight: 600,
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    lineHeight: 1.2,
                    marginTop: 8,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  {rp.title}
                </p>
                {rp.publishedAt && (
                  <p
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 11,
                      opacity: 0.4,
                      marginTop: 8,
                    }}
                  >
                    {formatDateShort(rp.publishedAt)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA BAND ── */}
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
