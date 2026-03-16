"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import Button from "@/components/ui/Button";
import type { PortableTextReactComponents } from "@portabletext/react";
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
      <p className="scroll-reveal-up" style={{ fontFamily: "var(--sans)", fontSize: 17, lineHeight: 1.7, color: "var(--text-primary)", opacity: 0.85, marginBottom: 28 }}>
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h2 className="scroll-reveal-up" style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.15, letterSpacing: "-0.02em", marginTop: 64, marginBottom: 24 }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="scroll-reveal-up" style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.3, marginTop: 48, marginBottom: 16, letterSpacing: "-0.01em" }}>
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="scroll-reveal-up" style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: 16, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 40, marginBottom: 12, opacity: 0.7 }}>
        {children}
      </h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="scroll-reveal-up" style={{ fontFamily: "var(--sans)", fontStyle: "italic", fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.4, borderLeft: "2px solid var(--border)", paddingLeft: 32, margin: "48px 0" }}>
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 500 }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ fontStyle: "italic" }}>{children}</em>,
    code: ({ children }: any) => (
      <code style={{ background: "var(--bg-shift)", padding: "2px 6px", fontFamily: "monospace", fontSize: 15 }}>
        {children}
      </code>
    ),
    link: ({ children, value }: any) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          style={{ color: "var(--text-primary)", borderBottom: "1px solid var(--border)", transition: "border-color 0.3s ease", textDecoration: "none" }}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: any) => <ul style={{ listStyleType: "disc", paddingLeft: 24, marginBottom: 28 }}>{children}</ul>,
    number: ({ children }: any) => <ol style={{ listStyleType: "decimal", paddingLeft: 24, marginBottom: 28 }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li style={{ fontFamily: "var(--sans)", fontSize: 17, lineHeight: 1.7, opacity: 0.85, marginBottom: 8 }}>{children}</li>,
    number: ({ children }: any) => <li style={{ fontFamily: "var(--sans)", fontSize: 17, lineHeight: 1.7, opacity: 0.85, marginBottom: 8 }}>{children}</li>,
  },
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <figure className="scroll-clip-reveal" style={{ margin: "40px 0 8px" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden" }}>
            <Image src={urlFor(value).width(1200).height(675).url()} alt={value.alt || "Project image"} fill style={{ objectFit: "cover" }} />
          </div>
          {value.alt && (
            <figcaption style={{ fontFamily: "var(--sans)", fontSize: 12, opacity: 0.4, marginTop: 8 }}>
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
  const readTime = calculateReadTime(post.body);

  return (
    <>
      {/* ── ARTICLE HERO (compact ~50vh) ── */}
      <section style={{ minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 var(--page-px) 60px", position: "relative" }}>
        <Link
          href="/insights"
          className="article-back-link"
          style={{ position: "absolute", top: 120, left: "var(--page-px)", fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, transition: "color 0.3s ease" }}
        >
          <span style={{ transition: "transform 0.3s ease" }}>&#8592;</span>
          Back to Insights
        </Link>

        <div data-hero-label style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {post.category && <span style={{ fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)" }}>{post.category}</span>}
          {post.category && post.publishedAt && <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)", margin: "0 8px" }}>—</span>}
          {post.publishedAt && <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)" }}>{formatDateLong(post.publishedAt)}</span>}
          {readTime > 0 && (
            <>
              <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)", margin: "0 8px" }}>—</span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)" }}>{readTime} min read</span>
            </>
          )}
        </div>

        <h1
          data-hero-heading
          style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: 1000, color: "var(--text-primary)", marginTop: 16, overflow: "hidden" }}
        >
          {post.title}
        </h1>
      </section>

      {/* ── FEATURED IMAGE ── */}
      {post.featuredImage?.asset && (
        <section style={{ padding: "0 var(--page-px)", marginTop: 40 }}>
          <div className="reveal-clip" style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
            <Image
              src={urlFor(post.featuredImage).width(1600).height(900).url()}
              alt={post.featuredImage.alt || post.title}
              fill
              style={{ objectFit: "cover" }}
              priority
              {...(post.featuredImage.asset.metadata?.lqip ? { placeholder: "blur", blurDataURL: post.featuredImage.asset.metadata.lqip } : {})}
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
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 40 }}>
            <Link
              href="/insights"
              className="article-back-link"
              style={{ fontFamily: "var(--sans)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "opacity 0.3s ease" }}
            >
              <span style={{ display: "inline-block", transition: "transform 0.3s ease" }}>&#8592;</span>
              Back to Insights
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEXT / PREVIOUS ── */}
      {(post.previousPost || post.nextPost) && (
        <section className="scroll-reveal-up" style={{ padding: "0 var(--page-px)", marginTop: 60 }}>
          <div className="post-nav">
            <div>
              {post.previousPost && (
                <Link href={`/insights/${post.previousPost.slug.current}`} className="post-nav-link" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="post-nav-arrow" style={{ display: "inline-block", transition: "transform 0.3s ease" }}>&#8592;</span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.4 }}>Previous</span>
                  </div>
                  {post.previousPost.category && <p style={{ fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", opacity: 0.4, marginTop: 8 }}>{post.previousPost.category}</p>}
                  <p className="post-nav-title" style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(20px, 2.5vw, 30px)", lineHeight: 1.2, letterSpacing: "-0.02em", marginTop: 8, transition: "opacity 0.3s ease" }}>{post.previousPost.title}</p>
                </Link>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              {post.nextPost && (
                <Link href={`/insights/${post.nextPost.slug.current}`} className="post-nav-link next" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.4 }}>Next</span>
                    <span className="post-nav-arrow" style={{ display: "inline-block", transition: "transform 0.3s ease" }}>&#8594;</span>
                  </div>
                  {post.nextPost.category && <p style={{ fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", opacity: 0.4, marginTop: 8 }}>{post.nextPost.category}</p>}
                  <p className="post-nav-title" style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(20px, 2.5vw, 30px)", lineHeight: 1.2, letterSpacing: "-0.02em", marginTop: 8, transition: "opacity 0.3s ease" }}>{post.nextPost.title}</p>
                </Link>
              )}
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", marginTop: 60 }} />
        </section>
      )}

      {/* ── RELATED POSTS ── */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section style={{ padding: "80px var(--page-px) 120px" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 32 }}>(Related)</p>
          <div className="related-grid">
            {post.relatedPosts.map((rp) => (
              <Link key={rp._id} href={`/insights/${rp.slug.current}`} className="post-nav-link scroll-reveal-up" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                {rp.category && <p style={{ fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)" }}>{rp.category}</p>}
                <p className="post-nav-title" style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(20px, 2.5vw, 28px)", lineHeight: 1.2, letterSpacing: "-0.02em", marginTop: 8, transition: "opacity 0.3s ease" }}>{rp.title}</p>
                {rp.publishedAt && <p style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>{rp.publishedAt ? formatDateShort(rp.publishedAt) : ""}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── DARK CTA ── */}
      <section
        className="css-reveal"
        style={{
          background: "var(--text-primary)",
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
              (Start a project)
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

          <div className="cta-dark-buttons">
            <Button href="/contact" variant="primary-inverted" data-cursor="link">
              Book a Discovery Call
            </Button>
            <Button href="/contact" variant="secondary-inverted" data-cursor="link">
              Start a Project
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
