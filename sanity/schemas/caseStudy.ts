import { defineType, defineField, defineArrayMember } from "sanity";
import {
  heroImagesMessage,
  heroLengthMessage,
  heroRequiredMessage,
  heroWordCaseMessage,
} from "../../src/lib/homepage-hero";
import { INDEX_IMAGE_MAX, SECTOR_OPTIONS } from "../../src/lib/work-index";
import { repeatedDiscipline, WWD_MAX_ENTRIES } from "../../src/lib/what-we-do";
import { services } from "../../src/data/services";

// The 30 disciplines of the homepage What we do, straight from the four services (one list, no copy).
const WWD_DISCIPLINE_OPTIONS = services.flatMap((s) => s.deliverables.map((d) => ({ title: `${d.name} (${s.name})`, value: d.name })));

// Whether the document being edited shows in the homepage hero: the Homepage hero fields are
// required only then. The checks themselves live in src/lib/homepage-hero.ts.
const heroShown = (context: { document?: unknown }) => (context.document as { heroShow?: unknown } | undefined)?.heroShow === true;
const pass = (message: string | undefined) => message ?? true;

// The four studio services. Shared by serviceCategories and the legacy serviceCategory field.
const SERVICE_CATEGORY_OPTIONS = [
  { title: "Brand Identity and Visual Design", value: "brand-identity" },
  { title: "Visual Media and Content Production", value: "visual-media" },
  { title: "Digital Design and Experience", value: "digital-design" },
  { title: "Creative Strategy and Systems", value: "creative-strategy" },
];

