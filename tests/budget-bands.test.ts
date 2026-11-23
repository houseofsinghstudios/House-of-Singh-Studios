// One budget list for both forms (site audit S-09, 23 Nov 2026): the contact form's budget menu and the
// Project Planner's investment question offer the same ranges, in the same words and order, from
// src/lib/budget-bands.ts. "Under $1,000" first, so no band reads as a minimum spend; "Not sure yet" last.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { BAND_IDS, BAND_LABELS } from "@/lib/budget-bands";
import { BUDGET_OPTIONS } from "@/lib/lead";
import { OPTIONAL } from "@/lib/project-planner/content";
import { BAND_IDS as PLANNER_BAND_IDS } from "@/lib/project-planner/types";

test("the shared list: six ranges, Under $1,000 first, Not sure yet last", () => {
  assert.deepEqual([...BAND_IDS], ["under_1k", "1k_4k", "4k_10k", "10k_20k", "20k_plus", "not_sure"]);
  assert.deepEqual(BAND_IDS.map((id) => BAND_LABELS[id]), ["Under $1,000", "$1,000 to $4,000", "$4,000 to $10,000", "$10,000 to $20,000", "$20,000 or more", "Not sure yet"]);
});

test("both forms read it: the same ranges in the same words and order", () => {
  assert.equal(PLANNER_BAND_IDS, BAND_IDS, "the planner's ids are the shared ids");
  assert.equal(OPTIONAL.bands, BAND_LABELS, "the planner's words are the shared words");
  assert.deepEqual([...BUDGET_OPTIONS], PLANNER_BAND_IDS.map((id) => OPTIONAL.bands[id]), "contact equals the planner");
});

test("no other file in src writes its own budget range", () => {
  // A range label written out anywhere but the shared list would let the two forms drift apart again.
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry.name) && full !== path.join("src", "lib", "budget-bands.ts")) {
        if (/"(Under \$1,000|\$1,000 to \$4,000|\$20,000 or more)"/.test(fs.readFileSync(full, "utf8"))) found.push(full);
      }
    }
  };
  walk("src");
  assert.deepEqual(found, []);
});
