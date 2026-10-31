// For a slug route, once Sanity has answered that the slug does not exist: a redirect an editor set
// up in Studio (permanent 308 or temporary 307), otherwise the 404. If the lookup itself fails, the
// error stands (no 404, no redirect), so Next.js keeps the last good page. The decision is
// resolveMissingSlug (src/lib/sanity/redirects.ts); this applies it.
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { resolveMissingSlug } from "@/lib/sanity/redirects";

export async function redirectOrNotFound(path: string): Promise<never> {
  const outcome = await resolveMissingSlug(path);
  if ("redirect" in outcome) {
    const { to, permanent } = outcome.redirect;
    return permanent ? permanentRedirect(to) : redirect(to);
  }
  notFound();
}
