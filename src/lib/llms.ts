// /llms.txt: a plain text map of the site for language models, in the llms.txt format (a title, a
// one paragraph summary, then sections of links with one line each). Every line uses the page's own
// meta description, from the same data the pages use. Pure, so it is tested without Sanity; the
// Sanity read is passed in (src/lib/sanity/articles.ts).
import { services } from "@/data/services";
import { readSanity, type SanityEnv } from "@/lib/sanity/resilience";
import { PAGE as PLANNER } from "@/lib/project-planner/content";
import { PAGE as PULSE } from "@/lib/brand-pulse/content";
import { LANDING } from "@/lib/initiatives/content";
import { PARTNERS } from "@/lib/partners/content";
import { PAGE_DESCRIPTIONS } from "@/lib/page-descriptions";

const SITE = "https://studios.houseofsingh.com";

export interface LlmsArticle {
  slug: string;
  title: string;
  // The article's SEO description; the article page falls back to the same line without one.
  description: string | null;
}

export const ARTICLE_FALLBACK = "Insights from House of Singh Studios.";

// The article list from a Sanity read. A failed read follows readSanity: no articles while building,
// and at runtime the error is rethrown, so the last good /llms.txt keeps being served (it refreshes
// hourly) instead of an empty list. The sitemap keeps its own fallback.
export async function loadLlmsArticles(read: () => Promise<unknown>, env?: SanityEnv): Promise<LlmsArticle[]> {
  return readSanity(
    "llms.txt articles",
    async () => {
      const docs = await read();
      if (!Array.isArray(docs)) return [];
      return docs
        .filter((d) => d && typeof d.slug === "string" && typeof d.title === "string")
        .map((d) => ({ slug: d.slug, title: d.title, description: typeof d.description === "string" && d.description.trim() ? d.description : null }));
    },
    () => [],
    env
  );
}

const link = (title: string, path: string, description: string) => `- [${title}](${SITE}${path}): ${description}`;

// Articles in the order given (newest first from the query).
export function buildLlmsTxt(articles: LlmsArticle[]): string {
  const sections: [string, string[]][] = [
    ["Services", services.map((s) => link(s.name, `/services/${s.slug}`, s.seoDescription))],
    ["Tools", [link("Project Planner", "/start", PLANNER.description), link("Brand Pulse", "/brand-pulse", PULSE.description)]],
    ["Work", [link("Work", "/work", PAGE_DESCRIPTIONS.work)]],
    ["Insights", articles.map((a) => link(a.title, `/insights/${a.slug}`, a.description || ARTICLE_FALLBACK))],
    ["Studio", [
      link("About", "/about", PAGE_DESCRIPTIONS.about),
      link("Initiatives", "/initiatives", LANDING.description),
      link("Partners", "/partners", PARTNERS.description),
      link("Contact", "/contact", PAGE_DESCRIPTIONS.contact),
    ]],
  ];
  return [
    "# House of Singh Studios",
    "",
    "> House of Singh Studios is a Toronto design studio for brand identity, websites, photography and video, and brand strategy. It serves businesses across the GTA and Canada.",
    "",
    ...sections.flatMap(([heading, lines]) => [`## ${heading}`, "", ...lines, ""]),
  ].join("\n");
}
