import { client } from "./client";
import { CASE_IMAGE_WIDTH, imageSource, shareImageUrl, wwdPreviewUrl } from "./image";
import type { SanityImageSource } from "@sanity/image-url";
import { readSanity, sanityFallbackAllowed } from "./resilience";
import { disciplineLabel } from "@/lib/disciplines";
import { coverAlt, projectAlt } from "@/lib/alt-text";
import type { Project } from "@/data/projects";
import type { PortableTextBlock as PortableTextBody } from "@portabletext/react";
import type { BlockImage, CaseStudyBlock, ProjectDetail, ProjectDetailImage } from "@/data/projectDetails";
import { projectType, type ProjectType } from "@/lib/initiatives/types";
import { heroObjectPosition, sortHeroProjects, type HeroFit, type HeroImage, type HeroProject } from "@/lib/homepage-hero";
import { sortIndexProjects, toIndexProject, type IndexProject, type IndexProjectDoc } from "@/lib/work-index";
import { pickWork, type WwdProjectDoc, type WwdWork } from "@/lib/what-we-do";
import { services } from "@/data/services";

// ── GROQ Queries ──

// A project's services as a list: the new serviceCategories field, or the legacy single
// serviceCategory as a one item list, so older projects keep working without a migration.
const serviceCategoriesProjection = `"serviceCategories": coalesce(serviceCategories, select(defined(serviceCategory) => [serviceCategory], []))`;

// Block images resolve their asset with natural dimensions, so blocks render at the true aspect ratio.
const blockImageProjection = `{ alt, hotspot, crop, "asset": asset->{ _id, url, metadata { dimensions { width, height, aspectRatio } } } }`;

const blocksProjection = `blocks[] {
  _type,
  _key,
  _type == "blockSplit" => { side, heading, body, image ${blockImageProjection} },
  _type == "blockOffset" => { heading, body, image ${blockImageProjection} },
  _type == "blockFull" => { caption, image ${blockImageProjection} },
  _type == "blockPair" => { "images": images[] ${blockImageProjection} },
  _type == "blockStatement" => { quote, body },
  _type == "blockFeature" => { caption, image ${blockImageProjection}, detail ${blockImageProjection} }
}`;

// Published documents only, the same filter in every query (and the client reads the published
// perspective as well): no drafts, no release versions.
const PUBLISHED = `!(_id in path("drafts.**")) && !(_id in path("versions.**"))`;

// Everything a case study page and the /work list read.
const caseStudyFields = `
  _id,
  title,
  "slug": slug.current,
  client,
  industry,
  year,
  overview,
  challenge,
  approach,
  deliverables,
  results,
  featuredImage,
  ${blocksProjection},
  gallery[] {
    _key,
    asset,
    alt,
    caption,
    hotspot,
    crop
  },
  testimonial,
  featured,
  projectType,
  ${serviceCategoriesProjection},
  disciplines,
  workDelivered,
  seoTitle,
  seoDescription,
  publishedAt
`;

// A case study card: the service pages' rows and the "Related work" row under an article.
const caseStudyCardFields = `title, "slug": slug.current, client, industry, overview, disciplines, projectType, featuredImage`;

const allProjectsQuery = `*[_type == "caseStudy" && ${PUBLISHED}] | order(publishedAt desc) {${caseStudyFields}}`;

const projectBySlugQuery = `*[_type == "caseStudy" && slug.current == $slug && ${PUBLISHED}][0] {${caseStudyFields}}`;

// A case study page: that case study in full, and every case study's slug and title in the /work
// order, only to find the next project (the list wraps round).
const projectDetailQuery = `{
  "doc": ${projectBySlugQuery},
  "order": *[_type == "caseStudy" && ${PUBLISHED}] | order(publishedAt desc) { "slug": slug.current, title }
}`;

