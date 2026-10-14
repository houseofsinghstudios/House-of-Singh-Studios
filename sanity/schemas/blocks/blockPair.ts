import { defineField, defineType } from "sanity";
import { truncate } from "./shared";

export default defineType({
  name: "blockPair",
  title: "Image pair",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "blockImage" }],
      description: "Exactly two images, shown side by side.",
      validation: (rule) => rule.required().length(2),
    }),
  ],
  preview: {
    select: { first: "images.0.alt", second: "images.1.alt", media: "images.0" },
    prepare: ({ first, second, media }) => ({
      title: "Image pair",
      subtitle: truncate([first, second].filter(Boolean).join(" + ")),
      media,
    }),
  },
});
