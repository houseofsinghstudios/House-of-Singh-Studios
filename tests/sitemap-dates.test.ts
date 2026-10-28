// Sitemap lastmod for code pages. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { services } from "@/data/services";
import { STATIC_LASTMOD, STATIC_PAGES, staticLastmod } from "@/lib/sitemap-dates";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

test("every code page in the sitemap has a lastmod date", () => {
  const pages = [...STATIC_PAGES, ...services.map((s) => `/services/${s.slug}`)];
  for (const path of pages) {
    const date = staticLastmod(path);
    assert.ok(date, `${path || "/"} is missing from STATIC_LASTMOD`);
    assert.match(date, DATE, path);
    assert.ok(!Number.isNaN(Date.parse(date)), path);
  }
});

test("every code page route on disk is in the list", () => {
  const routes = fs.readdirSync("src/app/(site)", { withFileTypes: true })
    // Route groups such as (home) add no path segment ((home) is the homepage, checked below), and
    // the catch all [...not-found] is the 404, never listed.
    .filter((e) => e.isDirectory() && !/^[([]/.test(e.name) && fs.existsSync(`src/app/(site)/${e.name}/page.tsx`))
    .map((e) => `/${e.name}`);
  for (const route of routes) assert.ok(STATIC_PAGES.includes(route), `${route} is a page but not in STATIC_PAGES`);
  assert.ok(STATIC_PAGES.includes(""), "the homepage");
});

test("dates are real and not in the future; programme pages fall back to Initiatives", () => {
  for (const [path, date] of Object.entries(STATIC_LASTMOD)) {
    assert.match(date, DATE, path);
    assert.ok(Date.parse(date) <= Date.now() + 24 * 60 * 60 * 1000, `${path} is dated in the future`);
  }
  assert.equal(staticLastmod("/initiatives/foundry"), STATIC_LASTMOD["/initiatives"]);
  assert.equal(staticLastmod("/nowhere"), undefined);
});
