// The Insights post card and its meta line, shared by /insights (InsightsClient) and the
// paginated pages /insights/page/N. No hooks or state, so the paginated pages render it on the
// server.

import IntentLink from "@/components/IntentLink";
import Image from "next/image";

// A post card. The image URLs are built on the server (src/lib/insights-cards.ts): the featured
// size and the card size, as any post can become the hero once a filter is chosen.
export interface InsightCard {
  _id: string;
  title: string;
  slug: { current: string };
  // position: the Studio hotspot as object-position (insightImagePosition).
  featuredImage?: { alt?: string; featuredUrl: string; cardUrl: string; position?: string };
  category?: string;
  publishedAt?: string;
  featured?: boolean;
  readingTime?: number;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function PostMeta({ category, date, readingTime }: { category?: string; date?: string; readingTime?: number }) {
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

// One card in the post grid. "index" staggers the reveal.
export function InsightGridCard({ post, index }: { post: InsightCard; index: number }) {
  return (
    <IntentLink
      href={`/insights/${post.slug?.current}`}
      className="ins-card css-reveal no-underline"
      data-cursor="view"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {post.featuredImage && (
        <div className="ins-card-img reveal-clip">
          <div className="ins-card-img-inner relative">
            <Image
              src={post.featuredImage.cardUrl}
              alt={post.featuredImage?.alt || post.title}
              fill
              style={{ objectFit: "cover", objectPosition: post.featuredImage.position }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      )}
      <PostMeta category={post.category} date={post.publishedAt} readingTime={post.readingTime} />
      <h3 className="ins-card-title">{post.title}</h3>
    </IntentLink>
  );
}
