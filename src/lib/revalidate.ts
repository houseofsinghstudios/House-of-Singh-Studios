// What the Sanity webhook (src/app/api/revalidate/route.ts) refreshes when content is published,
// changed or deleted. Every page reads Sanity somewhere (articles, case studies, testimonials,
// prices, settings, the founder portrait in every page's structured data), so the whole site is
// refreshed rather than a list of pages that would drift out of date. The sitemap and llms.txt are
// route handlers, named as well so they never wait for their hourly refresh.
export type RevalidateTarget = { path: string; type?: "layout" | "page" };

export const REVALIDATE_TARGETS: readonly RevalidateTarget[] = [
  { path: "/", type: "layout" },
  { path: "/sitemap.xml" },
  { path: "/llms.txt" },
];

// The webhook's signature check answer: true only for a signature that matched the secret.
// next-sanity answers null when the signature header is missing; that is refused too.
export const signatureAccepted = (isValidSignature: boolean | null): boolean => isValidSignature === true;
