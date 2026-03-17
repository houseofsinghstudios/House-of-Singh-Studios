import type { Metadata } from "next";
import { getAllPosts } from "@/lib/sanity/queries";
import InsightsClient from "@/components/insights/InsightsClient";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Insights — House of Singh Studios",
  description:
    "Thinking, frameworks, and perspective on brand, design, and creative systems.",
};

export default async function InsightsPage() {
  const posts = await getAllPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://studios.houseofsingh.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Insights",
                item: "https://studios.houseofsingh.com/insights",
              },
            ],
          }),
        }}
      />
      <InsightsClient posts={posts || []} />
    </>
  );
}
