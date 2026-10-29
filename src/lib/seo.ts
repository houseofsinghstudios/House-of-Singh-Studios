// Page titles carry the studio name exactly once. The root layout's title template appends
// " — House of Singh Studios" to every page title, so stored titles must be bare.

export const STUDIO_NAME = "House of Singh Studios";

// A studio name typed by hand at either end, with " — ", " – ", " - ", " | " or ": " between, any case.
const STUDIO_SUFFIX = /\s*[—–|:-]\s*House of Singh Studios\s*$/i;
const STUDIO_PREFIX = /^\s*House of Singh Studios\s*[—–|:-]\s*/i;
const STUDIO_ONLY = /^\s*House of Singh Studios\s*$/i;

function stripStudio(title: string): string {
  let t = title;
  for (let previous = ""; previous !== t; ) {
    previous = t;
    t = t.replace(STUDIO_SUFFIX, "").replace(STUDIO_PREFIX, "");
  }
  return STUDIO_ONLY.test(t) ? "" : t.trim();
}

// The first candidate that still has words once any studio name at either end is removed.
// bareTitle(project.seoTitle, project.name): the SEO title if set, otherwise the name.
// A title that is only the studio name falls through to the next candidate.
export function bareTitle(...candidates: (string | null | undefined)[]): string {
  for (const candidate of candidates) {
    const title = stripStudio(candidate || "");
    if (title) return title;
  }
  return "";
}

// For Open Graph and Twitter, which do not use the title template: the bare title plus the studio name, once.
export function studioTitle(title: string): string {
  return `${bareTitle(title)} — ${STUDIO_NAME}`;
}

// The site wide default share image (og:image and the twitter card): the homepage picture, served
// at /share-image.png. Pages with a picture of their own (case studies, articles, Brand Pulse, the
// Project Planner and the homepage) use that instead. A page's openGraph replaces the layout's
// whole openGraph, images included, so every page that sets openGraph names this image itself.
export const DEFAULT_SHARE_IMAGE = {
  url: "/share-image.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "House of Singh Studios. Clear thinking, made visible. Brand identity and design studio in Toronto.",
};

// The openGraph fields every page carries. A page's openGraph replaces the layout's whole openGraph,
// so every page that sets one spreads these first: WEBSITE_OG on every page except articles, which
// spread SITE_OG and set type "article" themselves.
export const SITE_OG = { locale: "en_CA", siteName: STUDIO_NAME } as const;
export const WEBSITE_OG = { type: "website", ...SITE_OG } as const;

// Article titles: an SEO title set in Sanity is the complete search title, used exactly as written
// (absolute, so the template adds nothing), and the social title too. Without one, the article
// title gets the studio name once, as before.
export function articleTitles(seoTitle: string | null | undefined, title: string): { title: string | { absolute: string }; social: string } {
  const own = (seoTitle || "").trim();
  if (own) return { title: { absolute: own }, social: own };
  const bare = bareTitle(title);
  return { title: bare, social: studioTitle(bare) };
}
