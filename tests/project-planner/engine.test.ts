// Project Planner tests. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildBrief, priorityOptions, validateAnswers, withNeeds, withPrimary } from "@/lib/project-planner/engine";
import { ACTIONS, BRIEF, CALL, PAGE, SERVICE_LABELS } from "@/lib/project-planner/content";
import { bookingNotes, bookingUrl } from "@/lib/project-planner/links";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { GOAL_IDS, HELP, NAMED_SERVICES, START_IDS, TIMING_IDS, type Answers, type Brief, type ServiceId } from "@/lib/project-planner/types";

const DASHES = /[-‐-―−]/;
const BRIEF_ID = "3f1c2b6e-8a4d-4c1e-9b7a-2d5e6f708192";

function* needSets(): Generator<ServiceId[]> {
  const s = [...NAMED_SERVICES];
  for (let i = 0; i < s.length; i++) {
    yield [s[i]];
    for (let j = i + 1; j < s.length; j++) {
      yield [s[i], s[j]];
      for (let k = j + 1; k < s.length; k++) yield [s[i], s[j], s[k]];
    }
  }
  yield ["unsure"];
}

function priorityVariants(primary: ServiceId): Answers["priorities"][] {
  if (primary === "unsure") return [[]];
  const opts = priorityOptions(primary) as Answers["priorities"];
  return [...opts.map((p) => [p]), opts.slice(0, 3), [HELP]];
}

// Every path: P1 sets x each possible main focus x P2 x P3 x P5, with P4 single, three and help.
function* allAnswers(): Generator<Answers> {
  for (const needs of needSets()) for (const primary of needs) for (const start of START_IDS[primary])
    for (const goal of GOAL_IDS) for (const timing of TIMING_IDS) for (const priorities of priorityVariants(primary))
      yield { needs, primary, start, goal, timing, priorities };
}

function visibleText(b: Brief): string {
  return [b.intro, b.headline, ...b.told.flatMap((t) => [t.question, t.answer]), b.firstPhase.title, ...b.firstPhase.items,
    ...b.alsoRequested.flatMap((x) => [x.label, x.note]), b.dependencyNote ?? "", b.success, ...b.toConfirm,
    b.timelines?.title ?? "", b.timelines?.label ?? "", b.timelines?.text ?? "", b.nextSteps.title, b.nextSteps.text].join("\n");
}

