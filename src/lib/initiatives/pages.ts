// Which /initiatives/<slug> pages exist. A page renders only when the initiative is visible, has
// hasPage set, and its page is built in the site code. Everything else, Foundry included, is a 404.
import { hasLivePage, type Initiative } from "./types";

export const BUILT_PAGES = ["parallel", "commons"] as const;
export type BuiltPage = (typeof BUILT_PAGES)[number];

export function programmePage(slug: string, initiatives: Initiative[]): (Initiative & { slug: BuiltPage }) | null {
  const initiative = initiatives.find((i) => i.slug === slug);
  if (!initiative || !hasLivePage(initiative)) return null;
  if (!(BUILT_PAGES as readonly string[]).includes(slug)) return null;
  return initiative as Initiative & { slug: BuiltPage };
}

// The landing page links to a programme only when its page renders.
export const linksToPage = (i: Initiative, all: Initiative[]) => programmePage(i.slug, all) !== null;
