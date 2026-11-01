import { createClient } from "next-sanity";
import { sanityProject } from "./project";

// The environment variables win when set; without them the public project id and dataset in
// ./project are used, so a fresh checkout builds as is. Read one by one so Next inlines them.
const { projectId, dataset } = sanityProject({
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
});

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});
