// Case study alt text. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { coverAlt, projectAlt } from "@/lib/alt-text";

test("images: the project name, then what is shown", () => {
  assert.equal(projectAlt("Nivora", "The Nivora wordmark"), "Nivora: The Nivora wordmark");
  assert.equal(projectAlt("Nivora", "Nivora: the lookbook cover"), "Nivora: the lookbook cover", "already in the pattern");
  assert.equal(projectAlt("Nivora", "  "), "Nivora", "empty alt falls back to the name");
  assert.equal(projectAlt("", "A wordmark"), "A wordmark");
});

test("cover: the project name and primary discipline, then what is shown", () => {
  assert.equal(coverAlt("Tairn and Co.", "Three tea cartons on a stone ledge", "Brand Identity"), "Tairn and Co., brand identity: Three tea cartons on a stone ledge");
  assert.equal(coverAlt("Bruno Bakehouse", "Bruno Bakehouse: the storefront", "Brand Identity"), "Bruno Bakehouse, brand identity: the storefront");
  assert.equal(coverAlt("Bruno Bakehouse", "Bruno Bakehouse, brand identity: the storefront", "Brand Identity"), "Bruno Bakehouse, brand identity: the storefront");
  assert.equal(coverAlt("Nivora", "", "Brand Identity"), "Nivora, brand identity");
  assert.equal(coverAlt("Nivora", "Ceramic pieces", ""), "Nivora: Ceramic pieces");
});
