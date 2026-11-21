// The homepage (03) Proof: "What every client can count on." The four promises live here, in code:
// they are true on every project. Each is paired with one client quote. Pure, so the rules are tested
// without React or Sanity. Never add numbers, statistics, prices or an exit or refund line here.

// Relative, not "@/": the Studio schema (sanity/schemas/testimonial.ts) imports these rules too.
import { TESTIMONIALS, type PromiseId, type Testimonial } from "./constants/homepage-data";

export type { PromiseId };

export const PROOF_SECTION = { number: "03", label: "Proof", heading: "What every client can count on." };

export interface ProofPromise {
  id: PromiseId;
  number: string;
  name: string;
  promise: string;
}

export const PROOF_PROMISES: readonly ProofPromise[] = [
  { id: "understanding", number: "01", name: "Understanding", promise: "We learn your business before we design for it. The strategy is agreed with you first." },
  { id: "time", number: "02", name: "Time", promise: "First concepts within two weeks. A reply within one business day." },
  { id: "effort", number: "03", name: "Effort", promise: "Two revision rounds included. The thinking happens before the drawing." },
  { id: "people", number: "04", name: "People", promise: "One senior contact, from the first call to the final file." },
];

// The quote a chapter shows: the excerpt, its key phrase, and the caption parts.
export interface ProofQuote {
  excerpt: string;
  keyPhrase: string;
  name: string;
  role: string;
}

export interface ProofChapter extends ProofPromise {
  quote: ProofQuote;
}

const toQuote = (t: Testimonial): ProofQuote => ({ excerpt: t.excerpt, keyPhrase: t.keyPhrase, name: t.author, role: t.role });

// The coded testimonial for a promise: the fallback that keeps every chapter filled.
export function codedQuote(id: PromiseId): ProofQuote {
  const t = TESTIMONIALS.find((item) => item.promise === id);
  if (!t) throw new Error(`No coded testimonial for the ${id} promise`);
  return toQuote(t);
}

// A published Sanity testimonial as getProofChapters reads it. Any field may be missing.
export interface TestimonialDoc {
  quote?: unknown;
  author?: unknown;
  role?: unknown;
  company?: unknown;
  excerpt?: unknown;
  keyPhrase?: unknown;
  promise?: unknown;
}

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

// A Sanity testimonial the section can show: every part present and both substring rules kept.
function sanityQuote(doc: TestimonialDoc): ProofQuote | null {
  const quote = text(doc.quote);
  const excerpt = text(doc.excerpt);
  const keyPhrase = text(doc.keyPhrase);
  const name = text(doc.author);
  if (!quote || !name || !excerpt || !keyPhrase) return null;
  if (excerptError(quote, excerpt) || keyPhraseError(excerpt, keyPhrase)) return null;
  return { excerpt, keyPhrase, name, role: [text(doc.role), text(doc.company)].filter(Boolean).join(", ") };
}

// The four chapters, in order. For each promise, the published Sanity testimonial that supports it,
// else the coded one, so a chapter is never empty. With no Sanity testimonials, all four are coded.
export function proofChapters(published: readonly TestimonialDoc[] = []): ProofChapter[] {
  return PROOF_PROMISES.map((p) => {
    const fromSanity = published.filter((d) => d.promise === p.id).map(sanityQuote).find(Boolean);
    return { ...p, quote: fromSanity ?? codedQuote(p.id) };
  });
}

// Studio rules for the testimonial (sanity/schemas/testimonial.ts)

// The promise list a testimonial can support: Studio titles, stored as the promise ids.
export const PROMISE_OPTIONS = PROOF_PROMISES.map((p) => ({ title: p.name, value: p.id }));

// The excerpt must be copied exactly from the quote, and the key phrase exactly from the excerpt.
export function excerptError(quote: unknown, excerpt: unknown): string | null {
  if (typeof excerpt !== "string" || !excerpt) return null;
  return typeof quote === "string" && quote.includes(excerpt) ? null : "The excerpt must be copied exactly from the quote, word for word.";
}
export function keyPhraseError(excerpt: unknown, keyPhrase: unknown): string | null {
  if (typeof keyPhrase !== "string" || !keyPhrase) return null;
  return typeof excerpt === "string" && excerpt.includes(keyPhrase) ? null : "The key phrase must be copied exactly from the excerpt, word for word.";
}

// No two published testimonials may share a promise. countOthers counts the published testimonials,
// other than this one, that already support it.
export const PROMISE_TAKEN_QUERY = `count(*[_type == "testimonial" && promise == $promise && _id != $id && !(_id in path("drafts.**")) && !(_id in path("versions.**"))])`;
export const publishedId = (id: string) => id.replace(/^drafts\./, "").replace(/^versions\.[^.]+\./, "");

export async function promiseTakenError(
  promise: unknown,
  documentId: string | undefined,
  countOthers: (params: { promise: string; id: string }) => Promise<number>,
): Promise<string | null> {
  if (typeof promise !== "string" || !promise) return null;
  const taken = await countOthers({ promise, id: publishedId(documentId ?? "") });
  if (!taken) return null;
  const name = PROOF_PROMISES.find((p) => p.id === promise)?.name ?? promise;
  return `Another published testimonial already supports ${name}. Each promise shows one testimonial: clear the promise on the other one first.`;
}

// The caption: "Name, Role".
export const captionText = (q: Pick<ProofQuote, "name" | "role">) => [q.name, q.role].filter(Boolean).join(", ");

// The excerpt in three parts around its key phrase. A key phrase that is not in the excerpt marks nothing.
export function splitOnKeyPhrase(excerpt: string, keyPhrase: string): { before: string; phrase: string; after: string } {
  const at = keyPhrase ? excerpt.indexOf(keyPhrase) : -1;
  if (at < 0) return { before: excerpt, phrase: "", after: "" };
  return { before: excerpt.slice(0, at), phrase: keyPhrase, after: excerpt.slice(at + keyPhrase.length) };
}

// The light

// The lit chapter: the last one whose top has crossed the line (55% down the viewport); the first
// before any has.
export function litFromCrossed(crossed: readonly boolean[]): number {
  return Math.max(0, crossed.lastIndexOf(true));
}

// Where the line sits, as an IntersectionObserver root margin: the bottom 45% of the viewport is cut off.
export const LIGHT_LINE = 0.55;
export const LIGHT_ROOT_MARGIN = `0px 0px -${Math.round((1 - LIGHT_LINE) * 100)}% 0px`;

// The space the list needs below it so the last chapter's top can reach the line: the page must go
// on for the rest of the viewport after it. Zero when the page below is already long enough.
export function bottomSpace(viewport: number, belowLastTop: number): number {
  return Math.max(0, Math.ceil(viewport * (1 - LIGHT_LINE) - belowLastTop));
}

// Where an index click scrolls: the chapter's top 30% down the viewport, and never under the header.
export function indexScrollTop(chapterTop: number, scrollY: number, viewport: number, headerBar: number): number {
  const offset = Math.max(viewport * 0.3, headerBar + 24);
  return Math.max(0, Math.round(chapterTop + scrollY - offset));
}

// The phone bar's count: "02 / 04".
export const countText = (lit: number, total: number) => `${String(lit + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
