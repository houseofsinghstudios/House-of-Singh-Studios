// The work index (the Living Index): the data the homepage's Selected work and the /work list read.
// Pure, no React and no Sanity client, so the rules are tested without either. getIndexProjects in
// src/lib/sanity/projects.ts reads the case studies and maps them through toIndexProject below.
//
// A visitor can say what kind of business they run ("Work for food and drink brands") and which
// discipline they care about ("in packaging"). Matching projects move to the top; nothing is hidden.

import { compareClientFirst, type HeroImage } from "@/lib/homepage-hero";
import { projectType, projectTypeLabel, type ProjectType } from "@/lib/initiatives/types";

// ── Business types (Studio: "Business type", the sector field) ──

// label: the list and the project line. word: the sentence ("Work for food and drink brands").
// question: the invitation under the matching projects on /work.
export const BUSINESS_TYPES = [
  { id: "food-and-drink", label: "Food and drink", word: "food and drink brands", question: "Building a food or drink brand?" },
  { id: "events", label: "Events", word: "events", question: "Planning an event people will remember?" },
  { id: "beauty-and-fragrance", label: "Beauty and fragrance", word: "beauty and fragrance labels", question: "Launching a beauty or fragrance label?" },
  { id: "fashion-and-jewellery", label: "Fashion and jewellery", word: "fashion and jewellery houses", question: "Building a fashion or jewellery house?" },
  { id: "home-and-lifestyle", label: "Home and lifestyle", word: "home and lifestyle brands", question: "Growing a home or lifestyle brand?" },
] as const;
export type BusinessTypeId = (typeof BUSINESS_TYPES)[number]["id"];

// The sentence before a business type is chosen.
export const DEFAULT_BUSINESS_WORD = "your kind of business";

// "other": the project shows on /work but belongs to no business type.
export type SectorId = BusinessTypeId | "other";

// The Studio list for the sector field, in this order (sanity/schemas/caseStudy.ts reads it).
export const SECTOR_OPTIONS: { title: string; value: SectorId }[] = [
  ...BUSINESS_TYPES.map((t) => ({ title: t.label, value: t.id })),
  { title: "Other (shows on /work, but in no business type)", value: "other" },
];

const BUSINESS_TYPE_IDS: readonly string[] = BUSINESS_TYPES.map((t) => t.id);
const isBusinessType = (value: unknown): value is BusinessTypeId => typeof value === "string" && BUSINESS_TYPE_IDS.includes(value);

// ── Disciplines, in the words a buyer uses ──

export const BUYER_DISCIPLINES = [
  { id: "identity", label: "Identity", word: "identity", question: "Ready for an identity that fits where you are going?" },
  { id: "packaging", label: "Packaging", word: "packaging", question: "Need packaging that earns its place on the shelf?" },
  { id: "websites", label: "Websites", word: "websites", question: "Planning a website that works as hard as you do?" },
  { id: "photography", label: "Photography", word: "photography", question: "Need photography that shows your brand at its best?" },
] as const;
export type BuyerDisciplineId = (typeof BUYER_DISCIPLINES)[number]["id"];

// The sentence before a discipline is chosen.
export const DEFAULT_DISCIPLINE_WORD = "every discipline";

// The Studio disciplines (the case study "Disciplines" field) that count as each buyer discipline.
// Publication, video, social content and strategy count as none.
const DISCIPLINE_TO_BUYER: Readonly<Record<string, BuyerDisciplineId>> = {
  "brand-identity": "identity",
  packaging: "packaging",
  website: "websites",
  photography: "photography",
  "art-direction": "photography",
};

const BUYER_IDS: readonly string[] = BUYER_DISCIPLINES.map((d) => d.id);
const isBuyerDiscipline = (value: unknown): value is BuyerDisciplineId => typeof value === "string" && BUYER_IDS.includes(value);

// A project's Studio disciplines as buyer disciplines: each once, in the BUYER_DISCIPLINES order.
export function buyerDisciplines(disciplines: readonly unknown[] | null | undefined): BuyerDisciplineId[] {
  const mapped = new Set((disciplines || []).map((d) => (typeof d === "string" ? DISCIPLINE_TO_BUYER[d] : undefined)));
  return BUYER_DISCIPLINES.map((d) => d.id).filter((id) => mapped.has(id));
}

