// Page title tests. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { bareTitle, studioTitle } from "@/lib/seo";

const final = (seoTitle: string, fallback = "Article Title") => `${bareTitle(seoTitle, fallback)} — House of Singh Studios`;
const once = (t: string) => (t.match(/House of Singh Studios/gi) ?? []).length === 1;

test("an SEO title never doubles the studio name", () => {
  const cases: [string, string][] = [
    ["Rebrand or Refresh", "Rebrand or Refresh"],
    ["Rebrand or Refresh — House of Singh Studios", "Rebrand or Refresh"],
    ["Rebrand or Refresh | House of Singh Studios", "Rebrand or Refresh"],
    ["Rebrand or Refresh - house of singh studios ", "Rebrand or Refresh"],
    ["Rebrand or Refresh: House of Singh Studios", "Rebrand or Refresh"],
    ["House of Singh Studios | Rebrand or Refresh", "Rebrand or Refresh"],
    ["House of Singh Studios — Rebrand or Refresh", "Rebrand or Refresh"],
    ["House of Singh Studios: Rebrand or Refresh", "Rebrand or Refresh"],
    ["Rebrand or Refresh | House of Singh Studios | House of Singh Studios", "Rebrand or Refresh"],
  ];
  for (const [input, bare] of cases) {
    assert.equal(bareTitle(input, "Article Title"), bare, input);
    assert.ok(once(final(input)), final(input));
    assert.ok(once(studioTitle(bareTitle(input, "Article Title"))));
  }
});

test("a title that is only the studio name, or blank, falls back to the next candidate", () => {
  assert.equal(bareTitle("House of Singh Studios", "Article Title"), "Article Title");
  assert.equal(bareTitle("   ", "Article Title"), "Article Title");
  assert.equal(bareTitle(undefined, null, "Article Title"), "Article Title");
});

test("a studio name in the middle of a title is left alone", () => {
  assert.equal(bareTitle("Why House of Singh Studios uses AI", "x"), "Why House of Singh Studios uses AI");
});

test("articles: an SEO title is the whole title, exactly as written; without one the studio name is added once", async () => {
  const { articleTitles } = await import("@/lib/seo");
  assert.deepEqual(articleTitles("Branding Agency Pricing Toronto (2026): What Agencies Charge", "Branding Agency Pricing in Toronto"), {
    title: { absolute: "Branding Agency Pricing Toronto (2026): What Agencies Charge" },
    social: "Branding Agency Pricing Toronto (2026): What Agencies Charge",
  });
  assert.deepEqual(articleTitles("  Why Your Brand Looks Different Everywhere | House of Singh Studios  ", "x"), {
    title: { absolute: "Why Your Brand Looks Different Everywhere | House of Singh Studios" },
    social: "Why Your Brand Looks Different Everywhere | House of Singh Studios",
  }, "kept as written, only trimmed");
  for (const none of [undefined, null, "", "   "]) {
    assert.deepEqual(articleTitles(none, "How to Brief a Design Studio"), {
      title: "How to Brief a Design Studio",
      social: "How to Brief a Design Studio — House of Singh Studios",
    }, String(none));
  }
});

test("og:type on every page: each page openGraph spreads WEBSITE_OG first, articles say article", async () => {
  const { readFileSync, readdirSync } = await import("node:fs");
  const { join } = await import("node:path");
  const { WEBSITE_OG } = await import("@/lib/seo");
  assert.deepEqual(WEBSITE_OG, { type: "website" });
  // A page's openGraph replaces the layout's, type included, so each one must carry its own.
  const pages: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "page.tsx") pages.push(p);
    }
  };
  walk(join(process.cwd(), "src/app/(site)"));
  const withOg = pages.filter((p) => readFileSync(p, "utf8").includes("openGraph: {"));
  assert.ok(withOg.length >= 17, `${withOg.length} pages set openGraph`);
  for (const p of withOg) {
    const src = readFileSync(p, "utf8");
    if (p.includes(join("insights", "[slug]"))) {
      assert.match(src, /type: "article"/, p);
      assert.doesNotMatch(src, /WEBSITE_OG/, p);
    } else {
      assert.match(src, /openGraph: \{\s*\.\.\.WEBSITE_OG,/, p);
    }
  }
});
