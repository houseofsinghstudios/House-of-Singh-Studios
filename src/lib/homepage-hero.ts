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
// HeroSection (a server component) turns each HeroProject into a HeroEntry: plain data with finished
// image URLs, safe to hand to the client components.

// One image as the hero renders it: the Studio crop already in the URL, the focal point as a CSS
// object-position.
export interface HeroSlide {
  src: string;
  alt: string;
  lqip?: string;
  position: string;
}

export interface HeroEntry {
  slug: string;
  heroName: string;
  heroLine: string;
  heroField: string;
  heroWord: string;
  heroFit: HeroFit;
  slides: HeroSlide[];
}

// The word in "digital for growing businesses." before a field is chosen.
export const DEFAULT_WORD = "businesses";

// The word button's accessible name, which follows the word: "Growing home brands. Show work by field".
export function wordLabel(word: string): string {
  return `Growing ${word}. Show work by field`;
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

// The field list: every project with both a field name and a field word, in hero order. A project
// missing either still rotates, but has no place in the list.
export function heroFieldItems(entries: readonly HeroEntry[]): { index: number; field: string; word: string }[] {
  return entries.flatMap((e, index) => (e.heroField.trim() && e.heroWord.trim() ? [{ index, field: e.heroField.trim(), word: e.heroWord.trim() }] : []));
}

// One image in the rotation: which project, which of its images.
export interface HeroFrame {
  project: number;
  image: number;
}

// At rest: each project's first image, in hero order. A chosen field: that project's images in order.
export function heroFrames(entries: readonly HeroEntry[], field: number | null): HeroFrame[] {
  if (field !== null && entries[field]) return entries[field].slides.map((_, image) => ({ project: field, image }));
  return entries.map((_, project) => ({ project, image: 0 }));
}

// How long an image holds before the next, in milliseconds: the first image of a set longer, so the
// visitor can take in the page; phones longer than desktop.
export const HOLD_MS = { desktop: { first: 7000, rest: 6000 }, phone: { first: 9000, rest: 8000 } } as const;
export function holdMs(first: boolean, phone: boolean): number {
  const hold = phone ? HOLD_MS.phone : HOLD_MS.desktop;
  return first ? hold.first : hold.rest;
}
