// The homepage (03) Proof: the copy, the coded testimonials, the light's rules and the section's
// structure. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { TESTIMONIALS } from "@/lib/constants/homepage-data";
import {
  LIGHT_ROOT_MARGIN,
  PROOF_PROMISES,
  PROOF_SECTION,
  bottomSpace,
  captionText,
  codedQuote,
  countText,
  indexScrollTop,
  litFromCrossed,
  proofChapters,
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
  assert.match(light, /<ol className="proof-index" aria-label="Our promises">/);
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

test("the homepage: (03) Proof replaces the testimonials carousel and the counters; (04) Two ways to start", () => {
  const page = read("src/app/(site)/(home)/page.tsx");
  const order = ["<HeroSection", "<SelectedWorkSection", "<WhatWeDoSection", "<ProofSection", "<ToolBand", "<CtaSection"].map((tag) => page.indexOf(tag));
  assert.ok(order.every((at, i) => at > 0 && (i === 0 || at > order[i - 1])), `order ${order}`);
  assert.doesNotMatch(page, /TestimonialsSection/);
  assert.equal(existsSync("src/components/homepage/TestimonialsSection.tsx"), false);
  assert.equal(existsSync("src/components/homepage/ProofSection.tsx"), false, "the counters are gone");
  assert.match(read("src/components/homepage/ToolBand.tsx"), /label: "\(04\) Two ways to start"/);
});

test("no dashes, numbers, prices or exit lines in the Proof copy", () => {
  const copy = [PROOF_SECTION.heading, ...PROOF_PROMISES.flatMap((p) => [p.name, p.promise]), ...TESTIMONIALS.flatMap((t) => [t.excerpt, t.keyPhrase, t.author, t.role])];
  for (const line of copy) {
    assert.doesNotMatch(line, /[‐-―-]/, line);
    assert.doesNotMatch(line, /\d|\$|price|refund|money back|guarantee/i, line);
  }
});
