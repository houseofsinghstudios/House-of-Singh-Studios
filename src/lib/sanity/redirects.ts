// Redirects managed in Studio (sanity/schemas/redirect.ts), looked up only after Sanity has answered
// that a slug does not exist. A failed read is rethrown, never treated as "no redirect": a Sanity
// outage must not turn a page into a 404 or a redirect (src/lib/sanity/resilience.ts).
import { client } from "./client";
import { readSanity, type SanityEnv } from "./resilience";
import { isSitePath } from "@/lib/site-paths";

export interface StudioRedirect {
  to: string;
  permanent: boolean;
}

type Fetch = (query: string, params: Record<string, string>) => Promise<unknown>;

const redirectQuery = `*[_type == "redirect" && from == $path] | order(_updatedAt desc) [0] { to, permanent }`;

export async function findStudioRedirect(
  path: string,
  fetch: Fetch = (query, params) => client.fetch(query, params),
  env?: SanityEnv
): Promise<StudioRedirect | null> {
  return readSanity(
    `redirect for "${path}"`,
    async () => {
      const found = (await fetch(redirectQuery, { path })) as { to?: unknown; permanent?: unknown } | null;
      // Only a path on this site, and never back to the same path.
      if (!found || !isSitePath(found.to) || found.to === path) return null;
      return { to: found.to, permanent: found.permanent !== false };
    },
    (error) => {
      throw error;
    },
    env
  );
}

export type MissingSlug = { redirect: StudioRedirect } | { notFound: true };

// What a slug route does once Sanity has answered that the slug does not exist: the Studio redirect
// when there is one, otherwise the 404. A failed lookup throws (neither a 404 nor a redirect).
export async function resolveMissingSlug(
  path: string,
  find: (path: string) => Promise<StudioRedirect | null> = findStudioRedirect
): Promise<MissingSlug> {
  const target = await find(path);
  return target ? { redirect: target } : { notFound: true };
}
