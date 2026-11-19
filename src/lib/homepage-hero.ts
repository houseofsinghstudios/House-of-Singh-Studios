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

// ── What the hero shows (src/components/homepage/Hero*.tsx) ──
// HeroSection (a server component) turns each HeroProject into a HeroEntry: plain data with a finished
// image URL, safe to hand to the client components. One image per project: its first hero image.
// heroField and heroWord stay in Studio for a later version that pairs the word with the image; the
// homepage does not read them now.

export interface HeroEntry {
  slug: string;
  heroName: string;
  heroLine: string;
  heroFit: HeroFit;
  // The Studio crop already in the URL; the focal point as a CSS object-position.
  image: { src: string; alt: string; lqip?: string; position: string };
}

// The word that cycles in "Brand identity, design and digital for growing businesses.", in this order,
// on its own clock. "businesses" first, the sentence screen readers hear. Lower case, 14 characters
// at most, so the reserved three lines always hold the sentence.
export const HERO_WORDS = [
  "businesses",
  "cafés",
  "restaurants",
  "clinics",
  "law firms",
  "contractors",
  "retailers",
  "food brands",
  "beauty labels",
  "startups",
] as const;
export const HERO_WORD_MAX = 14;

// The two clocks, in milliseconds. The words: the first change 4.5s after the entrance has finished,
// then every 3s. The images: 6s each, including the first. They never change within 500ms of each
// other: an image that would, waits until 500ms after the word.
export const HERO_ENTRANCE_MS = 1700;
export const WORD_FIRST_MS = HERO_ENTRANCE_MS + 4500;
export const WORD_EVERY_MS = 3000;
export const IMAGE_HOLD_MS = 6000;
export const CLOCK_GAP_MS = 500;

// How much longer an image that is due now waits, given the last and the next word change (the next is
// Infinity while the words are stopped).
export function imageWait(now: number, lastWord: number, nextWord: number): number {
  if (now - lastWord < CLOCK_GAP_MS) return lastWord + CLOCK_GAP_MS - now;
  if (nextWord - now < CLOCK_GAP_MS) return nextWord + CLOCK_GAP_MS - now;
  return 0;
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
