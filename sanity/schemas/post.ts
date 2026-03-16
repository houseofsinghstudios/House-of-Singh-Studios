import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "post",
  title: "Insight",
  type: "document",
  fields: [
    // ── Top section ──────────────────────────────────────────────
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
      title: "Featured Post",
      description: "Pin this post to the top of the Insights page.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "House of Singh Studios",
    }),

    // ── Media and meta section ───────────────────────────────────
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
        }),
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Design", value: "design" },
          { title: "Branding", value: "branding" },
          { title: "AI", value: "ai" },
          { title: "Strategy", value: "strategy" },
          { title: "Business", value: "business" },
          { title: "Process", value: "process" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description:
        "Keywords for this post (e.g. AI, Brand Strategy, Design Systems).",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    // ── Main content ─────────────────────────────────────────────
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule) =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  }),
                ],
              },
            ],
          },
        }),
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

    // ── Relationships ────────────────────────────────────────────
    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      description:
        "Select 2-3 related posts to show at the bottom of this article.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "post" }],
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "relatedServices",
      title: "Related Services",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "service" }],
        }),
      ],
    }),
    defineField({
      name: "relatedCaseStudies",
      title: "Related Case Studies",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "caseStudy" }],
        }),
      ],
    }),

    // ── SEO ──────────────────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      description:
        "Custom title for search engines. Falls back to the post title if empty.",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      description:
        "Custom meta description for search engines. Falls back to excerpt if empty.",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
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
