import { client } from "./client";
import { readSanity } from "./resilience";

export async function getAllServices() {
  return client.fetch(
    `*[_type == "service"] | order(order asc) {
      _id,
      title,
      slug,
      description,
      deliverables,
      featuredImage,
      order
    }`
  );
}

export async function getServiceBySlug(slug: string) {
  return client.fetch(
    `*[_type == "service" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      deliverables,
      processOverview,
      featuredImage,
      seoTitle,
      seoDescription,
      order
    }`,
    { slug }
  );
}

// A failed read in getAllPosts, getPostBySlug and getAllRoles follows readSanity (./resilience): the fallback only
// while building or without Sanity; at runtime the error is rethrown so the last good page stays.
export async function getAllPosts() {
  return readSanity("articles", () => client.fetch(
      // Card fields only: the whole list is sent to the browser for the filters, so the article
      // bodies stay on the server (the read time is worked out here from them).
      `*[_type == "post"] | order(featured desc, publishedAt desc) {
        _id,
        title,
        slug,
        featuredImage { alt, crop, hotspot, asset-> { _id } },
        category,
        "readingTime": round(length(pt::text(body)) / 5 / 200),
        publishedAt
      }`
  ), () => []);
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

export async function getAllPackages() {
  return client.fetch(
    `*[_type == "package"] | order(order asc) {
      _id,
      name,
      description,
      includes,
      idealFor,
      featured,
      order
    }`
  );
}

export async function getFeaturedCaseStudies() {
  return client.fetch(
    `*[_type == "caseStudy" && featured == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      client,
      industry,
      featuredImage,
      overview
    }`
  );
}

export async function getSiteSettings() {
  return client.fetch(
    `*[_type == "siteSettings"][0] {
      _id,
      studioName,
      tagline,
      description,
      email,
      phone,
      location,
      instagramUrl,
      linkedinUrl,
      ogImage
    }`
  );
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

export async function getRoleBySlug(slug: string) {
  return client.fetch(
    `*[_type == "role" && slug.current == $slug && isActive == true][0] {
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
    }`,
    { slug }
  );
}