// The homepage hero: case studies marked "Show in the homepage hero" that have a slug and at least one
// hero image. Ordered in code (src/lib/homepage-hero.ts), not here.
const heroProjectsQuery = `*[_type == "caseStudy" && heroShow == true && defined(slug.current) && count(heroImages) > 0 && ${PUBLISHED}] {
  title,
  "slug": slug.current,
  heroName,
  heroLine,
  heroWord,
  heroFit,
  heroOrder,
  projectType,
  "heroImages": heroImages[defined(asset)] {
    alt,
    hotspot,
    crop,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "lqip": asset->metadata.lqip
  }
}`;

// The work index (homepage Selected work and /work): every published case study, with only what the
// index shows. Each image resolves to its asset id (to drop repeats), file, size, alt text and blurred
// placeholder, as the hero's images do, with the editor's hotspot and crop. No page text; the hero line
// and the overview only for the project's one line (its first sentence). Mapped in src/lib/work-index.ts.
const indexImageProjection = `{
    alt,
    hotspot,
    crop,
    "id": asset->_id,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "lqip": asset->metadata.lqip
  }`;

const indexProjectsQuery = `*[_type == "caseStudy" && defined(slug.current) && ${PUBLISHED}] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  sector,
  disciplines,
  year,
  publishedAt,
  projectType,
  featured,
  homeOrder,
  heroLine,
  overview,
  "indexImages": indexImages[defined(asset)] ${indexImageProjection},
  "featuredImage": featuredImage ${indexImageProjection},
  "blockImages": blocks[] {
    "image": image ${indexImageProjection},
    "detail": detail ${indexImageProjection},
    "images": images[] ${indexImageProjection}
  }
}`;

// ── What the case study queries return ──

// A Sanity image as the queries project it: the asset reference (or the resolved asset), alt text,
// and the editor's crop and hotspot.
export interface CaseImage {
  _key?: string;
  asset?: { _ref?: string; _id?: string; url?: string } | null;
  alt?: string;
  caption?: string;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number };
}

// A case study document. Every field may be missing on an incomplete document, so the mappers below
// never assume one is there.
export interface CaseStudyDoc {
  _id?: string;
  title?: string;
  slug?: string;
  client?: string;
  industry?: string;
  year?: string | number;
  overview?: unknown;
  challenge?: PortableTextBlock[];
  approach?: PortableTextBlock[];
  deliverables?: string[];
  results?: PortableTextBlock[];
  featuredImage?: CaseImage | null;
  blocks?: unknown;
  gallery?: CaseImage[] | null;
  testimonial?: unknown;
  featured?: boolean;
  projectType?: unknown;
  serviceCategories?: unknown;
  disciplines?: unknown;
  workDelivered?: unknown;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
}

// ── Portable Text → plain text ──

interface PortableTextBlock {
  _type?: string;
  children?: { text?: string }[];
}

function portableTextToPlain(blocks: PortableTextBlock[] | undefined): string[] {
  if (!blocks || !Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => b._type === "block")
    .map((b) => (b.children || []).map((c) => c.text || "").join(""))
    .filter(Boolean);
}

// ── Sanity image → URL string ──

// The case study hero, the project cards and the related rows: a clean source up to 2400px wide
// (imageSource), never enlarged; next/image sizes it per screen.
function sanityImageUrl(img: CaseImage | null | undefined): string {
  if (!img?.asset) return "";
  try {
    return imageSource(img as SanityImageSource, CASE_IMAGE_WIDTH);
  } catch {
    return "";
  }
}

// The case study's share image: its cover cropped to 1200x630, or "" without one.
function sanityShareImageUrl(img: CaseImage | null | undefined): string {
  if (!img?.asset) return "";
  try {
    return shareImageUrl(img as SanityImageSource);
  } catch {
    return "";
  }
}

// ── Sanity page blocks → CaseStudyBlock[] ──

interface RawBlockImage {
  alt?: string;
  asset?: {
    _id?: string;
    metadata?: { dimensions?: { width?: number; height?: number } };
  } | null;
}

interface RawBlock {
  _type?: string;
  _key?: string;
  side?: string;
  heading?: string;
  body?: unknown;
  quote?: string;
  caption?: string;
  image?: RawBlockImage | null;
  detail?: RawBlockImage | null;
  images?: (RawBlockImage | null)[] | null;
}

