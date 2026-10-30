// Internal links between services, articles and case studies. Pure, so it is tested without Sanity.
// Edit the maps here: articles are matched on the start of their slug, so long slugs stay readable.
import { getServiceBySlug } from "@/data/services";

export const SERVICE_SLUGS = ["brand-identity", "visual-media", "digital-design", "creative-strategy"] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

// "Related thinking" on each service page, in this order. Each entry is the start of an article slug.
export const RELATED_THINKING: Record<ServiceSlug, string[]> = {
  "brand-identity": ["what-a-brand-identity-system-actually-includes", "rebrand-or-refresh", "how-much-does-brand-identity-design-cost"],
  "digital-design": ["how-to-brief-a-design-studio", "why-your-brand-looks-different-everywhere"],
  "visual-media": ["why-your-brand-looks-different-everywhere", "ai-made-design-faster"],
  "creative-strategy": ["5-signs-your-brand-is-actively-costing-you", "what-ai-can-and-cannot-do-for-your-brand"],
};

// The one line under each article's title in "Related thinking", by the same slug prefixes. An
// article without a line here shows its SEO description instead.
export const ARTICLE_LINES: Record<string, string> = {
  "what-a-brand-identity-system-actually-includes": "Every part of a complete identity system, and what each one does for the business.",
  "rebrand-or-refresh": "How to tell whether your brand needs a full rebrand or a careful refresh.",
  "how-much-does-brand-identity-design-cost": "What brand identity design costs in Canada, with real numbers and what changes them.",
  "how-to-brief-a-design-studio": "What to put in a design brief, what to leave out, and the mistake that derails most projects.",
  "why-your-brand-looks-different-everywhere": "What brand inconsistency costs a business, and how one identity system fixes it.",
  "ai-made-design-faster": "AI sped up production. Consistency still depends on creative direction.",
  "5-signs-your-brand-is-actively-costing-you": "Five signs your brand is working against the business instead of for it.",
  "what-ai-can-and-cannot-do-for-your-brand": "Where AI helps a design studio, and where the line sits for your brand.",
};

// The line for an article card: the configured line, otherwise the fallback (its SEO description).
export function articleLine(slug: string, fallback: string): string {
  const prefix = Object.keys(ARTICLE_LINES).find((p) => slug.startsWith(p));
  return prefix ? ARTICLE_LINES[prefix] : fallback;
}

// Case study discipline tags (as stored, or as display names) to the service each one demonstrates.
// Tags not listed here map to nothing.
const DISCIPLINE_SERVICE: Record<string, ServiceSlug> = {
  "brand identity": "brand-identity",
  logo: "brand-identity",
  packaging: "brand-identity",
  print: "brand-identity",
  website: "digital-design",
  ux: "digital-design",
  ui: "digital-design",
  digital: "digital-design",
  photography: "visual-media",
  video: "visual-media",
  "art direction": "visual-media",
  content: "visual-media",
  "social content": "visual-media",
  strategy: "creative-strategy",
  positioning: "creative-strategy",
  naming: "creative-strategy",
};

const normalise = (tag: string) => tag.trim().toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ");

const isServiceSlug = (value: unknown): value is ServiceSlug => typeof value === "string" && (SERVICE_SLUGS as readonly string[]).includes(value);

// The first slug that starts with the prefix, or undefined.
export function matchSlug(slugs: string[], prefix: string): string | undefined {
  return slugs.find((s) => s.startsWith(prefix));
}

// The services a case study demonstrates, from its discipline tags, in the site's service order.
export function servicesForDisciplines(tags: unknown): ServiceSlug[] {
  if (!Array.isArray(tags)) return [];
  const found = new Set(tags.filter((t): t is string => typeof t === "string").map((t) => DISCIPLINE_SERVICE[normalise(t)]).filter(Boolean));
  return SERVICE_SLUGS.filter((s) => found.has(s));
}

// Up to three articles for a service page, in the configured order, by slug prefix.
export function relatedThinking<T extends { slug: string }>(service: string, posts: T[]): T[] {
  const prefixes = isServiceSlug(service) ? RELATED_THINKING[service] : [];
  const out: T[] = [];
  for (const prefix of prefixes) {
    const post = posts.find((p) => p.slug.startsWith(prefix));
    if (post && !out.includes(post)) out.push(post);
  }
  return out.slice(0, 3);
}

// The services an article relates to: the ones set in Sanity (relatedServices), otherwise every
// service whose Related thinking list includes the article, otherwise brand identity.
export function servicesForArticle(slug: string, fromSanity: unknown = []): ServiceSlug[] {
  const set = Array.isArray(fromSanity) ? fromSanity.filter(isServiceSlug) : [];
  if (set.length > 0) return SERVICE_SLUGS.filter((s) => set.includes(s));
  const mapped = SERVICE_SLUGS.filter((s) => RELATED_THINKING[s].some((prefix) => slug.startsWith(prefix)));
  return mapped.length > 0 ? mapped : ["brand-identity"];
}

// Up to two case studies for an article: those chosen in Sanity first, then the newest that
// demonstrate one of the article's services, then the newest of all, so every article links to work.
export function relatedWork<T extends { slug: string; disciplines: string[] }>(services: ServiceSlug[], projects: T[], chosen: string[] = []): T[] {
  const out: T[] = [];
  const add = (p: T | undefined) => {
    if (p && out.length < 2 && !out.some((o) => o.slug === p.slug)) out.push(p);
  };
  chosen.forEach((slug) => add(projects.find((p) => p.slug === slug)));
  projects.filter((p) => servicesForDisciplines(p.disciplines).some((s) => services.includes(s))).forEach(add);
  projects.forEach(add);
  return out;
}

// The accessible name for a link to a service page whose visible text is short ("Learn More" or
// the service name): the visible text first, so speech input still matches it, then the page topic.
// The rest of a short link's text, for crawlers and screen readers alike: "about" and the page topic
// in running text ("about brand identity design and rebranding in Toronto"). It goes inside the link
// as visually hidden text after the visible words, so the link text and its accessible name are the
// same and start with what is on screen. Empty for an unknown service.
export function serviceLinkTopic(slug: string): string {
  const topic = getServiceBySlug(slug)?.seoH1;
  return topic ? ` about ${topic.charAt(0).toLowerCase()}${topic.slice(1)}` : "";
}

export function serviceLinkLabel(slug: string, visible: string): string {
  const topic = getServiceBySlug(slug)?.seoH1;
  return topic ? `${visible}: ${topic}` : visible;
}
