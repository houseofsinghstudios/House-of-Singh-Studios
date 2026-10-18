// Brand Pulse engine tests. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { assessWithActions } from "@/lib/brand-pulse/actions";
import { assess, ENGINE_VERSION, levelFor, overallPulse, profileFor, SCORING, severities, totalOf, weakestVital, type Severities } from "@/lib/brand-pulse/engine";
import { services } from "@/data/services";
import { ANSWER_IDS, type Answers, type ProfileId, type Pulse } from "@/lib/brand-pulse/types";
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
const sev = (a: Partial<Answers>) => severities({ ...BASE, ...a });
const s5 = (uptodate: number, presence: number, consistent: number, ready: number, clear: number): Severities => ({ uptodate, presence, consistent, ready, clear });

test("every one of the 53,760 combinations returns a complete, clean result, actions on the server only", () => {
  const serviceSlugs = new Set(services.map((s) => s.slug));
  let count = 0;
  for (const a of allAnswers()) {
    count++;
    const browser = assess(a);
    assert.ok(!("actions" in browser), "the browser result must not carry actions");
    const r = assessWithActions(a);
    assert.ok(["strong", "steady", "weak"].includes(r.pulse));
    assert.ok(r.pulseLabel && r.profileId && r.profileName && r.headline);
    assert.equal(r.vitals.length, 5);
    assert.deepEqual(r.vitals.map((v) => v.id), ["uptodate", "presence", "consistent", "ready", "clear"]);
    r.vitals.forEach((v) => assert.ok(Number.isInteger(v.severity) && v.severity >= 0 && v.severity <= 4 && v.level === levelFor(v.severity)));
    assert.equal(r.total, r.vitals.reduce((s, v) => s + v.severity, 0));
    assert.equal(r.paragraphs.length, 4);
    r.paragraphs.forEach((p) => assert.ok(p.trim().length > 0));
    assert.equal(r.actions.length, 3);
    r.actions.forEach((x) => assert.ok(x.trim().length > 0));
    assert.ok(serviceSlugs.has(r.service.slug) && r.service.name && r.service.url.endsWith(`/services/${r.service.slug}`));
    if (r.alsoService) assert.ok(serviceSlugs.has(r.alsoService.slug));
    assert.equal(r.engineVersion, ENGINE_VERSION);

    const visible = [r.pulseLabel, r.profileName, r.headline, ...r.paragraphs, ...r.actions, r.service.name, r.alsoService?.name ?? "",
      ...r.vitals.flatMap((v) => [v.label, v.levelLabel, v.explainer])].join("\n");
    assert.ok(!/undefined|null|\[object|TODO|lorem|\{\{|\}\}|NaN/i.test(visible), `placeholder text for ${JSON.stringify(a)}`);
    assert.ok(!DASHES.test(visible), `dash in result for ${JSON.stringify(a)}`);
  }
  assert.equal(count, 53760);
});

test("Up to date severity: under-1 0, 1-3 1, 3-5 2, over-5 3, never 4", () => {
  const expect = { "under-1": 0, "1-3": 1, "3-5": 2, "over-5": 3, never: 4 } as const;
  for (const [updated, n] of Object.entries(expect)) assert.equal(sev({ updated: updated as Answers["updated"] }).uptodate, n);
});

test("Presence severity: none 0; a named part 2, or 3 when the look is 3+ years old or never done", () => {
  for (const updated of ANSWER_IDS.updated) assert.equal(sev({ weakest: "none", updated }).presence, 0);
  for (const weakest of ANSWER_IDS.weakest.filter((w) => w !== "none")) {
    assert.equal(sev({ weakest, updated: "under-1" }).presence, 2);
    assert.equal(sev({ weakest, updated: "1-3" }).presence, 2);
    assert.equal(sev({ weakest, updated: "3-5" }).presence, 3);
    assert.equal(sev({ weakest, updated: "over-5" }).presence, 3);
    assert.equal(sev({ weakest, updated: "never" }).presence, 3);
  }
});

test("Consistent severity: yes 0, mostly 2, never-compared 2, no 4", () => {
  assert.equal(sev({ consistent: "yes" }).consistent, 0);
  assert.equal(sev({ consistent: "mostly" }).consistent, 2);
  assert.equal(sev({ consistent: "never-compared" }).consistent, 2);
  assert.equal(sev({ consistent: "no" }).consistent, 4);
});

test("Ready severity: handover base, plus 1 with growth ahead when above 0, capped at 4", () => {
  const base = { "written-followed": 0, "rules-unused": 2, "lots-of-help": 2, "in-our-heads": 3 } as const;
  for (const [handover, n] of Object.entries(base)) {
    const h = handover as Answers["handover"];
    assert.equal(sev({ handover: h, ahead: "steady" }).ready, n);
    for (const ahead of ["launch", "growing", "investment"] as const) {
      assert.equal(sev({ handover: h, ahead }).ready, n === 0 ? 0 : Math.min(4, n + 1));
    }
  }
  assert.equal(sev({ handover: "in-our-heads", ahead: "launch" }).ready, 4);
});

test("Clear severity: straight-away 0, some-explanation 2, after-talking 3, struggle 4", () => {
  assert.equal(sev({ clarity: "straight-away" }).clear, 0);
  assert.equal(sev({ clarity: "some-explanation" }).clear, 2);
  assert.equal(sev({ clarity: "after-talking" }).clear, 3);
  assert.equal(sev({ clarity: "struggle" }).clear, 4);
});

test("Level from severity: 0 and 1 Good, 2 Needs attention, 3 and 4 At risk", () => {
  assert.deepEqual([0, 1, 2, 3, 4].map(levelFor), ["good", "good", "attention", "risk", "risk"]);
});

test("Pulse bands on the total: 0 to 6 Strong, 7 to 11 Steady, 12 to 20 Weak, including the edges", () => {
  const expect: [number, Pulse][] = [[0, "strong"], [6, "strong"], [7, "steady"], [11, "steady"], [12, "weak"], [20, "weak"]];
  for (const [total, pulse] of expect) assert.equal(overallPulse(total), pulse, `total ${total}`);
  // The same edges reached through real answers.
  const at = (a: Partial<Answers>) => { const s = sev(a); return { total: totalOf(s), pulse: assess({ ...BASE, ...a }).pulse }; };
  assert.deepEqual(at({ updated: "1-3", clarity: "struggle", handover: "rules-unused" }), { total: 7, pulse: "steady" });
  assert.deepEqual(at({ updated: "1-3", consistent: "mostly", clarity: "after-talking" }), { total: 6, pulse: "strong" });
  assert.deepEqual(at({ updated: "1-3", consistent: "no", handover: "rules-unused", clarity: "struggle" }), { total: 11, pulse: "steady" });
  assert.deepEqual(at({ updated: "never", consistent: "no", clarity: "struggle" }), { total: 12, pulse: "weak" });
});

test("Strong profile only when every severity is 0 or 1", () => {
  assert.equal(profileFor(BASE, s5(1, 0, 0, 0, 0)), "strong");
  assert.equal(profileFor(BASE, s5(1, 1, 1, 1, 1)), "strong");
  assert.notEqual(profileFor(BASE, s5(0, 0, 0, 0, 2)), "strong");
});

test("Ties: the part named as weakest wins first", () => {
  const tied = s5(3, 3, 3, 3, 3);
  assert.equal(weakestVital(tied, "logo-look"), "uptodate");
  for (const w of ["website", "photo-video", "social", "print-sales"] as const) assert.equal(weakestVital(tied, w), "presence");
  assert.equal(weakestVital(tied, "none"), "consistent");
  // The preference only breaks ties: a strictly higher sign still wins.
  assert.equal(weakestVital(s5(3, 2, 4, 0, 0), "logo-look"), "consistent");
  assert.equal(weakestVital(s5(0, 3, 0, 0, 4), "website"), "clear");
});

test("Ties with no preference: Consistent, Ready, Clear, Up to date, Presence", () => {
  assert.deepEqual(SCORING.tieOrder, ["consistent", "ready", "clear", "uptodate", "presence"]);
  assert.equal(weakestVital(s5(3, 3, 3, 3, 3), "none"), "consistent");
  assert.equal(weakestVital(s5(3, 3, 0, 3, 3), "none"), "ready");
  assert.equal(weakestVital(s5(3, 3, 0, 0, 3), "none"), "clear");
  assert.equal(weakestVital(s5(3, 3, 0, 0, 0), "none"), "uptodate");
  assert.equal(weakestVital(s5(0, 3, 0, 0, 0), "none"), "presence");
  // A named part whose sign is not in the tie falls back to the order.
  assert.equal(weakestVital(s5(0, 2, 3, 3, 0), "website"), "consistent");
  assert.equal(weakestVital(s5(2, 0, 0, 3, 3), "logo-look"), "ready");
});

test("Sign to profile mapping is unchanged", () => {
  const p = (a: Partial<Answers>) => profileFor({ ...BASE, ...a }, sev(a));
  assert.equal(p({}), "strong");
  assert.equal(p({ clarity: "struggle" }), "hard-to-explain");
  assert.equal(p({ updated: "never" }), "overdue");
  assert.equal(p({ consistent: "no" }), "scattered");
  assert.equal(p({ weakest: "social", updated: "over-5" }), "undersold");
  assert.equal(p({ handover: "rules-unused", ahead: "launch" }), "unused-rulebook");
  assert.equal(p({ handover: "in-our-heads", ahead: "growing" }), "outgrown");
  assert.equal(p({ handover: "in-our-heads", ahead: "steady" }), "unwritten");
  // logo-look ties Up to date with Presence at 3 and wins for Up to date.
  assert.equal(p({ weakest: "logo-look", updated: "over-5" }), "overdue");
  // website ties Presence with Up to date at 3 and wins for Presence.
  assert.equal(p({ weakest: "website", updated: "over-5" }), "undersold");
});

test("Services: primary by profile, also worth a look only when weakest is named and differs", () => {
  const r = (a: Partial<Answers>) => assess({ ...BASE, ...a });
  assert.equal(r({ clarity: "struggle" }).service.slug, SLUGS.STRATEGY);
  assert.equal(r({ consistent: "no" }).service.slug, SLUGS.STRATEGY);
  assert.equal(r({ updated: "never" }).service.slug, SLUGS.BRAND);
  assert.equal(r({ weakest: "website" }).service.slug, SLUGS.DIGITAL);
  assert.equal(r({ weakest: "photo-video" }).service.slug, SLUGS.MEDIA);
  assert.equal(r({ weakest: "print-sales" }).service.slug, SLUGS.BRAND);
  assert.equal(r({}).service.slug, SLUGS.MEDIA);
  for (const a of allAnswers()) {
    const res = assess(a);
    if (a.weakest === "none") assert.equal(res.alsoService, null);
    if (res.alsoService) assert.notEqual(res.alsoService.slug, res.service.slug);
  }
});

test("Distribution across all combinations: no profile over 30%, Weak pulse under 50%", () => {
  const profiles = new Map<ProfileId, number>();
  const pulses = new Map<Pulse, number>();
  let n = 0;
  for (const a of allAnswers()) {
    const r = assess(a);
    n++;
    profiles.set(r.profileId, (profiles.get(r.profileId) ?? 0) + 1);
    pulses.set(r.pulse, (pulses.get(r.pulse) ?? 0) + 1);
  }
  const pct = (v: number) => `${((100 * v) / n).toFixed(1).padStart(5)}%`;
  const lines = ["", "  Brand Pulse distribution over all 53,760 combinations", "  Profile             Count   Share"];
  [...profiles.entries()].sort((x, y) => y[1] - x[1]).forEach(([k, v]) => lines.push(`  ${k.padEnd(18)}${String(v).padStart(6)}  ${pct(v)}`));
  lines.push("  Pulse               Count   Share");
  (["strong", "steady", "weak"] as Pulse[]).forEach((k) => lines.push(`  ${k.padEnd(18)}${String(pulses.get(k) ?? 0).padStart(6)}  ${pct(pulses.get(k) ?? 0)}`));
  console.log(lines.join("\n"));
  for (const [k, v] of profiles) assert.ok(v / n <= 0.3, `${k} is ${pct(v)}`);
  assert.ok((pulses.get("weak") ?? 0) / n < 0.5, `weak is ${pct(pulses.get("weak") ?? 0)}`);
});

test("Snapshot: real estate, over 5 years, website, not alike, in our heads, after talking, launch", () => {
  const r = assessWithActions({ industry: "real-estate", updated: "over-5", weakest: "website", consistent: "no", handover: "in-our-heads", clarity: "after-talking", ahead: "launch" });
  assert.deepEqual(r.vitals.map((v) => [v.id, v.severity, v.level]), [["uptodate", 3, "risk"], ["presence", 3, "risk"], ["consistent", 4, "risk"], ["ready", 4, "risk"], ["clear", 3, "risk"]]);
  assert.equal(r.total, 17);
  assert.equal(r.pulse, "weak");
  assert.equal(r.profileId, "scattered");
  assert.equal(r.profileName, "The Scattered Brand");
  assert.equal(r.service.slug, SLUGS.STRATEGY);
  assert.equal(r.alsoService?.slug, SLUGS.DIGITAL);
  assert.ok(r.paragraphs[0].startsWith("In real estate, buyers and partners"));
});

test("Snapshot: a strong technology brand", () => {
  const r = assessWithActions({ industry: "technology", updated: "1-3", weakest: "none", consistent: "yes", handover: "written-followed", clarity: "straight-away", ahead: "steady" });
  assert.deepEqual(r.vitals.map((v) => [v.id, v.severity, v.level]), [["uptodate", 1, "good"], ["presence", 0, "good"], ["consistent", 0, "good"], ["ready", 0, "good"], ["clear", 0, "good"]]);
  assert.equal(r.total, 1);
  assert.equal(r.pulse, "strong");
  assert.equal(r.profileId, "strong");
  assert.equal(r.service.slug, SLUGS.MEDIA);
  assert.equal(r.alsoService, null);
});

test("Output is identical across two runs", () => {
  const run = () => JSON.stringify([...allAnswers()].map(assessWithActions));
  assert.equal(run(), run());
});
