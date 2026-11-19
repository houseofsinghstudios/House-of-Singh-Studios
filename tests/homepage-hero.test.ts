// The homepage hero's projects (src/lib/homepage-hero.ts, getHeroProjects in
// src/lib/sanity/projects.ts): the order, the cap, the mapping and the Studio checks. Run with:
// npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  HERO_MAX,
  heroImagesMessage,
  heroLengthMessage,
  heroRequiredMessage,
  heroWordCaseMessage,
  sortHeroProjects,
} from "@/lib/homepage-hero";
import { mapHeroProject } from "@/lib/sanity/projects";

const p = (title: string, projectType?: string, heroOrder?: number) => ({ title, projectType, heroOrder });
const titles = (list: Array<{ title: string }>) => list.map((x) => x.title);

test("client work comes before explorations and the other types", () => {
  const sorted = sortHeroProjects([p("Exploration A", "exploration", 1), p("Client B", "client", 5), p("Parallel C", "parallel", 0), p("Client A", "client", 9)]);
  assert.deepEqual(titles(sorted), ["Client B", "Client A", "Parallel C", "Exploration A"]);
});

test("an empty or unknown project type counts as client work", () => {
  const sorted = sortHeroProjects([p("Exploration", "exploration", 1), p("No type", undefined, 3), p("Empty", "", 2), p("Unknown", "something", 4)]);
  assert.deepEqual(titles(sorted), ["Empty", "No type", "Unknown", "Exploration"]);
});

test("within a group, Hero order lowest first, no number last, then by title", () => {
  const sorted = sortHeroProjects([p("Zeta", "client"), p("Gamma", "client", 2), p("Alpha", "client"), p("Beta", "client", 1), p("Delta", "client", 2)]);
  assert.deepEqual(titles(sorted), ["Beta", "Delta", "Gamma", "Alpha", "Zeta"]);
});

test("at most six projects, the first six in hero order", () => {
  assert.equal(HERO_MAX, 6);
  const list = Array.from({ length: 9 }, (_, i) => p(`Project ${i}`, i % 2 ? "exploration" : "client", 9 - i));
  const sorted = sortHeroProjects(list);
  assert.equal(sorted.length, 6);
  // Five client projects (orders 9, 7, 5, 3, 1), then the lowest ordered exploration (order 0).
  assert.deepEqual(titles(sorted), ["Project 8", "Project 6", "Project 4", "Project 2", "Project 0", "Project 7"]);
  assert.deepEqual(sortHeroProjects([]), []);
});

test("the query's answer becomes hero projects: images without a file are dropped, defaults filled", () => {
  const project = mapHeroProject({
    title: "Marell Studio",
    slug: "marell-studio",
    heroName: "Marell",
    heroLine: "Ceramics identity and lookbook",
    heroField: "Home and lifestyle",
    heroWord: "home brands",
    heroFit: "contain",
    heroOrder: 2,
    projectType: "exploration",
    heroImages: [
      { url: "https://cdn.sanity.io/images/x/y/a-2400x1600.jpg", width: 2400, height: 1600, lqip: "data:image/jpeg;base64,AAA", alt: "Vases on a shelf", hotspot: { x: 0.4, y: 0.6 } },
      { alt: "No file yet" },
      { url: "https://cdn.sanity.io/images/x/y/b-2400x1600.jpg" },
    ],
  });
  assert.ok(project);
  assert.equal(project.heroFit, "contain");
  assert.equal(project.projectType, "exploration");
  assert.equal(project.heroImages.length, 2);
  assert.deepEqual(project.heroImages[0], { url: "https://cdn.sanity.io/images/x/y/a-2400x1600.jpg", alt: "Vases on a shelf", width: 2400, height: 1600, lqip: "data:image/jpeg;base64,AAA", hotspot: { x: 0.4, y: 0.6 } });
  assert.equal(project.heroImages[1].alt, "Marell", "missing alt falls back to the hero name");

  const plain = mapHeroProject({ title: "Bruno Bakehouse", slug: "bruno-bakehouse", heroImages: [{ url: "https://cdn.sanity.io/i.jpg", alt: "Bread" }] });
  assert.equal(plain?.heroName, "Bruno Bakehouse", "hero name falls back to the title");
  assert.equal(plain?.heroFit, "cover", "fill the frame by default");
  assert.equal(plain?.projectType, "client", "no type is client work");
  assert.equal(mapHeroProject({ title: "No images", slug: "x", heroImages: [{ alt: "nothing" }] }), null);
  assert.equal(mapHeroProject({ slug: "no-title", heroImages: [{ url: "https://cdn.sanity.io/i.jpg" }] }), null);
});