// Block images keep their natural aspect ratio: no crop, never enlarged past the original, a clean
// source up to 2400px wide (imageSource), as the hero.
function toBlockImage(raw: RawBlockImage | null | undefined, fallbackAlt: string): BlockImage | null {
  const id = raw?.asset?._id;
  const width = raw?.asset?.metadata?.dimensions?.width;
  const height = raw?.asset?.metadata?.dimensions?.height;
  if (!id || !width || !height) return null;
  try {
    const src = imageSource({ _id: id }, CASE_IMAGE_WIDTH);
    // fallbackAlt is the project name: "<project>: <what is shown>".
    return { src, alt: projectAlt(fallbackAlt, raw?.alt), width, height };
  } catch {
    return null;
  }
}

function toBody(raw: unknown): PortableTextBody[] {
  return Array.isArray(raw) ? (raw as PortableTextBody[]) : [];
}

// Returns the mapped block, or a reason string when the block cannot render.
function mapBlock(raw: RawBlock, index: number, title: string): CaseStudyBlock | string {
  const key = raw._key || `block-${index}`;
  const image = toBlockImage(raw.image, title);

  switch (raw._type) {
    case "blockSplit":
      if (!image) return "missing image or image asset";
      return {
        key,
        type: "split",
        side: raw.side === "right" ? "right" : "left",
        heading: raw.heading || "",
        body: toBody(raw.body),
        image,
      };
    case "blockOffset":
      if (!image) return "missing image or image asset";
      return { key, type: "offset", heading: raw.heading || "", body: toBody(raw.body), image };
    case "blockFull":
      if (!image) return "missing image or image asset";
      return { key, type: "full", image, caption: raw.caption || undefined };
    case "blockPair": {
      const pair = (raw.images || []).map((img) => toBlockImage(img, title));
      const [first, second] = pair;
      if (pair.length !== 2 || !first || !second) return "an image pair needs exactly two images with assets";
      return { key, type: "pair", images: [first, second] };
    }
    case "blockStatement": {
      const quote = (raw.quote || "").trim();
      if (!quote) return "missing quote";
      const body = toBody(raw.body);
      return { key, type: "statement", quote, body: body.length ? body : undefined };
    }
    case "blockFeature": {
      const detail = toBlockImage(raw.detail, title);
      if (!image || !detail) return "missing main or detail image, or its asset";
      return { key, type: "feature", image, detail, caption: raw.caption || undefined };
    }
    default:
      return `unknown block type "${raw._type}"`;
  }
}

// Exported for the content mapping tests (tests/content-mapping.test.ts), like the two mappers below.
export function mapBlocks(raw: unknown, slug: string, title: string): CaseStudyBlock[] {
  if (!Array.isArray(raw)) return [];
  const blocks: CaseStudyBlock[] = [];
  (raw as RawBlock[]).forEach((block, index) => {
    const mapped = mapBlock(block || {}, index, title);
    if (typeof mapped === "string") {
      console.warn(`[sanity/projects] Skipping block ${block?._key || index} on "${slug}": ${mapped}`);
    } else {
      blocks.push(mapped);
    }
  });
  return blocks;
}

// ── Map Sanity caseStudy → Project (for /work list) ──

