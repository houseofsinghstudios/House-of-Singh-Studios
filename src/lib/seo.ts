// Page titles carry the studio name exactly once. The root layout's title template appends
// " — House of Singh Studios" to every page title, so stored titles must be bare.

export const STUDIO_NAME = "House of Singh Studios";

// A studio name typed by hand at either end, with " — ", " – ", " - ", " | " or ": " between, any case.
const STUDIO_SUFFIX = /\s*[—–|:-]\s*House of Singh Studios\s*$/i;
const STUDIO_PREFIX = /^\s*House of Singh Studios\s*[—–|:-]\s*/i;
const STUDIO_ONLY = /^\s*House of Singh Studios\s*$/i;

function stripStudio(title: string): string {
  let t = title;
  for (let previous = ""; previous !== t; ) {
    previous = t;
    t = t.replace(STUDIO_SUFFIX, "").replace(STUDIO_PREFIX, "");
  }
  return STUDIO_ONLY.test(t) ? "" : t.trim();
}

// The first candidate that still has words once any studio name at either end is removed.
// bareTitle(project.seoTitle, project.name): the SEO title if set, otherwise the name.
// A title that is only the studio name falls through to the next candidate.
export function bareTitle(...candidates: (string | null | undefined)[]): string {
  for (const candidate of candidates) {
    const title = stripStudio(candidate || "");
    if (title) return title;
  }
  return "";
}

// For Open Graph and Twitter, which do not use the title template: the bare title plus the studio name, once.
export function studioTitle(title: string): string {
  return `${bareTitle(title)} — ${STUDIO_NAME}`;
}
