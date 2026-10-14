import { defineField, defineType } from "sanity";
import { truncate } from "./shared";

export default defineType({
  name: "blockFeature",
  title: "Feature with detail",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Main image",
      type: "blockImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "detail",
      title: "Detail image",
      type: "blockImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: { caption: "caption", alt: "image.alt", media: "image" },
    prepare: ({ caption, alt, media }) => ({
      title: "Feature with detail",
      subtitle: truncate(caption || alt),
      media,
    }),
  },
});
