// Starting prices for the Project Planner, read on the server from the Sanity "servicePricing"
// singleton. Server only: the page and the API route call this and pass the result to buildBrief.
//
// Rules:
//   request fails             -> "unavailable": every price hidden. Never fall back to defaults,
//                                which could hide a newer price or a showOnSite=false choice.
//   request works, no document -> "initial": the owner approved initial prices in config.ts.
//   published document         -> "sanity": a price shows only when showOnSite is true and the amount
//                                is a positive number. Brand identity always uses the Brand Foundation
//                                package price in src/data/packages.ts; Sanity only says whether to show it.
import "server-only";
import { BRAND_IDENTITY_STARTS_FROM, OWNER_APPROVED_INITIAL_PRICING } from "./config";
import { PRICED_SERVICES, type PricedService, type Pricing } from "./types";

export const SERVICE_PRICING_ID = "servicePricing";

const query = `*[_id == "${SERVICE_PRICING_ID}"][0]{
  "identity": identity{ showOnSite },
  "website": website{ startsFrom, showOnSite },
  "photo": photo{ startsFrom, showOnSite },
  "video": video{ startsFrom, showOnSite },
  "packaging": packaging{ startsFrom, showOnSite },
  "strategy": strategy{ startsFrom, showOnSite }
}`;

const positive = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : null);

export function pricingFromDocument(doc: unknown): Pricing {
  if (doc === null || doc === undefined) {
    return { source: "initial", prices: { identity: BRAND_IDENTITY_STARTS_FROM(), ...OWNER_APPROVED_INITIAL_PRICING } };
  }
  const d = doc as Record<string, { startsFrom?: unknown; showOnSite?: unknown } | null | undefined>;
  const prices = Object.fromEntries(
    PRICED_SERVICES.map((s) => {
      const entry = d[s];
      if (!entry || entry.showOnSite !== true) return [s, null];
      return [s, s === "identity" ? BRAND_IDENTITY_STARTS_FROM() : positive(entry.startsFrom)];
    })
  ) as Record<PricedService, number | null>;
  return { source: "sanity", prices };
}

export const UNAVAILABLE: Pricing = {
  source: "unavailable",
  prices: { identity: null, website: null, photo: null, video: null, packaging: null, strategy: null },
};

// Same refresh policy as the rest of the site's Sanity content: revalidated every 60 seconds.
// The Sanity client loads only when used, so tests can pass their own fetcher.
const sanityFetch = async (q: string): Promise<unknown> => {
  const { client } = await import("@/lib/sanity/client");
  return client.fetch(q, {}, { next: { revalidate: 60 } });
};

export async function loadPublishedPricing(fetcher: (q: string) => Promise<unknown> = sanityFetch): Promise<Pricing> {
  try {
    return pricingFromDocument(await fetcher(query));
  } catch (error) {
    console.warn("[project-planner] Service Pricing fetch failed, prices hidden:", error instanceof Error ? error.name : "unknown error");
    return UNAVAILABLE;
  }
}
