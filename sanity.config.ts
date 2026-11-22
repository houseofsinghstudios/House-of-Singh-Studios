"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { HIDDEN_TYPES, structure } from "./sanity/structure";
import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } from "./src/lib/sanity/project";

export default defineConfig({
  name: "hos-studios",
  title: "House of Singh Studios",
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: PUBLIC_SANITY_DATASET,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Hidden types cannot be created from the "new document" menu.
    templates: (templates) => templates.filter((t) => !HIDDEN_TYPES.includes(t.schemaType)),
  },
});
