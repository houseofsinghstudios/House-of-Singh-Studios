// The work index data (src/lib/work-index.ts): discipline mapping, ranking, the homepage six, the
// image fallback and the address bar parameters. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { heroObjectPosition } from "@/lib/homepage-hero";
import {
  BUSINESS_TYPES,
  BUYER_DISCIPLINES,
  DEFAULT_BUSINESS_WORD,
  DEFAULT_DISCIPLINE_WORD,
  HOME_MAX,
  SECTOR_OPTIONS,
  buyerDisciplines,
  homeSelection,
  indexImages,
  parseWorkParams,
  rankProjects,
  sortIndexProjects,
  toIndexProject,
  type IndexImageDoc,
  type IndexProject,
  type IndexProjectDoc,
} from "@/lib/work-index";

const img = (id: string, extra: Partial<IndexImageDoc> = {}): IndexImageDoc => ({ id, url: `https://cdn.sanity.io/images/x/y/${id}.jpg`, width: 1200, height: 900, alt: `${id} alt`, ...extra });

// A portfolio like the real one: the docs as getIndexProjects reads them, newest first.
const doc = (slug: string, extra: Partial<IndexProjectDoc> = {}): IndexProjectDoc => ({
  title: slug.replace(/-/g, " "),
  slug,
  publishedAt: "2026-10-14T12:00:00.000Z",
  featuredImage: img(`${slug}-cover`),
  ...extra,
});
const PORTFOLIO: IndexProjectDoc[] = [
  doc("the-floreans", { sector: "food-and-drink", disciplines: ["brand-identity", "packaging"], featured: true, homeOrder: 2, projectType: "client", publishedAt: "2026-11-18T12:00:00.000Z" }),
  doc("christmas-carnival", { sector: "events", disciplines: ["website", "art-direction"], projectType: "client", year: 2023, publishedAt: "2026-11-17T12:00:00.000Z" }),
  doc("nivora", { sector: "home-and-lifestyle", disciplines: ["brand-identity", "art-direction", "publication"], featured: true, homeOrder: 1, projectType: "exploration", publishedAt: "2026-10-17T12:00:00.000Z" }),
  doc("marell-studio", { sector: "fashion-and-jewellery", disciplines: ["brand-identity", "packaging", "website"], featured: true }),
  doc("tairn-and-co", { sector: "food-and-drink", disciplines: ["brand-identity", "packaging", "photography", "website"], featured: true, homeOrder: 3 }),
  doc("three", { sector: "beauty-and-fragrance", disciplines: ["brand-identity", "packaging", "art-direction"], featured: true }),
  doc("trilokchand-jewellers", { sector: "fashion-and-jewellery", disciplines: ["brand-identity", "packaging", "art-direction"] }),
  doc("bruno-bakehouse", { sector: "food-and-drink", disciplines: ["brand-identity", "strategy", "publication"] }),
  doc("studio-notes", { sector: "other", disciplines: ["video"], featured: true, homeOrder: 4, publishedAt: "2025-01-01T12:00:00.000Z" }),
  doc("no-type-yet", { disciplines: ["social-content"], featured: true, publishedAt: "2024-01-01T12:00:00.000Z" }),
];
const projects = sortIndexProjects(PORTFOLIO.map(toIndexProject).filter((p): p is IndexProject => p !== null));
const slugs = (list: readonly { slug: string }[]) => list.map((p) => p.slug);

test("the lists: five business types with their words, four buyer disciplines, and Other in Studio only", () => {
  assert.deepEqual(BUSINESS_TYPES.map((t) => [t.id, t.label, t.word]), [
    ["food-and-drink", "Food and drink", "food and drink brands"],
    ["events", "Events", "events"],
    ["beauty-and-fragrance", "Beauty and fragrance", "beauty and fragrance labels"],
    ["fashion-and-jewellery", "Fashion and jewellery", "fashion and jewellery houses"],
    ["home-and-lifestyle", "Home and lifestyle", "home and lifestyle brands"],
  ]);
  assert.equal(DEFAULT_BUSINESS_WORD, "your kind of business");
  assert.deepEqual(BUYER_DISCIPLINES.map((d) => d.id), ["identity", "packaging", "websites", "photography"]);
  // The /work line before a discipline is chosen: "Work for your kind of business, in every discipline".
  assert.equal(DEFAULT_DISCIPLINE_WORD, "every discipline");
  assert.deepEqual(SECTOR_OPTIONS.map((o) => o.value), ["food-and-drink", "events", "beauty-and-fragrance", "fashion-and-jewellery", "home-and-lifestyle", "other"]);
  assert.equal(SECTOR_OPTIONS[5].title, "Other (shows on /work, but in no business type)");
  // Studio titles: no hyphens or dashes.
  for (const o of SECTOR_OPTIONS) assert.doesNotMatch(o.title, /[-‐‑‒–—―]/, o.title);
});

