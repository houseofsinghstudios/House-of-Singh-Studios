// The four service pages' names and page topics (their seoH1) by slug, for code that also runs in
// the browser: the Brand Pulse engine, and the link text in src/lib/linking.ts. The full service copy
// in src/data/services.ts then stays on the server.
// tests/service-names.test.ts keeps these equal to src/data/services.ts.

export const SERVICE_NAMES = {
  "brand-identity": "Brand Identity and Visual Design",
  "visual-media": "Visual Media and Content Production",
  "digital-design": "Digital Design and Experience",
  "creative-strategy": "Creative Strategy and Systems",
} as const;

export const SERVICE_TOPICS: Record<ServiceNameSlug, string> = {
  "brand-identity": "Brand identity design and rebranding in Toronto",
  "visual-media": "Brand photography and video production in Toronto",
  "digital-design": "Website design for brands in Toronto",
  "creative-strategy": "Brand strategy and positioning in Toronto",
};

export type ServiceNameSlug = keyof typeof SERVICE_NAMES;

// A service page's topic by slug, or undefined for anything else (own keys only, so a slug such as
// "toString" never finds an inherited property).
export function serviceTopic(slug: string): string | undefined {
  return Object.hasOwn(SERVICE_TOPICS, slug) ? SERVICE_TOPICS[slug as ServiceNameSlug] : undefined;
}
