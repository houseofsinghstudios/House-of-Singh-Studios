import { defineType, defineField } from "sanity";

// Site Settings. Only the About page fields are read (src/lib/sanity/queries.ts). The studio details,
// social links and default share image are hidden: the site takes them from the code. Hidden, not
// deleted, so their data stays.
export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "studioName",
      title: "Studio Name",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      hidden: true,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      hidden: true,
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      hidden: true,
    }),
    defineField({
      name: "ogImage",
      title: "Default OG Image",
      type: "image",
      description:
        "Default social sharing image used when no page-specific image is set.",
      hidden: true,
    }),
    defineField({
      name: "aboutStudioImage",
      title: "About Page — Studio Image",
      type: "image",
      options: { hotspot: true },
      description: "Full-width image shown on the About page between sections. Recommended: landscape, minimum 1600px wide.",
    }),
    defineField({
      name: "aboutFounderImage",
      title: "About Page — Founder Portrait",
      type: "image",
      options: { hotspot: true },
      description: "Founder portrait shown on the About page. Recommended: 4:5 portrait ratio, minimum 960px wide.",
    }),
    defineField({
      name: "aboutFounderName",
      title: "About Page — Founder Name",
      type: "string",
    }),
    defineField({
      name: "aboutFounderRole",
      title: "About Page — Founder Role",
      type: "string",
      description: "When empty, the About page shows the text written in the code.",
    }),
    defineField({
      name: "aboutFounderBio",
      title: "About Page — Founder Bio",
      type: "text",
      rows: 6,
      description: "Main founder biography paragraph. When empty, the About page shows the text written in the code.",
    }),
    defineField({
      name: "aboutFounderBioSecondary",
      title: "About Page — Founder Bio (secondary)",
      type: "text",
      rows: 3,
      description: "Second paragraph. When empty, the About page shows the text written in the code.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