export function mapSanityToProject(doc: CaseStudyDoc, index: number): Project {
  const overviewText = typeof doc.overview === "string" ? doc.overview : "";
  const imageUrl = sanityImageUrl(doc.featuredImage);

  return {
    slug: doc.slug || "",
    number: String(index + 1).padStart(2, "0"),
    name: doc.title || "",
    workType: "Brand Identity",
    origin: "Client Project",
    year: doc.year ? String(doc.year) : "",
    description: overviewText,
    shortDescription: overviewText.length > 120 ? overviewText.slice(0, 120) + "…" : overviewText,
    // Bare title: the root layout's title template adds the studio name.
    seoTitle: doc.seoTitle || doc.title || "",
    seoDescription: doc.seoDescription || overviewText,
    image: imageUrl,
    shareImage: sanityShareImageUrl(doc.featuredImage) || undefined,
    sections: {
      business: {
        label: "(The business)",
        paragraphs: overviewText ? [overviewText] : [],
      },
      challenge: {
        label: "(The challenge)",
        paragraphs: portableTextToPlain(doc.challenge),
      },
      approach: {
        label: "(The approach)",
        paragraphs: portableTextToPlain(doc.approach),
      },
      deliverables: {
        label: "(Deliverables)",
        paragraphs: [],
      },
      result: {
        label: "(The result)",
        paragraphs: portableTextToPlain(doc.results),
      },
    },
    deliverablesList: doc.deliverables || [],
    disciplines: Array.isArray(doc.disciplines) && doc.disciplines.length > 0
      ? doc.disciplines
      : undefined,
    serviceCategories: Array.isArray(doc.serviceCategories) && doc.serviceCategories.length > 0
      ? doc.serviceCategories
      : undefined,
    projectType: projectType(doc.projectType),
  };
}

// ── Map Sanity caseStudy → ProjectDetail (for /work/[slug]) ──

// "order" is every case study's slug and title in the /work order, for the next project link.
export function mapSanityToProjectDetail(doc: CaseStudyDoc, order: Array<Pick<CaseStudyDoc, "slug" | "title">>): ProjectDetail {
  const overviewText = typeof doc.overview === "string" ? doc.overview : "";
  const imageUrl = sanityImageUrl(doc.featuredImage);
  // The cover's alt names the project and its primary discipline.
  const cover = coverAlt(doc.title || "", doc.featuredImage?.alt, Array.isArray(doc.disciplines) && doc.disciplines[0] ? disciplineLabel(doc.disciplines[0]) : "");

  // Build gallery images
  const galleryImages: ProjectDetailImage[] = (doc.gallery || [])
    .map((img) => ({
      src: sanityImageUrl(img),
      alt: projectAlt(doc.title || "", img.alt),
    }))
    .filter((img: ProjectDetailImage) => img.src);

  // Find next project (circular)
  const currentIdx = order.findIndex((d) => d.slug === doc.slug);
  const nextDoc = order[(currentIdx + 1) % order.length] || order[0];

  // Build deliverables with descriptions
  const deliverables = (doc.deliverables || []).map((d: string) => ({
    title: d,
    description: "",
  }));

  return {
    slug: doc.slug || "",
    name: doc.title || "",
    category: "Brand Identity",
    year: doc.year ? String(doc.year) : "",
    industry: doc.industry || undefined,
    projectType: projectType(doc.projectType),
    timeline: undefined,
    summary: overviewText,
    heroImage: {
      src: imageUrl,
      alt: cover,
    },
    overview: {
      heading: "The business",
      paragraphs: overviewText ? [overviewText] : [],
    },
    challenge: {
      heading: "The challenge",
      paragraphs: portableTextToPlain(doc.challenge),
    },
    approach: {
      heading: "The approach",
      paragraphs: portableTextToPlain(doc.approach),
    },
    deliverables,
    images: {
      set1: galleryImages.length > 0
        ? galleryImages
        : imageUrl
          ? [{ src: imageUrl, alt: cover }]
          : [],
    },
    result: {
      heading: "The result",
      paragraphs: portableTextToPlain(doc.results),
    },
    nextProject: {
      slug: nextDoc?.slug || "",
      name: nextDoc?.title || "",
    },
    blocks: mapBlocks(doc.blocks, doc.slug || "", doc.title || ""),
    workDelivered: Array.isArray(doc.workDelivered) ? doc.workDelivered.filter((w: unknown) => typeof w === "string") : [],
  };
}

// ── Public API ──
// A failed read follows readSanity (./resilience): the local data below only while building or
// without Sanity; at runtime the error is rethrown so the last good page stays. An answer with
// nothing in it follows the same rule (localWhenAllowed): the local data only while building or
// without Sanity, otherwise nothing, so a case study Sanity does not have goes through
// redirectOrNotFound and never serves the old coded copy.

