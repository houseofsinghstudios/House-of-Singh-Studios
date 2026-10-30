import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { HIDDEN_TYPES, SINGLETONS } from "../sanity/structure";

test("testimonial, teamMember and package are hidden in Studio, with their schemas kept", () => {
  assert.deepEqual([...HIDDEN_TYPES].sort(), ["package", "teamMember", "testimonial"]);
  // Read as text: the sanity package cannot load under the test runner's react-server condition.
  const index = readFileSync("sanity/schemas/index.ts", "utf8");
  for (const [type, imported] of [["testimonial", "testimonial"], ["teamMember", "teamMember"], ["package", "packageSchema"]]) {
    assert.match(index, new RegExp(`^  ${imported},$`, "m"), `${type} schema still registered, so existing documents stay readable`);
    assert.match(readFileSync(`sanity/schemas/${type}.ts`, "utf8"), new RegExp(`name: "${type}"`));
  }
});

test("hidden types are left out of the desk and of every create new menu", () => {
  const structure = readFileSync("sanity/structure.ts", "utf8");
  assert.match(structure, /\[\.\.\.SINGLETONS, \.\.\.HIDDEN_TYPES\]\.includes\(item\.getId\(\)/);
  const config = readFileSync("sanity.config.ts", "utf8");
  assert.match(config, /templates\.filter\(\(t\) => !\[\.\.\.SINGLETONS, \.\.\.HIDDEN_TYPES\]\.includes\(t\.schemaType\)\)/);
  assert.deepEqual(SINGLETONS, ["servicePricing"]);
});
