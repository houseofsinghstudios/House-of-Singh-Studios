// "Related thinking" on a service page: two or three article cards in a row between 1px rules, in
// the /insights card style (read time in the meta line, then the title and one line). The whole
// card is the link, so its accessible name starts with the article title. Hidden when empty.
import { Link } from "next-view-transitions";
import type { ArticleCard } from "@/lib/sanity/articles";

export default function RelatedThinking({ articles }: { articles: ArticleCard[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="svcd-thinking" aria-labelledby="thinking-label">
      <p id="thinking-label" className="editorial-label css-reveal" style={{ margin: 0 }}>
        (Related thinking)
      </p>
      <div className="svcd-thinking-grid">
        {articles.map((article, i) => (
          <Link
            key={article.slug}
            href={`/insights/${article.slug}`}
            className="ins-card svcd-thinking-card css-reveal no-underline"
            data-cursor="view"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <h3 className="ins-card-title">{article.title}</h3>
            {article.line && <p className="svcd-thinking-line">{article.line}</p>}
            <p className="ins-meta svcd-thinking-meta">{article.readingTime} min read</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
