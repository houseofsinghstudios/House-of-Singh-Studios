import { defineField, defineType } from "sanity";
import { bodyField } from "./shared";

export default defineType({
  name: "blockSplit",
  title: "Split",
  type: "object",
  fields: [
    defineField({
      name: "side",
      title: "Image side",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "left",
    }),
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
    select: { side: "side", heading: "heading", media: "image" },
    prepare: ({ side, heading, media }) => ({
      title: `Split, image ${side === "right" ? "right" : "left"}: ${heading || "Untitled"}`,
      media,
    }),
  },
});