// When Sanity has answered with nothing: the local data while building or without Sanity, else none.
async function localWhenAllowed<T>(local: () => Promise<T>, none: T): Promise<T> {
  return sanityFallbackAllowed() ? local() : none;
}

async function localProjects(): Promise<Project[]> {
  const { projects } = await import("@/data/projects");
  return projects;
}

async function localProjectBySlug(slug: string): Promise<Project | null> {
  return (await localProjects()).find((p) => p.slug === slug) || null;
}

// The fallback for one case study: the local copy, or the original error when there is none, so a
// failed read is never mistaken for a slug that does not exist.
async function localProjectOrRethrow(slug: string, error: unknown): Promise<Project> {
  const project = await localProjectBySlug(slug);
  if (!project) throw error;
  return project;
}

async function localProjectDetail(slug: string): Promise<ProjectDetail | null> {
  const { getProjectDetail } = await import("@/data/projectDetails");
  return getProjectDetail(slug) || null;
}

export async function getAllProjects(): Promise<Project[]> {
  return readSanity(
    "all case studies",
    async () => {
      const docs = await client.fetch<CaseStudyDoc[]>(allProjectsQuery);
      return docs && docs.length > 0 ? docs.map(mapSanityToProject) : localWhenAllowed(localProjects, []);
    },
    localProjects
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return readSanity(
    `case study "${slug}"`,
    async () => {
      const doc = await client.fetch<CaseStudyDoc | null>(projectBySlugQuery, { slug });
      return doc ? mapSanityToProject(doc, 0) : localWhenAllowed(() => localProjectBySlug(slug), null);
    },
    (error) => localProjectOrRethrow(slug, error)
  );
}

export async function getProjectDetailBySlug(slug: string): Promise<ProjectDetail | null> {
  return readSanity(
    `case study detail "${slug}"`,
    async () => {
      const { doc, order } = await client.fetch<{ doc: CaseStudyDoc | null; order: Array<Pick<CaseStudyDoc, "slug" | "title">> | null }>(projectDetailQuery, { slug });
      return doc && Array.isArray(order) && order.length > 0 ? mapSanityToProjectDetail(doc, order) : localWhenAllowed(() => localProjectDetail(slug), null);
    },
    async (error) => {
      const detail = await localProjectDetail(slug);
      if (!detail) throw error;
      return detail;
    }
  );
}

// ── Map Sanity caseStudy → HomepageProject (for homepage featured work) ──

// A hero project as the query returns it. Every field may be missing on a document that skipped
// Studio's checks, so the mapper below never assumes one is there.
interface HeroProjectDoc {
  title?: string;
  slug?: string;
  heroName?: string;
  heroLine?: string;
  heroWord?: string;
  heroFit?: string;
  heroOrder?: number;
  projectType?: unknown;
  heroImages?: Array<{
    alt?: string;
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
    url?: string;
    width?: number;
    height?: number;
    lqip?: string;
  }> | null;
}

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

// Images without a file are left out, and so is a project left with none. The hero name falls back
// to the title; the alt text falls back to the hero name.
export function mapHeroProject(doc: HeroProjectDoc): HeroProject | null {
  const title = str(doc.title);
  const slug = str(doc.slug);
  const heroName = str(doc.heroName) || title;
  const heroImages: HeroImage[] = (doc.heroImages || []).flatMap((image) => {
    const url = str(image?.url);
    if (!url) return [];
    return [{
      url,
      alt: str(image.alt) || heroName,
      ...(typeof image.width === "number" ? { width: image.width } : {}),
      ...(typeof image.height === "number" ? { height: image.height } : {}),
      ...(str(image.lqip) ? { lqip: str(image.lqip) } : {}),
      ...(image.hotspot ? { hotspot: { x: image.hotspot.x, y: image.hotspot.y } } : {}),
      ...(image.crop ? { crop: { top: image.crop.top, bottom: image.crop.bottom, left: image.crop.left, right: image.crop.right } } : {}),
    }];
  });
  if (!title || !slug || heroImages.length === 0) return null;
  const heroFit: HeroFit = doc.heroFit === "contain" ? "contain" : "cover";
  return {
    title,
    slug,
    heroName,
    heroLine: str(doc.heroLine),
    heroWord: str(doc.heroWord),
    heroFit,
    ...(typeof doc.heroOrder === "number" && Number.isFinite(doc.heroOrder) ? { heroOrder: doc.heroOrder } : {}),
    projectType: projectType(doc.projectType),
    heroImages,
  };
}

// The homepage hero's projects, in hero order, at most HERO_MAX. Read with readSanity like the
// featured projects; with nothing to show (or Sanity unreachable while building) the list is empty.
export async function getHeroProjects(): Promise<HeroProject[]> {
  return readSanity(
    "homepage hero projects",
    async () => {
      const docs = await client.fetch<HeroProjectDoc[]>(heroProjectsQuery);
      const projects = (docs || []).map(mapHeroProject).filter((p): p is HeroProject => p !== null);
      return sortHeroProjects(projects);
    },
    () => []
  );
}

// Every published case study for the work index, in the index order (client work first, then newest).
// Read with readSanity, so a failed read keeps the last good result; with nothing to fall back on (a
// build without Sanity) the list is empty.
export async function getIndexProjects(): Promise<IndexProject[]> {
  return readSanity(
    "work index projects",
    async () => {
      const docs = await client.fetch<IndexProjectDoc[]>(indexProjectsQuery);
      const projects = (docs || []).map(toIndexProject).filter((p): p is IndexProject => p !== null);
      return sortIndexProjects(projects);
    },
    () => []
  );
}

// ── Service category project type ──

export interface ServiceProject {
  slug: string;
  name: string;
  // The card's second line, from real fields only: industry, else client when it differs from the
  // title, else the overview's first sentence. Never invented.
  subtitle: string;
  image: string;
  disciplines: string[];
  projectType: ProjectType;
}

function firstSentence(text: unknown): string {
  if (typeof text !== "string") return "";
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : trimmed).trim();
}

