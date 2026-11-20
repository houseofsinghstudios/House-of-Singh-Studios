// The Living Index on /work: the sentence words, the counts and the polite status a choice gives, and
// the page structure (sr only H1, Suspense fallback, one view transition name per project).
// The data rules themselves are in tests/work-index.test.ts. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  BUSINESS_TYPES,
  BUYER_DISCIPLINES,
  frameCode,
  invitationQuestion,
  parseWorkParams,
  projectMeta,
  rankProjects,
  sentenceWords,
  statusText,
  toIndexProject,
  workHref,
  workKindLabel,
  type IndexChoice,
  type IndexProject,
} from "@/lib/work-index";

const read = (file: string) => readFileSync(file, "utf8");
const code = (file: string) => read(file).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

// The real portfolio's disciplines, with the sectors used for the screenshots.
const PROJECTS: Pick<IndexProject, "slug" | "sector" | "disciplines">[] = [
  { slug: "the-floreans", sector: "food-and-drink", disciplines: ["identity", "packaging"] },
  { slug: "christmas-carnival", sector: "events", disciplines: ["websites", "photography"] },
  { slug: "marell", sector: "fashion-and-jewellery", disciplines: ["identity", "packaging", "websites"] },
  { slug: "tairn", sector: "home-and-lifestyle", disciplines: ["identity", "packaging", "websites", "photography"] },
  { slug: "three", sector: "beauty-and-fragrance", disciplines: ["identity", "packaging", "photography"] },
  { slug: "trilokchand", sector: "fashion-and-jewellery", disciplines: ["identity", "packaging", "photography"] },
  { slug: "bruno", sector: "food-and-drink", disciplines: ["identity"] },
  { slug: "nivora", sector: "home-and-lifestyle", disciplines: ["identity", "photography"] },
];

const status = (choice: IndexChoice) => {
  const { matches, rest } = rankProjects(PROJECTS, choice);
  return statusText(choice, matches.length, rest.length);
};

test("the sentence: default words, then the chosen ones", () => {
  assert.deepEqual(sentenceWords({}), { business: "your kind of business", discipline: "every discipline" });
  assert.deepEqual(sentenceWords({ sector: "food-and-drink" }), { business: "food and drink brands", discipline: "every discipline" });
  assert.deepEqual(sentenceWords({ discipline: "websites" }), { business: "your kind of business", discipline: "websites" });
  assert.deepEqual(sentenceWords(parseWorkParams(new URLSearchParams("for=beauty-and-fragrance&in=packaging"))), {
    business: "beauty and fragrance labels",
    discipline: "packaging",
  });
  // An unknown value in the address keeps the default words.
  assert.deepEqual(sentenceWords(parseWorkParams({ for: "cars", in: "video" })), sentenceWords({}));
});

test("the address: a choice and back, both ways", () => {
  assert.equal(workHref({}), "/work");
  assert.equal(workHref({ sector: "food-and-drink" }), "/work?for=food-and-drink");
  assert.equal(workHref({ discipline: "websites" }), "/work?in=websites");
  assert.equal(workHref({ sector: "food-and-drink", discipline: "websites" }), "/work?for=food-and-drink&in=websites");
  for (const choice of [{}, { sector: "events" }, { discipline: "photography" }, { sector: "events", discipline: "photography" }] as IndexChoice[]) {
    assert.deepEqual(parseWorkParams(new URLSearchParams(workHref(choice).split("?")[1] ?? "")), choice);
  }
});

test("a combination with no match: zero matches, everything below, and the list option counts zero", () => {
  const choice: IndexChoice = { sector: "food-and-drink", discipline: "websites" };
  const { matches, rest } = rankProjects(PROJECTS, choice);
  assert.equal(matches.length, 0);
  assert.equal(rest.length, PROJECTS.length, "nothing is hidden");
  assert.equal(statusText(choice, 0, rest.length), "Nothing for that combination yet. 8 projects below.");
  // With Food and drink chosen, the Websites option has nothing to show, so it is greyed and cannot be chosen.
  const counts = BUYER_DISCIPLINES.map((d) => rankProjects(PROJECTS, { sector: "food-and-drink", discipline: d.id }).matches.length);
  assert.deepEqual(counts, [2, 1, 0, 0]);
});

test("the polite status: counts, words, singular, and nothing more below", () => {
  assert.equal(status({}), "8 projects.");
  assert.equal(status({ sector: "food-and-drink" }), "2 projects for food and drink brands. 6 more below.");
  assert.equal(status({ discipline: "websites" }), "3 projects in websites. 5 more below.");
  assert.equal(status({ sector: "food-and-drink", discipline: "packaging" }), "1 project for food and drink brands, in packaging. 7 more below.");
  assert.equal(statusText({ discipline: "identity" }, 8, 0), "8 projects in identity.");
  // No hyphens or dashes in what a screen reader hears.
  for (const t of BUSINESS_TYPES) assert.doesNotMatch(status({ sector: t.id }), /[-‐‑‒–—―]/);
});

