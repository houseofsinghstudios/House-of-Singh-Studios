import type { Metadata } from "next";
import { DEFAULT_SHARE_IMAGE, WEBSITE_OG } from "@/lib/seo";
import { getAllPosts } from "@/lib/sanity/queries";
import type { SanityImageSource } from "@sanity/image-url";
import InsightsClient, { type InsightCard } from "@/components/insights/InsightsClient";
import { insightImageUrl } from "@/lib/sanity/image";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Articles from a Toronto design studio on brand identity, rebranding, websites and what they cost in Canada, with real numbers and practical frameworks.',
  alternates: { canonical: 'https://studios.houseofsingh.com/insights' },
  openGraph: {
    ...WEBSITE_OG,
    title: 'Insights — House of Singh Studios',
    description: 'Articles from a Toronto design studio on brand identity, rebranding, websites and what they cost in Canada, with real numbers and practical frameworks.',
    url: 'https://studios.houseofsingh.com/insights',
    images: [DEFAULT_SHARE_IMAGE],
  },
};

type ListedPost = Omit<InsightCard, "featuredImage"> & { featuredImage?: SanityImageSource & { asset?: unknown; alt?: string } };

export default async function InsightsPage() {
  // Image URLs are built here, so no Sanity code reaches the browser. Any post can become the
  // featured one when a filter is chosen, so each carries both sizes.
  const posts: InsightCard[] = ((await getAllPosts()) || []).map(({ featuredImage, ...post }: ListedPost) => ({
    ...post,
    ...(featuredImage?.asset
      ? { featuredImage: { alt: featuredImage.alt, featuredUrl: insightImageUrl.featured(featuredImage), cardUrl: insightImageUrl.card(featuredImage) } }
      : {}),
  }));

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Insights', url: 'https://studios.houseofsingh.com/insights' },
      ]} />
      <InsightsClient posts={posts} />
    </>
  );
}
