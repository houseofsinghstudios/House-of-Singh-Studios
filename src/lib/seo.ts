// Page titles carry the studio name exactly once. The root layout's title template appends
// " — House of Singh Studios" to every page title, so stored titles must be bare.

export const STUDIO_NAME = "House of Singh Studios";

// A trailing studio name typed by hand: " — ", " – ", " - " or " | " before it, any case.
const STUDIO_SUFFIX = /\s*[—–|-]\s*House of Singh Studios\s*$/i;

// The first non-empty candidate with any trailing studio name removed.
// bareTitle(project.seoTitle, project.name): the SEO title if set, otherwise the name.
export function bareTitle(...candidates: (string | null | undefined)[]): string {
  for (const candidate of candidates) {
    const title = (candidate || "").replace(STUDIO_SUFFIX, "").trim();
    if (title) return title;
  }
  return "";
}

// For Open Graph and Twitter, which do not use the title template: the bare title plus the studio name, once.
export function studioTitle(title: string): string {
  return `${bareTitle(title)} — ${STUDIO_NAME}`;
}
