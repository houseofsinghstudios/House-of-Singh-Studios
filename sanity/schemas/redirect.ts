import { defineType, defineField } from "sanity";
import { pathProblem } from "../../src/lib/site-paths";

// A redirect for a changed slug. When a visitor opens an article, case study, service or initiative
// address that no longer exists, the site looks here before showing "not found" and sends them to
// the new address. The fixed redirects in next.config.ts are separate and stay there.
export default defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({
      name: "from",
      title: "From path",
      description: "The old address, as a path: /insights/old-title. It must no longer exist on the site.",
      type: "string",
      validation: (rule) => rule.required().custom((value) => pathProblem(value) ?? true),
    }),
    defineField({
      name: "to",
      title: "To path",
      description: "Where visitors go instead, as a path: /insights/new-title.",
      type: "string",
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const problem = pathProblem(value);
          if (problem) return problem;
          return value === (context.document as { from?: string } | undefined)?.from ? "Use a different path from the one above." : true;
        }),
    }),
    defineField({
      name: "permanent",
      title: "Permanent",
      description: "On for a slug that has changed for good (search engines move to the new address). Off for a temporary move.",
      type: "boolean",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Note",
      description: "Why this redirect exists, for whoever edits it next. Not shown on the site.",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { from: "from", to: "to", permanent: "permanent" },
    prepare: ({ from, to, permanent }) => ({
      title: `${from || "?"} → ${to || "?"}`,
      subtitle: permanent === false ? "Temporary" : "Permanent",
    }),
  },
});
