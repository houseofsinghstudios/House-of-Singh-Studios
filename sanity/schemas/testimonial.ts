import { defineType, defineField } from "sanity";
import { PROMISE_OPTIONS, PROMISE_TAKEN_QUERY, excerptError, keyPhraseError, promiseTakenError } from "../../src/lib/proof";

// Client testimonials. The homepage (03) Proof shows, for each promise, the published testimonial that
// supports it (its excerpt, with the key phrase on the marker band); without one it uses the
// testimonial written in the code (src/lib/constants/homepage-data.ts), so a chapter is never empty.
// The rules live in src/lib/proof.ts, shared with the site and its tests.
export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "The part of the quote shown in the homepage Proof section. Copy it exactly from the quote, word for word.",
      validation: (rule) => rule.required().custom((excerpt, context) => excerptError((context.document as { quote?: unknown } | undefined)?.quote, excerpt) ?? true),
    }),
    defineField({
      name: "keyPhrase",
      title: "Key phrase",
      type: "string",
      description: "The words that get the marker band in the homepage Proof section. Copy them exactly from the excerpt, word for word.",
      validation: (rule) => rule.required().custom((keyPhrase, context) => keyPhraseError((context.document as { excerpt?: unknown } | undefined)?.excerpt, keyPhrase) ?? true),
    }),
    defineField({
      name: "promise",
      title: "Promise",
      type: "string",
      description: "Which homepage Proof promise this testimonial supports. Optional. One published testimonial per promise; without one, the homepage uses the testimonial written in the code.",
      options: { list: PROMISE_OPTIONS, layout: "radio" },
      validation: (rule) =>
        rule.custom(async (promise, context) => {
          const client = context.getClient({ apiVersion: "2024-01-01" });
          const error = await promiseTakenError(promise, context.document?._id, (params) => client.fetch<number>(PROMISE_TAKEN_QUERY, params));
          return error ?? true;
        }),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "relatedCaseStudy",
      title: "Related Case Study",
      type: "reference",
      to: [{ type: "caseStudy" }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "author",
      subtitle: "company",
      media: "photo",
    },
  },
});
