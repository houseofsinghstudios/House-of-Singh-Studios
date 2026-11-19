// The homepage hero's projects: case studies marked "Show in the homepage hero" in Studio (the
// Homepage hero fieldset in sanity/schemas/caseStudy.ts), read by getHeroProjects in
// src/lib/sanity/projects.ts. Pure, so the order and the Studio checks are tested without Sanity.

import { projectType, type ProjectType } from "@/lib/initiatives/types";

// At most this many projects rotate in the hero.
export const HERO_MAX = 6;

// One hero image, as the query returns it: the original file's URL and size, its blurred
// placeholder, its alt text and the editor's hotspot.
export interface HeroImage {
  url: string;
  width?: number;
  height?: number;
  lqip?: string;
  alt: string;
  hotspot?: { x: number; y: number };
}

// "cover" fills the frame; "contain" fits the whole image inside it (website screens).
export type HeroFit = "cover" | "contain";

export interface HeroProject {
  title: string;
  slug: string;
  // Shown under the homepage image.
  heroName: string;
  // One short line under the name on desktop.
  heroLine: string;
  // The field's name in the homepage list, for example "Home and lifestyle".
  heroField: string;
  // Replaces "businesses" in "digital for growing businesses.", for example "home brands".
  heroWord: string;
  heroFit: HeroFit;
  heroOrder?: number;
  projectType: ProjectType;
  heroImages: HeroImage[];
}

// Infinity minus Infinity is NaN, so two projects without a number compare as equal here.
const compareOrder = (a: number, b: number) => (a === b ? 0 : a - b);

// The hero order: client work first (a project with no type is client work), then explorations and
// the other types; within each group by Hero order, lowest first (no number goes last), then by
// title. At most HERO_MAX.
export function sortHeroProjects<T extends Pick<HeroProject, "title" | "heroOrder"> & { projectType?: unknown }>(projects: readonly T[]): T[] {
  const group = (p: T) => (projectType(p.projectType) === "client" ? 0 : 1);
  const order = (p: T) => (typeof p.heroOrder === "number" && Number.isFinite(p.heroOrder) ? p.heroOrder : Infinity);
  return [...projects]
    .sort((a, b) => group(a) - group(b) || compareOrder(order(a), order(b)) || a.title.localeCompare(b.title))
    .slice(0, HERO_MAX);
}

// ── Studio checks for the Homepage hero fieldset (sanity/schemas/caseStudy.ts) ──
// Each returns a message when the check fails, or undefined. The schema turns them into errors or
// warnings.

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

// Required once the project shows in the hero.
export function heroRequiredMessage(value: unknown, shown: boolean, message: string): string | undefined {
  return shown && !text(value) ? message : undefined;
}

// A warning when the text runs past the length that fits.
export function heroLengthMessage(value: unknown, max: number, message: string): string | undefined {
  return text(value).length > max ? message : undefined;
}

// The field word reads inside a sentence, so it is lower case only.
export function heroWordCaseMessage(value: unknown): string | undefined {
  const word = text(value);
  return word && word !== word.toLowerCase() ? "Use lower case only, for example home brands." : undefined;
}

// One to four images once the project shows in the hero.
export function heroImagesMessage(images: unknown, shown: boolean): string | undefined {
  const count = Array.isArray(images) ? images.length : 0;
  if (shown && count < 1) return "Add at least one image: the first one rotates on the homepage.";
  if (count > 4) return "Use four images at most.";
  return undefined;
}
