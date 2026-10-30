// What a page does when a Sanity read fails.
//
// While the site runs (an ISR refresh, or a page rendered on request), the error is rethrown.
// Next.js then keeps serving the last page it generated successfully and retries on the next
// request, so a short Sanity outage never replaces a good page with fallback content or a false
// "not found".
//
// The fallback content is used only while `next build` runs, or when Sanity is not configured at
// all, so a build still completes without Sanity. Each failure is logged here once, with a
// "[sanity]" prefix; callers do not log it again.

export type SanityEnv = {
  NEXT_PHASE?: string;
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
};

// Read one by one so the public values are inlined at build time, as everywhere else.
function currentEnv(): SanityEnv {
  return {
    NEXT_PHASE: process.env.NEXT_PHASE,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  };
}

// True during `next build`, or when Sanity has no project or dataset to read from.
export function sanityFallbackAllowed(env: SanityEnv = currentEnv()): boolean {
  if (env.NEXT_PHASE === "phase-production-build") return true;
  return !env.NEXT_PUBLIC_SANITY_PROJECT_ID || !env.NEXT_PUBLIC_SANITY_DATASET;
}

// Runs a Sanity read. On failure: the fallback while building (or without Sanity), otherwise the
// error is rethrown so the last good page stays. "label" names the read in the log. The fallback
// receives the error, so it can rethrow when it has nothing true to offer (a slug it does not know
// must fail the build, never become a cached "not found").
export async function readSanity<T>(
  label: string,
  read: () => Promise<T>,
  fallback: (error: unknown) => T | Promise<T>,
  env: SanityEnv = currentEnv()
): Promise<T> {
  try {
    return await read();
  } catch (error) {
    const reason = error instanceof Error ? `${error.name}: ${error.message}`.slice(0, 200) : "unknown error";
    if (sanityFallbackAllowed(env)) {
      console.warn(`[sanity] ${label} failed while building or without Sanity, using the fallback content (${reason})`);
      return fallback(error);
    }
    console.error(`[sanity] ${label} failed, rethrown so Next.js keeps any cached version of the page (${reason})`);
    throw error;
  }
}
