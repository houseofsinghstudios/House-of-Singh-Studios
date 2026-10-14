import { defineField, defineType } from "sanity";
import { bodyField } from "./shared";

export default defineType({
  name: "blockOffset",
  title: "Offset",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    bodyField({ required: true }),
    defineField({
      name: "image",
      title: "Image",
      type: "blockImage",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { heading: "heading", media: "image" },
    prepare: ({ heading, media }) => ({
      title: `Offset: ${heading || "Untitled"}`,
      media,
    }),
  },
});
