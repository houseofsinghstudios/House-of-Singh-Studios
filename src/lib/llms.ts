// /llms.txt: a plain text map of the site for language models, in the llms.txt format (a title, a
// one paragraph summary, then sections of links with one line each). Every line uses the page's own
// meta description, from the same data the pages use. Pure, so it is tested without Sanity.
import { services } from "@/data/services";
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
