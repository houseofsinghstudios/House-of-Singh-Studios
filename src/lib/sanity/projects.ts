import { client } from "./client";
import { urlFor } from "./image";
import type { Project, ProjectSection } from "@/data/projects";
import type { ProjectDetail, ProjectDetailImage } from "@/data/projectDetails";
import type { Project as HomepageProject } from "@/lib/constants/homepage-data";

// ── GROQ Queries ──

const allProjectsQuery = `*[_type == "caseStudy"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  client,
  industry,
  services[]-> { _id, title, slug },
  year,
  overview,
  challenge,
  approach,
  deliverables,
  results,
  featuredImage,
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
  serviceCategory,
  disciplines,
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
  services[]-> { _id, title, slug },
  year,
  overview,
  challenge,
  approach,
  deliverables,
  results,
  featuredImage,
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
  serviceCategory,
  disciplines,
  seoTitle,
  seoDescription,
  publishedAt
}`;

const featuredProjectsQuery = `*[_type == "caseStudy" && featured == true] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  services[]-> { _id, title, slug },
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
    return urlFor(img).width(1600).url();
  } catch {
    return "";
  }
}

// ── Map Sanity caseStudy → Project (for /work list) ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSanityToProject(doc: any, index: number): Project {
  const serviceNames = (doc.services || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((s: any) => s.title)
    .filter(Boolean)
    .join(", ");

  const overviewText = typeof doc.overview === "string" ? doc.overview : "";
  const imageUrl = sanityImageUrl(doc.featuredImage);

  return {
    slug: doc.slug || "",
    number: String(index + 1).padStart(2, "0"),
    name: doc.title || "",
    workType: serviceNames || "Brand Identity",
    origin: "Client Project",
    year: doc.year ? String(doc.year) : "",
    description: overviewText,
    shortDescription: overviewText.length > 120 ? overviewText.slice(0, 120) + "…" : overviewText,
    seoTitle: doc.seoTitle || `${doc.title} — House of Singh Studios`,
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
    serviceCategory: doc.serviceCategory || undefined,
  };
}

// ── Map Sanity caseStudy → ProjectDetail (for /work/[slug]) ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSanityToProjectDetail(doc: any, allDocs: any[]): ProjectDetail {
  const serviceNames = (doc.services || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((s: any) => s.title)
    .filter(Boolean)
    .join(", ");

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
    category: serviceNames || "Brand Identity",
    year: doc.year ? String(doc.year) : "",
    industry: doc.industry || undefined,
    timeline: undefined,
    summary: overviewText,
    heroImage: {
      src: imageUrl,
      alt: doc.title || "",
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
  const serviceNames = (doc.services || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((s: any) => s.title)
    .filter(Boolean)
    .join(", ");

  const overviewText = typeof doc.overview === "string" ? doc.overview : "";
  const imageUrl = sanityImageUrl(doc.featuredImage);

  return {
    name: doc.title || "",
    label: serviceNames || "Brand Identity",
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

const DISCIPLINE_LABELS: Record<string, string> = {
  "brand-identity": "Brand Identity",
  packaging: "Packaging",
  publication: "Publication",
  "art-direction": "Art Direction",
  website: "Website",
  video: "Video",
  photography: "Photography",
  "social-content": "Social Content",
  strategy: "Strategy",
};

export interface DisciplineFilter {
  value: string;
  label: string;
}

export function getWorkTypeFilters(projects: Project[]): DisciplineFilter[] {
  // Collect disciplines that exist on at least one project
  const found = new Set<string>();
  let hasDisciplines = false;

  projects.forEach((p) => {
    if (p.disciplines && p.disciplines.length > 0) {
      hasDisciplines = true;
      p.disciplines.forEach((d) => found.add(d));
    }
  });

  // If no projects have disciplines set yet, fall back to workType strings
  if (!hasDisciplines) {
    const types = new Set<string>();
    projects.forEach((p) => {
      p.workType.split(",").forEach((t) => {
        const trimmed = t.trim();
        if (trimmed) types.add(trimmed);
      });
    });
    return Array.from(types).map((t) => ({ value: t, label: t }));
  }

  // Return in canonical order, only disciplines that have matching projects
  return DISCIPLINE_ORDER
    .filter((d) => found.has(d))
    .map((d) => ({ value: d, label: DISCIPLINE_LABELS[d] || d }));
}

// ── Service category project type ──

export interface ServiceProject {
  slug: string;
  name: string;
  image: string;
  disciplines: string[];
}

const serviceCategoryQuery = `*[_type == "caseStudy" && defined(serviceCategory)] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  serviceCategory,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    docs.forEach((doc: any) => {
      const cat = doc.serviceCategory as string;
      if (cat && grouped[cat]) {
        grouped[cat].push({
          slug: doc.slug || "",
          name: doc.title || "",
          image: sanityImageUrl(doc.featuredImage),
          disciplines: Array.isArray(doc.disciplines) ? doc.disciplines : [],
        });
      }
    });
    return grouped;
  } catch (error) {
    console.error("[sanity/projects] Service category fetch failed:", error);
    return empty;
  }
}
