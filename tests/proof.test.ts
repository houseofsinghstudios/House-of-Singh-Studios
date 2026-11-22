// The homepage (03) Proof: the copy, the coded testimonials, the light's rules and the section's
// structure. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { TESTIMONIALS } from "@/lib/constants/homepage-data";
import {
  LIGHT_ROOT_MARGIN,
  PROMISE_OPTIONS,
  PROMISE_TAKEN_QUERY,
  PROOF_PROMISES,
  PROOF_SECTION,
  bottomSpace,
  captionText,
  codedQuote,
  countText,
  excerptError,
  indexScrollTop,
  keyPhraseError,
  litFromCrossed,
  proofChapters,
  promiseTakenError,
  publishedId,
  splitOnKeyPhrase,
} from "@/lib/proof";

const read = (file: string) => readFileSync(file, "utf8");

test("the copy, exactly as approved", () => {
  assert.deepEqual(PROOF_SECTION, { number: "03", label: "Proof", heading: "What every client can count on." });
  assert.deepEqual(
    PROOF_PROMISES.map((p) => [p.number, p.name, p.promise]),
    [
      ["01", "Understanding", "We learn your business before we design for it. The strategy is agreed with you first."],
      ["02", "Time", "First concepts within two weeks. A reply within one business day."],
      ["03", "Effort", "Two revision rounds included. The thinking happens before the drawing."],
      ["04", "People", "One senior contact, from the first call to the final file."],
    ],
  );
  assert.deepEqual(
    proofChapters().map((c) => captionText(c.quote)),
    ["Siddhartha Sharma, Author, Speaker, Leadership Coach", "Lovejot, Director, Planning and Logistics", "Keval, CPA and Controller, Ferrari", "Yanina, People and Culture, TEDxToronto"],
  );
});

test("the coded testimonials: each excerpt is in its quote, each key phrase in its excerpt", () => {
  assert.equal(TESTIMONIALS.length, 4);
  for (const t of TESTIMONIALS) {
    assert.ok(t.quote.includes(t.excerpt), `${t.author}: the excerpt is an exact substring of the quote`);
    assert.ok(t.excerpt.includes(t.keyPhrase), `${t.author}: the key phrase is an exact substring of the excerpt`);
  }
  const by = Object.fromEntries(TESTIMONIALS.map((t) => [t.author, [t.excerpt, t.keyPhrase]]));
  assert.deepEqual(by["Siddhartha Sharma"], ["Crafting a publication cover that reflects the essence of a book is rare.", "reflects the essence of a book"]);
  assert.deepEqual(by["Lovejot"], ["From timelines to communication, every step felt aligned and intentional.", "every step felt aligned and intentional"]);
  assert.deepEqual(by["Keval"], ["Their creative process mirrors the kind of structure we value in finance.", "the kind of structure we value in finance"]);
  assert.deepEqual(by["Yanina"], [
    "They brought intention to every creative decision and helped foster a team culture rooted in clarity and design excellence.",
    "brought intention to every creative decision",
  ]);
});

test("every promise has exactly one coded testimonial, so a chapter is never empty", () => {
  for (const p of PROOF_PROMISES) {
    assert.equal(TESTIMONIALS.filter((t) => t.promise === p.id).length, 1, p.id);
    assert.ok(codedQuote(p.id).excerpt, p.id);
  }
});

test("the key phrase splits the excerpt; a phrase that is not there marks nothing", () => {
  assert.deepEqual(splitOnKeyPhrase("We value a clear process.", "clear process"), { before: "We value a ", phrase: "clear process", after: "." });
  assert.deepEqual(splitOnKeyPhrase("We value a clear process.", "missing"), { before: "We value a clear process.", phrase: "", after: "" });
  assert.deepEqual(splitOnKeyPhrase("Text.", ""), { before: "Text.", phrase: "", after: "" });
});

test("the light: the last chapter past the line, 55% down; 01 before any", () => {
  assert.equal(LIGHT_ROOT_MARGIN, "0px 0px -45% 0px");
  assert.equal(litFromCrossed([false, false, false, false]), 0);
  assert.equal(litFromCrossed([true, false, false, false]), 0);
  assert.equal(litFromCrossed([true, true, true, false]), 2);
  assert.equal(litFromCrossed([true, true, true, true]), 3);
  // Room for the last chapter: none when the page goes on, the shortfall when it does not.
  assert.equal(bottomSpace(900, 2000), 0);
  assert.equal(bottomSpace(900, 300), 105);
  // An index click: 30% down the viewport, never under the header.
  assert.equal(indexScrollTop(1200, 1000, 900, 72), 1200 + 1000 - 270);
  assert.equal(indexScrollTop(100, 0, 200, 72), 4);
  assert.equal(countText(1, 4), "02 / 04");
});

