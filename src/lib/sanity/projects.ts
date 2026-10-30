import { client } from "./client";
import { shareImageUrl, urlFor } from "./image";
import { readSanity } from "./resilience";
import { disciplineLabel } from "@/lib/disciplines";
import { coverAlt, projectAlt } from "@/lib/alt-text";
import type { Project } from "@/data/projects";
import type { PortableTextBlock as PortableTextBody } from "@portabletext/react";
import type { BlockImage, CaseStudyBlock, ProjectDetail, ProjectDetailImage } from "@/data/projectDetails";
import type { Project as HomepageProject } from "@/lib/constants/homepage-data";
import { projectType, type ProjectType } from "@/lib/initiatives/types";

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

const allProjectsQuery = `*[_type == "caseStudy"] | order(publishedAt desc) {
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
}`;

const projectBySlugQuery = `*[_type == "caseStudy" && slug.current == $slug][0] {
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
}`;

const featuredProjectsQuery = `*[_type == "caseStudy" && featured == true] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  overview,
  projectType,
  featuredImage
}`;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanityImageUrl(img: any): string {
  if (!img?.asset) return "";
  try {
    return urlFor(img).width(1600).auto("format").quality(80).url();
  } catch {
    return "";
  }
}

// The case study's share image: its cover cropped to 1200x630, or "" without one.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanityShareImageUrl(img: any): string {
  if (!img?.asset) return "";
  try {
    return shareImageUrl(img);
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

// Block images keep their natural aspect ratio: no crop, never enlarged past the original.
// Only block images request a modern format here; sanityImageUrl is unchanged.
function toBlockImage(raw: RawBlockImage | null | undefined, fallbackAlt: string): BlockImage | null {
  const id = raw?.asset?._id;
  const width = raw?.asset?.metadata?.dimensions?.width;
  const height = raw?.asset?.metadata?.dimensions?.height;
  if (!id || !width || !height) return null;
  try {
    const src = urlFor({ _id: id }).width(2000).fit("max").auto("format").url();
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

function mapBlocks(raw: unknown, slug: string, title: string): CaseStudyBlock[] {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSanityToProject(doc: any, index: number): Project {
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
    gradient: "linear-gradient(155deg, #D8D2CA, #C8BFB4)",
    image: imageUrl,
    shareImage: sanityShareImageUrl(doc.featuredImage) || undefined,
    sections: {
      business: {
        label: "(The Business)",
        paragraphs: overviewText ? [overviewText] : [],
      },
      challenge: {
        label: "(The Challenge)",
        paragraphs: portableTextToPlain(doc.challenge),
      },
      approach: {
        label: "(The Approach)",
        paragraphs: portableTextToPlain(doc.approach),
      },
      deliverables: {
        label: "(Deliverables)",
        paragraphs: [],
      },
      result: {
        label: "(The Result)",
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSanityToProjectDetail(doc: any, allDocs: any[]): ProjectDetail {
  const overviewText = typeof doc.overview === "string" ? doc.overview : "";
  const imageUrl = sanityImageUrl(doc.featuredImage);
  // The cover's alt names the project and its primary discipline.
  const cover = coverAlt(doc.title || "", doc.featuredImage?.alt, Array.isArray(doc.disciplines) && doc.disciplines[0] ? disciplineLabel(doc.disciplines[0]) : "");

  // Build gallery images
  const galleryImages: ProjectDetailImage[] = (doc.gallery || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((img: any) => ({
      src: sanityImageUrl(img),
      alt: projectAlt(doc.title || "", img.alt),
    }))
    .filter((img: ProjectDetailImage) => img.src);

  // Find next project (circular)
  const currentIdx = allDocs.findIndex((d) => d.slug === doc.slug);
  const nextDoc = allDocs[(currentIdx + 1) % allDocs.length] || allDocs[0];

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
      heading: "The Business",
      paragraphs: overviewText ? [overviewText] : [],
    },
    challenge: {
      heading: "The Challenge",
      paragraphs: portableTextToPlain(doc.challenge),
    },
    approach: {
      heading: "The Approach",
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
      heading: "The Result",
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
// without Sanity; at runtime the error is rethrown so the last good page stays. When Sanity answers
// with nothing, the local data is used as before.

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
      const docs = await client.fetch(allProjectsQuery);
      return docs && docs.length > 0 ? docs.map(mapSanityToProject) : localProjects();
    },
    localProjects
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return readSanity(
    `case study "${slug}"`,
    async () => {
      const doc = await client.fetch(projectBySlugQuery, { slug });
      return doc ? mapSanityToProject(doc, 0) : localProjectBySlug(slug);
    },
    (error) => localProjectOrRethrow(slug, error)
  );
}

export async function getProjectDetailBySlug(slug: string): Promise<ProjectDetail | null> {
  return readSanity(
    `case study detail "${slug}"`,
    async () => {
      const allDocs = await client.fetch(allProjectsQuery);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = allDocs && allDocs.length > 0 ? allDocs.find((d: any) => d.slug === slug) : null;
      return doc ? mapSanityToProjectDetail(doc, allDocs) : localProjectDetail(slug);
    },
    async (error) => {
      const detail = await localProjectDetail(slug);
      if (!detail) throw error;
      return detail;
    }
  );
}

// ── Map Sanity caseStudy → HomepageProject (for homepage featured work) ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSanityToHomepageProject(doc: any): HomepageProject {
  const overviewText = typeof doc.overview === "string" ? doc.overview : "";
  const imageUrl = sanityImageUrl(doc.featuredImage);

  return {
    name: doc.title || "",
    label: "Brand Identity",
    sentence: overviewText.length > 160 ? overviewText.slice(0, 160) + "…" : overviewText,
    href: `/work/${doc.slug || ""}`,
    projectType: projectType(doc.projectType),
    color: "#2B2B2B",
    accent: "#C9A96E",
    image: imageUrl,
  };
}

async function localFeaturedProjects(): Promise<HomepageProject[]> {
  const { PROJECTS } = await import("@/lib/constants/homepage-data");
  return PROJECTS;
}

export async function getFeaturedProjects(): Promise<HomepageProject[]> {
  return readSanity(
    "featured case studies",
    async () => {
      const docs = await client.fetch(featuredProjectsQuery);
      return docs && docs.length > 0 ? docs.map(mapSanityToHomepageProject) : localFeaturedProjects();
    },
    localFeaturedProjects
  );
}

// Canonical discipline order for the filter bar
const DISCIPLINE_ORDER = [
  "brand-identity",
  "packaging",
  "publication",
  "art-direction",
  "website",
  "video",
  "photography",
  "social-content",
  "strategy",
];


export interface DisciplineFilter {
  value: string;
  label: string;
}

export function getWorkTypeFilters(): DisciplineFilter[] {
  return DISCIPLINE_ORDER.map((d) => ({ value: d, label: disciplineLabel(d) }));
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

const serviceCategoryQuery = `*[_type == "caseStudy" && (defined(serviceCategories) || defined(serviceCategory))] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  ${serviceCategoriesProjection},
  client,
  industry,
  overview,
  disciplines,
  projectType,
  featuredImage
}`;

type ServiceCategoryMap = Record<string, ServiceProject[]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toServiceProject(doc: any): ServiceProject {
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
      const docs = await client.fetch(serviceCategoryQuery);
      if (!docs || docs.length === 0) return empty;

      const grouped = { ...empty };
      // A project appears under every service it covers, once per service.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      docs.forEach((doc: any) => {
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
      const docs = await client.fetch(`*[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc) {
  title, "slug": slug.current, client, industry, overview, disciplines, projectType, featuredImage
}`);
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

const plannerCaseStudiesQuery = `*[_type == "caseStudy" && defined(slug.current) && count(workDelivered) > 0 && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(publishedAt desc) {
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

const projectsByTypeQuery = `*[_type == "caseStudy" && projectType in $types && defined(slug.current) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(publishedAt desc) {
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