test("every path gives a complete, clean brief", () => {
  let count = 0;
  for (const a of allAnswers()) {
    count++;
    assert.ok(validateAnswers(a).ok, JSON.stringify(a));
    const b = buildBrief(a);
    assert.ok(b.headline.length > 0);
    assert.ok(b.firstPhase.items.length >= 1 && b.firstPhase.items.every((i) => i.trim()));
    assert.ok(b.success && b.toConfirm.length >= 1);
    // Every brief ends in the call.
    assert.deepEqual(b.actions, { primary: "book", secondary: "send" });
    const text = visibleText(b);
    assert.ok(!/undefined|null|NaN|\[object|\{price\}|TODO|lorem/i.test(text), `placeholder in ${JSON.stringify(a)}`);
    assert.ok(!DASHES.test(text), `dash in ${JSON.stringify(a)}: ${text.match(new RegExp(`.{0,30}${DASHES.source}.{0,30}`))}`);
  }
  console.log(`  # ${count} briefs checked`);
  assert.ok(count > 10000);
});

test("no brief mentions a service the visitor did not choose, and media or website briefs never add identity", () => {
  for (const a of allAnswers()) {
    const text = visibleText(buildBrief(a));
    for (const s of NAMED_SERVICES) {
      if (a.needs.includes(s)) continue;
      assert.ok(!text.includes(SERVICE_LABELS[s]), `${SERVICE_LABELS[s]} in ${JSON.stringify(a)}`);
    }
    if (a.needs.every((n) => n === "website" || n === "photo" || n === "video")) {
      assert.ok(!/identity|brand package|Brand Foundation|rebrand/i.test(text), `identity added to ${JSON.stringify(a)}`);
    }
    if (!a.needs.includes("identity")) assert.ok(!/Brand Foundation|Brand packages typically/.test(text), `brand package in ${JSON.stringify(a)}`);
  }
});

test("brand package timelines only when brand identity is the main focus, never for packaging", () => {
  for (const a of allAnswers()) {
    const t = buildBrief(a).timelines;
    if (a.primary !== "identity") assert.equal(t, null, JSON.stringify(a));
  }
  const b = buildBrief({ needs: ["identity"], primary: "identity", start: "new", goal: "credibility", priorities: ["logo_system"], timing: "now" });
  assert.equal(b.timelines?.text, "Brand packages typically take 4 to 6 weeks (Foundation), 8 to 12 weeks (Identity System) or 12 to 16 weeks (Ecosystem).");
  const pack = buildBrief({ needs: ["packaging", "identity"], primary: "packaging", start: "new", goal: "launch", priorities: ["pack_system"], timing: "now" });
  assert.equal(pack.timelines, null);
});

test("no prices anywhere: no dollar figure, no investment or fit wording, and the brief ends in the call", () => {
  for (const a of allAnswers()) {
    const b = buildBrief(a);
    const text = visibleText(b);
    assert.ok(!/\$\s?\d|starts? from|starting price|price guide|budget|fits/i.test(text), `price wording in ${JSON.stringify(a)}`);
    assert.ok(!("investment" in b) && !("fitNote" in b) && !("priceSource" in b), "no price fields in the brief");
    assert.deepEqual(b.actions, { primary: "book", secondary: "send" });
  }
  // The words of the finale and the page.
  assert.equal(ACTIONS.book, "Choose a time for your call");
  assert.equal(CALL.line, "Your answers go to the studio before the call, so we start with your business.");
  assert.equal(PAGE.description, "Plan your project in two minutes. We come to the call prepared.");
  assert.match(BRIEF.next, /^Choose a time for your call\./);
});

test("help me prioritise gives discovery activities, never the first three menu items", () => {
  const b = buildBrief({ needs: ["identity"], primary: "identity", start: "logo", goal: "credibility", priorities: [HELP], timing: "now" });
  assert.equal(b.firstPhase.title, "Priorities to confirm together");
  assert.deepEqual(b.firstPhase.items, ["Review your existing materials", "Choose the most useful first deliverables", "Clarify what depends on what", "Review what should be kept"]);
  const fresh = buildBrief({ needs: ["website"], primary: "website", start: "no_site", goal: "clarity", priorities: [HELP], timing: "now" });
  assert.ok(!fresh.firstPhase.items.includes("Review what should be kept") && !fresh.firstPhase.items.includes("Site structure and navigation"));
  const unsure = buildBrief({ needs: ["unsure"], primary: "unsure", start: "changing", goal: "other", priorities: [], timing: "flexible" });
  assert.deepEqual(unsure.firstPhase.items, ["What has changed in the business", "What exists today and what still works", "Which piece to do first and why"]);
});

test("also requested lists only chosen services, with the dependency note only for identity from scratch plus website", () => {
  const b = buildBrief({ needs: ["identity", "website", "photo"], primary: "identity", start: "new", goal: "launch", priorities: ["logo_system"], timing: "now" });
  assert.deepEqual(b.alsoRequested.map((x) => x.service), ["website", "photo"]);
  assert.ok(b.alsoRequested.every((x) => x.note === "Also requested; scope and sequence to confirm together."));
  assert.ok(b.dependencyNote);
  assert.equal(buildBrief({ needs: ["identity", "website"], primary: "identity", start: "system", goal: "launch", priorities: ["refine"], timing: "now" }).dependencyNote, null);
  assert.equal(buildBrief({ needs: ["website", "identity"], primary: "website", start: "redesign", goal: "launch", priorities: ["visual"], timing: "now" }).dependencyNote, null);
});

test("changing the main focus clears its starting point and priorities but keeps goal and timing", () => {
  const d = { needs: ["identity", "website"] as ServiceId[], primary: "identity" as const, start: "logo" as const, priorities: ["guidelines"] as Answers["priorities"], goal: "clarity" as const, timing: "now" as const };
  const changed = withPrimary(d, "website");
  assert.deepEqual(changed, { needs: ["identity", "website"], primary: "website", goal: "clarity", timing: "now" });
  assert.equal(withPrimary(d, "identity"), d, "same focus keeps everything");
  const dropped = withNeeds(d, ["website"]);
  assert.equal(dropped.primary, "website");
  assert.equal(dropped.start, undefined);
  assert.equal(dropped.priorities, undefined);
  const kept = withNeeds(d, ["identity", "photo"]);
  assert.equal(kept.start, "logo");
  assert.deepEqual(kept.priorities, ["guidelines"]);
});

test("answers validation accepts only allowed, consistent ids", () => {
  const ok: Answers = { needs: ["photo", "video"], primary: "video", start: "campaign", goal: "launch", priorities: ["short_form", "demos"], timing: "now" };
  assert.ok(validateAnswers(ok).ok);
  const bad: [string, unknown][] = [
    ["unknown service", { ...ok, needs: ["photo", "farming"] }],
    ["four services", { ...ok, needs: ["photo", "video", "website", "strategy"] }],
    ["unsure with another", { ...ok, needs: ["unsure", "photo"], primary: "photo" }],
    ["primary not chosen", { ...ok, primary: "website" }],
    ["start for another service", { ...ok, start: "redesign" }],
    ["priority for another service", { ...ok, priorities: ["structure"] }],
    ["help with others", { ...ok, priorities: [HELP, "demos"] }],
    ["four priorities", { ...ok, priorities: ["brand_story", "campaign_video", "short_form", "demos"] }],
    ["priorities when unsure", { needs: ["unsure"], primary: "unsure", start: "growing", goal: "other", priorities: ["demos"], timing: "now" }],
    ["no priorities for a service", { ...ok, priorities: [] }],
    ["bad goal", { ...ok, goal: "riches" }],
    ["bad timing", { ...ok, timing: "yesterday" }],
    ["repeated service", { ...ok, needs: ["photo", "photo"] }],
    ["not an object", "photo"],
  ];
  for (const [label, input] of bad) assert.ok(!validateAnswers(input).ok, label);
  // The unsure path skips the priorities step, so its draft has no priorities field at all.
  const unsureDraft = { needs: ["unsure"], primary: "unsure", start: "changing", goal: "other", timing: "flexible" };
  const v = validateAnswers(unsureDraft);
  assert.ok(v.ok && v.answers.priorities.length === 0, "unsure draft without priorities is complete");
  assert.ok(!validateAnswers({ ...ok, priorities: undefined }).ok, "a service draft without priorities is not");
});

test("booking links carry the notes only: no email, name, budget or free text, under 300 characters", () => {
  let longest = 0;
  for (const a of allAnswers()) {
    if (a.goal !== "other") continue;
    const b = buildBrief(a);
    const url = bookingUrl(BRIEF_ID, b, a);
    const notes = bookingNotes(BRIEF_ID, b, a);
    longest = Math.max(longest, notes.length);
    assert.ok(url.startsWith(`${DISCOVERY_CALL_URL}?notes=`));
    assert.deepEqual([...new URL(url).searchParams.keys()], ["notes"]);
    assert.ok(!/email=|name=|@|%40|\$|client\.example|Launch on/i.test(url), url);
    assert.ok(notes.startsWith("Project brief 3f1c2b6e: "));
  }
  assert.ok(longest < 300, `longest notes ${longest}`);
});

test("output is identical across two runs", () => {
  const run = () => JSON.stringify([...allAnswers()].filter((_, i) => i % 7 === 0).map((a) => buildBrief(a)));
  assert.equal(run(), run());
});
