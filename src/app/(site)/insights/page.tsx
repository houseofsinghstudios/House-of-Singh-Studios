import type { Metadata } from "next";
import { DEFAULT_SHARE_IMAGE, WEBSITE_OG } from "@/lib/seo";
import { getInsightCards } from "@/lib/insights-cards";
import InsightsClient from "@/components/insights/InsightsClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Articles from a Toronto design studio on brand identity, rebranding, websites and what they cost in Canada, with real numbers and practical frameworks.',
  alternates: { canonical: 'https://studios.houseofsingh.com/insights' },
  openGraph: {
    ...WEBSITE_OG,
    title: 'Insights | House of Singh Studios',
    description: 'Articles from a Toronto design studio on brand identity, rebranding, websites and what they cost in Canada, with real numbers and practical frameworks.',
    url: 'https://studios.houseofsingh.com/insights',
    images: [DEFAULT_SHARE_IMAGE],
  },
};

export default async function InsightsPage() {
  // In listing order, the hero first, with the image URLs built on the server
  // (src/lib/insights-cards.ts, shared with /insights/page/N).
  const posts = await getInsightCards();

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