// ── What the UI reads ──

// The url is the original file; the editor's hotspot and crop (fractions of the original, as Sanity
// stores them) come along when set, so the image window can keep the focal point in frame the way the
// hero does (heroObjectPosition in src/lib/homepage-hero.ts).
export interface IndexImage {
  url: string;
  width: number;
  height: number;
  alt: string;
  lqip?: string;
  hotspot?: HeroImage["hotspot"];
  crop?: HeroImage["crop"];
}

export interface IndexProject {
  slug: string;
  title: string;
  // Unset in Studio reads as "other".
  sector: SectorId;
  // The business type's label; empty for "other".
  sectorLabel: string;
  // Buyer disciplines, in the BUYER_DISCIPLINES order.
  disciplines: BuyerDisciplineId[];
  // The buyer disciplines as a phrase: "Identity, packaging and photography". Empty when none.
  deliveredLine: string;
  // The Studio "Year" field; null when it is not set (then no year is shown). Never the publish date.
  year: number | null;
  // One short line about the project: its Hero line, else the first sentence of its overview.
  line: string;
  isExploration: boolean;
  // Kept for the order: client work first (projectType), then newest (publishedAt).
  projectType: ProjectType;
  publishedAt: string;
  images: IndexImage[];
  homeOrder?: number;
  featured: boolean;
}

export const INDEX_IMAGE_MAX = 6;
export const HOME_MAX = 6;

// "Identity", "Identity and packaging", "Identity, packaging and photography".
function deliveredPhrase(disciplines: readonly BuyerDisciplineId[]): string {
  const words = disciplines.map((id, i) => {
    const label = BUYER_DISCIPLINES.find((d) => d.id === id)?.label ?? id;
    return i === 0 ? label : label.toLowerCase();
  });
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

// ── From the Sanity query (getIndexProjects) ──

// An image as the query projects it: the asset's id (to drop repeats), file and size, alt text and
// blurred placeholder.
export interface IndexImageDoc {
  id?: string;
  url?: string;
  width?: number;
  height?: number;
  alt?: string;
  lqip?: string;
  hotspot?: { x?: number; y?: number } | null;
  crop?: { top?: number; bottom?: number; left?: number; right?: number } | null;
}

export interface IndexProjectDoc {
  title?: string;
  slug?: string;
  sector?: string;
  disciplines?: unknown[] | null;
  year?: number;
  publishedAt?: string;
  projectType?: unknown;
  featured?: boolean;
  homeOrder?: number;
  heroLine?: string;
  overview?: string;
  indexImages?: (IndexImageDoc | null)[] | null;
  featuredImage?: IndexImageDoc | null;
  // The page blocks in page order, each with whichever images it has.
  blockImages?: ({ image?: IndexImageDoc | null; detail?: IndexImageDoc | null; images?: (IndexImageDoc | null)[] | null } | null)[] | null;
}

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

// The first sentence of a text: up to the first full stop, question or exclamation mark.
function firstSentence(value: unknown): string {
  const all = text(value).replace(/\s+/g, " ");
  const match = all.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : all).trim();
}

const num = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

// The hotspot only when both coordinates are numbers; the crop only when all four sides are.
function focalPoint(raw: IndexImageDoc["hotspot"]): IndexImage["hotspot"] {
  return raw && num(raw.x) && num(raw.y) ? { x: raw.x, y: raw.y } : undefined;
}

function cropBox(raw: IndexImageDoc["crop"]): IndexImage["crop"] {
  return raw && num(raw.top) && num(raw.bottom) && num(raw.left) && num(raw.right) ? { top: raw.top, bottom: raw.bottom, left: raw.left, right: raw.right } : undefined;
}

function toIndexImage(doc: IndexImageDoc | null | undefined, title: string): IndexImage | null {
  const url = text(doc?.url);
  const { width, height } = doc || {};
  if (!url || typeof width !== "number" || typeof height !== "number" || width <= 0 || height <= 0) return null;
  const lqip = text(doc?.lqip);
  const hotspot = focalPoint(doc?.hotspot);
  const crop = cropBox(doc?.crop);
  return { url, width, height, alt: text(doc?.alt) || title, ...(lqip ? { lqip } : {}), ...(hotspot ? { hotspot } : {}), ...(crop ? { crop } : {}) };
}

