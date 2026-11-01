// The Sanity project and dataset the site and the Studio read. Both are public (they appear in every
// image URL), so they live in the code: a fresh checkout builds and runs without any environment
// variables. NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET, when set, take precedence
// for the site (src/lib/sanity/client.ts); the Studio (sanity.config.ts) always uses these.
export const PUBLIC_SANITY_PROJECT_ID = "00iree4d";
export const PUBLIC_SANITY_DATASET = "production";

export function sanityProject(env: { NEXT_PUBLIC_SANITY_PROJECT_ID?: string; NEXT_PUBLIC_SANITY_DATASET?: string }) {
  return {
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET || PUBLIC_SANITY_DATASET,
  };
}
