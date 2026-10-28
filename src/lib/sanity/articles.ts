// Article cards for "Related thinking" on the service pages: title, one line and read time only.
// Published articles; the read time is worked out the same way as on /insights. Empty if Sanity is
// unreachable, and the row is then hidden.
import { client } from "./client";

export interface ArticleCard {
  slug: string;
  title: string;
  // The SEO description, otherwise the first key takeaway.
  line: string;
  readingTime: number;
}

const articleCardsQuery = `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  "line": coalesce(seoDescription, keyTakeaways[0], ""),
  "readingTime": round(length(pt::text(body)) / 5 / 200)
}`;

export async function getArticleCards(): Promise<ArticleCard[]> {
  try {
    const docs: unknown = await client.fetch(articleCardsQuery, {}, { next: { revalidate: 60 } });
    if (!Array.isArray(docs)) return [];
    return docs
      .filter((d) => d && typeof d.slug === "string" && typeof d.title === "string")
      .map((d) => ({ slug: d.slug, title: d.title, line: typeof d.line === "string" ? d.line : "", readingTime: Math.max(1, Number(d.readingTime) || 1) }));
  } catch (error) {
    console.error("[sanity/articles] Article cards fetch failed:", error instanceof Error ? error.name : "unknown error");
    return [];
  }
}
