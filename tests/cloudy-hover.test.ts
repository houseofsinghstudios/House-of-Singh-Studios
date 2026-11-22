// Small text on a Cloudy White hover ground turns Gunmetal while the ground shows, as on .surface-cloudy
// panels and the homepage What we do rows: Accessible Ash is 3.91:1 on Cloudy White (22 Nov 2026).
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("hover grounds: every Cloudy White hover sets --text-label to Gunmetal", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  const rule = css.match(/@media \(hover: hover\) \{\s*((?:\.[\w-]+:hover,?\s*)+)\{\s*--text-label: var\(--text-secondary\);/);
  assert.ok(rule, "the shared hover rule");
  for (const sel of [".row-bleed:hover", ".svc-del-row:hover", ".svc-acc-row:hover", ".about-team-card:hover", ".ai-compare-data:hover"]) {
    assert.ok(rule[1].includes(sel), sel);
  }
  assert.match(css, /\.surface-cloudy,\s*\.svc-block-img-placeholder \{\s*--text-label: var\(--text-secondary\);/);
});
