// A fresh checkout builds without environment variables: the site falls back to the public project.
import { test } from "node:test";
import assert from "node:assert/strict";
import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID, sanityProject } from "@/lib/sanity/project";

test("without environment variables the public project id and dataset are used", () => {
  assert.deepEqual(sanityProject({}), { projectId: "00iree4d", dataset: "production" });
  assert.deepEqual(sanityProject({ NEXT_PUBLIC_SANITY_PROJECT_ID: "", NEXT_PUBLIC_SANITY_DATASET: "" }), { projectId: PUBLIC_SANITY_PROJECT_ID, dataset: PUBLIC_SANITY_DATASET });
});

test("set environment variables take precedence", () => {
  assert.deepEqual(sanityProject({ NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123", NEXT_PUBLIC_SANITY_DATASET: "staging" }), { projectId: "abc123", dataset: "staging" });
});
