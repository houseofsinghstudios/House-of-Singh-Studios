// Contact form lead rules. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { BUDGET_OPTIONS, checkLeadLengths, cleanField, LEAD_LIMITS } from "@/lib/lead";

const valid = { name: "Ada", email: "ada@example.com", service: "Brand Identity", budget: "$1,000 to $4,000", message: "Hello." };

test("clean: tags and surrounding whitespace removed, missing values empty", () => {
  assert.equal(cleanField("  <b>Ada</b>  ", LEAD_LIMITS.name), "Ada");
  assert.equal(cleanField(undefined, LEAD_LIMITS.name), "");
  assert.equal(cleanField(null, LEAD_LIMITS.name), "");
  assert.equal(cleanField("", LEAD_LIMITS.name), "");
  assert.equal(cleanField(42, LEAD_LIMITS.name), "42");
});

test("lengths: a normal lead passes, service and budget may be empty", () => {
  assert.equal(checkLeadLengths(valid), null);
  assert.equal(checkLeadLengths({ ...valid, service: "", budget: "" }), null);
  assert.equal(checkLeadLengths({ ...valid, name: "a".repeat(LEAD_LIMITS.name), message: "m".repeat(LEAD_LIMITS.message) }), null);
});

test("lengths: name 1 to 120 and message 1 to 5,000, measured after cleaning", () => {
  assert.match(checkLeadLengths({ ...valid, name: cleanField("   ", LEAD_LIMITS.name) }) ?? "", /^Name/);
  assert.match(checkLeadLengths({ ...valid, name: cleanField("<i></i>", LEAD_LIMITS.name) }) ?? "", /^Name/);
  assert.match(checkLeadLengths({ ...valid, name: "a".repeat(121) }) ?? "", /^Name/);
  assert.equal(checkLeadLengths({ ...valid, name: cleanField(`  ${"a".repeat(120)}  `, LEAD_LIMITS.name) }), null);
  assert.match(checkLeadLengths({ ...valid, message: "" }) ?? "", /^Message must be 1 to 5,000/);
  assert.match(checkLeadLengths({ ...valid, message: "m".repeat(5001) }) ?? "", /^Message/);
});

test("lengths: service and budget capped at 80", () => {
  assert.equal(checkLeadLengths({ ...valid, service: "s".repeat(80), budget: "b".repeat(80) }), null);
  assert.match(checkLeadLengths({ ...valid, service: "s".repeat(81) }) ?? "", /^Service/);
  assert.match(checkLeadLengths({ ...valid, budget: "b".repeat(81) }) ?? "", /^Budget/);
});

test("reasons never quote the submitted value", () => {
  const secret = "x".repeat(121);
  assert.ok(!(checkLeadLengths({ ...valid, name: secret }) ?? "").includes(secret));
});

test("budget is optional: missing, null or empty all pass", () => {
  for (const missing of [undefined, null, ""]) assert.equal(checkLeadLengths({ ...valid, budget: cleanField(missing, LEAD_LIMITS.budget) }), null, String(missing));
});

test("budget options: Not sure yet first, then the ranges, each within the 80 character cap", () => {
  assert.deepEqual([...BUDGET_OPTIONS], ["Not sure yet", "$1,000 to $4,000", "$4,000 to $10,000", "$10,000 to $20,000", "$20,000 or more"]);
  for (const option of BUDGET_OPTIONS) assert.equal(checkLeadLengths({ ...valid, budget: option }), null, option);
});