test("discipline mapping: Studio disciplines to buyer terms, each once, in a fixed order", () => {
  assert.deepEqual(buyerDisciplines(["brand-identity"]), ["identity"]);
  assert.deepEqual(buyerDisciplines(["packaging"]), ["packaging"]);
  assert.deepEqual(buyerDisciplines(["website"]), ["websites"]);
  assert.deepEqual(buyerDisciplines(["photography"]), ["photography"]);
  assert.deepEqual(buyerDisciplines(["art-direction"]), ["photography"]);
  // Both photography and art direction count once; order follows the buyer list, not the input.
  assert.deepEqual(buyerDisciplines(["photography", "website", "art-direction", "brand-identity"]), ["identity", "websites", "photography"]);
  // Publication, video, social content and strategy map to nothing.
  assert.deepEqual(buyerDisciplines(["publication", "video", "social-content", "strategy"]), []);
  assert.deepEqual(buyerDisciplines(undefined), []);
  assert.deepEqual(buyerDisciplines([null, 3, "unknown"]), []);
});

test("a project as the index shows it: label, delivered line, year, type", () => {
  const tairn = projects.find((p) => p.slug === "tairn-and-co")!;
  assert.equal(tairn.sectorLabel, "Food and drink");
  assert.deepEqual(tairn.disciplines, ["identity", "packaging", "websites", "photography"]);
  assert.equal(tairn.deliveredLine, "Identity, packaging, websites and photography");
  assert.equal(projects.find((p) => p.slug === "the-floreans")!.deliveredLine, "Identity and packaging");
  assert.equal(projects.find((p) => p.slug === "bruno-bakehouse")!.deliveredLine, "Identity");
  assert.equal(projects.find((p) => p.slug === "studio-notes")!.deliveredLine, "");
  // The Studio year, or null when it is not set: never the publish date (that only orders the list).
  assert.equal(projects.find((p) => p.slug === "christmas-carnival")!.year, 2023);
  assert.equal(tairn.year, null, "no year set, though published in 2026");
  assert.equal(tairn.publishedAt, "2026-10-14T12:00:00.000Z");
  assert.equal(toIndexProject({ title: "T", slug: "t", year: Number.NaN })!.year, null);
  assert.equal(projects.find((p) => p.slug === "nivora")!.isExploration, true);
  // No business type set in Studio reads as Other, with no label.
  const untyped = projects.find((p) => p.slug === "no-type-yet")!;
  assert.equal(untyped.sector, "other");
  assert.equal(untyped.sectorLabel, "");
  assert.equal(toIndexProject({ slug: "x" }), null, "no title");
  assert.equal(toIndexProject({ title: "X" }), null, "no slug");
});

test("the index order: client work first, then explorations, then newest, then title", () => {
  assert.deepEqual(slugs(projects), [
    "the-floreans", // client, newest
    "christmas-carnival",
    "bruno-bakehouse", // same date: by title
    "marell-studio",
    "tairn-and-co",
    "three",
    "trilokchand-jewellers",
    "studio-notes",
    "no-type-yet",
    "nivora", // the exploration, last whatever its date
  ]);
});

test("rankProjects: a business type moves matches to the top, in the order given; nothing is dropped", () => {
  const { matches, rest } = rankProjects(projects, { sector: "food-and-drink" });
  assert.deepEqual(slugs(matches), ["the-floreans", "bruno-bakehouse", "tairn-and-co"]);
  assert.equal(matches.length + rest.length, projects.length);
  assert.deepEqual(slugs(rest), slugs(projects).filter((s) => !slugs(matches).includes(s)), "rest keeps the order");
});

