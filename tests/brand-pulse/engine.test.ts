// Brand Pulse engine tests. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { assess, ENGINE_VERSION, overallPulse, profileFor, vitalLevels, weakestVital } from "@/lib/brand-pulse/engine";
import { services } from "@/data/services";
import { ANSWER_IDS, type Answers, type Level, type VitalId } from "@/lib/brand-pulse/types";
import { allAnswers } from "./all-answers";

const DASHES = /[-‐-―−]/;
const BASE: Answers = {
  industry: "other",
  updated: "under-1",
  weakest: "none",
  consistent: "yes",
  handover: "written-followed",
  clarity: "straight-away",
  ahead: "steady",
};
const SLUGS = { BRAND: "brand-identity", MEDIA: "visual-media", DIGITAL: "digital-design", STRATEGY: "creative-strategy" };

const level = (a: Partial<Answers>, id: VitalId) => vitalLevels({ ...BASE, ...a })[id];

test("every one of the 53,760 combinations returns a complete, clean result", () => {
  const serviceSlugs = new Set(services.map((s) => s.slug));
  let count = 0;
  for (const a of allAnswers()) {
    count++;
    const r = assess(a);
    assert.ok(["strong", "steady", "weak"].includes(r.pulse));
    assert.ok(r.pulseLabel && r.profileId && r.profileName && r.headline);
    assert.equal(r.vitals.length, 5);
    assert.deepEqual(r.vitals.map((v) => v.id), ["uptodate", "presence", "consistent", "ready", "clear"]);
    assert.equal(r.paragraphs.length, 4);
    r.paragraphs.forEach((p) => assert.ok(p.trim().length > 0));
    assert.equal(r.actions.length, 3);
    assert.ok(serviceSlugs.has(r.service.slug) && r.service.name && r.service.url.endsWith(`/services/${r.service.slug}`));
    if (r.alsoService) assert.ok(serviceSlugs.has(r.alsoService.slug));
    assert.equal(r.engineVersion, ENGINE_VERSION);

    const visible = [r.pulseLabel, r.profileName, r.headline, ...r.paragraphs, ...r.actions, r.service.name, r.alsoService?.name ?? "",
      ...r.vitals.flatMap((v) => [v.label, v.levelLabel, v.explainer])].join("\n");
    assert.ok(!/undefined|null|\[object|TODO|lorem|\{\{|\}\}/i.test(visible), `placeholder text for ${JSON.stringify(a)}`);
    assert.ok(!DASHES.test(visible), `dash in result for ${JSON.stringify(a)}`);
  }
  assert.equal(count, 53760);
});

test("Up to date: under-1 and 1-3 Good, 3-5 Needs attention, over-5 and never At risk", () => {
  const expect: Record<Answers["updated"], Level> = { "under-1": "good", "1-3": "good", "3-5": "attention", "over-5": "risk", never: "risk" };
  for (const [updated, lvl] of Object.entries(expect)) assert.equal(level({ updated: updated as Answers["updated"] }, "uptodate"), lvl);
});

test("Presence: none Good; any other Needs attention, At risk when the look is 3+ years old or never done", () => {
  for (const updated of ANSWER_IDS.updated) assert.equal(level({ weakest: "none", updated }, "presence"), "good");
  for (const weakest of ANSWER_IDS.weakest.filter((w) => w !== "none")) {
    assert.equal(level({ weakest, updated: "under-1" }, "presence"), "attention");
    assert.equal(level({ weakest, updated: "1-3" }, "presence"), "attention");
    assert.equal(level({ weakest, updated: "3-5" }, "presence"), "risk");
    assert.equal(level({ weakest, updated: "over-5" }, "presence"), "risk");
    assert.equal(level({ weakest, updated: "never" }, "presence"), "risk");
  }
});

test("Consistent: yes Good, mostly and never-compared Needs attention, no At risk", () => {
  assert.equal(level({ consistent: "yes" }, "consistent"), "good");
  assert.equal(level({ consistent: "mostly" }, "consistent"), "attention");
  assert.equal(level({ consistent: "never-compared" }, "consistent"), "attention");
  assert.equal(level({ consistent: "no" }, "consistent"), "risk");
});

test("Ready: handover levels, and growth ahead raises Needs attention to At risk while Good stays Good", () => {
  assert.equal(level({ handover: "written-followed", ahead: "steady" }, "ready"), "good");
  assert.equal(level({ handover: "rules-unused", ahead: "steady" }, "ready"), "attention");
  assert.equal(level({ handover: "lots-of-help", ahead: "steady" }, "ready"), "attention");
  assert.equal(level({ handover: "in-our-heads", ahead: "steady" }, "ready"), "risk");
  for (const ahead of ["launch", "growing", "investment"] as const) {
    assert.equal(level({ handover: "written-followed", ahead }, "ready"), "good");
    assert.equal(level({ handover: "rules-unused", ahead }, "ready"), "risk");
    assert.equal(level({ handover: "lots-of-help", ahead }, "ready"), "risk");
    assert.equal(level({ handover: "in-our-heads", ahead }, "ready"), "risk");
  }
});

test("Clear: straight-away Good, some-explanation Needs attention, after-talking and struggle At risk", () => {
  assert.equal(level({ clarity: "straight-away" }, "clear"), "good");
  assert.equal(level({ clarity: "some-explanation" }, "clear"), "attention");
  assert.equal(level({ clarity: "after-talking" }, "clear"), "risk");
  assert.equal(level({ clarity: "struggle" }, "clear"), "risk");
});

test("Overall pulse: no At risk Strong, exactly one Steady, two or more Weak", () => {
  const all = (l: Level) => ({ uptodate: l, presence: l, consistent: l, ready: l, clear: l });
  assert.equal(overallPulse(all("good")), "strong");
  assert.equal(overallPulse(all("attention")), "strong");
  assert.equal(overallPulse({ ...all("attention"), ready: "risk" }), "steady");
  assert.equal(overallPulse({ ...all("good"), ready: "risk", clear: "risk" }), "weak");
  assert.equal(overallPulse(all("risk")), "weak");
});

test("Weakest sign: lowest level, ties broken Clear, Up to date, Ready, Consistent, Presence", () => {
  const all = (l: Level) => ({ uptodate: l, presence: l, consistent: l, ready: l, clear: l });
  assert.equal(weakestVital(all("risk")), "clear");
  assert.equal(weakestVital({ ...all("risk"), clear: "attention" }), "uptodate");
  assert.equal(weakestVital({ ...all("risk"), clear: "good", uptodate: "good" }), "ready");
  assert.equal(weakestVital({ ...all("risk"), clear: "good", uptodate: "good", ready: "good" }), "consistent");
  assert.equal(weakestVital({ ...all("good"), presence: "attention" }), "presence");
  assert.equal(weakestVital({ ...all("attention"), presence: "risk" }), "presence");
});

test("Profile rules, first match wins", () => {
  const p = (a: Partial<Answers>) => profileFor({ ...BASE, ...a }, vitalLevels({ ...BASE, ...a }));
  assert.equal(p({}), "strong");
  // Clear ties with everything and still wins.
  assert.equal(p({ updated: "never", weakest: "website", consistent: "no", handover: "in-our-heads", clarity: "struggle", ahead: "launch" }), "hard-to-explain");
  assert.equal(p({ clarity: "some-explanation", updated: "3-5" }), "hard-to-explain");
  assert.equal(p({ updated: "over-5", weakest: "social", consistent: "no", handover: "in-our-heads" }), "overdue");
  assert.equal(p({ handover: "rules-unused", ahead: "launch", consistent: "no" }), "unused-rulebook");
  assert.equal(p({ handover: "rules-unused", ahead: "steady" }), "unused-rulebook");
  assert.equal(p({ handover: "lots-of-help", ahead: "growing", consistent: "no" }), "outgrown");
  assert.equal(p({ handover: "in-our-heads", ahead: "investment" }), "outgrown");
  assert.equal(p({ handover: "in-our-heads", ahead: "steady", consistent: "no" }), "unwritten");
  assert.equal(p({ handover: "lots-of-help", ahead: "steady" }), "unwritten");
  assert.equal(p({ consistent: "no", weakest: "website", updated: "never" }), "overdue");
  assert.equal(p({ consistent: "no", weakest: "website" }), "scattered");
  assert.equal(p({ consistent: "mostly", weakest: "website" }), "scattered");
  assert.equal(p({ weakest: "photo-video" }), "undersold");
  assert.equal(p({ weakest: "logo-look", updated: "3-5" }), "undersold");
  assert.equal(p({ weakest: "logo-look", consistent: "never-compared" }), "scattered");
});

test("Services: primary by profile, also worth a look only when weakest is named and differs", () => {
  const r = (a: Partial<Answers>) => assess({ ...BASE, ...a });
  assert.equal(r({ clarity: "struggle" }).service.slug, SLUGS.STRATEGY);
  assert.equal(r({ consistent: "no" }).service.slug, SLUGS.STRATEGY);
  assert.equal(r({ handover: "rules-unused" }).service.slug, SLUGS.STRATEGY);
  assert.equal(r({ handover: "lots-of-help", ahead: "launch" }).service.slug, SLUGS.STRATEGY);
  assert.equal(r({ handover: "in-our-heads" }).service.slug, SLUGS.STRATEGY);
  assert.equal(r({ updated: "never" }).service.slug, SLUGS.BRAND);
  assert.equal(r({ weakest: "website" }).service.slug, SLUGS.DIGITAL);
  assert.equal(r({ weakest: "photo-video" }).service.slug, SLUGS.MEDIA);
  assert.equal(r({ weakest: "social" }).service.slug, SLUGS.MEDIA);
  assert.equal(r({ weakest: "print-sales" }).service.slug, SLUGS.BRAND);
  assert.equal(r({ weakest: "logo-look" }).service.slug, SLUGS.BRAND);
  assert.equal(r({}).service.slug, SLUGS.MEDIA);
  assert.equal(r({ weakest: "website" }).alsoService, null);
  assert.equal(r({ updated: "over-5", weakest: "logo-look" }).alsoService, null);
  assert.equal(r({ updated: "over-5", weakest: "website" }).alsoService?.slug, SLUGS.DIGITAL);

  for (const a of allAnswers()) {
    const res = assess(a);
    if (a.weakest === "none" || res.alsoService?.slug === res.service.slug) assert.equal(res.alsoService, null);
    if (a.weakest === "none") assert.equal(res.alsoService, null);
    if (res.alsoService) assert.notEqual(res.alsoService.slug, res.service.slug);
  }
});

test("Snapshot: a weak, hard to explain real estate brand", () => {
  const r = assess({ industry: "real-estate", updated: "over-5", weakest: "website", consistent: "no", handover: "in-our-heads", clarity: "after-talking", ahead: "launch" });
  assert.equal(r.pulse, "weak");
  assert.equal(r.pulseLabel, "Weak pulse");
  assert.equal(r.profileId, "hard-to-explain");
  assert.equal(r.profileName, "The Hard to Explain Brand");
  assert.deepEqual(r.vitals.map((v) => v.level), ["risk", "risk", "risk", "risk", "risk"]);
  assert.equal(r.service.slug, SLUGS.STRATEGY);
  assert.equal(r.service.name, "Creative Strategy and Systems");
  assert.equal(r.alsoService?.slug, SLUGS.DIGITAL);
  assert.ok(r.paragraphs[0].startsWith("In real estate, buyers and partners"));
});

test("Snapshot: a strong technology brand", () => {
  const r = assess({ industry: "technology", updated: "1-3", weakest: "none", consistent: "yes", handover: "written-followed", clarity: "straight-away", ahead: "steady" });
  assert.equal(r.pulse, "strong");
  assert.equal(r.profileId, "strong");
  assert.equal(r.profileName, "The Strong Pulse Brand");
  assert.deepEqual(r.vitals.map((v) => v.level), ["good", "good", "good", "good", "good"]);
  assert.equal(r.service.slug, SLUGS.MEDIA);
  assert.equal(r.service.name, "Visual Media and Content Production");
  assert.equal(r.alsoService, null);
});

test("Output is identical across two runs", () => {
  const run = () => JSON.stringify([...allAnswers()].map(assess));
  assert.equal(run(), run());
});
