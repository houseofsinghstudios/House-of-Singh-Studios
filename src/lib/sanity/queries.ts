import { client } from "./client";

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

export async function getAllPosts() {
  try {
    const posts = await client.fetch(
      `*[_type == "post"] | order(featured desc, publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
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
        body,
        featured,
        "readingTime": round(length(pt::text(body)) / 5 / 200),
        publishedAt
      }`
    );
    return posts;
  } catch (error) {
    console.error('Sanity fetch error:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
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
      "relatedPosts": *[_type == "post" && _id != ^._id] | order(publishedAt desc) [0...3] {
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
        category,
        featuredImage {
          ...,
          asset-> {
            _id,
            url,
            metadata { dimensions, lqip }
          }
        }
      }
    }`,
    { slug }
  );
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
  return client.fetch(
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
  );
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
