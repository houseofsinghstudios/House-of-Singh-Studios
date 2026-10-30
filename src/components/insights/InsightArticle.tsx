// An Insights article, rendered on the server. Only the newsletter form (ArticleNewsletter) and the
// share buttons (ShareButtons) run in the browser; the text, related posts and links are plain HTML.
import { Link } from "next-view-transitions";
import Image from "next/image";
import Button from "@/components/ui/Button";
import NextPageLink from "@/components/layout/NextPageLink";
import ShareButtons from "@/components/ShareButtons";
import { calculateReadTime } from "@/lib/read-time";
import { updatedLabel } from "@/lib/article-dates";
import RgdLink, { RgdText } from "@/components/RgdLink";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import ArticleBody, { type ArticleBlock } from "./ArticleBody";
import ArticleNewsletter from "./ArticleNewsletter";
import { ArticleAdjacent, ArticleRelated } from "./ArticleMore";

// src: the image URL at the size this page shows it, built by the article page.
interface PostImage {
  src?: string;
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

export interface AdjacentPost {
  title: string;
  slug: { current: string };
  category?: string;
}

export interface RelatedPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  category?: string;
  featuredImage?: PostImage;
}

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  _updatedAt?: string;
  category?: string;
  featuredImage?: PostImage;
  keyTakeaways?: string[];
  body?: ArticleBlock[];
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

// endCta and relatedWork are rendered by the page and placed where the article ends, before the
// newsletter.
export default function InsightArticle({ post, endCta, relatedWork }: { post: Post; endCta?: React.ReactNode; relatedWork?: React.ReactNode }) {
  const readTime = calculateReadTime(post.body);
  const updated = updatedLabel(post.publishedAt, post._updatedAt);

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
          {/* Two separate links side by side, never one inside the other. */}
          <p className="ins-meta art-meta-line">
            By{" "}
            <Link href="/about" className="art-byline" data-cursor="link">
              Maninder Singh
            </Link>{" "}
            <RgdLink />, Creative Director
          </p>
          {updated && <p className="ins-meta art-meta-line">{updated}</p>}

          <h1 className="art-title">{post.title}</h1>
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
              src={post.featuredImage.src!}
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

      {/* ═══ KEY TAKEAWAYS ═══ */}
      {post.keyTakeaways && post.keyTakeaways.length > 0 && (
        <section className="art-takeaways-section css-reveal">
          <div className="art-body">
            <div className="art-takeaways">
              <p className="editorial-label art-takeaways-label">
                (Key Takeaways)
              </p>
              <ul className="art-takeaways-list">
                {post.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="art-takeaways-item">
                    <span className="art-takeaways-dash">&middot;</span>
                    <span><RgdText text={takeaway} /></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ═══ BODY ═══ */}
      {post.body && (
        <section className="art-body-section">
          <div className="art-body">
            <ArticleBody body={post.body} />
          </div>
        </section>
      )}

      {/* ═══ END OF ARTICLE CALL TO ACTION ═══ */}
      {endCta && (
        <section style={{ padding: "0 var(--page-px)" }}>
          <div className="art-body">{endCta}</div>
        </section>
      )}

      {relatedWork}

      {/* ═══ FOOTER (back + share + newsletter) ═══ */}
      <section style={{ padding: "0 var(--page-px)" }}>
        <div className="art-body">
          <div className="art-footer-divider" />
          <Link href="/insights" className="art-back art-back--inline">
            <span className="art-back-arrow">&#8592;</span>
            Back to Insights
          </Link>
          <ShareButtons
            title={post.title}
            url={`https://studios.houseofsingh.com/insights/${post.slug.current}`}
          />
          <ArticleNewsletter />
        </div>
      </section>

      {/* ═══ PREV / NEXT ═══ */}
      <ArticleAdjacent previousPost={post.previousPost} nextPost={post.nextPost} />

      {/* ═══ RELATED POSTS ═══ */}
      <ArticleRelated related={post.relatedPosts || []} category={post.category} />

      <NextPageLink current={`/insights/${post.slug.current}`} />

      {/* ═══ DARK CTA ═══ */}
      <section
        className="css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "120px var(--page-px)",
        }}
      >
        <div className="cta-centered">
          <p className="cta-label">(Next Step)</p>
          <h2 className="cta-heading">Ready to build a brand that works?</h2>
          <div className="cta-buttons">
            <Button href={DISCOVERY_CALL_URL} variant="primary-inverted" data-cursor="link" target="_blank" rel="noopener noreferrer">
              Book a Discovery Call
            </Button>
            <Button href="/start" variant="secondary-inverted" data-cursor="link">
              Start a Project
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
