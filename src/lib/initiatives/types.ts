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

// The words shown in brackets after the category when no statusLabel override is set.
export const STATUS_LABELS: Record<Exclude<InitiativeStatus, "hidden">, string> = {
  live: "Live",
  "nominations-open": "Nominations open",
  "opening-soon": "Opening soon",
  "by-invitation": "By invitation",
};

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

// The bracketed status text: the override if set, otherwise the default for the status.
export function statusText(i: Pick<Initiative, "status" | "statusLabel">): string {
  if (i.statusLabel && i.statusLabel.trim()) return i.statusLabel.trim();
  return i.status === "hidden" ? "" : STATUS_LABELS[i.status];
}

// Whether /initiatives/<slug> renders: visible and with its own page. Otherwise the route is a 404.
export function hasLivePage(i: Pick<Initiative, "status" | "hasPage"> | null | undefined): boolean {
  return !!i && isVisible(i) && i.hasPage;
}

// Empty category, tagline or summary in Sanity keeps the built-in copy for the same slug,
// so a half filled document never blanks a row.
export function withFallbackCopy(list: Initiative[], fallback: Initiative[]): Initiative[] {
  return list.map((i) => {
    const f = fallback.find((x) => x.slug === i.slug);
    if (!f) return i;
    return { ...i, category: i.category || f.category, tagline: i.tagline || f.tagline, summary: i.summary || f.summary };
  });
}

const text = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

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
  };
}
