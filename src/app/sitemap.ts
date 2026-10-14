import { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";
import { services } from "@/data/services";

// Rebuilt hourly, so a newly published project or article appears without a redeploy.
export const revalidate = 3600;

const baseUrl = "https://studios.houseofsingh.com";

// Static public pages. No lastModified: a build date would claim changes that never happened.
const staticPages = ["", "/about", "/ai", "/careers", "/contact", "/insights", "/packages", "/privacy", "/services", "/terms", "/work"];

// Published documents only. Drafts and release versions are unpublished and never listed.
// The legacy fallback projects in src/data/projects.ts are deliberately not listed either.
const sitemapQuery = `{
  "caseStudies": *[_type == "caseStudy" && defined(slug.current) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{ "slug": slug.current, _updatedAt },
  "posts": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{ "slug": slug.current, _updatedAt }
}`;

type SitemapDoc = { slug: string; _updatedAt?: string };

function changeFrequency(path: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (path === "") return "weekly";
  if (path === "/privacy" || path === "/terms") return "yearly";
  return "monthly";
}

function priority(path: string): number {
  if (path === "") return 1.0;
  if (path === "/services" || path === "/work" || path === "/contact") return 0.9;
  if (path === "/privacy" || path === "/terms") return 0.3;
  return 0.7;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = new Map<string, MetadataRoute.Sitemap[number]>();
  const add = (path: string, lastModified?: string) => {
    const url = `${baseUrl}${path}`;
    if (entries.has(url)) return;
    entries.set(url, {
      url,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: changeFrequency(path),
      priority: priority(path),
    });
  };

  staticPages.forEach((path) => add(path));
  services.forEach((service) => add(`/services/${service.slug}`));

  // If Sanity is unreachable the sitemap still serves the pages above, and retries next hour.
  try {
    const { caseStudies, posts } = await client.fetch<{ caseStudies: SitemapDoc[]; posts: SitemapDoc[] }>(
      sitemapQuery,
      {},
      { next: { revalidate } }
    );
    (caseStudies || []).forEach((doc) => add(`/work/${doc.slug}`, doc._updatedAt));
    (posts || []).forEach((doc) => add(`/insights/${doc.slug}`, doc._updatedAt));
  } catch (error) {
    console.warn("[sitemap] Sanity fetch failed, serving static and services pages only:", error);
  }

  return [...entries.values()];
}
