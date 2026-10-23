// Initiatives and project types. Pure, so pages, queries and tests share one set of rules.
// The lists must match sanity/schemas/initiative.ts, sanity/schemas/caseStudy.ts and
// scripts/import-portfolio/lib/config.mjs.

export const PROJECT_TYPES = ["client", "exploration", "parallel", "commons"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

// The visible label for each project type. Client work shows nothing new.
export const PROJECT_TYPE_LABELS: Record<ProjectType, string | null> = {
  client: null,
  exploration: "Exploration",
  parallel: "Parallel",
  commons: "Commons",
};

// Anything missing or unknown is client work: existing case studies have no projectType.
export function projectType(value: unknown): ProjectType {
  return (PROJECT_TYPES as readonly unknown[]).includes(value) ? (value as ProjectType) : "client";
}

export function projectTypeLabel(value: unknown): string | null {
  return PROJECT_TYPE_LABELS[projectType(value)];
}

export const INITIATIVE_STATUSES = ["live", "nominations-open", "opening-soon", "by-invitation", "hidden"] as const;
export type InitiativeStatus = (typeof INITIATIVE_STATUSES)[number];

// The words shown in brackets on the status line when no statusLabel override is set.
// A live program with no override shows no status line at all.
export const STATUS_LABELS: Record<Exclude<InitiativeStatus, "hidden">, string> = {
  live: "",
  "nominations-open": "Nominations open",
  "opening-soon": "Opening soon",
  "by-invitation": "By invitation",
};

// One short fact for the landing panel, for example "3 projects a year". The label is optional.
export interface GlanceItem {
  label?: string;
  value: string;
}

export const MAX_GLANCE = 3;

// An organization Commons has done pro bono work for, shown as its logo. Order as entered in Studio.
export interface Recognition {
  name: string;
  year?: number;
  logo: { url: string; alt: string; width: number; height: number };
}

export interface Initiative {
  name: string;
  slug: string;
  category: string;
  tagline: string;
  summary: string;
  status: InitiativeStatus;
  statusLabel?: string;
  order: number;
  hasPage: boolean;
  seoTitle?: string;
  seoDescription?: string;
  atAGlance: GlanceItem[];
  recognitions: Recognition[];
}

// An unknown status is treated as hidden: nothing appears by accident.
export function initiativeStatus(value: unknown): InitiativeStatus {
  return (INITIATIVE_STATUSES as readonly unknown[]).includes(value) ? (value as InitiativeStatus) : "hidden";
}

export const isVisible = (i: Pick<Initiative, "status">) => i.status !== "hidden";

// Visible initiatives in their display order. Hidden ones never leave this function.
export function visibleInitiatives<T extends Pick<Initiative, "status" | "order" | "name">>(list: T[]): T[] {
  return list.filter(isVisible).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

// The bracketed status text: the override if set, otherwise the default for the status (none for live).
export function statusText(i: Pick<Initiative, "status" | "statusLabel">): string {
  if (i.statusLabel && i.statusLabel.trim()) return i.statusLabel.trim();
  return i.status === "hidden" ? "" : STATUS_LABELS[i.status];
}

// Whether /initiatives/<slug> renders: visible and with its own page. Otherwise the route is a 404.
export function hasLivePage(i: Pick<Initiative, "status" | "hasPage"> | null | undefined): boolean {
  return !!i && isVisible(i) && i.hasPage;
}

// Empty category, tagline, summary or at a glance in Sanity keeps the built-in copy for the same
// slug, so a half filled document never blanks a row. Recognitions have no built-in copy.
export function withFallbackCopy(list: Initiative[], fallback: Initiative[]): Initiative[] {
  return list.map((i) => {
    const f = fallback.find((x) => x.slug === i.slug);
    if (!f) return i;
    return {
      ...i,
      category: i.category || f.category,
      tagline: i.tagline || f.tagline,
      summary: i.summary || f.summary,
      atAGlance: i.atAGlance.length > 0 ? i.atAGlance : f.atAGlance,
    };
  });
}

const text = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const records = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === "object") : [];

// At a glance items with a value, at most three.
export function toGlance(v: unknown): GlanceItem[] {
  return records(v)
    .map((item) => ({ label: text(item.label) || undefined, value: text(item.value) }))
    .filter((item) => item.value)
    .slice(0, MAX_GLANCE);
}

// Recognitions with a name, a logo URL, alt text and the logo's dimensions; anything incomplete is dropped.
export function toRecognitions(v: unknown): Recognition[] {
  return records(v).flatMap((item) => {
    const logo = item.logo && typeof item.logo === "object" ? (item.logo as Record<string, unknown>) : {};
    const name = text(item.name);
    const url = text(logo.url);
    const alt = text(logo.alt);
    const width = typeof logo.width === "number" ? logo.width : 0;
    const height = typeof logo.height === "number" ? logo.height : 0;
    if (!name || !url || !alt || !width || !height) return [];
    const year = typeof item.year === "number" && Number.isInteger(item.year) ? item.year : undefined;
    return [{ name, year, logo: { url, alt, width, height } }];
  });
}

// Recognitions grouped by year, in the order entered. Items without a year form their own group.
export function recognitionsByYear(list: Recognition[]): { year?: number; items: Recognition[] }[] {
  const groups: { year?: number; items: Recognition[] }[] = [];
  for (const r of list) {
    const group = groups.find((g) => g.year === r.year);
    if (group) group.items.push(r);
    else groups.push({ year: r.year, items: [r] });
  }
  return groups;
}

// One Sanity initiative document as an Initiative, or null without a name and slug.
// An unknown status reads as hidden.
export function toInitiative(doc: Record<string, unknown>): Initiative | null {
  const name = text(doc.name);
  const slug = text(doc.slug);
  if (!name || !slug) return null;
  return {
    name,
    slug,
    category: text(doc.category),
    tagline: text(doc.tagline),
    summary: text(doc.summary),
    status: initiativeStatus(doc.status),
    statusLabel: text(doc.statusLabel) || undefined,
    order: typeof doc.order === "number" ? doc.order : 999,
    hasPage: doc.hasPage === true,
    seoTitle: text(doc.seoTitle) || undefined,
    seoDescription: text(doc.seoDescription) || undefined,
    atAGlance: toGlance(doc.atAGlance),
    recognitions: toRecognitions(doc.recognitions),
  };
}
