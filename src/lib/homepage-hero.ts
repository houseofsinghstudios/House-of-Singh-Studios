// The homepage hero's projects: case studies marked "Show in the homepage hero" in Studio (the
// Homepage hero fieldset in sanity/schemas/caseStudy.ts), read by getHeroProjects in
// src/lib/sanity/projects.ts. Pure, so the order and the Studio checks are tested without Sanity.

import { projectType, type ProjectType } from "@/lib/initiatives/types";

// At most this many projects rotate in the hero.
export const HERO_MAX = 6;

// One hero image, as the query returns it: the original file's URL and size, its blurred
// placeholder, its alt text, and the editor's hotspot and crop (fractions of the original, as Sanity
// stores them), so the image builder can respect both.
export interface HeroImage {
  url: string;
  width?: number;
  height?: number;
  lqip?: string;
  alt: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
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

// Client work before everything else (a project with no type is client work), then explorations and
// the other types together. The first step of the hero order, and of the work index order
// (src/lib/work-index.ts), so the two lists always agree on it.
export function compareClientFirst(a: { projectType?: unknown }, b: { projectType?: unknown }): number {
  const group = (p: { projectType?: unknown }) => (projectType(p.projectType) === "client" ? 0 : 1);
  return group(a) - group(b);
}

// The hero order: client work first, then within each group by Hero order, lowest first (no number
// goes last), then by title. At most HERO_MAX.
export function sortHeroProjects<T extends Pick<HeroProject, "title" | "heroOrder"> & { projectType?: unknown }>(projects: readonly T[]): T[] {
  const order = (p: T) => (typeof p.heroOrder === "number" && Number.isFinite(p.heroOrder) ? p.heroOrder : Infinity);
  return [...projects]
    .sort((a, b) => compareClientFirst(a, b) || compareOrder(order(a), order(b)) || a.title.localeCompare(b.title))
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

// ── What the hero shows (src/components/homepage/Hero*.tsx) ──
// HeroSection (a server component) turns each HeroProject into a HeroEntry: plain data with a finished
// image URL, safe to hand to the client components. One image per project: its first hero image.
// heroField stays in Studio for later use; the homepage does not read it now.

export interface HeroEntry {
  slug: string;
  heroName: string;
  heroLine: string;
  // The word in the value line while this project's image shows ("" when Studio has none).
  heroWord: string;
  heroFit: HeroFit;
  // The Studio crop already in the URL; the focal point as a CSS object-position.
  image: { src: string; alt: string; lqip?: string; position: string };
}

// The word in "Brand identity, design and digital for growing businesses." before the rotation has
// moved, and for any project without a field word. Also the sentence screen readers hear.
export const DEFAULT_WORD = "businesses";

// One clock: each image holds 5s, the first included, at every width; the word changes with it.
export const IMAGE_HOLD_MS = 5000;

// The word for the image on screen. The first image on the first pass shows "businesses"; every later
// image shows its project's field word; once the rotation has looped, the first project shows its own
// too. A project without a field word shows "businesses" for its turn.
export function heroWordFor(entries: readonly Pick<HeroEntry, "heroWord">[], index: number, looped: boolean): string {
  if (index === 0 && !looped) return DEFAULT_WORD;
  return entries[index]?.heroWord.trim() || DEFAULT_WORD;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const percent = (n: number) => `${Math.round(clamp01(n) * 1000) / 10}%`;

// The hotspot as object-position inside the cropped image, so the focal point stays in frame at every
// width. Sanity stores both as fractions of the original; after a crop the hotspot is measured from
// the crop's edges. No hotspot: centred.
export function heroObjectPosition(image: Pick<HeroImage, "hotspot" | "crop">): string {
  if (!image.hotspot) return "50% 50%";
  const c = image.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const w = 1 - c.left - c.right;
  const h = 1 - c.top - c.bottom;
  const x = w > 0 ? (image.hotspot.x - c.left) / w : 0.5;
  const y = h > 0 ? (image.hotspot.y - c.top) / h : 0.5;
  return `${percent(x)} ${percent(y)}`;
}
