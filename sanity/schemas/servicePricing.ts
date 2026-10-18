import { defineType, defineField } from "sanity";
import { BRAND_FOUNDATION } from "../../src/data/packages";

// Singleton: one document, _id "servicePricing". Read by the Project Planner on the server.
// Brand identity has no number here: it always uses the Brand Foundation package price, the figure
// the Packages page shows, so the two can never disagree.

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
  description: "Starting prices shown in the Project Planner. Published changes follow the website's content refresh schedule.",
  fields: [
    defineField({
      name: "identity",
      title: "Brand identity",
      type: "object",
      description: `Uses the Brand Foundation package price shown on the Packages page (currently ${BRAND_FOUNDATION.price}). That price is set with the packages, not here. This switch only decides whether it is shown in the planner.`,
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
