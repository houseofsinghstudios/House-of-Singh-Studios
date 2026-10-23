import { defineType, defineField, defineArrayMember } from "sanity";

// The four studio services. Shared by serviceCategories and the legacy serviceCategory field.
const SERVICE_CATEGORY_OPTIONS = [
  { title: "Brand Identity and Visual Design", value: "brand-identity" },
  { title: "Visual Media and Content Production", value: "visual-media" },
  { title: "Digital Design and Experience", value: "digital-design" },
  { title: "Creative Strategy and Systems", value: "creative-strategy" },
];

export default defineType({
  name: "caseStudy",
  title: "Project",
  type: "document",
  fieldsets: [
    {
      name: "legacy",
      title: "Legacy content",
      description:
        "Only used when Page Blocks is empty. Kept so older projects keep rendering. Will be removed once every project uses blocks.",
      options: { collapsible: true, collapsed: true },
    },
  ],
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
      name: "projectType",
      title: "Project type",
      type: "string",
      description:
        "Exploration: self initiated work for an invented brand. Parallel: a real business reimagined with written permission. Commons: pro bono work.",
      options: {
        // Must match src/lib/initiatives/types.ts and scripts/import-portfolio/lib/config.mjs.
        list: [
          { title: "Client", value: "client" },
          { title: "Exploration", value: "exploration" },
          { title: "Parallel", value: "parallel" },
          { title: "Commons", value: "commons" },
        ],
        layout: "radio",
      },
      // New projects start as client work. Existing projects have no value and read as client.
      initialValue: "client",
    }),
    defineField({
      name: "serviceCategories",
      title: "Service Categories",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Every studio service this project covers. The project appears under each one on the /services page.",
      options: {
        list: SERVICE_CATEGORY_OPTIONS,
        layout: "grid",
      },
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "serviceCategory",
      title: "Service Category",
      type: "string",
      description: "Replaced by Service Categories. Kept so older projects keep working.",
      options: {
        list: SERVICE_CATEGORY_OPTIONS,
      },
      fieldset: "legacy",
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
      name: "workDelivered",
      title: "Work actually delivered",
      type: "array",
      description: "Tick only what was genuinely delivered for this project. Used to choose proof in the Project Planner.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Identity", value: "identity" },
          { title: "Strategy", value: "strategy" },
          { title: "Website design", value: "website_design" },
          { title: "Website build", value: "website_build" },
          { title: "Photography", value: "photography" },
          { title: "Video", value: "video" },
          { title: "Packaging", value: "packaging" },
          { title: "Print", value: "print" },
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
      fieldset: "legacy",
    }),
    defineField({
      name: "approach",
      title: "Approach",
      type: "array",
      of: [{ type: "block" }],
      fieldset: "legacy",
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
      fieldset: "legacy",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description:
            "Describe the image for people using screen readers. Leave empty to use the project title.",
        }),
      ],
    }),
    defineField({
      name: "blocks",
      title: "Page Blocks",
      type: "array",
      description: "The body of the project page, top to bottom. Pick a block, fill it, reorder by dragging.",
      of: [
        { type: "blockSplit" },
        { type: "blockOffset" },
        { type: "blockFull" },
        { type: "blockPair" },
        { type: "blockStatement" },
        { type: "blockFeature" },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      fieldset: "legacy",
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
