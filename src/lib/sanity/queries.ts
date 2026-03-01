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

export async function getAllCaseStudies() {
  return client.fetch(
    `*[_type == "caseStudy"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      client,
      industry,
      services[]-> { _id, title, slug },
      year,
      overview,
      featuredImage,
      featured,
      publishedAt
    }`
  );
}

export async function getCaseStudyBySlug(slug: string) {
  return client.fetch(
    `*[_type == "caseStudy" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      client,
      industry,
      services[]-> { _id, title, slug },
      year,
      overview,
      challenge,
      approach,
      deliverables,
      results,
      featuredImage,
      gallery[] {
        _key,
        asset,
        alt,
        caption,
        hotspot,
        crop
      },
      testimonial,
      featured,
      seoTitle,
      seoDescription,
      publishedAt
    }`,
    { slug }
  );
}

export async function getAllPosts() {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      category,
      tags,
      publishedAt
    }`
  );
}

export async function getPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      category,
      tags,
      body[] {
        ...,
        _type == "image" => {
          ...,
          asset->
        }
      },
      relatedServices[]-> { _id, title, slug },
      relatedCaseStudies[]-> { _id, title, slug, featuredImage },
      seoTitle,
      seoDescription,
      publishedAt
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

export async function getFeaturedTestimonials() {
  return client.fetch(
    `*[_type == "testimonial" && featured == true] {
      _id,
      quote,
      author,
      role,
      company,
      photo
    }`
  );
}

export async function getTeamMembers() {
  return client.fetch(
    `*[_type == "teamMember"] | order(order asc) {
      _id,
      name,
      role,
      bio,
      photo,
      linkedin,
      order
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
