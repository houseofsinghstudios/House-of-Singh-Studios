// The end of an article: the previous and next articles, then the related posts the page chose
// (src/lib/related-posts.ts). Server rendered.
import { Link } from "next-view-transitions";
import Image from "next/image";
import type { AdjacentPost, RelatedPost } from "./InsightArticle";

function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function ArticleAdjacent({ previousPost, nextPost }: { previousPost?: AdjacentPost; nextPost?: AdjacentPost }) {
  if (!previousPost && !nextPost) return null;
  return (
    <section className="art-nav-section">
      <div className="art-nav-divider" />
      <div className="art-nav">
        <div>
          {previousPost && (
            <Link
              href={`/insights/${previousPost.slug.current}`}
              className="art-nav-link no-underline"
            >
              <p className="art-nav-label">
                <span className="art-nav-arrow art-nav-arrow--prev">
                  &#8592;
                </span>{" "}
                Previous
              </p>
              <p className="art-nav-title">
                {previousPost.title}
              </p>
            </Link>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          {nextPost && (
            <Link
              href={`/insights/${nextPost.slug.current}`}
              className="art-nav-link art-nav-link--next no-underline"
            >
              <p className="art-nav-label">
                Next{" "}
                <span className="art-nav-arrow art-nav-arrow--next">
                  &#8594;
                </span>
              </p>
              <p className="art-nav-title">{nextPost.title}</p>
            </Link>
          )}
        </div>
      </div>
      <div className="art-nav-divider" />
    </section>
  );
}

export function ArticleRelated({ posts }: { posts: RelatedPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="art-related-section">
      <p className="editorial-label" style={{ margin: "0 0 12px" }}>
        (Related)
      </p>
      <h2 className="art-related-heading">More from the studio.</h2>
      <div className="art-related-grid">
        {posts.map((rp) => (
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
                    src={rp.featuredImage.src!}
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
  );
}
