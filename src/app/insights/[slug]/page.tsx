import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/sanity/queries";
import InsightArticleClient from "@/components/insights/InsightArticleClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description:
      post.seoDescription ||
      "Insights from House of Singh Studios.",
    alternates: { canonical: `https://studios.houseofsingh.com/insights/${slug}` },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || "Insights from House of Singh Studios.",
      url: `https://studios.houseofsingh.com/insights/${slug}`,
      images: post.featuredImage?.asset?.url
        ? [{ url: post.featuredImage.asset.url }]
        : [],
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://studios.houseofsingh.com' },
        { name: 'Insights', url: 'https://studios.houseofsingh.com/insights' },
        { name: post.title, url: `https://studios.houseofsingh.com/insights/${post.slug.current}` },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description:
              post.keyTakeaways && post.keyTakeaways.length > 0
                ? post.keyTakeaways.join(" ").slice(0, 200)
                : post.seoDescription || "Insights from House of Singh Studios.",
            image: post.featuredImage?.asset?.url || "",
            datePublished: post.publishedAt,
            author: {
              "@type": "Person",
              name: "Maninder Singh",
              url: "https://houseofsingh.com",
            },
            publisher: {
              "@type": "Organization",
              name: "House of Singh Studios",
              url: "https://studios.houseofsingh.com",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://studios.houseofsingh.com/insights/${post.slug.current}`,
            },
            ...(post.keyTakeaways && post.keyTakeaways.length > 0
              ? {
                  about: {
                    "@type": "ItemList",
                    name: "Key Takeaways",
                    itemListElement: post.keyTakeaways.map(
                      (t: string, i: number) => ({
                        "@type": "ListItem",
                        position: i + 1,
                        name: t,
                      })
                    ),
                  },
                }
              : {}),
          }),
        }}
      />
      <InsightArticleClient post={post} />
    </>
  );
}
