import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { DEFAULT_SHARE_IMAGE, WEBSITE_OG } from "@/lib/seo";
import { getInsightCards } from "@/lib/insights-cards";
import { archivePageNumber, pageCount, pageHref, parsePageNumber, postsForPage } from "@/lib/insights-listing";
import { InsightGridCard } from "@/components/insights/InsightCards";
import InsightsCta from "@/components/insights/InsightsCta";
import NextPageLink from "@/components/layout/NextPageLink";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import "@/components/insights/insights.css";

// The Insights archive, page 2 onwards: the posts "Load more" reveals on /insights, as plain pages
// with plain links, so crawlers reach every post. Indexed and followed, each with its own title and
// canonical; deliberately not in the sitemap (src/app/sitemap.ts). Page 1 is /insights itself.
// Refreshed at most once a minute, and at once by the Sanity webhook (src/app/api/revalidate).
export const revalidate = 60;
export const dynamicParams = true;

const SITE = "https://studios.houseofsingh.com";

type Props = { params: Promise<{ page: string }> };

export async function generateStaticParams() {
  const pages = pageCount((await getInsightCards()).length);
  return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parsePageNumber((await params).page);
  if (!page || page < 2) return { title: "Insights" };
  const title = `Insights, Page ${page}`;
  const description = `Page ${page} of the House of Singh Studios Insights archive: articles from a Toronto design studio on brand identity, rebranding, websites and what they cost in Canada.`;
  const url = `${SITE}${pageHref(page)}`;
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: { ...WEBSITE_OG, title: `${title} | House of Singh Studios`, description, url, images: [DEFAULT_SHARE_IMAGE] },
  };
}

export default async function InsightsArchivePage({ params }: Props) {
  // /insights/page/1 never reaches this page: next.config.ts redirects it to /insights.
  const posts = await getInsightCards();
  const page = archivePageNumber((await params).page, posts.length);
  if (!page) notFound();
  const total = pageCount(posts.length);
  const pagePosts = postsForPage(posts, page);

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: SITE },
        { name: "Insights", url: `${SITE}/insights` },
        { name: `Page ${page}`, url: `${SITE}${pageHref(page)}` },
      ]} />
      <div>
        <section className="ins-hero">
          <p className="editorial-label css-reveal ins-hero-label">(Insights)</p>
          <h1 className="ins-heading css-reveal">Insights, Page {page}</h1>
          <p className="ins-sub css-reveal">Page {page} of {total}. On brand, design, and creative systems.</p>
        </section>

        <div className="ins-list">
          {/* Hidden: keeps the headings in order, h1 then h2 then the cards' h3. */}
          <h2 className="sr-only">Articles</h2>
          <div className="ins-grid">
            {pagePosts.map((post, i) => (
              <InsightGridCard key={post._id} post={post} index={i} />
            ))}
          </div>

          <nav className="ins-pager" aria-label="Insights pages">
            <Link href={pageHref(page - 1)} className="ins-load-more-btn no-underline">
              Newer articles
            </Link>
            {page < total && (
              <Link href={pageHref(page + 1)} className="ins-load-more-btn no-underline">
                Older articles
              </Link>
            )}
          </nav>
        </div>

        <NextPageLink current="/insights" />
        <InsightsCta />
      </div>
    </>
  );
}
