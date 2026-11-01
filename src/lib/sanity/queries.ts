import { client } from "./client";
import { readSanity } from "./resilience";
import { calculateReadTime, READ_TIME_BLOCKS } from "@/lib/read-time";

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
      `*[_type == "post"] | order(featured desc, publishedAt desc) {
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
          asset-> {
            _id,
            url,
            metadata { dimensions, lqip }
          }
        }`;

export async function getPostBySlug(slug: string) {
  return readSanity(`article "${slug}"`, () => client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      featuredImage {
        ...,
        asset-> {
          _id,
          url,
          metadata { dimensions, lqip }
        }
      },
      category,
      tags,
      keyTakeaways,
      body[] {
        ...,
        _type == "image" => {
          ...,
          asset-> {
            _id,
            url,
            metadata { dimensions, lqip }
          }
        }
      },
      relatedServices[]-> { _id, title, slug },
      relatedCaseStudies[]-> { _id, title, slug, featuredImage },
      seoTitle,
      seoDescription,
      publishedAt,
      _updatedAt,
      "previousPost": *[_type == "post" && publishedAt < ^.publishedAt] | order(publishedAt desc) [0] {
        title,
        slug,
        category
      },
      "nextPost": *[_type == "post" && publishedAt > ^.publishedAt] | order(publishedAt asc) [0] {
        title,
        slug,
        category
      },
      // The editor's hand picked related posts, in their order, and the latest three others as the
      // fallback; src/lib/related-posts.ts decides which are shown.
      "chosenPosts": relatedPosts[]-> {
        ${relatedCardFields}
      },
      "latestPosts": *[_type == "post" && _id != ^._id] | order(publishedAt desc) [0...3] {
        ${relatedCardFields}
      }
    }`,
    { slug }
    // Never a fallback "not found" for a failed read: the error stands, even while building.
  ), (error) => { throw error; });
}

export const aboutPageQuery = `*[_type == "siteSettings"][0]{
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
    `*[_type == "role" && isActive == true] | order(order asc, publishedAt desc) {
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
