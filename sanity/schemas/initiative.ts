import { defineArrayMember, defineType, defineField } from "sanity";

// A studio led program shown under /initiatives (Parallel, Commons, Foundry).
// The status list must match src/lib/initiatives/types.ts. "hidden" never renders anywhere:
// not on /initiatives, not in the sitemap, and its page returns 404.
export default defineType({
  name: "initiative",
  title: "Initiative",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The program name, for example Parallel.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The web address: /initiatives/<slug>. Changing this after publishing breaks existing links. Add a redirect below if you change it.",
      options: { source: "name", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Shown in the label style above the name, for example Brands reimagined.",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "One short line, for example One brand. Another possibility.",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Two sentences, shown on the /initiatives page.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Hidden: never shown anywhere, and its page returns 404.",
      options: {
        list: [
          { title: "Live", value: "live" },
          { title: "Nominations open", value: "nominations-open" },
          { title: "Opening soon", value: "opening-soon" },
          { title: "By invitation", value: "by-invitation" },
          { title: "Hidden", value: "hidden" },
        ],
        layout: "radio",
      },
      initialValue: "hidden",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "statusLabel",
      title: "Status label",
      type: "string",
      description: "Optional. Replaces the status text, for example Nominations open for 2027.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Position on /initiatives. Lower numbers come first.",
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: "hasPage",
      title: "Has its own page",
      type: "boolean",
      description: "Whether /initiatives/<slug> exists. The page also needs to be built in the site code.",
      initialValue: false,
    }),
    defineField({
      name: "atAGlance",
      title: "At a glance",
      type: "array",
      description: "Up to three short facts, for example 3 projects a year. Shown along the bottom of this program's panel on /initiatives, and as a short list on phones.",
      of: [
        defineArrayMember({
          name: "glanceItem",
          title: "Fact",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Optional. A small label shown before the value, for example Format.",
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: "The fact itself, a few words.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "recognitions",
      title: "Recognitions",
      type: "array",
      description: "Commons only. Organizations the studio has done pro bono work for, shown as logos in the Pro bono work section, in the order entered here. Without any, the logos are not shown.",
      hidden: ({ document }) => (document?.slug as { current?: string } | undefined)?.current !== "commons",
      of: [
        defineArrayMember({
          name: "recognition",
          title: "Recognition",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Organization name",
              type: "string",
              description: "Shown beneath the logo.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "year",
              title: "Year",
              type: "number",
              description: "The year of the work, for example 2026. Logos are grouped by year.",
              validation: (rule) => rule.integer().min(2000).max(2100),
            }),
            defineField({
              name: "logo",
              title: "Logo",
              type: "image",
              description: "Shown as uploaded, at the same height as the other logos. No recolouring.",
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                  description: "For example: Northfield Food Bank logo.",
                  validation: (rule) => rule.required(),
                }),
              ],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "name", subtitle: "year", media: "logo" } },
        }),
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      description: "Optional. Without it the page uses its built in title.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
      description: "Optional. Without it the page uses its built in description.",
      validation: (rule) => rule.max(160),
    }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", status: "status", order: "order" },
    prepare: ({ title, status, order }) => ({ title, subtitle: `${order ?? ""} ${status ?? ""}`.trim() }),
  },
});
