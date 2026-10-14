import { defineField, defineType } from "sanity";
import { bodyField, truncate } from "./shared";

export default defineType({
  name: "blockStatement",
  title: "Statement",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      description: "Shown large. One or two sentences.",
      validation: (rule) => rule.required(),
    }),
    bodyField({
      required: false,
      description: "Optional supporting text shown small beside the statement.",
    }),
  ],
  preview: {
    select: { quote: "quote" },
    prepare: ({ quote }) => ({
      title: `Statement: ${truncate(quote) || "Untitled"}`,
    }),
  },
});
