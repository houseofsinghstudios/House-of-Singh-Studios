import { defineField, defineType } from "sanity";

// A specialist in the studio's network, shown as a card on /about under "The right people for every
// brief". The site shows the role and the photo (in black and white) only. internalName is for the
// studio's own reference and is never queried by the site.
export default defineType({
  name: "networkMember",
  title: "Network member",
  type: "document",
  fields: [
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Shown on the website under the photo, for example Brand Strategist.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      description: "Shown square and in black and white on the About page. Upload the original in colour; set the hotspot on the face.",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the photo, without the person's name. Read by screen readers and by Google.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "internalName",
      title: "Internal name",
      type: "string",
      description: "Not shown on the website.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Position on the About page. Lower numbers come first.",
      validation: (rule) => rule.integer(),
    }),
    defineField({
      name: "showOnWebsite",
      title: "Show on website",
      type: "boolean",
      description: "Switch off to hide this person without deleting them.",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { media: "photo", role: "role", internalName: "internalName", shown: "showOnWebsite" },
    prepare: ({ media, role, internalName, shown }) => ({
      media,
      title: role || "No role yet",
      subtitle: [internalName, shown === false ? "Hidden" : ""].filter(Boolean).join("  ·  ") || undefined,
    }),
  },
});
