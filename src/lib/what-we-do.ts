// The homepage's (02) What we do: the rules behind it, pure so they are tested without React or Sanity.
// The words come from src/data/services.ts (src/lib/what-we-do-data.ts reads them on the server); the
// real work behind a discipline comes from the Studio "What we do" fieldset (getWhatWeDoWork).

interface WwdDiscipline {
  name: string;
  description: string;
}

export interface WwdService {
  slug: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  disciplines: WwdDiscipline[];
}

// One word in the keyword field, in the field's reading order.
export interface WwdTerm {
  name: string;
  service: string;
  // The order of its service (0 to 3), and its own place in the field.
  serviceIndex: number;
  order: number;
}

// The case study behind a discipline: its address, the client's name and the preview image.
export interface WwdWork {
  discipline: string;
  slug: string;
  client: string;
  image: { src: string; alt: string; position: string };
}

// ── Counts and the heading ──

export const totalDisciplines = (services: readonly WwdService[]) => services.reduce((n, s) => n + s.disciplines.length, 0);

const ONES = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

// A count as a word, capitalised: 4 is "Four", 30 is "Thirty", 31 is "Thirty one" (no hyphen, by the
// site's copy rule). Numbers from 100 up are written as digits.
export function countWord(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 99) return String(n);
  if (n < 20) return ONES[n];
  const ones = n % 10;
  return ones ? `${TENS[Math.floor(n / 10)]} ${ONES[ones].toLowerCase()}` : TENS[Math.floor(n / 10)];
}

// "Four services. Thirty disciplines. One studio.": both numbers from the data, so it stays true.
export function wwdHeading(services: readonly WwdService[]): string {
  return `${countWord(services.length)} services. ${countWord(totalDisciplines(services))} disciplines. One studio.`;
}

// A row's discipline count, two digits: "09".
export const countLabel = (n: number) => String(n).padStart(2, "0");

// ── The keyword field ──

// Every discipline, interleaved across the services: the first of each service, then the second of
// each, and so on. A service with fewer disciplines simply drops out of the later rounds.
export function interleave(services: readonly WwdService[]): WwdTerm[] {
  const terms: WwdTerm[] = [];
  const longest = Math.max(0, ...services.map((s) => s.disciplines.length));
  for (let round = 0; round < longest; round++) {
    services.forEach((s, serviceIndex) => {
      const d = s.disciplines[round];
      if (d) terms.push({ name: d.name, service: s.slug, serviceIndex, order: terms.length });
    });
  }
  return terms;
}

// ── Words and links ──

export const caseStudyHref = (slug: string) => `/work/${slug}`;
export const serviceHref = (slug: string) => `/services/${slug}`;
export const detailLinkText = (serviceName: string) => `${serviceName} in detail`;
export const seeItText = (client: string) => `See it in ${client}`;
export const previewCaption = (discipline: string, client: string) => `${discipline} for ${client}`;

// ── The work behind each discipline ──

// A project as getWhatWeDoWork reads it. Any field may be missing.
export interface WwdProjectDoc {
  slug?: string;
  title?: string;
  heroName?: string;
  projectType?: unknown;
  homeOrder?: number;
  publishedAt?: string;
  whatWeDo?: Array<{ discipline?: string; image?: WwdImageDoc | null } | null> | null;
}

export interface WwdImageDoc {
  url?: string;
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const order = (p: WwdProjectDoc) => (typeof p.homeOrder === "number" && Number.isFinite(p.homeOrder) ? p.homeOrder : Infinity);

// Client work first in the sense of the Studio rule: explorations are never used (no type counts as
// client). Then by Homepage order (none last), then newest, then title.
export function rankWorkProjects(docs: readonly WwdProjectDoc[]): WwdProjectDoc[] {
  return docs
    .filter((p) => text(p.slug) && p.projectType !== "exploration")
    .sort((a, b) => order(a) - order(b) || text(b.publishedAt).localeCompare(text(a.publishedAt)) || text(a.title).localeCompare(text(b.title)));
}

// For each discipline, the first project (in rankWorkProjects order) that lists it with an image.
// A discipline without one is left out, so its word stays plain text. buildImage turns the Studio
// image into its URL and focal point (src/lib/sanity/image.ts on the server; a stub in tests).
export function pickWork(
  docs: readonly WwdProjectDoc[],
  disciplines: readonly string[],
  buildImage: (image: WwdImageDoc) => { src: string; position: string },
): Record<string, WwdWork> {
  const known = new Set(disciplines);
  const picked: Record<string, WwdWork> = {};
  for (const p of rankWorkProjects(docs)) {
    for (const entry of p.whatWeDo ?? []) {
      const discipline = text(entry?.discipline);
      const image = entry?.image;
      if (!known.has(discipline) || picked[discipline] || !image?.url) continue;
      const client = text(p.heroName) || text(p.title);
      const { src, position } = buildImage(image);
      picked[discipline] = { discipline, slug: text(p.slug), client, image: { src, alt: text(image.alt), position } };
    }
  }
  return picked;
}

// ── Studio rules for the "What we do" fieldset (sanity/schemas/caseStudy.ts) ──

export const WWD_MAX_ENTRIES = 12;

// The first discipline chosen twice in one project, or null.
export function repeatedDiscipline(entries: ReadonlyArray<{ discipline?: unknown } | null | undefined> | null | undefined): string | null {
  const seen = new Set<string>();
  for (const entry of entries ?? []) {
    const d = text(entry?.discipline);
    if (!d) continue;
    if (seen.has(d)) return d;
    seen.add(d);
  }
  return null;
}