test("rankProjects: a discipline, both together, neither, and a combination with no matches", () => {
  assert.deepEqual(slugs(rankProjects(projects, { discipline: "websites" }).matches), ["christmas-carnival", "marell-studio", "tairn-and-co"]);
  // Both: a project must have the business type and the discipline.
  assert.deepEqual(slugs(rankProjects(projects, { sector: "food-and-drink", discipline: "packaging" }).matches), ["the-floreans", "tairn-and-co"]);
  // Neither: every project in rest, in the order given.
  const none = rankProjects(projects);
  assert.deepEqual(none.matches, []);
  assert.deepEqual(slugs(none.rest), slugs(projects));
  // No match at all: the one beauty and fragrance project (THREE) has no website.
  const empty = rankProjects(projects, { sector: "beauty-and-fragrance", discipline: "websites" });
  assert.deepEqual(empty.matches, []);
  assert.deepEqual(slugs(empty.rest), slugs(projects), "with no matches, everything stays, in order");
});

test("homeSelection without a business type: Show on Homepage projects by Homepage order, then the index order, six at most", () => {
  const six = homeSelection(projects);
  assert.equal(six.length, HOME_MAX);
  // homeOrder 1, 2, 3, 4 first; then the unnumbered featured ones in index order.
  assert.deepEqual(slugs(six), ["nivora", "the-floreans", "tairn-and-co", "studio-notes", "marell-studio", "three"]);
  assert.ok(six.every((p) => p.featured));
});

test("homeSelection with a business type: every match from the whole portfolio first, then the usual six fill to six", () => {
  const food = homeSelection(projects, "food-and-drink");
  assert.equal(food.length, HOME_MAX);
  // Bruno Bakehouse is not on the homepage, but it is food and drink: it comes in.
  assert.deepEqual(slugs(food).slice(0, 3), ["the-floreans", "bruno-bakehouse", "tairn-and-co"]);
  assert.ok(slugs(food).includes("bruno-bakehouse"));
  // Then the usual six, in their order, without repeats.
  assert.deepEqual(slugs(food).slice(3), ["nivora", "studio-notes", "marell-studio"]);
  assert.equal(new Set(slugs(food)).size, HOME_MAX);
  // A business type with more than six matches still returns six, all matches.
  const many = Array.from({ length: 8 }, (_, i) => toIndexProject(doc(`events-${i}`, { sector: "events" }))!);
  assert.deepEqual(homeSelection([...projects, ...many], "events").map((p) => p.sector), Array(HOME_MAX).fill("events"));
});

test("image fallback: the Index images when set, otherwise the featured image then the page blocks, each asset once, six at most", () => {
  // Index images win, and only they are used.
  const own = indexImages({ indexImages: [img("a"), img("b")], featuredImage: img("cover"), blockImages: [{ image: img("c") }] }, "Own");
  assert.deepEqual(own.map((i) => i.alt), ["a alt", "b alt"]);
  // Fallback: the cover, then block images in page order (main image, detail, then a pair's images).
  const fallback = indexImages(
    {
      featuredImage: img("cover"),
      blockImages: [{ image: img("one") }, null, { image: img("main"), detail: img("detail") }, { images: [img("left"), img("right")] }],
    },
    "Fallback"
  );
  assert.deepEqual(fallback.map((i) => i.url.split("/").pop()), ["cover.jpg", "one.jpg", "main.jpg", "detail.jpg", "left.jpg", "right.jpg"]);
  // The featured image repeated in the blocks (the same asset id) shows once.
  const repeated = indexImages({ featuredImage: img("cover"), blockImages: [{ image: img("cover") }, { image: img("two") }] }, "Repeat");
  assert.deepEqual(repeated.map((i) => i.url.split("/").pop()), ["cover.jpg", "two.jpg"]);
  // Six at most, from the Index images or from the fallback.
  const many = Array.from({ length: 9 }, (_, i) => img(`p${i}`));
  assert.equal(indexImages({ indexImages: many }, "Many").length, 6);
  assert.equal(indexImages({ featuredImage: img("cover"), blockImages: many.map((image) => ({ image })) }, "Many").length, 6);
  // Images without a file or a size are skipped; a missing alt falls back to the project title.
  const skipped = indexImages({ featuredImage: img("x", { url: "" }), blockImages: [{ image: img("y", { width: undefined }) }, { image: img("z", { alt: "" }) }] }, "Title");
  assert.deepEqual(skipped.map((i) => i.alt), ["Title"]);
  // The blur placeholder comes through when there is one.
  assert.equal(indexImages({ featuredImage: img("q", { lqip: "data:image/jpeg;base64,AAAA" }) }, "T")[0].lqip, "data:image/jpeg;base64,AAAA");
});

