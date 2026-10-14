import { defineField, defineType } from "sanity";
import { truncate } from "./shared";

export default defineType({
  name: "blockFull",
  title: "Full width image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
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
      title: "Full width image",
      subtitle: truncate(caption || alt),
      media,
    }),
  },
});
