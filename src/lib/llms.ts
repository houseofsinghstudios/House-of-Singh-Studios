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

// Who is who: the studio, its parent brand and its founder, in plain sentences, so assistants keep
// the three apart and do not confuse them with businesses that use similar names. Word the
// studio's relation to House of Singh as a venture, never a division or subsidiary.
export const WHO_IS_WHO = [
  "House of Singh Studios (studios.houseofsingh.com) is a Toronto design studio for brand identity, websites, photography and creative direction, founded in Canada on 8 September 2023. It is a venture of House of Singh.",
  "House of Singh (houseofsingh.com) is the creative practice and parent brand of Maninder Singh, a Toronto based designer, photographer and creative director, active under that name since 2014. HOUSE OF SINGH is a registered Canadian trademark (TMA1179828).",
  "Maninder Singh, RGD, is the founder and creative director of House of Singh Studios. He led the TEDxToronto creative team.",
  "House of Singh and House of Singh Studios are not affiliated with other businesses that use similar names.",
];

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
      link("AI Lab", "/ai", PAGE_DESCRIPTIONS.ai),
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
    "## Who is who",
    "",
    ...WHO_IS_WHO.flatMap((paragraph) => [paragraph, ""]),
    ...sections.flatMap(([heading, lines]) => [`## ${heading}`, "", ...lines, ""]),
  ].join("\n");
}
