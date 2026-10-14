import { defineField, defineType } from "sanity";

// Shared image used inside every case study block. Rendered at its natural aspect ratio, never cropped.
export const blockImage = defineType({
  name: "blockImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe what is in the frame. Read by screen readers and by Google.",
      validation: (rule) => rule.required(),
    }),
  ],
});

// Portable text for block bodies: plain paragraphs with bold, italic and links only.
export function bodyField(options: { required: boolean; description?: string }) {
  return defineField({
    name: "body",
    title: "Body",
    type: "array",
    description: options.description,
    of: [
      {
        type: "block",
        styles: [{ title: "Normal", value: "normal" }],
        lists: [],
        marks: {
          decorators: [
            { title: "Bold", value: "strong" },
            { title: "Italic", value: "em" },
          ],
          annotations: [
            {
              name: "link",
              title: "Link",
              type: "object",
              fields: [
                defineField({
                  name: "href",
                  title: "URL",
                  type: "url",
                  validation: (rule) => rule.required().uri({ scheme: ["http", "https", "mailto"] }),
                }),
              ],
            },
          ],
        },
      },
    ],
    validation: options.required ? (rule) => rule.required().min(1) : undefined,
  });
}

// Shortens long text for Studio list previews.
export function truncate(text: string | undefined, length = 60) {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}
