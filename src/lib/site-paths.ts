// Paths for the redirects editors manage in Studio. Shared by the Studio validation
// (sanity/schemas/redirect.ts) and the site (src/lib/sanity/redirects.ts), so both apply one rule.

// A problem with a path, or null when it is fine: it starts with "/" and stays on this site ("//"
// would send the visitor to another host), with no spaces, query, fragment or trailing slash.
export function pathProblem(value: unknown): string | null {
  if (typeof value !== "string" || value === "") return "Enter a path.";
  if (!value.startsWith("/")) return 'Start with "/", for example /insights/old-title.';
  if (value.startsWith("//")) return "Use a path on this site, not another address.";
  if (/\s/.test(value)) return "Remove the spaces.";
  if (/[?#]/.test(value)) return "Use the path only, without ? or #.";
  if (value.length > 1 && value.endsWith("/")) return "Remove the slash at the end.";
  return null;
}

export const isSitePath = (value: unknown): value is string => pathProblem(value) === null;
