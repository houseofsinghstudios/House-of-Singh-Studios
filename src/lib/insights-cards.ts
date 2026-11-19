// Every published post as an Insights card, in listing order (src/lib/insights-listing.ts), with
// the image URLs built here so no Sanity code reaches the browser. Read by /insights and
// /insights/page/N, so both pages always agree on the order.

import type { SanityImageSource } from "@sanity/image-url";
import { getAllPosts, type PostCard } from "@/lib/sanity/queries";
import { insightImageUrl } from "@/lib/sanity/image";
import { orderForListing } from "@/lib/insights-listing";
import type { InsightCard } from "@/components/insights/InsightCards";

type ListedPost = Omit<PostCard, "featuredImage"> & { featuredImage?: SanityImageSource & { asset?: unknown; alt?: string } };

// Any post can become the hero once a filter is chosen, so each carries both image sizes.
const toCard = ({ featuredImage, ...post }: ListedPost): InsightCard => ({
  ...post,
  ...(featuredImage?.asset
    ? { featuredImage: { alt: featuredImage.alt, featuredUrl: insightImageUrl.featured(featuredImage), cardUrl: insightImageUrl.card(featuredImage) } }
    : {}),
});

export async function getInsightCards(): Promise<InsightCard[]> {
  const posts = ((await getAllPosts()) || []) as ListedPost[];
  return orderForListing(posts.map(toCard));
}
