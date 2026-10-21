// Links into the Project Planner (?service=, ?from=, ?begin=). Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { ENTRY_PLACEMENTS, parseBegin, parsePlacement, parseService, startHref } from "@/lib/project-planner/start-links";
import { buildPayload, parseEvent } from "@/lib/project-planner/events-server";
import { SERVICE_IDS } from "@/lib/project-planner/types";

test("service: known codes pass, anything else is no preselection", () => {
  for (const s of SERVICE_IDS) assert.equal(parseService(s), s);
  for (const bad of [undefined, null, "", "Website", "web", "identity ", "print", 3]) assert.equal(parseService(bad), null, String(bad));
  assert.equal(parseService(["video", "photo"]), "video");
});

test("begin: only exactly 1 skips the intro", () => {
  assert.equal(parseBegin("1"), true);
  assert.equal(parseBegin(["1"]), true);
  for (const bad of [undefined, null, "", "0", "true", "yes", "01", 1]) assert.equal(parseBegin(bad), false, String(bad));
});

test("placement: the homepage band values are known, anything else is direct", () => {
  assert.ok(ENTRY_PLACEMENTS.includes("home_band_chip") && ENTRY_PLACEMENTS.includes("home_band_button"));
  for (const p of ENTRY_PLACEMENTS) assert.equal(parsePlacement(p), p);
  for (const bad of [undefined, "", "home", "Home_Band_Chip", "evil", ["x"]]) assert.equal(parsePlacement(bad), "direct", String(bad));
  assert.equal(startHref("home_band_button"), "/start?from=home_band_button");
});

test("the n8n payload records the band placement as entryPlacement", () => {
  const attribution = { source: "", medium: "", campaign: "", landingPage: "/start", entryPlacement: "home_band_chip", referrer: "https://studios.houseofsingh.com/" };
  const e = parseEvent({ event: "started", briefId: "3f1c2b6e-8a4d-4c1e-9b7a-2d5e6f708192", attribution });
  assert.ok(typeof e !== "string");
  const p = buildPayload(e, null, "2026-10-21T12:00:00.000Z") as { attribution: { entryPlacement: string } };
  assert.equal(p.attribution.entryPlacement, "home_band_chip");
});
