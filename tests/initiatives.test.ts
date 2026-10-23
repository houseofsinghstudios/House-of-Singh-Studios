// Initiatives: status filtering, status text, and which programme pages exist. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { FALLBACK_INITIATIVES } from "@/lib/initiatives/content";
import { programmePage, linksToPage } from "@/lib/initiatives/pages";
import { hasLivePage, initiativeStatus, projectType, projectTypeLabel, statusText, toInitiative, visibleInitiatives, withFallbackCopy, type Initiative } from "@/lib/initiatives/types";

const make = (o: Partial<Initiative>): Initiative => ({ name: "X", slug: "x", category: "", tagline: "", summary: "", status: "live", order: 1, hasPage: true, ...o });

test("visible initiatives: hidden ones are dropped, the rest ordered by order then name", () => {
  const list = [
    make({ name: "C", slug: "c", order: 2 }),
    make({ name: "Hidden", slug: "h", order: 0, status: "hidden" }),
    make({ name: "B", slug: "b", order: 1, status: "by-invitation" }),
    make({ name: "A", slug: "a", order: 1, status: "opening-soon" }),
  ];
  assert.deepEqual(visibleInitiatives(list).map((i) => i.slug), ["a", "b", "c"]);
  assert.deepEqual(visibleInitiatives(FALLBACK_INITIATIVES).map((i) => i.slug), ["parallel", "commons"], "Foundry is hidden in the fallback");
});

test("status text: the override wins, otherwise the default words; hidden has none", () => {
  assert.equal(statusText(make({ status: "live" })), "Live");
  assert.equal(statusText(make({ status: "nominations-open" })), "Nominations open");
  assert.equal(statusText(make({ status: "nominations-open", statusLabel: "Nominations open for 2027" })), "Nominations open for 2027");
  assert.equal(statusText(make({ status: "opening-soon", statusLabel: "   " })), "Opening soon");
  assert.equal(statusText(make({ status: "hidden" })), "");
});

test("unknown statuses read as hidden, so nothing appears by accident", () => {
  assert.equal(initiativeStatus("live"), "live");
  for (const bad of [undefined, null, "", "Live", "draft", 3]) assert.equal(initiativeStatus(bad), "hidden", String(bad));
  assert.equal(toInitiative({ name: "Y", slug: "y", status: "secret", order: 4 })?.status, "hidden");
  assert.equal(toInitiative({ name: "", slug: "y" }), null);
});

test("programme pages: hidden, pageless, unknown and unbuilt slugs are all 404", () => {
  assert.equal(programmePage("parallel", FALLBACK_INITIATIVES)?.name, "Parallel");
  assert.equal(programmePage("commons", FALLBACK_INITIATIVES)?.name, "Commons");
  assert.equal(programmePage("foundry", FALLBACK_INITIATIVES), null, "Foundry is hidden");
  assert.equal(programmePage("nothing", FALLBACK_INITIATIVES), null);
  const shown = FALLBACK_INITIATIVES.map((i) => (i.slug === "foundry" ? { ...i, status: "live" as const, hasPage: true } : i));
  assert.equal(programmePage("foundry", shown), null, "visible with hasPage, but its page is not built yet");
  const hiddenParallel = FALLBACK_INITIATIVES.map((i) => (i.slug === "parallel" ? { ...i, status: "hidden" as const } : i));
  assert.equal(programmePage("parallel", hiddenParallel), null);
  const noPage = FALLBACK_INITIATIVES.map((i) => (i.slug === "commons" ? { ...i, hasPage: false } : i));
  assert.equal(programmePage("commons", noPage), null);
  assert.equal(linksToPage(noPage.find((i) => i.slug === "commons")!, noPage), false, "no page, no Explore link");
  assert.equal(hasLivePage(null), false);
});

test("project types: missing or unknown is client, with no label", () => {
  assert.equal(projectType(undefined), "client");
  assert.equal(projectType("Parallel"), "client");
  assert.equal(projectTypeLabel(undefined), null);
  assert.equal(projectTypeLabel("client"), null);
  assert.equal(projectTypeLabel("exploration"), "Exploration");
  assert.equal(projectTypeLabel("parallel"), "Parallel");
  assert.equal(projectTypeLabel("commons"), "Commons");
});

test("Sanity copy: empty fields keep the built-in copy, filled fields win", () => {
  const [parallel, commons] = withFallbackCopy(
    [make({ name: "Parallel", slug: "parallel" }), make({ name: "Commons", slug: "commons", tagline: "New line." }), make({ slug: "other" })],
    FALLBACK_INITIATIVES
  );
  assert.equal(parallel.tagline, "One brand. Another possibility.");
  assert.equal(parallel.category, "Brands reimagined");
  assert.equal(commons.tagline, "New line.");
  assert.ok(commons.summary.startsWith("Pro bono brand"));
});
