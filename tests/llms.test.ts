// /llms.txt: the format, every published article, and the same descriptions as the pages.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ARTICLE_FALLBACK, buildLlmsTxt, loadLlmsArticles } from "@/lib/llms";
import { services } from "@/data/services";
import { PAGE_DESCRIPTIONS } from "@/lib/page-descriptions";

const ARTICLES = [
  { slug: "brand-guidelines-what-to-include", title: "Brand Guidelines: What to Include", description: "What brand guidelines should include, and why teams ignore them." },
  { slug: "branding-agency-pricing-toronto", title: "Branding Agency Pricing in Toronto", description: "What Toronto studios and agencies charge." },
  { slug: "no-description-yet", title: "An Article Without a Description", description: null },
];
const txt = buildLlmsTxt(ARTICLES);

test("llms.txt format: title, one paragraph summary, then the sections in order", () => {
  const lines = txt.split("\n");
  assert.equal(lines[0], "# House of Singh Studios");
  assert.match(lines[2], /^> House of Singh Studios is a Toronto design studio for brand identity, websites, photography and video, and brand strategy\. It serves businesses across the GTA and Canada\.$/);
  assert.deepEqual(lines.filter((l) => l.startsWith("## ")), ["## Services", "## Tools", "## Work", "## Insights", "## Studio"]);
  for (const l of lines.filter((l) => l.startsWith("- "))) assert.match(l, /^- \[[^\]]+\]\(https:\/\/studios\.houseofsingh\.com\/[a-z0-9/-]*\): \S/, l);
});

test("every published article is listed once, in the order given (newest first), with its page's description", () => {
  const insights = txt.slice(txt.indexOf("## Insights"), txt.indexOf("## Studio"));
  const listed = [...insights.matchAll(/\]\(https:\/\/studios\.houseofsingh\.com\/insights\/([^)]+)\)/g)].map((m) => m[1]);
  assert.deepEqual(listed, ARTICLES.map((a) => a.slug));
  assert.ok(insights.includes(`/insights/no-description-yet): ${ARTICLE_FALLBACK}`), "the article page's own fallback");
});

test("the article query counts as published exactly what the sitemap counts", () => {
  const filter = (src: string, start: string) => src.slice(src.indexOf(start)).match(/\*\[_type == "post"([^\]]*)\]/)![1];
  const llms = filter(readFileSync("src/lib/sanity/articles.ts", "utf8"), "const llmsArticlesQuery");
  const sitemap = filter(readFileSync("src/app/sitemap.ts", "utf8"), '"posts"');
  assert.equal(llms, sitemap);
});

test("the pages' own descriptions, every service and every studio page", () => {
  for (const s of services) assert.ok(txt.includes(`[${s.name}](https://studios.houseofsingh.com/services/${s.slug}): ${s.seoDescription}`), s.slug);
  assert.ok(txt.includes(`(https://studios.houseofsingh.com/work): ${PAGE_DESCRIPTIONS.work}`));
  for (const path of ["/start", "/brand-pulse", "/about", "/initiatives", "/partners", "/contact"]) assert.ok(txt.includes(`(https://studios.houseofsingh.com${path}): `), path);
});

test("house style outside the addresses: no dashes, Canadian spelling", () => {
  // Addresses and the list markers the format requires are not prose.
  const prose = txt.replace(/\(https:\/\/[^)]+\)/g, "").replace(/^- /gm, "");
  assert.doesNotMatch(prose, /[-‐‑‒–—―]/);
  assert.doesNotMatch(prose, /\bcolor|organis|\bcenter\b|\bfavor|\bbehavior/i);
});

test("llms.txt is not in the sitemap", () => {
  assert.doesNotMatch(readFileSync("src/app/sitemap.ts", "utf8"), /llms/);
});

// The article list when Sanity fails (src/lib/sanity/resilience.ts): no articles only while building;
// at runtime the error is rethrown, so the last good /llms.txt keeps being served, never an empty list.
const configured = { NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123", NEXT_PUBLIC_SANITY_DATASET: "production" };
const quietly = async (run: () => Promise<void>) => {
  const original = { warn: console.warn, error: console.error };
  console.warn = () => {};
  console.error = () => {};
  try { await run(); } finally { Object.assign(console, original); }
};

test("llms.txt articles: Sanity's answer becomes the list, untitled or slugless documents left out", async () => {
  const docs = [{ slug: "a", title: "A", description: "Line." }, { slug: "b", title: "B", description: " " }, { title: "No slug" }, null];
  assert.deepEqual(await loadLlmsArticles(async () => docs, { ...configured, NEXT_PHASE: "phase-production-server" }), [
    { slug: "a", title: "A", description: "Line." },
    { slug: "b", title: "B", description: null },
  ]);
});

test("llms.txt articles: at runtime a failed read rethrows, so the last good llms.txt stays", async () => {
  const error = new TypeError("fetch failed");
  await quietly(async () => {
    await assert.rejects(loadLlmsArticles(() => Promise.reject(error), { ...configured, NEXT_PHASE: "phase-production-server" }), (thrown) => thrown === error);
  });
});

test("llms.txt articles: while building a failed read gives no articles, and the build completes", async () => {
  await quietly(async () => {
    assert.deepEqual(await loadLlmsArticles(() => Promise.reject(new TypeError("fetch failed")), { ...configured, NEXT_PHASE: "phase-production-build" }), []);
  });
});

test("the sitemap keeps its own fallback: its Sanity read is still caught there, not by readSanity", () => {
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
  assert.match(sitemap, /catch \(error\) \{\s*console\.warn\("\[sitemap\] Sanity fetch failed/);
  assert.doesNotMatch(sitemap, /readSanity/);
});