const serviceCategoryQuery = `*[_type == "caseStudy" && (defined(serviceCategories) || defined(serviceCategory)) && ${PUBLISHED}] | order(publishedAt desc) {
  ${caseStudyCardFields},
  ${serviceCategoriesProjection}
}`;

type ServiceCategoryMap = Record<string, ServiceProject[]>;

function toServiceProject(doc: CaseStudyDoc): ServiceProject {
  return {
    slug: doc.slug || "",
    name: doc.title || "",
    subtitle: (
      doc.industry ||
      (doc.client && doc.client !== doc.title ? doc.client : "") ||
      firstSentence(doc.overview) ||
      ""
    ).trim(),
    image: sanityImageUrl(doc.featuredImage),
    disciplines: Array.isArray(doc.disciplines) ? doc.disciplines : [],
    projectType: projectType(doc.projectType),
  };
}

export async function getAllProjectsGroupedByService(): Promise<ServiceCategoryMap> {
  const empty: ServiceCategoryMap = {
    "brand-identity": [],
    "visual-media": [],
    "digital-design": [],
    "creative-strategy": [],
  };

  return readSanity(
    "case studies by service",
    async () => {
      const docs = await client.fetch<CaseStudyDoc[]>(serviceCategoryQuery);
      if (!docs || docs.length === 0) return empty;

      const grouped = { ...empty };
      // A project appears under every service it covers, once per service.
      docs.forEach((doc) => {
        const categories: string[] = Array.isArray(doc.serviceCategories) ? doc.serviceCategories : [];
        const project = toServiceProject(doc);
        for (const cat of new Set(categories)) {
          if (grouped[cat]) grouped[cat].push(project);
        }
      });
      return grouped;
    },
    () => empty
  );
}

// Every case study as a card, newest first: the "Related work" row at the end of an article.
// Empty when Sanity has none (or, while building, cannot be reached), and the row is then hidden.
export async function getProjectCards(): Promise<ServiceProject[]> {
  return readSanity(
    "case study cards",
    async () => {
      const docs = await client.fetch<CaseStudyDoc[]>(`*[_type == "caseStudy" && defined(slug.current) && ${PUBLISHED}] | order(publishedAt desc) { ${caseStudyCardFields} }`);
      return Array.isArray(docs) ? docs.map(toServiceProject).filter((p: ServiceProject) => p.slug) : [];
    },
    () => []
  );
}