// The images for the strip and the image window: the Index images when there are any; otherwise
// the featured image, then the images in the page blocks in page order. Each asset once, six at most.
export function indexImages(doc: IndexProjectDoc, title: string): IndexImage[] {
  const own = (doc.indexImages || []).filter(Boolean) as IndexImageDoc[];
  const fromPage = [doc.featuredImage, ...(doc.blockImages || []).flatMap((b) => (b ? [b.image, b.detail, ...(b.images || [])] : []))];
  const candidates = own.length > 0 ? own : fromPage;
  const seen = new Set<string>();
  const out: IndexImage[] = [];
  for (const candidate of candidates) {
    if (out.length === INDEX_IMAGE_MAX) break;
    const image = toIndexImage(candidate, title);
    if (!image) continue;
    const key = text(candidate?.id) || image.url;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(image);
  }
  return out;
}

// One case study as the index shows it, or null without a title or slug.
export function toIndexProject(doc: IndexProjectDoc): IndexProject | null {
  const title = text(doc.title);
  const slug = text(doc.slug);
  if (!title || !slug) return null;
  const sector: SectorId = isBusinessType(doc.sector) ? doc.sector : "other";
  const disciplines = buyerDisciplines(doc.disciplines);
  // publishedAt orders the list; it never stands in for the year.
  const publishedAt = text(doc.publishedAt);
  const year = num(doc.year) ? doc.year : null;
  const type = projectType(doc.projectType);
  return {
    slug,
    title,
    sector,
    sectorLabel: BUSINESS_TYPES.find((t) => t.id === sector)?.label ?? "",
    disciplines,
    deliveredLine: deliveredPhrase(disciplines),
    year,
    line: text(doc.heroLine) || firstSentence(doc.overview),
    isExploration: type === "exploration",
    projectType: type,
    publishedAt,
    images: indexImages(doc, title),
    ...(typeof doc.homeOrder === "number" && Number.isFinite(doc.homeOrder) ? { homeOrder: doc.homeOrder } : {}),
    featured: doc.featured === true,
  };
}

// ── Order and selection ──

// The index order: client work first, then explorations and the other types (the hero's rule,
// compareClientFirst); within each, newest first; then by title.
export function sortIndexProjects<T extends Pick<IndexProject, "title" | "publishedAt" | "projectType">>(projects: readonly T[]): T[] {
  return [...projects].sort((a, b) => compareClientFirst(a, b) || b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title));
}

export interface IndexChoice {
  sector?: BusinessTypeId;
  discipline?: BuyerDisciplineId;
}

// The matching projects first, the rest after, each in the order given (pass them in index order).
// A project matches when it has the chosen business type and the chosen discipline (both, when both
// are chosen). With no choice every project is in "rest". Nothing is ever left out.
export function rankProjects<T extends Pick<IndexProject, "sector" | "disciplines">>(projects: readonly T[], choice: IndexChoice = {}): { matches: T[]; rest: T[] } {
  const { sector, discipline } = choice;
  if (!sector && !discipline) return { matches: [], rest: [...projects] };
  const matches: T[] = [];
  const rest: T[] = [];
  for (const p of projects) {
    const ok = (!sector || p.sector === sector) && (!discipline || p.disciplines.includes(discipline));
    (ok ? matches : rest).push(p);
  }
  return { matches, rest };
}

const homeRank = (p: Pick<IndexProject, "homeOrder">) => (typeof p.homeOrder === "number" ? p.homeOrder : Infinity);

// The homepage six. No business type: the projects with "Show on Homepage" on, by Homepage order
// (no number last), then in index order. A business type: every project of that type from the whole
// portfolio first, then the usual six fill the places left, six in total.
export function homeSelection<T extends IndexProject>(projects: readonly T[], sector?: BusinessTypeId): T[] {
  const ordered = sortIndexProjects(projects);
  const position = new Map(ordered.map((p, i) => [p, i]));
  const featured = ordered
    .filter((p) => p.featured)
    .sort((a, b) => {
      const ra = homeRank(a);
      const rb = homeRank(b);
      return (ra === rb ? 0 : ra - rb) || (position.get(a) ?? 0) - (position.get(b) ?? 0);
    })
    .slice(0, HOME_MAX);
  if (!sector) return featured;
  const picked = rankProjects(ordered, { sector }).matches.slice(0, HOME_MAX);
  for (const p of featured) {
    if (picked.length === HOME_MAX) break;
    if (!picked.includes(p)) picked.push(p);
  }
  return picked;
}

