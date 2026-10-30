// The Studio fields the pages cannot render without are required. Read as text: the sanity package
// cannot load under the test runner's react-server condition.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fieldBlock = (schema: string, field: string) => {
  const src = readFileSync(`sanity/schemas/${schema}.ts`, "utf8");
  const start = src.indexOf(`name: "${field}",`);
  assert.ok(start > 0, `${schema}.${field} exists`);
  const next = src.indexOf("defineField(", start);
  return src.slice(start, next === -1 ? undefined : next);
};

test("case studies need a date, a featured image and an overview", () => {
  assert.match(fieldBlock("caseStudy", "publishedAt"), /rule\.required\(\)/);
  assert.match(fieldBlock("caseStudy", "overview"), /rule\.required\(\)/);
  // The featured image's rule follows its nested alt field, so it is found by its message.
  assert.match(readFileSync("sanity/schemas/caseStudy.ts", "utf8"), /image\?\.asset \? true : "Add a featured image/);
});

test("insights need a body; initiatives a tagline and a summary", () => {
  assert.match(fieldBlock("post", "body"), /rule\.required\(\)\.min\(1\)/);
  assert.match(fieldBlock("initiative", "tagline"), /rule\.required\(\)/);
  assert.match(fieldBlock("initiative", "summary"), /rule\.required\(\)/);
});
