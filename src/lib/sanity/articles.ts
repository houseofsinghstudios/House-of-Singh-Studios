// Article cards for "Related thinking" on the service pages: title, one line and read time only.
// Published articles; the read time is worked out the same way as on /insights. Empty when there
// are none (or, while building, Sanity cannot be reached), and the row is then hidden.
import { client } from "./client";
import { readSanity } from "./resilience";

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
  return readSanity(
    "article cards",
    async () => {
      const docs: unknown = await client.fetch(articleCardsQuery, {}, { next: { revalidate: 60 } });
      if (!Array.isArray(docs)) return [];
      return docs
        .filter((d) => d && typeof d.slug === "string" && typeof d.title === "string")
        .map((d) => ({ slug: d.slug, title: d.title, line: typeof d.line === "string" ? d.line : "", readingTime: Math.max(1, Number(d.readingTime) || 1) }));
    },
    () => []
  );
}

// Every published article for /llms.txt, newest first: its title and the description its page uses.
// Published means what the sitemap counts: a slug, and not a draft or a release version. On any
// failure, none: llms.txt keeps its deliberate fallback and does not use readSanity.
const llmsArticlesQuery = `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  "description": seoDescription
}`;

export async function getLlmsArticles(): Promise<{ slug: string; title: string; description: string | null }[]> {
  try {
    const docs: unknown = await client.fetch(llmsArticlesQuery, {}, { next: { revalidate: 3600 } });
    if (!Array.isArray(docs)) return [];
    return docs
      .filter((d) => d && typeof d.slug === "string" && typeof d.title === "string")
      .map((d) => ({ slug: d.slug, title: d.title, description: typeof d.description === "string" && d.description.trim() ? d.description : null }));
  } catch (error) {
    console.error("[sanity] llms.txt articles failed, listing none:", error instanceof Error ? error.name : "unknown error");
    return [];
  }
}
