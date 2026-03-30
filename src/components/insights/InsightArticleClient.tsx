"use client";

import { useState, FormEvent } from "react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import Button from "@/components/ui/Button";
import NextPageLink from "@/components/layout/NextPageLink";
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
  featuredImage?: PostImage;
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
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const portableTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }: any) => (
      <p className="art-p">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="art-h2">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="art-h3">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="art-h4">{children}</h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="art-bq">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong style={{ fontWeight: 500 }}>{children}</strong>
    ),
    em: ({ children }: any) => (
      <em style={{ fontStyle: "italic" }}>{children}</em>
    ),
    code: ({ children }: any) => <code className="art-code">{children}</code>,
    link: ({ children, value }: any) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          className="art-link"
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
    bullet: ({ children }: any) => <ul className="art-ul">{children}</ul>,
    number: ({ children }: any) => <ol className="art-ol">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="art-li">{children}</li>,
    number: ({ children }: any) => <li className="art-li">{children}</li>,
  },
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <figure className="art-figure reveal-clip">
          <div className="art-figure-inner">
            <Image
              src={urlFor(value).width(1200).height(675).url()}
              alt={value.alt || "Article image"}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          {value.alt && (
            <figcaption className="art-caption">{value.alt}</figcaption>
          )}
        </figure>
      );
    },
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="art-share">
      <span className="art-share-label">Share</span>
      <button
        type="button"
        onClick={() =>
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
            "_blank"
          )
        }
        className="art-share-btn"
      >
        LinkedIn
      </button>
      <button
        type="button"
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`,
            "_blank"
          )
        }
        className="art-share-btn"
      >
        X
      </button>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // Fallback: silently fail
          }
        }}
        className="art-share-btn"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

function InlineNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{ marginTop: 32 }}>
        <p className="art-newsletter-success">
          Thank you. You&rsquo;re on the list.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 32 }}>
      <form onSubmit={handleSubmit} className="art-newsletter-form">
        <span className="art-newsletter-label">
          Get studio insights in your inbox.
        </span>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "submitting"}
          className="art-newsletter-input"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="art-newsletter-submit"
          style={{ opacity: status === "submitting" ? 0.4 : 0.6 }}
        >
          Subscribe&nbsp;&rarr;
        </button>
      </form>
      {status === "error" && (
        <p className="art-newsletter-error">Something went wrong. Try again.</p>
      )}
    </div>
  );
}

export default function InsightArticleClient({ post }: { post: Post }) {
  const readTime = calculateReadTime(post.body);

  // Filter related posts to same category, max 2
  const relatedPosts = (post.relatedPosts || [])
    .filter((rp) => rp.category === post.category)
    .slice(0, 2);
  // Fallback: if fewer than 2 same-category, fill from all related
  const finalRelated =
    relatedPosts.length >= 2
      ? relatedPosts
      : [
          ...relatedPosts,
          ...(post.relatedPosts || [])
            .filter(
              (rp) => !relatedPosts.find((r) => r._id === rp._id)
            )
            .slice(0, 2 - relatedPosts.length),
        ];

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="art-hero">
        <Link href="/insights" className="art-back" data-cursor="link">
          <span className="art-back-arrow">&#8592;</span>
          All Insights
        </Link>

        <div className="art-hero-content css-reveal">
          <div className="ins-meta" style={{ marginTop: 24 }}>
            {post.category && <span>{post.category}</span>}
            {post.category && post.publishedAt && (
              <span className="ins-meta-dot">&middot;</span>
            )}
            {post.publishedAt && (
              <span>{formatDateLong(post.publishedAt)}</span>
            )}
            {readTime > 0 && (
              <>
                <span className="ins-meta-dot">&middot;</span>
                <span>{readTime} min read</span>
              </>
            )}
          </div>

          <h1 className="art-title">{post.title}</h1>

          {post.excerpt && <p className="art-excerpt">{post.excerpt}</p>}
        </div>
      </section>

      {/* ═══ FEATURED IMAGE ═══ */}
      {post.featuredImage?.asset && (
        <section className="art-hero-img-section">
          <div
            className="art-hero-img reveal-clip"
            style={{
              animationDuration: "1s",
              transitionDuration: "1s",
            }}
          >
            <Image
              src={urlFor(post.featuredImage).width(1600).height(900).url()}
              alt={post.featuredImage.alt || post.title}
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="100vw"
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

      {/* ═══ BODY ═══ */}
      {post.body && (
        <section className="art-body-section">
          <div className="art-body">
            <PortableText value={post.body} components={portableTextComponents} />
          </div>
        </section>
      )}

      {/* ═══ FOOTER (back + share + newsletter) ═══ */}
      <section style={{ padding: "0 var(--page-px)" }}>
        <div className="art-body">
          <div className="art-footer-divider" />
          <Link href="/insights" className="art-back art-back--inline">
            <span className="art-back-arrow">&#8592;</span>
            Back to Insights
          </Link>
          <ShareRow title={post.title} />
          <InlineNewsletter />
        </div>
      </section>

      {/* ═══ PREV / NEXT ═══ */}
      {(post.previousPost || post.nextPost) && (
        <section className="art-nav-section">
          <div className="art-nav-divider" />
          <div className="art-nav">
            <div>
              {post.previousPost && (
                <Link
                  href={`/insights/${post.previousPost.slug.current}`}
                  className="art-nav-link no-underline"
                >
                  <p className="art-nav-label">
                    <span className="art-nav-arrow art-nav-arrow--prev">
                      &#8592;
                    </span>{" "}
                    Previous
                  </p>
                  <p className="art-nav-title">
                    {post.previousPost.title}
                  </p>
                </Link>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              {post.nextPost && (
                <Link
                  href={`/insights/${post.nextPost.slug.current}`}
                  className="art-nav-link art-nav-link--next no-underline"
                >
                  <p className="art-nav-label">
                    Next{" "}
                    <span className="art-nav-arrow art-nav-arrow--next">
                      &#8594;
                    </span>
                  </p>
                  <p className="art-nav-title">{post.nextPost.title}</p>
                </Link>
              )}
            </div>
          </div>
          <div className="art-nav-divider" />
        </section>
      )}

      {/* ═══ RELATED POSTS ═══ */}
      {finalRelated.length > 0 && (
        <section className="art-related-section">
          <p className="editorial-label" style={{ margin: "0 0 12px" }}>
            (Related)
          </p>
          <h2 className="art-related-heading">More from the studio.</h2>
          <div className="art-related-grid">
            {finalRelated.map((rp) => (
              <Link
                key={rp._id}
                href={`/insights/${rp.slug.current}`}
                className="ins-card no-underline"
                data-cursor="view"
              >
                {rp.featuredImage?.asset && (
                  <div className="ins-card-img">
                    <div className="ins-card-img-inner relative">
                      <Image
                        src={urlFor(rp.featuredImage)
                          .width(600)
                          .height(338)
                          .url()}
                        alt={rp.featuredImage.alt || rp.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                )}
                <div className="ins-meta">
                  {rp.category && <span>{rp.category}</span>}
                  {rp.category && rp.publishedAt && (
                    <span className="ins-meta-dot">&middot;</span>
                  )}
                  {rp.publishedAt && (
                    <span>{formatDateShort(rp.publishedAt)}</span>
                  )}
                </div>
                <h3 className="ins-card-title">{rp.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <NextPageLink />

      {/* ═══ DARK CTA ═══ */}
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
          <div className="cta-dark-buttons">
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
      </section>
    </>
  );
}
