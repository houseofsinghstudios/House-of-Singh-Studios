// Initiatives from Sanity, with the copy in src/lib/initiatives/content.ts as the fallback.
// Published documents only. When Sanity has at least one initiative it is the source of truth;
// when it cannot be reached or has none yet, the fallback list is used. Empty copy fields keep the fallback copy.
// Hidden initiatives are kept here and filtered by visibleInitiatives(), so nothing hidden ever reaches a page.
import { client } from "./client";
import { urlFor } from "./image";
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
  seoDescription,
  atAGlance[] { label, value },
  recognitions[] {
    name,
    year,
    "logo": logo { alt, asset, crop, hotspot, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }
  }
}`;

type Doc = Record<string, unknown> & { recognitions?: { logo?: Record<string, unknown> | null }[] | null };

// Logo URLs come from the shared image builder: the image as uploaded, no transforms.
function withLogoUrls(doc: Doc): Doc {
  if (!Array.isArray(doc.recognitions)) return doc;
  return {
    ...doc,
    recognitions: doc.recognitions.map((r) =>
      r?.logo?.asset ? { ...r, logo: { ...r.logo, url: urlFor(r.logo as Parameters<typeof urlFor>[0]).url() } } : r
    ),
  };
}

export async function getInitiatives(): Promise<Initiative[]> {
  try {
    const docs: unknown = await client.fetch(initiativesQuery);
    const list = Array.isArray(docs)
      ? docs.map((d) => toInitiative(withLogoUrls(d as Doc))).filter((i): i is Initiative => i !== null)
      : [];
    if (list.length > 0) return withFallbackCopy(list, FALLBACK_INITIATIVES);
  } catch (error) {
    console.error("[sanity/initiatives] Fetch failed, using fallback:", error instanceof Error ? error.name : "unknown error");
  }
  return FALLBACK_INITIATIVES;
}
