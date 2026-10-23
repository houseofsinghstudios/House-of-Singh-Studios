// Initiatives from Sanity, with the copy in src/lib/initiatives/content.ts as the fallback.
// Published documents only. When Sanity has at least one initiative it is the source of truth;
// when it cannot be reached or has none yet, the fallback list is used. Empty copy fields keep the fallback copy. Hidden initiatives are kept
// here and filtered by visibleInitiatives(), so nothing hidden ever reaches a page.
import { client } from "./client";
import { FALLBACK_INITIATIVES } from "@/lib/initiatives/content";
import { toInitiative, withFallbackCopy, type Initiative } from "@/lib/initiatives/types";

const initiativesQuery = `*[_type == "initiative" && defined(slug.current) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(order asc) {
  name,
  "slug": slug.current,
  category,
  tagline,
  summary,
  status,
  statusLabel,
  order,
  hasPage,
  seoTitle,
  seoDescription
}`;

export async function getInitiatives(): Promise<Initiative[]> {
  try {
    const docs: unknown = await client.fetch(initiativesQuery);
    const list = Array.isArray(docs) ? docs.map((d) => toInitiative(d as Record<string, unknown>)).filter((i): i is Initiative => i !== null) : [];
    if (list.length > 0) return withFallbackCopy(list, FALLBACK_INITIATIVES);
  } catch (error) {
    console.error("[sanity/initiatives] Fetch failed, using fallback:", error instanceof Error ? error.name : "unknown error");
  }
  return FALLBACK_INITIATIVES;
}
