import { defineType, defineField } from "sanity";

export default defineType({
  name: "role",
  title: "Open Role",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      description: "e.g. Senior Brand Designer",
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
      name: "department",
      title: "Department / Category",
      type: "string",
      options: {
        list: [
          { title: "Brand Identity and Visual Design", value: "brand-identity" },
          { title: "Visual Media and Content Production", value: "visual-media" },
          { title: "Digital Design and Experience", value: "digital-design" },
          { title: "Creative Strategy and Systems", value: "creative-strategy" },
          { title: "Operations", value: "operations" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Employment Type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "full-time" },
          { title: "Part-time", value: "part-time" },
          { title: "Contract", value: "contract" },
          { title: "Freelance", value: "freelance" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. Toronto / Remote, Remote, Toronto",
      initialValue: "Toronto / Remote",
    }),
    defineField({
      name: "summary",
      title: "Short Summary",
      type: "text",
      rows: 3,
      description:
        "One to two sentences shown on the listing card. Direct and specific.",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "description",
      title: "Full Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Full role description rendered with Portable Text on the page.",
    }),
    defineField({
      name: "responsibilities",
      title: "Responsibilities",
      type: "array",
      of: [{ type: "string" }],
      description: "List of key responsibilities. One per line.",
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      of: [{ type: "string" }],
      description: "List of requirements. One per line.",
    }),
    defineField({
      name: "niceToHave",
      title: "Nice to Have",
      type: "array",
      of: [{ type: "string" }],
      description: "Optional extras. One per line.",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Toggle off to hide the role without deleting it.",
      initialValue: true,
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first. Use to pin priority roles to the top.",
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "department",
      active: "isActive",
    },
    prepare(selection) {
      const { title, subtitle, active } = selection;
      return {
        title: `${active ? "" : "[HIDDEN] "}${title}`,
        subtitle,
      };
    },
  },
});