test("images carry the editor's hotspot and crop, so the focal point works as in the hero", () => {
  const hotspot = { x: 0.7, y: 0.4 };
  const crop = { top: 0, bottom: 0.1, left: 0.1, right: 0.3 };
  const [own] = indexImages({ indexImages: [img("a", { hotspot, crop })] }, "Own");
  assert.deepEqual(own.hotspot, hotspot);
  assert.deepEqual(own.crop, crop);
  // Through the fallback too: the featured image and the block images.
  const fallback = indexImages({ featuredImage: img("cover", { hotspot: { x: 0.2, y: 0.8 } }), blockImages: [{ image: img("b", { hotspot }) }] }, "Fallback");
  assert.deepEqual(fallback.map((i) => i.hotspot), [{ x: 0.2, y: 0.8 }, hotspot]);
  // The hero's helper reads it as is: the crop keeps 0.1 to 0.7 across and 0 to 0.9 down, so x 0.7 is
  // its right edge (100%) and y 0.4 is 44.4% of the way down.
  assert.equal(heroObjectPosition(own), "100% 44.4%");
  assert.equal(heroObjectPosition(fallback[0]), "20% 80%");
  // None set, or half set: left off, so the image is centred.
  const plain = indexImages({ featuredImage: img("p", { hotspot: null, crop: { top: 0.1 } }) }, "Plain")[0];
  assert.equal("hotspot" in plain, false);
  assert.equal("crop" in plain, false);
  assert.equal(heroObjectPosition(plain), "50% 50%");
});

test("parseWorkParams: ?for= a business type and ?in= a discipline; unknown values are ignored", () => {
  assert.deepEqual(parseWorkParams(new URLSearchParams("for=food-and-drink&in=packaging")), { sector: "food-and-drink", discipline: "packaging" });
  assert.deepEqual(parseWorkParams({ for: "events" }), { sector: "events" });
  assert.deepEqual(parseWorkParams({ in: ["websites", "packaging"] }), { discipline: "websites" }, "the first of a repeated value");
  assert.deepEqual(parseWorkParams(new URLSearchParams("for=other&in=video")), {}, "Other is no business type; video is no buyer discipline");
  assert.deepEqual(parseWorkParams(new URLSearchParams("for=FOOD-AND-DRINK&in=")), {});
  assert.deepEqual(parseWorkParams({}), {});
});

test("Studio: the Work index fieldset, collapsed, after the Homepage hero, with its three fields", () => {
  // Read as text: the sanity package cannot load under the test runner's react-server condition.
  const schema = readFileSync("sanity/schemas/caseStudy.ts", "utf8");
  assert.ok(schema.indexOf('name: "workIndex"') > schema.indexOf('name: "homepageHero"'), "fieldset after the hero's");
  assert.match(schema, /name: "workIndex",\s*title: "Work index",[\s\S]*?options: \{ collapsible: true, collapsed: true \}/);
  // From the field to the next top level field (four spaces in), so nested fields stay inside.
  const field = (name: string) => schema.slice(schema.indexOf(`name: "${name}",`), schema.indexOf("\n    defineField({", schema.indexOf(`name: "${name}",`)));
  assert.match(field("sector"), /title: "Business type",[\s\S]*fieldset: "workIndex"[\s\S]*options: \{ list: SECTOR_OPTIONS, layout: "radio" \}/);
  assert.match(field("indexImages"), /title: "Index images",[\s\S]*fieldset: "workIndex"[\s\S]*hotspot: true[\s\S]*rule\.required\(\)[\s\S]*rule\.max\(INDEX_IMAGE_MAX\)/);
  assert.match(field("homeOrder"), /title: "Homepage order",\s*type: "number",\s*fieldset: "workIndex"/);
  // The hero fields come first, in order, then the work index fields.
  const order = ["heroFit", "sector", "indexImages", "homeOrder", "serviceCategories"].map((n) => schema.indexOf(`name: "${n}",`));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  // The stale hero wording is gone.
  assert.doesNotMatch(schema, /name in the homepage list|fits the homepage list|when a visitor picks this field/);
});