export default defineType({
  name: "caseStudy",
  title: "Project",
  type: "document",
  fieldsets: [
    {
      name: "homepageHero",
      title: "Homepage hero",
      description: "The rotating image at the top of the homepage, its caption, and the word in the homepage line.",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "workIndex",
      title: "Work index",
      description: "How this project shows in Selected work on the homepage and in the list on /work.",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "homepageWhatWeDo",
      title: "What we do",
      description: "The real work behind each discipline in What we do on the homepage.",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "legacy",
      title: "Legacy content",
      description:
        "Only used when Page Blocks is empty. Kept so older projects keep rendering. Will be removed once every project uses blocks.",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Changing this after publishing breaks existing links. Add a redirect below if you change it.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Show on Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "projectType",
      title: "Project type",
      type: "string",
      description:
        "Exploration: self initiated work for an invented brand. Parallel: a real business reimagined with written permission. Commons: pro bono work.",
      options: {
        // Must match src/lib/initiatives/types.ts and scripts/import-portfolio/lib/config.mjs.
        list: [
          { title: "Client", value: "client" },
          { title: "Exploration", value: "exploration" },
          { title: "Parallel", value: "parallel" },
          { title: "Commons", value: "commons" },
        ],
        layout: "radio",
      },
      // New projects start as client work. Existing projects have no value and read as client.
      initialValue: "client",
    }),
    defineField({
      name: "heroShow",
      title: "Show in the homepage hero",
      type: "boolean",
      fieldset: "homepageHero",
      initialValue: false,
    }),
    defineField({
      name: "heroOrder",
      title: "Hero order",
      type: "number",
      fieldset: "homepageHero",
      description: "Lower shows first. Client work first, then explorations.",
    }),
    defineField({
      name: "heroName",
      title: "Hero name",
      type: "string",
      fieldset: "homepageHero",
      description: "Shown under the homepage image.",
      validation: (rule) => [
        rule.custom((value, context) => pass(heroRequiredMessage(value, heroShown(context), "Add the hero name: it is shown under the homepage image."))),
        rule.custom((value) => pass(heroLengthMessage(value, 28, "Keep it under 28 characters so it fits one line on a phone."))).warning(),
      ],
    }),
    defineField({
      name: "heroLine",
      title: "Hero line",
      type: "string",
      fieldset: "homepageHero",
      description: "One short line under the name on desktop, for example Ceramics identity and lookbook.",
      validation: (rule) => [
        rule.custom((value, context) => pass(heroRequiredMessage(value, heroShown(context), "Add the hero line: it is shown under the name on desktop."))),
        rule.custom((value) => pass(heroLengthMessage(value, 40, "Keep it under 40 characters so it fits one line."))).warning(),
      ],
    }),
    defineField({
      name: "heroField",
      title: "Field",
      type: "string",
      fieldset: "homepageHero",
      description: "Not shown on the site at the moment. Keep it filled for later use.",
      validation: (rule) => [
        rule.custom((value, context) => pass(heroRequiredMessage(value, heroShown(context), "Add the field: keep it filled for later use."))),
        rule.custom((value) => pass(heroLengthMessage(value, 22, "Keep it under 22 characters."))).warning(),
      ],
    }),
    defineField({
      name: "heroWord",
      title: "Field word",
      type: "string",
      fieldset: "homepageHero",
      description: "The word in the homepage line while this project's image shows. Lower case and plural, for example home brands.",
      validation: (rule) => [
        rule.custom((value, context) => pass(heroRequiredMessage(value, heroShown(context), "Add the field word: it replaces businesses in the homepage line."))),
        rule.custom((value) => pass(heroWordCaseMessage(value))),
        rule.custom((value) => pass(heroLengthMessage(value, 14, "Keep it under 14 characters so the homepage line stays short."))).warning(),
      ],
    }),
    defineField({
      name: "heroImages",
      title: "Hero images",
      type: "array",
      fieldset: "homepageHero",
      description: "One to four images. The homepage shows the first. 2400px wide or more.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Describe the image for people using screen readers.",
              validation: (rule) => rule.required().error("Describe the image: screen readers read it aloud."),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.custom((value, context) => pass(heroImagesMessage(value, heroShown(context)))),
    }),
    defineField({
      name: "heroFit",
      title: "Hero fit",
      type: "string",
      fieldset: "homepageHero",
      description: "Fit inside the frame suits website screens.",
      options: {
        list: [
          { title: "Fill the frame", value: "cover" },
          { title: "Fit inside the frame", value: "contain" },
        ],
        layout: "radio",
      },
      initialValue: "cover",
    }),
    defineField({
      name: "sector",
      title: "Business type",
      type: "string",
      fieldset: "workIndex",
      description: "Which business is this work for? Used by 'your kind of business' on the homepage and /work.",
      // The list lives in src/lib/work-index.ts, which the homepage and /work read too.
      options: { list: SECTOR_OPTIONS, layout: "radio" },
    }),
    defineField({
      name: "indexImages",
      title: "Index images",
      type: "array",
      fieldset: "workIndex",
      description:
        "Up to six images, in order, for the small strip under the project name and the image window. Leave empty to use the featured image and the case study's own images.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Describe the image for people using screen readers.",
              validation: (rule) => rule.required().error("Describe the image: screen readers read it aloud."),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(INDEX_IMAGE_MAX).error("Use six images at most."),
    }),
    defineField({
      name: "homeOrder",
      title: "Homepage order",
      type: "number",
      fieldset: "workIndex",
      description: "Lower numbers show first in Selected work on the homepage. Only projects with 'Show on Homepage' on are used, six at most.",
    }),
    defineField({
      name: "whatWeDo",
      title: "What we do",
      type: "array",
      fieldset: "homepageWhatWeDo",
      description: "Choose the disciplines this project shows on the homepage, and the image for each. Client work only; explorations are never used.",
      of: [
        defineArrayMember({
          type: "object",
          name: "whatWeDoEntry",
          title: "Discipline",
          fields: [
            defineField({
              name: "discipline",
              title: "Discipline",
              type: "string",
              description: "One of the thirty disciplines of the four services.",
              options: { list: WWD_DISCIPLINE_OPTIONS },
              validation: (rule) => rule.required().error("Choose a discipline."),
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              description: "Shown beside the word on the homepage, in a small frame. Set the hotspot on what matters.",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                  description: "Describe the image for people using screen readers.",
                  validation: (rule) => rule.required().error("Describe the image: screen readers read it aloud."),
                }),
              ],
              validation: (rule) => rule.required().error("Add the image for this discipline."),
            }),
          ],
          preview: { select: { title: "discipline", media: "image" } },
        }),
      ],
      validation: (rule) =>
        rule.max(WWD_MAX_ENTRIES).error("Use twelve disciplines at most.").custom((entries) => {
          const repeated = repeatedDiscipline(entries as Array<{ discipline?: unknown }> | undefined);
          return repeated ? `${repeated} is chosen twice. Each discipline once per project.` : true;
        }),
    }),
    defineField({
      name: "serviceCategories",
      title: "Service Categories",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Every studio service this project covers. The project appears under each one on the /services page.",
      options: {
        list: SERVICE_CATEGORY_OPTIONS,
        layout: "grid",
      },
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "serviceCategory",
      title: "Service Category",
      type: "string",
      description: "Replaced by Service Categories. Kept so older projects keep working.",
      options: {
        list: SERVICE_CATEGORY_OPTIONS,
      },
      fieldset: "legacy",
    }),
    defineField({
      name: "disciplines",
      title: "Disciplines",
      type: "array",
      description:
        "What type of work was done? Select all that apply. Used as filters on the /work page.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Brand Identity", value: "brand-identity" },
          { title: "Packaging", value: "packaging" },
          { title: "Publication", value: "publication" },
          { title: "Art Direction", value: "art-direction" },
          { title: "Website", value: "website" },
          { title: "Video", value: "video" },
          { title: "Photography", value: "photography" },
          { title: "Social Content", value: "social-content" },
          { title: "Strategy", value: "strategy" },
        ],
      },
    }),
    defineField({
      name: "workDelivered",
      title: "Work actually delivered",
      type: "array",
      description: "Tick only what was genuinely delivered for this project. Used to choose proof in the Project Planner.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Identity", value: "identity" },
          { title: "Strategy", value: "strategy" },
          { title: "Website design", value: "website_design" },
          { title: "Website build", value: "website_build" },
          { title: "Photography", value: "photography" },
          { title: "Video", value: "video" },
          { title: "Packaging", value: "packaging" },
          { title: "Print", value: "print" },
        ],
      },
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "text",
      rows: 4,
      // The card text on /work, the Business section and the search description fall back to it.
      validation: (rule) => rule.required().error("Write an overview: it is the project's card text and its search description."),
    }),
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "array",
      of: [{ type: "block" }],
      fieldset: "legacy",
    }),
    defineField({
      name: "approach",
      title: "Approach",
      type: "array",
      of: [{ type: "block" }],
      fieldset: "legacy",
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "results",
      title: "Results",
      type: "array",
      of: [{ type: "block" }],
      fieldset: "legacy",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description:
            "Describe the image for people using screen readers. Leave empty to use the project title.",
        }),
      ],
      // Without it the project's card on /work, the services pages and the case study hero is blank.
      validation: (rule) =>
        rule.custom((image: { asset?: unknown } | undefined) => (image?.asset ? true : "Add a featured image: it is the project's card and hero.")),
    }),
    defineField({
      name: "blocks",
      title: "Page Blocks",
      type: "array",
      description: "The body of the project page, top to bottom. Pick a block, fill it, reorder by dragging.",
      of: [
        { type: "blockSplit" },
        { type: "blockOffset" },
        { type: "blockFull" },
        { type: "blockPair" },
        { type: "blockStatement" },
        { type: "blockFeature" },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      fieldset: "legacy",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "object",
      fields: [
        defineField({
          name: "quote",
          title: "Quote",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "author",
          title: "Author",
          type: "string",
        }),
        defineField({
          name: "role",
          title: "Role",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      // Every list of projects is ordered by it, newest first.
      validation: (rule) => rule.required().error("Set the date: projects are listed newest first."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "client",
      media: "featuredImage",
    },
  },
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
