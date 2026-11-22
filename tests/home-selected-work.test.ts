// The homepage's (01) Selected work, a short Living Index: the six for each choice as rendered
// (numbers 01 to 06 in the order shown), the closing link with and without a choice, and the
// structure (server section, h2 sentence, no address change, one view transition name per project).
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  BUSINESS_TYPES,
  homeAllWorkLink,
  homeOrders,
  homeRows,
  rankProjects,
  sortIndexProjects,
  toIndexProject,
  type IndexProject,
  type IndexProjectDoc,
} from "@/lib/work-index";

const read = (file: string) => readFileSync(file, "utf8");
const code = (file: string) => read(file).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const doc = (slug: string, extra: Partial<IndexProjectDoc> = {}): IndexProjectDoc => ({
  title: slug,
  slug,
  projectType: "client",
  publishedAt: "2026-10-01T12:00:00.000Z",
  featuredImage: { id: `${slug}-cover`, url: `https://cdn.sanity.io/images/x/y/${slug}.jpg`, width: 1200, height: 900, alt: slug },
  ...extra,
});
// Eight projects: six featured with a Homepage order, two food and drink projects not featured.
const PORTFOLIO = sortIndexProjects(
  [
    doc("floreans", { sector: "food-and-drink", featured: true, homeOrder: 3, publishedAt: "2026-11-18T12:00:00.000Z" }),
    doc("carnival", { sector: "events", featured: true, homeOrder: 6, publishedAt: "2026-11-17T12:00:00.000Z" }),
    doc("marell", { sector: "fashion-and-jewellery", featured: true, homeOrder: 1 }),
    doc("tairn", { sector: "home-and-lifestyle", featured: true, homeOrder: 2 }),
    doc("three", { sector: "beauty-and-fragrance", featured: true, homeOrder: 4 }),
    doc("trilokchand", { sector: "fashion-and-jewellery", featured: true, homeOrder: 5 }),
    doc("bruno", { sector: "food-and-drink", publishedAt: "2026-09-01T12:00:00.000Z" }),
    doc("olive", { sector: "food-and-drink", publishedAt: "2026-08-01T12:00:00.000Z" }),
  ]
    .map(toIndexProject)
    .filter((p): p is IndexProject => p !== null),
);
// As the browser gets them: the /work number from the index order (the homepage renumbers).
const ITEMS = PORTFOLIO.map((p, i) => ({ slug: p.slug, sector: p.sector, number: i + 1 }));
const ORDERS = homeOrders(PORTFOLIO);
const view = (rows: { matches: { slug: string; number: number }[]; rest: { slug: string; number: number }[] }) =>
  [...rows.matches, ...rows.rest].map((p) => `${String(p.number).padStart(2, "0")} ${p.slug}`);

test("no choice: the six featured by Homepage order, numbered 01 to 06 as shown", () => {
  assert.deepEqual(view(homeRows(ITEMS, ORDERS.all)), ["01 marell", "02 tairn", "03 floreans", "04 three", "05 trilokchand", "06 carnival"]);
  assert.equal(homeRows(ITEMS, ORDERS.all).matches.length, 0);
});

test("a business type: every match from the whole portfolio first, then the curated six fill to six", () => {
  const rows = homeRows(ITEMS, ORDERS["food-and-drink"], "food-and-drink");
  assert.deepEqual(rows.matches.map((p) => p.slug), ["floreans", "bruno", "olive"], "matches in index order, featured or not");
  assert.deepEqual(view(rows), ["01 floreans", "02 bruno", "03 olive", "04 marell", "05 tairn", "06 three"]);
  // Every business type: six rows, numbered 01 to 06, matches before the rest.
  for (const t of BUSINESS_TYPES) {
    const r = homeRows(ITEMS, ORDERS[t.id], t.id);
    assert.equal(r.matches.length + r.rest.length, 6, t.id);
    assert.deepEqual([...r.matches, ...r.rest].map((p) => p.number), [1, 2, 3, 4, 5, 6], t.id);
    assert.ok(r.matches.every((p) => p.sector === t.id) && r.rest.every((p) => p.sector !== t.id), t.id);
  }
});

test("the closing link: all work, or all work for the chosen type, carried to /work?for=", () => {
  assert.deepEqual(homeAllWorkLink(undefined, PORTFOLIO.length), { text: "All work (08)", href: "/work" });
  const food = rankProjects(PORTFOLIO, { sector: "food-and-drink" }).matches.length;
  assert.deepEqual(homeAllWorkLink("food-and-drink", food), { text: "All work for food and drink (03)", href: "/work?for=food-and-drink" });
  assert.deepEqual(homeAllWorkLink("events", 1), { text: "All work for events (01)", href: "/work?for=events" });
  for (const t of BUSINESS_TYPES) assert.doesNotMatch(homeAllWorkLink(t.id, 1).text, /[-‐‑‒–—―]/);
});

test("structure: a server section, the h2 sentence in the island, rows as h3 links, no address change", () => {
  const section = code("src/components/homepage/SelectedWorkSection.tsx");
  assert.doesNotMatch(section, /^"use client"/);
  assert.match(section, /<EditorialLabel number="01" text="Selected work" \/>/);
  const island = code("src/components/work/index/HomeWorkIndex.tsx");
  assert.match(island, /<h2 id=\{headingId\} className="hw-sentence">\s*See our work for\{" "\}\s*<Choice /);
  assert.doesNotMatch(island, /useRouter|router\.|useSearchParams|history\./, "the choice is page state only");
  // The closing row holds the link to /work only (owner decision, Nov 2026); the type labels stay.
  assert.doesNotMatch(island, /Client work first|explorations are marked/);
  assert.match(island, /<div className="hw-close">\s*<Link href=\{all\.href\} className="hw-all"/);
  const rows = code("src/components/work/index/WorkRows.tsx");
  assert.match(rows, /const stripMax = home \? 3 : 6;/);
  assert.match(rows, /<p className="editorial-label wi-other">More from the studio<\/p>/);
  assert.match(rows, /<h3 className="wi-name" style=\{\{ viewTransitionName: `project-\$\{item\.slug\}` \}\}>/);
  assert.match(read("src/app/(site)/(home)/page.tsx"), /<SelectedWorkSection projects=\{indexProjects\} \/>/);
});

test("one view transition name per project on /: the hero names none", () => {
  for (const file of readdirSync("src/components/homepage")) {
    if (!file.endsWith(".tsx")) continue;
    assert.doesNotMatch(code(`src/components/homepage/${file}`), /viewTransitionName: `project-/, file);
  }
});

test("the section is named by its heading (aria-labelledby, homepage audit H-19)", () => {
  const section = readFileSync("src/components/homepage/SelectedWorkSection.tsx", "utf8");
  assert.match(section, /const HEADING_ID = "selected-work-heading";/);
  assert.match(section, /<section className="hw-section css-reveal" aria-labelledby=\{HEADING_ID\}>/);
  assert.match(section, /headingId=\{HEADING_ID\}/);
});
