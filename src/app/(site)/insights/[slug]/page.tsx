import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/sanity/queries";
import InsightArticleClient from "@/components/insights/InsightArticleClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import BrandPulseArticleCta from "@/components/brand-pulse/BrandPulseArticleCta";
import { DEFAULT_SHARE_IMAGE, bareTitle, studioTitle } from "@/lib/seo";
import { shareImageUrl } from "@/lib/sanity/image";
import { getProjectCards } from "@/lib/sanity/projects";
import { relatedWork, servicesForArticle } from "@/lib/linking";
import RelatedWork from "@/components/insights/RelatedWork";
import { orgRef, personRef } from "@/lib/schema";

type SlugRef = { slug?: { current?: string } } | null;
const slugsOf = (refs: unknown): string[] =>
  Array.isArray(refs) ? refs.map((r: SlugRef) => r?.slug?.current).filter((s): s is string => typeof s === "string") : [];

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
    // The SEO title when set, otherwise the article title: the same choice og makes below.
    title: bareTitle(post.seoTitle, post.title),
    description:
      post.seoDescription ||
      "Insights from House of Singh Studios.",
    alternates: { canonical: `https://studios.houseofsingh.com/insights/${slug}` },
    openGraph: {
      title: studioTitle(bareTitle(post.seoTitle, post.title)),
      description: post.seoDescription || "Insights from House of Singh Studios.",
      url: `https://studios.houseofsingh.com/insights/${slug}`,
      // The article's image cropped to 1200x630, never the original upload; the default otherwise.
      images: post.featuredImage?.asset
        ? [{ url: shareImageUrl(post.featuredImage), width: 1200, height: 630, alt: post.title }]
        : [DEFAULT_SHARE_IMAGE],
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

  // "Related work": up to two case studies for the article's services (src/lib/linking.ts).
  const services = servicesForArticle(post.slug.current, slugsOf(post.relatedServices));
  const work = relatedWork(services, await getProjectCards(), slugsOf(post.relatedCaseStudies));

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
            dateModified: post._updatedAt || post.publishedAt,
            // The founder and the studio, defined once on every page in the site layout.
            author: personRef,
            publisher: orgRef,
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
      <InsightArticleClient post={post} endCta={<BrandPulseArticleCta />} relatedWork={<RelatedWork projects={work} />} />
    </>
  );
}
