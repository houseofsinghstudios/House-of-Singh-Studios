import { client } from "./client";
import { urlFor } from "./image";
import { disciplineLabel } from "@/lib/disciplines";
import type { Project } from "@/data/projects";
import type { PortableTextBlock as PortableTextBody } from "@portabletext/react";
import type { BlockImage, CaseStudyBlock, ProjectDetail, ProjectDetailImage } from "@/data/projectDetails";
import type { Project as HomepageProject } from "@/lib/constants/homepage-data";

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
    return { src, alt: raw?.alt || fallbackAlt, width, height };
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
  };
}

// ── Map Sanity caseStudy → ProjectDetail (for /work/[slug]) ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSanityToProjectDetail(doc: any, allDocs: any[]): ProjectDetail {
  const overviewText = typeof doc.overview === "string" ? doc.overview : "";
  const imageUrl = sanityImageUrl(doc.featuredImage);

  // Build gallery images
  const galleryImages: ProjectDetailImage[] = (doc.gallery || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((img: any) => ({
      src: sanityImageUrl(img),
      alt: img.alt || doc.title || "",
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
    timeline: undefined,
    summary: overviewText,
    heroImage: {
      src: imageUrl,
      alt: doc.featuredImage?.alt || doc.title || "",
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
          ? [{ src: imageUrl, alt: doc.title || "" }]
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

export async function getAllProjects(): Promise<Project[]> {
  try {
    const docs = await client.fetch(allProjectsQuery);
    if (docs && docs.length > 0) {
      return docs.map(mapSanityToProject);
    }
  } catch (error) {
    console.error("[sanity/projects] Fetch failed, using fallback:", error);
  }
  const { projects } = await import("@/data/projects");
  return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const doc = await client.fetch(projectBySlugQuery, { slug });
    if (doc) {
      return mapSanityToProject(doc, 0);
    }
  } catch (error) {
    console.error("[sanity/projects] Slug fetch failed, using fallback:", error);
  }
  const { projects } = await import("@/data/projects");
  return projects.find((p) => p.slug === slug) || null;
}

export async function getProjectDetailBySlug(slug: string): Promise<ProjectDetail | null> {
  try {
    const allDocs = await client.fetch(allProjectsQuery);
    if (allDocs && allDocs.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = allDocs.find((d: any) => d.slug === slug);
      if (doc) {
        return mapSanityToProjectDetail(doc, allDocs);
      }
    }
  } catch (error) {
    console.error("[sanity/projects] Detail fetch failed, using fallback:", error);
  }
  const { getProjectDetail } = await import("@/data/projectDetails");
  return getProjectDetail(slug) || null;
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
    color: "#2B2B2B",
    accent: "#C9A96E",
    image: imageUrl,
  };
}

export async function getFeaturedProjects(): Promise<HomepageProject[]> {
  try {
    const docs = await client.fetch(featuredProjectsQuery);
    if (docs && docs.length > 0) {
      return docs.map(mapSanityToHomepageProject);
    }
  } catch (error) {
    console.error("[sanity/projects] Featured fetch failed, using fallback:", error);
  }
  const { PROJECTS } = await import("@/lib/constants/homepage-data");
  return PROJECTS;
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
  featuredImage
}`;

type ServiceCategoryMap = Record<string, ServiceProject[]>;

export async function getAllProjectsGroupedByService(): Promise<ServiceCategoryMap> {
  const empty: ServiceCategoryMap = {
    "brand-identity": [],
    "visual-media": [],
    "digital-design": [],
    "creative-strategy": [],
  };

  try {
    const docs = await client.fetch(serviceCategoryQuery);
    if (!docs || docs.length === 0) return empty;

    const grouped = { ...empty };
    // A project appears under every service it covers, once per service.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    docs.forEach((doc: any) => {
      const categories: string[] = Array.isArray(doc.serviceCategories) ? doc.serviceCategories : [];
      const project: ServiceProject = {
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
      };
      for (const cat of new Set(categories)) {
        if (grouped[cat]) grouped[cat].push(project);
      }
    });
    return grouped;
  } catch (error) {
    console.error("[sanity/projects] Service category fetch failed:", error);
    return empty;
  }
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
export async function getPlannerCaseStudies(): Promise<PlannerCaseStudy[]> {
  try {
    const docs: unknown = await client.fetch(plannerCaseStudiesQuery, {}, { next: { revalidate: 60 } });
    if (!Array.isArray(docs)) return [];
    return docs
      .filter((d) => d && typeof d.title === "string" && typeof d.slug === "string" && Array.isArray(d.workDelivered))
      .map((d) => ({ title: d.title.trim(), slug: d.slug, workDelivered: d.workDelivered.filter((w: unknown) => typeof w === "string") }));
  } catch (error) {
    console.warn("[sanity/projects] Planner case studies fetch failed:", error instanceof Error ? error.name : "unknown error");
    return [];
  }
}
