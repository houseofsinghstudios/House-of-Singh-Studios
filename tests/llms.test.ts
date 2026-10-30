// /llms.txt: the format, every published article, and the same descriptions as the pages.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ARTICLE_FALLBACK, buildLlmsTxt } from "@/lib/llms";
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
