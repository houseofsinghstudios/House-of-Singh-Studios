import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "studioName",
      title: "Studio Name",
      type: "string",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "ogImage",
      title: "Default OG Image",
      type: "image",
      description:
        "Default social sharing image used when no page-specific image is set.",
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
    }),
    defineField({
      name: "aboutFounderBio",
      title: "About Page — Founder Bio",
      type: "text",
      rows: 6,
      description: "Main founder biography paragraph.",
    }),
    defineField({
      name: "aboutFounderBioSecondary",
      title: "About Page — Founder Bio (secondary)",
      type: "text",
      rows: 3,
      description: "Second paragraph, shown with lighter opacity.",
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
