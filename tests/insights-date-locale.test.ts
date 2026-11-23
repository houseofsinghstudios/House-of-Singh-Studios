// Article dates are formatted for Canada (en-CA), the site's locale (lang="en-CA", og:locale en_CA;
// CLAUDE.md drift in the site audit, 23 Nov 2026). Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("every Insights date formatter uses en-CA", () => {
  for (const f of ["src/components/insights/InsightArticle.tsx", "src/components/insights/ArticleMore.tsx", "src/components/insights/InsightCards.tsx", "src/lib/article-dates.ts"]) {
    const src = readFileSync(f, "utf8");
    assert.match(src, /"en-CA"/, f);
    assert.doesNotMatch(src, /"en-US"/, f);
  }
  // What a reader sees: the month written out, as before.
  const d = new Date("2026-11-23T12:00:00Z");
  assert.equal(new Intl.DateTimeFormat("en-CA", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d), "November 23, 2026");
  assert.equal(new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric", timeZone: "UTC" }).format(d), "November 2026");
});
