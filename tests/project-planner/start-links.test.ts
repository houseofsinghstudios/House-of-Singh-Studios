// Links into the Project Planner (?service=, ?from=, ?begin=). Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { ENTRY_PLACEMENTS, parseBegin, parsePlacement, parseService, plannerOpening, startHref } from "@/lib/project-planner/start-links";
import { buildPayload, parseEvent } from "@/lib/project-planner/events-server";
import { SERVICE_IDS } from "@/lib/project-planner/types";

test("service: a single known code still works, anything else is no preselection", () => {
  for (const s of SERVICE_IDS) assert.deepEqual(parseService(s), [s]);
  for (const bad of [undefined, null, "", "Website", "web", "identity ", "print", 3]) assert.deepEqual(parseService(bad), [], String(bad));
  assert.deepEqual(parseService(["video", "photo"]), ["video"], "the first of repeated parameters");
});

test("service: up to three known codes, comma separated, in order; unknown and repeated ones ignored", () => {
  assert.deepEqual(parseService("identity,website"), ["identity", "website"]);
  assert.deepEqual(parseService("website,identity,photo"), ["website", "identity", "photo"]);
  assert.deepEqual(parseService("identity,website,photo,video"), ["identity", "website", "photo"], "three at most");
  assert.deepEqual(parseService("identity,print,web,website"), ["identity", "website"], "unknown ids ignored");
  assert.deepEqual(parseService("identity,identity,website"), ["identity", "website"], "repeats ignored");
  assert.deepEqual(parseService("unsure"), ["unsure"], "unsure alone");
  assert.deepEqual(parseService("unsure,website"), ["website"], "unsure never sits beside a named service");
  assert.deepEqual(parseService(",,"), []);
});

test("preselection: chosen services answer question 01, so a begin link opens on question 02", () => {
  assert.deepEqual(plannerOpening(["identity", "website"], true), { screen: "step", stepIndex: 1, draft: { needs: ["identity", "website"], primary: "identity" } });
  assert.deepEqual(plannerOpening([], true), { screen: "step", stepIndex: 0, draft: { needs: [] } }, "no services: question 01");
  assert.deepEqual(plannerOpening(["video"], false), { screen: "intro", stepIndex: 0, draft: { needs: ["video"], primary: "video" } }, "without begin: the intro, with the choice kept");
  // From the address, as the homepage (04) Start sends it.
  const open = plannerOpening(parseService("identity,website"), parseBegin("1"));
  assert.equal(open.stepIndex, 1);
  assert.equal(open.draft.primary, "identity");
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
  const p = buildPayload(e, "2026-10-21T12:00:00.000Z") as { attribution: { entryPlacement: string } };
  assert.equal(p.attribution.entryPlacement, "home_band_chip");
});
