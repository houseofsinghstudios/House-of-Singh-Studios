// The About clock names Toronto's zone as the date has it, EST in winter and EDT under daylight time
// (site audit S-16, 23 Nov 2026): the label was a fixed "EST". Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { torontoTime } from "@/lib/toronto-time";

test("the zone follows daylight time", () => {
  assert.equal(torontoTime(new Date("2026-01-15T17:00:00Z")).zone, "EST");
  assert.equal(torontoTime(new Date("2026-07-15T16:00:00Z")).zone, "EDT");
  // The changes themselves: 8 March and 1 November 2026, at 2am local time.
  assert.equal(torontoTime(new Date("2026-03-08T06:59:00Z")).zone, "EST");
  assert.equal(torontoTime(new Date("2026-03-08T07:01:00Z")).zone, "EDT");
  assert.equal(torontoTime(new Date("2026-11-01T05:59:00Z")).zone, "EDT");
  assert.equal(torontoTime(new Date("2026-11-01T06:01:00Z")).zone, "EST");
});

test("the About clock reads the zone from it, never a fixed EST, and only in the browser", () => {
  const src = readFileSync("src/components/about/AboutClient.tsx", "utf8");
  assert.match(src, /return `\$\{time\} \$\{torontoTime\(now\)\.zone\}`;/);
  assert.doesNotMatch(src, /\bEST\{" "\}/, "no fixed label");
  assert.match(src, /const noTimeOnServer = \(\) => null;/, "the server renders the hidden placeholder");
});