test("the structure: a labelled section, an ordered list of chapters, a figure per quote", () => {
  const section = read("src/components/homepage/proof/ProofSection.tsx");
  assert.match(section, /<section className="proof" aria-labelledby=\{HEADING_ID\}>/);
  assert.match(section, /<h2 id=\{HEADING_ID\}/);
  assert.match(section, /<ol className="proof-list">/);
  assert.match(section, /<h3 className="proof-promise">/);
  assert.match(section, /<figure className="proof-figure">\s*<blockquote className="proof-quote">/);
  assert.match(section, /<figcaption className="proof-caption">\{captionText\(chapter\.quote\)\}<\/figcaption>/);
  assert.match(section, /<span className="proof-band">\{phrase\}<\/span>/);
  assert.doesNotMatch(section, /"use client"/, "a server component shell");
  const light = read("src/components/homepage/proof/ProofLight.tsx");
  assert.match(light, /^"use client";/);
  assert.match(light, /<ol className="proof-index needs-js" aria-label="Our promises">/);
  assert.match(light, /aria-current=\{i === lit \? "step" : undefined\}/);
  assert.match(light, /className="proof-bar-shell" aria-hidden="true"/);
  assert.match(light, /new IntersectionObserver/);
  assert.doesNotMatch(light, /addEventListener\("scroll"/, "no scroll listeners");
  // The server's first state is the island's: chapter 01 lit.
  assert.match(light, /useState\(0\)/);
});

test("analytics: one event, on desktop index clicks only", () => {
  const light = read("src/components/homepage/proof/ProofLight.tsx");
  assert.deepEqual([...light.matchAll(/track\("([a-z_]+)"/g)].map((m) => m[1]), ["proof_index_click"]);
  assert.match(light, /track\("proof_index_click", \{ promise: p\.id \}\)/);
});

test("the light in CSS: colour only, the band, and reduced motion", () => {
  const css = read("src/components/homepage/proof/proof.css");
  assert.match(css, /--proof-ink: var\(--text-label\)/);
  assert.match(css, /background-position: 0 0\.14em/);
  assert.match(css, /background-size: var\(--proof-band\) 0\.9em/);
  assert.match(css, /box-decoration-break: clone/);
  assert.match(css, /transition: background-size 0\.7s var\(--proof-ease\) 0\.12s/);
  assert.doesNotMatch(css, /opacity:\s*0\.\d/, "rest is colour, never opacity");
  assert.match(css, /top: calc\(var\(--header-edge\) \+ 48px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("the homepage: (03) Proof replaces the testimonials carousel and the counters; (04) Start closes it", () => {
  const page = read("src/app/(site)/(home)/page.tsx");
  const order = ["<HeroSection", "<SelectedWorkSection", "<WhatWeDoSection", "<ProofSection", "<StartSection"].map((tag) => page.indexOf(tag));
  assert.ok(order.every((at, i) => at > 0 && (i === 0 || at > order[i - 1])), `order ${order}`);
  assert.doesNotMatch(page, /TestimonialsSection/);
  assert.equal(existsSync("src/components/homepage/TestimonialsSection.tsx"), false);
  assert.equal(existsSync("src/components/homepage/ProofSection.tsx"), false, "the counters are gone");
  // (04) Start: tests/home-start.test.ts.
});

test("no dashes, numbers, prices or exit lines in the Proof copy", () => {
  const copy = [PROOF_SECTION.heading, ...PROOF_PROMISES.flatMap((p) => [p.name, p.promise]), ...TESTIMONIALS.flatMap((t) => [t.excerpt, t.keyPhrase, t.author, t.role])];
  for (const line of copy) {
    assert.doesNotMatch(line, /[‐-―-]/, line);
    assert.doesNotMatch(line, /\d|\$|price|refund|money back|guarantee/i, line);
  }
});

// Testimonials in Sanity

const doc = (promise: string, over: Record<string, unknown> = {}) => ({
  quote: "We came for a logo. We left with a clear way to talk about our business, and a team we trust.",
  author: "Sample Person",
  role: "Founder",
  company: "Sample Co",
  excerpt: "We left with a clear way to talk about our business",
  keyPhrase: "a clear way to talk",
  promise,
  ...over,
});

test("the fallback per promise: Sanity first, the coded testimonial when there is none or it breaks a rule", () => {
  const chapters = proofChapters([
    doc("time"),
    doc("effort", { excerpt: "Not in the quote at all." }),
    doc("people", { keyPhrase: "not in the excerpt" }),
    doc("other"),
  ]);
  assert.deepEqual(chapters.map((c) => c.id), ["understanding", "time", "effort", "people"]);
  assert.deepEqual(chapters[1].quote, { excerpt: "We left with a clear way to talk about our business", keyPhrase: "a clear way to talk", name: "Sample Person", role: "Founder, Sample Co" });
  assert.deepEqual(chapters[0].quote, codedQuote("understanding"), "no published testimonial: the coded one");
  assert.deepEqual(chapters[2].quote, codedQuote("effort"), "an excerpt not in its quote: the coded one");
  assert.deepEqual(chapters[3].quote, codedQuote("people"), "a key phrase not in its excerpt: the coded one");
  // A missing part also falls back.
  for (const field of ["quote", "author", "excerpt", "keyPhrase"]) {
    assert.deepEqual(proofChapters([doc("time", { [field]: "" })])[1].quote, codedQuote("time"), field);
  }
  // Nothing from Sanity, or Sanity unreachable while building: all four coded, never empty.
  assert.deepEqual(proofChapters([]).map((c) => c.quote), PROOF_PROMISES.map((p) => codedQuote(p.id)));
  assert.equal(captionText(chapters[1].quote), "Sample Person, Founder, Sample Co");
});

test("the substring rules, as Studio applies them", () => {
  assert.equal(excerptError("One two three.", "two three"), null);
  assert.match(excerptError("One two three.", "two four") ?? "", /copied exactly from the quote/);
  assert.equal(excerptError("One two three.", ""), null, "empty: the required rule speaks instead");
  assert.equal(keyPhraseError("two three", "three"), null);
  assert.match(keyPhraseError("two three", "Three") ?? "", /copied exactly from the excerpt/, "exact, case included");
  for (const t of TESTIMONIALS) {
    assert.equal(excerptError(t.quote, t.excerpt), null, t.author);
    assert.equal(keyPhraseError(t.excerpt, t.keyPhrase), null, t.author);
  }
});

test("no two published testimonials share a promise", async () => {
  const asked: Array<{ promise: string; id: string }> = [];
  const counts = (n: number) => async (params: { promise: string; id: string }) => (asked.push(params), n);
  assert.equal(await promiseTakenError("time", "drafts.abc", counts(0)), null);
  assert.deepEqual(asked.at(-1), { promise: "time", id: "abc" }, "a draft is compared without its own published copy");
  assert.match((await promiseTakenError("time", "abc", counts(1))) ?? "", /Another published testimonial already supports Time\./);
  assert.equal(await promiseTakenError(undefined, "abc", counts(5)), null, "optional: no promise, no check");
  assert.equal(publishedId("versions.r1.abc"), "abc");
  assert.match(PROMISE_TAKEN_QUERY, /_type == "testimonial" && promise == \$promise && _id != \$id && !\(_id in path\("drafts\.\*\*"\)\)/);
});

test("Studio: the testimonial fields, listed as Testimonials", () => {
  const schema = read("sanity/schemas/testimonial.ts");
  for (const field of ["quote", "author", "role", "company", "photo", "relatedCaseStudy", "featured"]) assert.match(schema, new RegExp(`name: "${field}"`), `kept: ${field}`);
  assert.match(schema, /name: "excerpt",\s*title: "Excerpt",\s*type: "text",[\s\S]*?description: "The part of the quote shown in the homepage Proof section\.[\s\S]*?rule\.required\(\)\.custom/);
  assert.match(schema, /name: "keyPhrase",\s*title: "Key phrase",\s*type: "string",[\s\S]*?description: "The words that get the marker band[\s\S]*?rule\.required\(\)\.custom/);
  assert.match(schema, /name: "promise",\s*title: "Promise",\s*type: "string",[\s\S]*?options: \{ list: PROMISE_OPTIONS, layout: "radio" \}/);
  assert.deepEqual(PROMISE_OPTIONS, [
    { title: "Understanding", value: "understanding" },
    { title: "Time", value: "time" },
    { title: "Effort", value: "effort" },
    { title: "People", value: "people" },
  ]);
  const structure = read("sanity/structure.ts");
  assert.match(structure, /testimonial: "Testimonials"/);
  assert.doesNotMatch(structure, /HIDDEN_TYPES = \[[^\]]*"testimonial"/);
});

test("the homepage reads the testimonials through the resilience helper", () => {
  const reader = read("src/lib/sanity/testimonials.ts");
  assert.match(reader, /readSanity\(\s*"proof testimonials",[\s\S]*?\(\) => proofChapters\(\),?\s*\)/);
  assert.match(reader, /_type == "testimonial" && defined\(promise\) && !\(_id in path\("drafts\.\*\*"\)\)/);
  assert.match(read("src/app/(site)/(home)/page.tsx"), /getProofChapters\(\)/);
});

test("publishing a testimonial refreshes the homepage: the webhook refreshes the whole site, whatever the type", async () => {
  const { REVALIDATE_TARGETS } = await import("@/lib/revalidate");
  assert.ok(REVALIDATE_TARGETS.some((t) => t.path === "/" && t.type === "layout"), "the root layout, so the homepage too");
  const route = read("src/app/api/revalidate/route.ts");
  assert.doesNotMatch(route, /_type|testimonial|caseStudy/, "no document type filter in the route");
});
