import { client } from "./client";
import { readSanity } from "./resilience";
import { calculateReadTime, READ_TIME_BLOCKS } from "@/lib/read-time";

// Published documents only, the same filter in every query (and the client reads the published
// perspective as well): no drafts, no release versions.
const PUBLISHED = `!(_id in path("drafts.**")) && !(_id in path("versions.**"))`;

// An image asset with its size and placeholder, as article images and the About page read them.
const assetWithMetadata = `asset-> {
            _id,
            url,
            metadata { dimensions, lqip }
          }`;

// The previous and next article links under an article.
const adjacentPostFields = `title,
        slug,
        category`;

// A failed read in getAllPosts, getPostBySlug and getAllRoles follows readSanity (./resilience): the fallback only
// while building or without Sanity; at runtime the error is rethrown so the last good page stays.
// One article card for /insights, as sent to the browser (no body).
export interface PostCard {
  _id: string;
  title: string;
  slug: { current: string };
  featuredImage?: { alt?: string; crop?: { top: number; bottom: number; left: number; right: number }; hotspot?: { x: number; y: number }; asset?: { _id: string } };
  category?: string;
  publishedAt?: string;
  readingTime: number;
}

export async function getAllPosts(): Promise<PostCard[]> {
  return readSanity("articles", async () => {
    // Card fields only: the whole list is sent to the browser for the filters, so the article
    // bodies stay on the server. Only the text of the body blocks is fetched, the read time is
    // worked out from it here exactly as on the article, and the text is dropped.
    const posts = await client.fetch<Array<Omit<PostCard, "readingTime"> & { readBody?: Parameters<typeof calculateReadTime>[0] }>>(
      `*[_type == "post" && ${PUBLISHED}] | order(featured desc, publishedAt desc) {
        _id,
        title,
        slug,
        featuredImage { alt, crop, hotspot, asset-> { _id } },
        category,
        ${READ_TIME_BLOCKS},
        publishedAt
      }`
    );
    return (posts || []).map(({ readBody, ...post }) => ({ ...post, readingTime: calculateReadTime(readBody) }));
  }, () => []);
}

// A related post card: title, date, category and image.
const relatedCardFields = `_id,
        title,
        slug,
        publishedAt,
        category,
        featuredImage {
          ...,
          ${assetWithMetadata}
        }`;

// An article as getPostBySlug reads it (before the page builds the image URLs).
export interface ArticleImage {
  _type?: string;
  asset?: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number }; lqip?: string } };
  alt?: string;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number };
}
export interface ArticleLink {
  title: string;
  slug: { current: string };
  category?: string;
}
export interface ArticleCardDoc extends ArticleLink {
  _id: string;
  publishedAt?: string;
  featuredImage?: ArticleImage;
}
export type ArticleBodyBlock = { _type: string; _key?: string; children?: Array<{ text?: string }> } & ArticleImage;
type Reference = { _id: string; title?: string; slug?: { current?: string } } | null;
export interface ArticleDoc {
  _id: string;
  title: string;
  slug: { current: string };
  featuredImage?: ArticleImage;
  category?: string;
  tags?: string[];
  keyTakeaways?: string[];
  body?: ArticleBodyBlock[];
  relatedServices?: Reference[] | null;
  relatedCaseStudies?: Reference[] | null;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  _updatedAt?: string;
  previousPost?: ArticleLink | null;
  nextPost?: ArticleLink | null;
  chosenPosts?: (ArticleCardDoc | null)[] | null;
  latestPosts?: ArticleCardDoc[] | null;
}

export async function getPostBySlug(slug: string): Promise<ArticleDoc | null> {
  return readSanity(`article "${slug}"`, () => client.fetch<ArticleDoc | null>(
    `*[_type == "post" && slug.current == $slug && ${PUBLISHED}][0] {
      _id,
      title,
      slug,
      featuredImage {
        ...,
        ${assetWithMetadata}
      },
      category,
      tags,
      keyTakeaways,
      body[] {
        ...,
        _type == "image" => {
          ...,
          ${assetWithMetadata}
        }
      },
      relatedServices[]-> { _id, title, slug },
      relatedCaseStudies[]-> { _id, title, slug, featuredImage },
      seoTitle,
      seoDescription,
      publishedAt,
      _updatedAt,
      "previousPost": *[_type == "post" && publishedAt < ^.publishedAt && ${PUBLISHED}] | order(publishedAt desc) [0] {
        ${adjacentPostFields}
      },
      "nextPost": *[_type == "post" && publishedAt > ^.publishedAt && ${PUBLISHED}] | order(publishedAt asc) [0] {
        ${adjacentPostFields}
      },
      // The editor's hand picked related posts, in their order, and the latest three others as the
      // fallback; src/lib/related-posts.ts decides which are shown.
      "chosenPosts": relatedPosts[]-> {
        ${relatedCardFields}
      },
      "latestPosts": *[_type == "post" && _id != ^._id && ${PUBLISHED}] | order(publishedAt desc) [0...3] {
        ${relatedCardFields}
      }
    }`,
    { slug }
    // Never a fallback "not found" for a failed read: the error stands, even while building.
  ), (error) => { throw error; });
}

// The founder portrait from Site Settings (the About page image) as its absolute Sanity CDN URL, for
// the founder's structured data on every page. Refreshed daily. Deliberately forgiving: a failed
// read means no image in the structured data, never a failed or stale page.
const founderImageQuery = `*[_type == "siteSettings" && ${PUBLISHED}][0].aboutFounderImage.asset->url`;

export async function getFounderImageUrl(): Promise<string | undefined> {
  try {
    const url: unknown = await client.fetch(founderImageQuery, {}, { next: { revalidate: 86400 } });
    return typeof url === "string" && url.startsWith("https://cdn.sanity.io/") ? url : undefined;
  } catch {
    return undefined;
  }
}

export const aboutPageQuery = `*[_type == "siteSettings" && ${PUBLISHED}][0]{
  aboutStudioImage{
    asset->{_id, url, metadata{dimensions, lqip}},
    hotspot,
    crop
  },
  aboutFounderImage{
    asset->{_id, url, metadata{dimensions, lqip}},
    hotspot,
    crop
  },
  aboutFounderName,
  aboutFounderRole,
  aboutFounderBio,
  aboutFounderBioSecondary
}`;

export async function getAllRoles() {
  return readSanity("open roles", () => client.fetch(
    `*[_type == "role" && isActive == true && ${PUBLISHED}] | order(order asc, publishedAt desc) {
      _id,
      title,
      slug,
      department,
      type,
      location,
      summary,
      description,
      responsibilities,
      requirements,
      niceToHave,
      publishedAt
    }`
  ), () => []);
}
