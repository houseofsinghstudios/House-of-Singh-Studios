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

// quiet: the caller logs the failure itself (see resolveMissingSlug), so readSanity's generic line is
// skipped. Either way a failure is thrown, never "no redirect".
export async function findStudioRedirect(
  path: string,
  fetch: Fetch = (query, params) => client.fetch(query, params),
  env?: SanityEnv,
  { quiet = false }: { quiet?: boolean } = {}
): Promise<StudioRedirect | null> {
  const read = async () => {
    const found = (await fetch(redirectQuery, { path })) as { to?: unknown; permanent?: unknown } | null;
    // Only a path on this site, and never back to the same path.
    if (!found || !isSitePath(found.to) || found.to === path) return null;
    return { to: found.to, permanent: found.permanent !== false };
  };
  if (quiet) return read();
  return readSanity(
    `redirect for "${path}"`,
    read,
    (error) => {
      throw error;
    },
    env
  );
}

export type MissingSlug = { redirect: StudioRedirect } | { notFound: true };

// What a slug route does once it knows the slug does not exist: the Studio redirect when there is
// one, otherwise the 404. A failed lookup throws (neither a 404 nor a redirect), except with
// notFoundIfUnreachable: for /services/[slug], whose slugs come from the code, so "not a service" is
// certain without Sanity and the page stays a 404 during an outage, as it always was.
export async function resolveMissingSlug(
  path: string,
  find?: (path: string) => Promise<StudioRedirect | null>,
  { notFoundIfUnreachable = false }: { notFoundIfUnreachable?: boolean } = {}
): Promise<MissingSlug> {
  // With the outage 404, this function logs the failure, so the lookup stays quiet: one line.
  const lookup = find ?? ((p: string) => findStudioRedirect(p, undefined, undefined, { quiet: notFoundIfUnreachable }));
  let target: StudioRedirect | null;
  try {
    target = await lookup(path);
  } catch (error) {
    if (!notFoundIfUnreachable) throw error;
    const reason = error instanceof Error ? `${error.name}: ${error.message}`.slice(0, 200) : "unknown error";
    console.error(`[sanity] redirect lookup for "${path}" failed, answered with the 404 as the slug is not in the code (${reason})`);
    return { notFound: true };
  }
  return target ? { redirect: target } : { notFound: true };
}
