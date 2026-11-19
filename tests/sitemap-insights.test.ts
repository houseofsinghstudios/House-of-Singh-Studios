// The sitemap's /insights entry: the newest post's _updatedAt when Sanity answers, the date map's
// date when it does not, and never an archive page (/insights/page/N). The Sanity client's fetch is
// replaced for each case, so no request leaves the test. Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import sitemap from "@/app/sitemap";
import { client } from "@/lib/sanity/client";
import { staticLastmod } from "@/lib/sitemap-dates";

const realFetch = client.fetch;
afterEach(() => { client.fetch = realFetch; });

// Answers the sitemap query with these posts; any other query (initiatives) gets an empty list,
// which leaves the initiatives on their own built-in list.
function answer(posts: Array<{ slug: string; _updatedAt?: string }>) {
  client.fetch = (async (query: string) => (query.includes('"posts"') ? { caseStudies: [], posts } : [])) as typeof client.fetch;
}

const entry = (map: Awaited<ReturnType<typeof sitemap>>, path: string) =>
  map.find((e) => e.url === `https://studios.houseofsingh.com${path}`);

test("when Sanity cannot be read, /insights falls back to the date map and no article is listed", async () => {
  client.fetch = (async () => { throw new TypeError("fetch failed"); }) as typeof client.fetch;
  const warn = console.warn;
  console.warn = () => {};
  const error = console.error;
  console.error = () => {};
  try {
    const map = await sitemap();
    assert.equal(entry(map, "/insights")?.lastModified, staticLastmod("/insights"));
    assert.ok(staticLastmod("/insights"), "the date map has a date for /insights");
    assert.equal(map.filter((e) => e.url.includes("/insights/")).length, 0);
    assert.equal(map.filter((e) => e.url === "https://studios.houseofsingh.com/insights").length, 1);
  } finally {
    console.warn = warn;
    console.error = error;
  }
});

test("when Sanity answers, /insights takes the newest post's _updatedAt and every post is listed", async () => {
  answer([
    { slug: "brand-audit-checklist", _updatedAt: "2026-11-18T00:06:31Z" },
    { slug: "packaging-design-cost-canada", _updatedAt: "2026-11-03T19:17:09Z" },
  ]);
  const map = await sitemap();
  assert.equal(entry(map, "/insights")?.lastModified, "2026-11-18T00:06:31Z");
  assert.equal(entry(map, "/insights/brand-audit-checklist")?.lastModified, "2026-11-18T00:06:31Z");
  assert.ok(entry(map, "/insights/packaging-design-cost-canada"));
});

test("archive pages are never in the sitemap", async () => {
  answer(Array.from({ length: 40 }, (_, i) => ({ slug: `post-${i}`, _updatedAt: "2026-11-01T00:00:00Z" })));
  const map = await sitemap();
  assert.equal(map.filter((e) => e.url.includes("/insights/page")).length, 0);
});
