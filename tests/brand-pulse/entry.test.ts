// Ways into Brand Pulse (?q= and ?from=). Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { ENTRY_PLACEMENTS, parsePlacement, parsePrefill } from "@/lib/brand-pulse/entry";
import { QUESTIONS } from "@/lib/brand-pulse/content";
import { QUESTION_ORDER } from "@/lib/brand-pulse/types";

test("prefill: every question and answer in content.ts is accepted, as one answer", () => {
  for (const q of QUESTION_ORDER) {
    for (const a of Object.keys(QUESTIONS[q].options)) assert.deepEqual(parsePrefill(`${q}:${a}`), { [q]: a });
  }
  assert.deepEqual(parsePrefill(["updated:3-5", "updated:never"]), { updated: "3-5" }, "first value of a repeated ?q");
});

test("prefill: unknown, malformed or mismatched values are ignored", () => {
  for (const bad of [
    undefined, null, "", 42, {}, "updated", "updated:", ":3-5", "updated:6-9", "unknown:3-5",
    "industry:3-5", "updated:3-5:extra", "updated:3-5,weakest:website", "UPDATED:3-5", " updated:3-5",
    "toString:x", "__proto__:x", "constructor:name", "updated:toString", "updated:<b>",
  ]) {
    assert.equal(parsePrefill(bad), null, String(bad));
  }
});

test("placement: known values pass, anything else is direct", () => {
  for (const p of ENTRY_PLACEMENTS) assert.equal(parsePlacement(p), p);
  for (const bad of [undefined, null, "", "home", "HOME_BAND_CHIP", "home_band_chip ", "email=a@b.co", ["evil"], 1]) {
    assert.equal(parsePlacement(bad), "direct", String(bad));
  }
  assert.equal(parsePlacement(["home_band_button", "evil"]), "home_band_button");
});
