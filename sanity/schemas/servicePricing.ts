import { defineType, defineField } from "sanity";

// Singleton: one document, _id "servicePricing". NOT READ BY THE SITE since 20 Nov 2026: the site
// never shows the studio's own prices, and the Project Planner ends in a call. The fields stay as they
// were, so the published document is untouched; the schema and the document can be removed later.

const priced = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { collapsible: false },
    fields: [
      defineField({
        name: "startsFrom",
        title: "Starts from (CAD, excluding HST)",
        type: "number",
        description: "Whole dollars. Required when shown on the site, and must be greater than zero.",
        validation: (rule) =>
          rule.custom((value, context) => {
            const parent = context.parent as { showOnSite?: boolean } | undefined;
            if (!parent?.showOnSite) return true;
            if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return "Enter a starting price greater than zero, or turn off Show on site.";
            return true;
          }),
      }),
      defineField({
        name: "showOnSite",
        title: "Show on site",
        type: "boolean",
        description: "Off: the planner says the investment will be confirmed instead of showing a figure.",
        initialValue: false,
      }),
    ],
  });

export default defineType({
  name: "servicePricing",
  title: "Service Pricing",
  type: "document",
  description: "Not used by the website since 20 Nov 2026: the site shows no studio prices. Kept for reference until it is removed.",
  fields: [
    defineField({
      name: "identity",
      title: "Brand identity",
      type: "object",
      description: "Not used by the website.",
      options: { collapsible: false },
      fields: [
        defineField({
          name: "showOnSite",
          title: "Show on site",
          type: "boolean",
          initialValue: false,
        }),
      ],
    }),
    priced("website", "Website"),
    priced("photo", "Photography"),
    priced("video", "Video"),
    priced("packaging", "Packaging design"),
    priced("strategy", "Strategy"),
  ],
  preview: {
    prepare: () => ({ title: "Service Pricing" }),
  },
});