test("the invitation: the business type's question, else the discipline's, else none", () => {
  assert.equal(invitationQuestion({ sector: "food-and-drink", discipline: "websites" }), "Building a food or drink brand?");
  assert.equal(invitationQuestion({ discipline: "packaging" }), "Need packaging that earns its place on the shelf?");
  assert.equal(invitationQuestion({}), null);
  for (const q of [...BUSINESS_TYPES, ...BUYER_DISCIPLINES].map((x) => x.question)) {
    assert.match(q, /\?$/);
    assert.doesNotMatch(q, /[-‐‑‒–—―]/);
  }
});

test("row and window words: the meta line, the kind, the frame code and the one line", () => {
  assert.equal(projectMeta({ sectorLabel: "Food and drink", deliveredLine: "Identity and packaging" }), "Food and drink. Identity and packaging.");
  assert.equal(projectMeta({ sectorLabel: "", deliveredLine: "Identity" }), "Identity.");
  assert.equal(projectMeta({ sectorLabel: "", deliveredLine: "" }), "");
  assert.equal(workKindLabel("client"), "Client work");
  assert.equal(workKindLabel("exploration"), "Studio exploration");
  assert.equal(frameCode(5, 1), "05B");
  assert.equal(frameCode(12, 0), "12A");
  // The line: the Hero line when set, else the first sentence of the overview.
  assert.equal(toIndexProject({ title: "T", slug: "t", heroLine: " A line. ", overview: "No." })!.line, "A line.");
  assert.equal(toIndexProject({ title: "T", slug: "t", overview: "First sentence here. Second one." })!.line, "First sentence here.");
  assert.equal(toIndexProject({ title: "T", slug: "t" })!.line, "");
});

test("page structure: static, sr only H1, the default list as the Suspense fallback, canonical /work", () => {
  const page = code("src/app/(site)/work/page.tsx");
  assert.match(page, /export const revalidate = 60;/);
  assert.match(page, /<h1 className="sr-only">Work: brand identity, packaging, websites and photography by House of Singh Studios, Toronto<\/h1>/);
  assert.match(page, /<Suspense fallback=\{<WorkIndex items=\{items\} choice=\{\{\}\} \/>\}>\s*<WorkIndexFromUrl items=\{items\} \/>/);
  assert.match(page, /canonical: 'https:\/\/studios\.houseofsingh\.com\/work'/);
  assert.doesNotMatch(page, /searchParams/, "reading searchParams on the server would make the page dynamic");
});

test("rows: the h3 link carries the project's one view transition name; no css-reveal on rows that reorder", () => {
  const rows = code("src/components/work/index/WorkRows.tsx");
  assert.match(rows, /<h3 className="wi-name" style=\{\{ viewTransitionName: `project-\$\{item\.slug\}` \}\}>/);
  assert.equal(rows.match(/viewTransitionName/g)?.length, 1);
  for (const file of ["WorkIndex", "WorkRows", "WorkWindow", "WorkSentence", "WorkChoicePanel"]) {
    assert.doesNotMatch(code(`src/components/work/index/${file}.tsx`), /css-reveal|priority/, file);
  }
  // The window is decorative: hidden, with no links.
  const win = code("src/components/work/index/WorkWindow.tsx");
  assert.match(win, /className="wi-window" aria-hidden="true"/);
  assert.doesNotMatch(win, /<Link|href=/);
});

test("the choices: role button, expanded state, controls, Enter and Space", () => {
  const sentence = code("src/components/work/index/WorkSentence.tsx");
  for (const attr of ['role="button"', "tabIndex={0}", "aria-expanded={open}", "aria-controls={controls}"]) assert.ok(sentence.includes(attr), attr);
  assert.match(sentence, /e\.key !== "Enter" && e\.key !== " "/);
  assert.match(code("src/components/work/index/index-shared.ts"), /e\.key === "Escape"/);
  assert.match(code("src/components/work/index/WorkChoicePanel.tsx"), /aria-disabled=\{disabled \|\| undefined\}/);
});

test("phones: the window follows the header, from the one hidden state the header sets", () => {
  const header = code("src/components/layout/Header.tsx");
  assert.match(header, /document\.documentElement\.toggleAttribute\("data-header-hidden", hidden\)/);
  const globals = read("src/app/globals.css");
  assert.match(globals, /--header-slide: 0\.35s cubic-bezier\(0\.23, 1, 0\.32, 1\);/);
  assert.match(globals, /html\[data-header-hidden\] \{\s*--header-edge: 0px;/);
  assert.match(globals, /\.site-header \{[^}]*transition: transform var\(--header-slide\)/);
  const css = read("src/components/work/index/work-index.css");
  assert.match(css, /top: var\(--header-edge\);\s*transition: top var\(--header-slide\);/);
  // Reduced motion: the window does not slide (the header never hides then anyway).
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.wi-window,[\s\S]*transition: none;/);
});
