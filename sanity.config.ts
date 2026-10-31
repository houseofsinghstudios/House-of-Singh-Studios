"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { HIDDEN_TYPES, SINGLETONS, structure } from "./sanity/structure";

export default defineConfig({
  name: "hos-studios",
  title: "House of Singh Studios",
  projectId: "00iree4d",
  dataset: "production",
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Singletons cannot be created again from the "new document" menu, and hidden types not at all.
    templates: (templates) => templates.filter((t) => ![...SINGLETONS, ...HIDDEN_TYPES].includes(t.schemaType)),
  },
  document: {
    // A singleton cannot be duplicated or deleted, only edited and published.
    actions: (actions, { schemaType }) =>
      SINGLETONS.includes(schemaType) ? actions.filter((a) => a.action && ["publish", "discardChanges", "restore"].includes(a.action)) : actions,
  },
});