// ── The address bar: /work?for=food-and-drink&in=packaging ──

type SearchParamsLike = URLSearchParams | Record<string, string | string[] | undefined>;

function param(params: SearchParamsLike, key: string): string | undefined {
  const value = params instanceof URLSearchParams ? params.get(key) : params[key];
  const first = Array.isArray(value) ? value[0] : value;
  return typeof first === "string" ? first : undefined;
}

// ?for= a business type, ?in= a discipline. Unknown values (and "other") are ignored.
export function parseWorkParams(params: SearchParamsLike): IndexChoice {
  const sector = param(params, "for");
  const discipline = param(params, "in");
  return {
    ...(isBusinessType(sector) ? { sector } : {}),
    ...(isBuyerDiscipline(discipline) ? { discipline } : {}),
  };
}

// ── The words on /work ──

const businessType = (id: BusinessTypeId | undefined) => BUSINESS_TYPES.find((t) => t.id === id);
const buyerDiscipline = (id: BuyerDisciplineId | undefined) => BUYER_DISCIPLINES.find((d) => d.id === id);

// The two words in "Work for [your kind of business], in [every discipline].", for a choice.
export function sentenceWords(choice: IndexChoice): { business: string; discipline: string } {
  return {
    business: businessType(choice.sector)?.word ?? DEFAULT_BUSINESS_WORD,
    discipline: buyerDiscipline(choice.discipline)?.word ?? DEFAULT_DISCIPLINE_WORD,
  };
}

// The invitation under the matching projects: the business type's question, else the discipline's.
export function invitationQuestion(choice: IndexChoice): string | null {
  return businessType(choice.sector)?.question ?? buyerDiscipline(choice.discipline)?.question ?? null;
}

// The address for a choice: /work, /work?for=food-and-drink, /work?for=food-and-drink&in=packaging.
export function workHref(choice: IndexChoice): string {
  const params = new URLSearchParams();
  if (choice.sector) params.set("for", choice.sector);
  if (choice.discipline) params.set("in", choice.discipline);
  const query = params.toString();
  return query ? `/work?${query}` : "/work";
}

const projectsWord = (n: number) => `${n} ${n === 1 ? "project" : "projects"}`;

// What the polite status reads after a choice: "3 projects for food and drink brands. 5 more below."
// With nothing chosen, the count of everything. With no match, says so.
export function statusText(choice: IndexChoice, matches: number, rest: number): string {
  const business = businessType(choice.sector);
  const discipline = buyerDiscipline(choice.discipline);
  if (!business && !discipline) return `${projectsWord(matches + rest)}.`;
  if (matches === 0) return `Nothing for that combination yet. ${projectsWord(rest)} below.`;
  const what = [business ? `for ${business.word}` : "", discipline ? `in ${discipline.word}` : ""].filter(Boolean).join(", ");
  return `${projectsWord(matches)} ${what}.${rest > 0 ? ` ${rest} more below.` : ""}`;
}

// The line under a project name: "Food and drink. Identity, packaging and photography." Either part
// alone when the other is empty.
export function projectMeta(project: Pick<IndexProject, "sectorLabel" | "deliveredLine">): string {
  return [project.sectorLabel, project.deliveredLine].filter(Boolean).map((part) => `${part}.`).join(" ");
}

// The kind of work, under the image window: "Client work", "Studio exploration", or the initiative.
export function workKindLabel(type: ProjectType): string {
  if (type === "client") return "Client work";
  if (type === "exploration") return "Studio exploration";
  return projectTypeLabel(type) ?? "";
}

// The image window's frame code: the project's number and the image's letter, "05B".
export function frameCode(projectNumber: number, imageIndex: number): string {
  return `${String(projectNumber).padStart(2, "0")}${String.fromCharCode(65 + imageIndex)}`;
}