test("Studio: the hero fields are required only once the project shows in the hero", () => {
  assert.equal(heroRequiredMessage("", true, "Add it."), "Add it.");
  assert.equal(heroRequiredMessage("  ", true, "Add it."), "Add it.");
  assert.equal(heroRequiredMessage(undefined, false, "Add it."), undefined);
  assert.equal(heroRequiredMessage("Marell", true, "Add it."), undefined);
});

test("Studio: length warnings start above the limit", () => {
  assert.equal(heroLengthMessage("x".repeat(28), 28, "Too long."), undefined);
  assert.equal(heroLengthMessage("x".repeat(29), 28, "Too long."), "Too long.");
  assert.equal(heroLengthMessage(undefined, 28, "Too long."), undefined);
});

test("Studio: the field word is lower case only", () => {
  assert.equal(heroWordCaseMessage("home brands"), undefined);
  assert.equal(heroWordCaseMessage("cafés"), undefined);
  assert.match(heroWordCaseMessage("Home brands") ?? "", /lower case/);
  assert.match(heroWordCaseMessage("CAFÉS") ?? "", /lower case/);
  assert.equal(heroWordCaseMessage(undefined), undefined);
});

test("Studio: one to four hero images once the project shows in the hero", () => {
  assert.match(heroImagesMessage([], true) ?? "", /at least one image/);
  assert.match(heroImagesMessage(undefined, true) ?? "", /at least one image/);
  assert.equal(heroImagesMessage(undefined, false), undefined);
  assert.equal(heroImagesMessage([1, 2, 3, 4], true), undefined);
  assert.match(heroImagesMessage([1, 2, 3, 4, 5], true) ?? "", /four images at most/);
});

test("Studio: the Homepage hero fieldset is collapsed, every field is in it, and the old fields are untouched", () => {
  // Read as text: the sanity package cannot load under the test runner's react-server condition.
  const schema = readFileSync("sanity/schemas/caseStudy.ts", "utf8");
  assert.match(schema, /name: "homepageHero",\s*title: "Homepage hero",[\s\S]*?options: \{ collapsible: true, collapsed: true \}/);
  for (const field of ["heroShow", "heroOrder", "heroName", "heroLine", "heroField", "heroWord", "heroImages", "heroFit"]) {
    const start = schema.indexOf(`name: "${field}",`);
    assert.ok(start > 0, field);
    assert.match(schema.slice(start, schema.indexOf("defineField({", start + 1)), /fieldset: "homepageHero"/, field);
  }
  assert.match(schema, /name: "featured",\s*title: "Show on Homepage",\s*type: "boolean",\s*initialValue: false,/);
  // Visible copy in the fieldset: no hyphens or dashes.
  const fieldset = schema.slice(schema.indexOf('name: "heroShow"'), schema.indexOf('name: "serviceCategories"'));
  const strings = [...fieldset.matchAll(/(?:title|description|error)\(?:? ?"([^"]*)"/g), ...fieldset.matchAll(/"((?:Add|Keep|Use|Describe)[^"]*)"/g)].map((m) => m[1]);
  assert.ok(strings.length > 10);
  for (const s of strings) assert.doesNotMatch(s, /[-‐‑‒–—―]/, s);
});
