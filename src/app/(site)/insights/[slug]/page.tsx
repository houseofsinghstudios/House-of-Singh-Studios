import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/sanity/queries";
import { getPublishedArticleSlugs } from "@/lib/sanity/articles";
import InsightArticleClient from "@/components/insights/InsightArticleClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import BrandPulseArticleCta from "@/components/brand-pulse/BrandPulseArticleCta";
import { articleTitles, DEFAULT_SHARE_IMAGE, SITE_OG } from "@/lib/seo";
import { insightImageUrl, shareImageUrl } from "@/lib/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";
import { getProjectCards } from "@/lib/sanity/projects";
import { relatedWork, servicesForArticle } from "@/lib/linking";
import RelatedWork from "@/components/insights/RelatedWork";
import { SERVICE_TERMS, orgRef, personRef } from "@/lib/schema";
import { jsonLd } from "@/lib/json-ld";

type SlugRef = { slug?: { current?: string } } | null;
type WithImage = { asset?: unknown } & SanityImageSource;

// The image URLs, built here so no Sanity code reaches the browser: the hero, every image in the
// text and every related post's card, each as a plain src string beside the image it came from.
/* eslint-disable @typescript-eslint/no-explicit-any */
const withImageUrls = (post: any) => ({
  ...post,
  featuredImage: post.featuredImage?.asset ? { ...post.featuredImage, src: insightImageUrl.hero(post.featuredImage) } : post.featuredImage,
  body: post.body?.map((block: any) => (block._type === "image" && block.asset ? { ...block, src: insightImageUrl.body(block as WithImage) } : block)),
  relatedPosts: post.relatedPosts?.map((rp: any) =>
    rp.featuredImage?.asset ? { ...rp, featuredImage: { ...rp.featuredImage, src: insightImageUrl.card(rp.featuredImage) } } : rp),
});
/* eslint-enable @typescript-eslint/no-explicit-any */
const slugsOf = (refs: unknown): string[] =>
  Array.isArray(refs) ? refs.map((r: SlugRef) => r?.slug?.current).filter((s): s is string => typeof s === "string") : [];

// Incremental static regeneration: every published article is generated ahead and refreshed at
// most once a minute. An article published later is generated on its first visit. If Sanity fails
// during a refresh, the last good version keeps being served (src/lib/sanity/resilience.ts).
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPublishedArticleSlugs()).map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  // The SEO title, when set, is the whole search and social title; otherwise the article title
  // with the studio name. The twitter card copies the openGraph title.
  const titles = articleTitles(post.seoTitle, post.title);
  return {
    title: titles.title,
    description:
      post.seoDescription ||
      "Insights from House of Singh Studios.",
    alternates: { canonical: `https://studios.houseofsingh.com/insights/${slug}` },
    openGraph: {
      ...SITE_OG,
      title: titles.social,
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
          __html: jsonLd({
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
      <InsightArticleClient post={withImageUrls(post)} endCta={<BrandPulseArticleCta />} relatedWork={<RelatedWork projects={work} services={services.map((s) => ({ href: `/services/${s}`, label: SERVICE_TERMS[s] }))} />} />
    </>
  );
}
