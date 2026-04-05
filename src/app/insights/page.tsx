import type { Metadata } from "next";
import { getAllPosts } from "@/lib/sanity/queries";
import InsightsClient from "@/components/insights/InsightsClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Thinking, frameworks, and perspective on brand, design, and creative systems from House of Singh Studios.',
  alternates: { canonical: 'https://studios.houseofsingh.com/insights' },
  openGraph: {
    title: 'Insights — House of Singh Studios',
    description: 'Thinking, frameworks, and perspective on brand, design, and creative systems.',
    url: 'https://studios.houseofsingh.com/insights',
  },
};

export default async function InsightsPage() {
  const posts = await getAllPosts();

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Insights', url: 'https://studios.houseofsingh.com/insights' },
      ]} />
      <InsightsClient posts={posts || []} />
    </>
  );
}
