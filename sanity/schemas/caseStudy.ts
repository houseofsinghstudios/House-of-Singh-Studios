import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "caseStudy",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Show on Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "serviceCategory",
      title: "Service Category",
      type: "string",
      description:
        "Which of the 4 studio services does this project belong to? Used on the /services page.",
      options: {
        list: [
          { title: "Brand Identity and Visual Design", value: "brand-identity" },
          { title: "Visual Media and Content Production", value: "visual-media" },
          { title: "Digital Design and Experience", value: "digital-design" },
          { title: "Creative Strategy and Systems", value: "creative-strategy" },
        ],
      },
    }),
    defineField({
      name: "disciplines",
      title: "Disciplines",
      type: "array",
      description:
        "What type of work was done? Select all that apply. Used as filters on the /work page.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Brand Identity", value: "brand-identity" },
          { title: "Packaging", value: "packaging" },
          { title: "Publication", value: "publication" },
          { title: "Art Direction", value: "art-direction" },
          { title: "Website", value: "website" },
          { title: "Video", value: "video" },
          { title: "Photography", value: "photography" },
          { title: "Social Content", value: "social-content" },
          { title: "Strategy", value: "strategy" },
        ],
      },
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "approach",
      title: "Approach",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "results",
      title: "Results",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "object",
      fields: [
        defineField({
          name: "quote",
          title: "Quote",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "author",
          title: "Author",
          type: "string",
        }),
        defineField({
          name: "role",
          title: "Role",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "client",
      media: "featuredImage",
    },
  },
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