// ── Project Planner: published case studies that say what they delivered ──

export interface PlannerCaseStudy {
  title: string;
  slug: string;
  workDelivered: string[];
}

const plannerCaseStudiesQuery = `*[_type == "caseStudy" && defined(slug.current) && count(workDelivered) > 0 && ${PUBLISHED}] | order(publishedAt desc) {
  "title": title,
  "slug": slug.current,
  workDelivered
}`;

// Related work for the planner. Never falls back to unrelated projects: on any failure, none.
// Deliberately not readSanity: /start renders on every request, so there is no earlier page to
// keep, and the planner works without these.
export async function getPlannerCaseStudies(): Promise<PlannerCaseStudy[]> {
  try {
    const docs: unknown = await client.fetch(plannerCaseStudiesQuery, {}, { next: { revalidate: 60 } });
    if (!Array.isArray(docs)) return [];
    return docs
      .filter((d) => d && typeof d.title === "string" && typeof d.slug === "string" && Array.isArray(d.workDelivered))
      .map((d) => ({ title: d.title.trim(), slug: d.slug, workDelivered: d.workDelivered.filter((w: unknown) => typeof w === "string") }));
  } catch (error) {
    console.warn("[sanity] planner case studies failed, showing none:", error instanceof Error ? error.name : "unknown error");
    return [];
  }
}

// ── Initiatives: published case studies of one project type, newest first ──

const projectsByTypeQuery = `*[_type == "caseStudy" && projectType in $types && defined(slug.current) && ${PUBLISHED}] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  year,
  overview,
  featuredImage,
  disciplines,
  projectType,
  ${serviceCategoriesProjection}
}`;

// Grouped by type. Empty lists when Sanity has none (or, while building, cannot be reached): pages
// show their empty line.
export async function getProjectsByType(types: ProjectType[]): Promise<Record<ProjectType, Project[]>> {
  const empty = (): Record<ProjectType, Project[]> => ({ client: [], exploration: [], parallel: [], commons: [] });
  return readSanity(
    "case studies by type",
    async () => {
      const grouped = empty();
      const docs: unknown = await client.fetch(projectsByTypeQuery, { types });
      if (Array.isArray(docs)) {
        docs.forEach((doc, i) => {
          const project = mapSanityToProject(doc, i);
          if (project.projectType && types.includes(project.projectType)) grouped[project.projectType].push(project);
        });
      }
      return grouped;
    },
    empty
  );
}

// ── Homepage (02) What we do: the real work behind each discipline ──

// Projects with at least one "What we do" entry. Ordered and filtered in code (src/lib/what-we-do.ts).
const whatWeDoQuery = `*[_type == "caseStudy" && defined(slug.current) && count(whatWeDo) > 0 && ${PUBLISHED}] {
  "slug": slug.current,
  title,
  heroName,
  projectType,
  homeOrder,
  publishedAt,
  "whatWeDo": whatWeDo[] {
    discipline,
    "image": image { alt, hotspot, crop, "url": asset->url }
  }
}`;

// For each of the 30 disciplines, the case study that shows it: the first project listing it that is
// marked client or Commons (never an exploration, a Parallel project or one with no type), by Homepage
// order, then newest. A discipline without one stays plain text.
export async function getWhatWeDoWork(): Promise<Record<string, WwdWork>> {
  const disciplines = services.flatMap((s) => s.deliverables.map((d) => d.name));
  return readSanity(
    "what we do work",
    async () => {
      const docs = await client.fetch<WwdProjectDoc[]>(whatWeDoQuery);
      return pickWork(docs || [], disciplines, (image) => ({ src: wwdPreviewUrl({ url: image.url!, crop: image.crop }), position: heroObjectPosition(image) }));
    },
    () => ({})
  );
}
