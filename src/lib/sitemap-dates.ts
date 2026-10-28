// The sitemap's lastmod for pages written in code. Sanity pages (case studies, articles) use their
// own _updatedAt. When a page's content changes, update its date here in the same commit: a test
// fails if a code page is missing.

// Code pages listed in the sitemap, besides the service pages from src/data/services.ts.
export const STATIC_PAGES = ["", "/about", "/ai", "/brand-pulse", "/careers", "/contact", "/insights", "/partners", "/privacy", "/services", "/start", "/terms", "/work", "/initiatives"];

export const STATIC_LASTMOD: Record<string, string> = {
  "": "2026-10-28",
  "/about": "2026-10-28",
  "/ai": "2026-10-28",
  "/brand-pulse": "2026-10-28",
  "/careers": "2026-10-26",
  "/contact": "2026-10-26",
  "/insights": "2026-10-26",
  "/partners": "2026-10-26",
  "/privacy": "2026-10-26",
  "/services": "2026-10-28",
  "/start": "2026-10-26",
  "/terms": "2026-10-26",
  "/work": "2026-10-28",
  "/initiatives": "2026-10-26",
  "/initiatives/parallel": "2026-10-26",
  "/initiatives/commons": "2026-10-26",
  "/services/brand-identity": "2026-10-28",
  "/services/visual-media": "2026-10-28",
  "/services/digital-design": "2026-10-28",
  "/services/creative-strategy": "2026-10-28",
};

// A programme page added later takes the Initiatives date until it has its own.
export function staticLastmod(path: string): string | undefined {
  return STATIC_LASTMOD[path] ?? (path.startsWith("/initiatives/") ? STATIC_LASTMOD["/initiatives"] : undefined);
}
