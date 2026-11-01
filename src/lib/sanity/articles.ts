// Article cards for "Related thinking" on the service pages: title, one line and read time only.
// Published articles; the read time is worked out on the server exactly as on the article itself. Empty when there
// are none (or, while building, Sanity cannot be reached), and the row is then hidden.
import { client } from "./client";
import { readSanity } from "./resilience";
import { loadLlmsArticles, type LlmsArticle } from "@/lib/llms";
import { calculateReadTime, READ_TIME_BLOCKS } from "@/lib/read-time";

export interface ArticleCard {
  slug: string;
  title: string;
  // The SEO description, otherwise the first key takeaway.
  line: string;
  readingTime: number;
}

const articleCardsQuery = `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  "line": coalesce(seoDescription, keyTakeaways[0], ""),
  ${READ_TIME_BLOCKS}
}`;

export async function getArticleCards(): Promise<ArticleCard[]> {
  return readSanity(
    "article cards",
    async () => {
      const docs: unknown = await client.fetch(articleCardsQuery, {}, { next: { revalidate: 60 } });
      if (!Array.isArray(docs)) return [];
      return docs
        .filter((d) => d && typeof d.slug === "string" && typeof d.title === "string")
        .map((d) => ({ slug: d.slug, title: d.title, line: typeof d.line === "string" ? d.line : "", readingTime: Math.max(1, calculateReadTime(d.readBody)) }));
    },
    () => []
  );
}

// The slugs of every published article, generated ahead by /insights/[slug]. Published means what
// the sitemap counts: a slug, and not a draft or a release version. A failed read follows
// readSanity: none while building (articles then render on their first visit), rethrown at runtime.
const publishedArticleSlugsQuery = `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))].slug.current`;

export async function getPublishedArticleSlugs(): Promise<string[]> {
  return readSanity(
    "published article slugs",
    async () => {
      const slugs: unknown = await client.fetch(publishedArticleSlugsQuery);
      return Array.isArray(slugs) ? slugs.filter((s): s is string => typeof s === "string" && s.length > 0) : [];
    },
    () => []
  );
}

// Every published article for /llms.txt, newest first: its title and the description its page uses.
// Published means what the sitemap counts: a slug, and not a draft or a release version. A failed
// read follows readSanity (see loadLlmsArticles): the last good llms.txt stays.
const llmsArticlesQuery = `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  "description": seoDescription
}`;

export async function getLlmsArticles(): Promise<LlmsArticle[]> {
  return loadLlmsArticles(() => client.fetch(llmsArticlesQuery, {}, { next: { revalidate: 3600 } }));
}
