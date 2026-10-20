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
