// Project Planner tests. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { budgetPosition, buildBrief, priorityOptions, validateAnswers, withNeeds, withPrimary } from "@/lib/project-planner/engine";
import { FIT, PRICE_LABELS, SERVICE_LABELS } from "@/lib/project-planner/content";
import { bookingNotes, bookingUrl } from "@/lib/project-planner/links";
import { loadPublishedPricing, pricingFromDocument, UNAVAILABLE } from "@/lib/project-planner/pricing";
import { BRAND_FOUNDATION } from "@/data/packages";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { formatDollars } from "@/lib/money";
import { BAND_IDS, GOAL_IDS, HELP, PRICED_SERVICES, START_IDS, TIMING_IDS, type Answers, type Brief, type Pricing, type ServiceId } from "@/lib/project-planner/types";

const DASHES = /[-‐-―−]/;
const INITIAL = pricingFromDocument(null);
const BRIEF_ID = "3f1c2b6e-8a4d-4c1e-9b7a-2d5e6f708192";

function* needSets(): Generator<ServiceId[]> {
  const s = [...PRICED_SERVICES];
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
    ...b.alsoRequested.flatMap((x) => [x.label, x.note]), b.dependencyNote ?? "", b.success, ...b.toConfirm, b.investment.title,
    ...b.investment.lines.flatMap((l) => [l.label, l.text]), b.investment.message ?? "", b.investment.timelines?.label ?? "",
    b.investment.timelines?.text ?? "", b.investment.note, b.nextSteps.title, b.nextSteps.text, b.fitNote ?? ""].join("\n");
}

test("every path gives a complete, clean brief", () => {
  let count = 0;
  for (const a of allAnswers()) {
    count++;
    assert.ok(validateAnswers(a).ok, JSON.stringify(a));
    const b = buildBrief(a, INITIAL);
    assert.ok(b.headline.length > 0);
    assert.ok(b.firstPhase.items.length >= 1 && b.firstPhase.items.every((i) => i.trim()));
    assert.ok(b.success && b.toConfirm.length >= 1);
    assert.ok(b.investment.title && b.investment.note && (b.investment.lines.length > 0 || b.investment.message));
    assert.ok(["book", "send", "focused"].includes(b.actions.primary));
    const text = visibleText(b);
    assert.ok(!/undefined|null|NaN|\[object|\{price\}|TODO|lorem/i.test(text), `placeholder in ${JSON.stringify(a)}`);
    assert.ok(!DASHES.test(text), `dash in ${JSON.stringify(a)}: ${text.match(new RegExp(`.{0,30}${DASHES.source}.{0,30}`))}`);
  }
  console.log(`  # ${count} briefs checked`);
  assert.ok(count > 10000);
});

test("no brief mentions a service the visitor did not choose, and media or website briefs never add identity", () => {
  for (const a of allAnswers()) {
    const text = visibleText(buildBrief(a, INITIAL));
    for (const s of PRICED_SERVICES) {
      if (a.needs.includes(s)) continue;
      assert.ok(!text.includes(SERVICE_LABELS[s]), `${SERVICE_LABELS[s]} in ${JSON.stringify(a)}`);
      assert.ok(!text.includes(`${PRICE_LABELS[s]}\n`), `${PRICE_LABELS[s]} price line in ${JSON.stringify(a)}`);
    }
    if (a.needs.every((n) => n === "website" || n === "photo" || n === "video")) {
      assert.ok(!/identity|brand package|Brand Foundation|rebrand/i.test(text), `identity added to ${JSON.stringify(a)}`);
    }
    if (!a.needs.includes("identity")) assert.ok(!/Brand Foundation|Brand packages typically/.test(text), `brand package in ${JSON.stringify(a)}`);
  }
});

test("prices: one line per chosen service, never a sum", () => {
  for (const a of allAnswers()) {
    const b = buildBrief(a, INITIAL);
    const allowed = new Set(a.needs.filter((n) => n !== "unsure").map((n) => formatDollars(INITIAL.prices[n as keyof Pricing["prices"]]!)));
    const figures = visibleText(b).match(/\$[\d,]+/g) ?? [];
    for (const f of figures) assert.ok(allowed.has(f), `${f} is not a chosen service's price in ${JSON.stringify(a)}`);
    const priced = a.needs.filter((n) => n !== "unsure");
    assert.equal(b.investment.lines.length, priced.length);
    assert.deepEqual(b.investment.lines.map((l) => l.service), [a.primary, ...priced.filter((n) => n !== a.primary)].filter((n) => n !== "unsure"));
  }
});

test("brand package timelines only when brand identity is the main focus, never for packaging", () => {
  for (const a of allAnswers()) {
    const t = buildBrief(a, INITIAL).investment.timelines;
    if (a.primary !== "identity") assert.equal(t, null, JSON.stringify(a));
  }
  const b = buildBrief({ needs: ["identity"], primary: "identity", start: "new", goal: "credibility", priorities: ["logo_system"], timing: "now" }, INITIAL);
  assert.equal(b.investment.timelines?.text, "Brand packages typically take 4 to 6 weeks (Foundation), 8 to 12 weeks (Identity System) or 12 to 16 weeks (Ecosystem).");
  const pack = buildBrief({ needs: ["packaging", "identity"], primary: "packaging", start: "new", goal: "launch", priorities: ["pack_system"], timing: "now" }, INITIAL);
  assert.equal(pack.investment.timelines, null);
});

test("budget: below the main service's published price gives the focused action and note, never 'aligned'", () => {
  const scenarios: Pricing[] = [INITIAL, UNAVAILABLE, pricingFromDocument({ website: { startsFrom: 3500, showOnSite: false }, photo: { startsFrom: 1200, showOnSite: true } })];
  for (const pricing of scenarios) for (const a of allAnswers()) {
    if (a.priorities.length > 1 || a.goal !== "credibility") continue;
    for (const band of BAND_IDS) {
      const b = buildBrief(a, pricing, { investment: band });
      // The brief's own statements. The told back chips repeat the visitor's answers, and one
      // starting point option itself reads "Our teams or suppliers aren't aligned".
      const text = visibleText({ ...b, told: [] });
      assert.ok(!/aligned/i.test(text));
      // "fits" appears only inside the owner's own note, never as a claim about the budget.
      assert.ok(!/fits/i.test(text.replace(FIT.below, "")), `fits in ${JSON.stringify(a)}`);
      const pos = budgetPosition(band, a, pricing);
      if (band === "under_1k") {
        assert.equal(pos, "below");
        assert.deepEqual(b.actions, { primary: "focused", secondary: null });
      }
      if (pos === "below") {
        assert.equal(b.actions.primary, "focused");
        assert.equal(b.fitNote, FIT.below);
        if (band !== "under_1k") assert.equal(b.actions.secondary, "book");
      }
      const price = a.primary === "unsure" ? null : pricing.prices[a.primary];
      if (band !== "under_1k" && !price) assert.equal(pos, null, "hidden or unavailable price never infers fit");
    }
  }
  // Edges: an upper bound equal to the price is not below.
  const id = (band: (typeof BAND_IDS)[number]) => budgetPosition(band, { needs: ["identity"], primary: "identity", start: "new", goal: "credibility", priorities: [HELP], timing: "now" }, INITIAL);
  assert.equal(id("1k_4k"), "scope");
  const photo = (band: (typeof BAND_IDS)[number]) => budgetPosition(band, { needs: ["photo"], primary: "photo", start: "campaign", goal: "production", priorities: ["product"], timing: "now" }, pricingFromDocument({ photo: { startsFrom: 5000, showOnSite: true } }));
  assert.equal(photo("1k_4k"), "below");
  assert.equal(photo("4k_10k"), "scope");
  assert.equal(photo("not_sure"), null);
});

test("actions without a budget: soon and not unsure books a call first, otherwise send first", () => {
  const base: Answers = { needs: ["website"], primary: "website", start: "redesign", goal: "clarity", priorities: ["structure"], timing: "now" };
  assert.deepEqual(buildBrief(base, INITIAL).actions, { primary: "book", secondary: "send" });
  assert.deepEqual(buildBrief({ ...base, timing: "one_three" }, INITIAL).actions, { primary: "book", secondary: "send" });
  assert.deepEqual(buildBrief({ ...base, timing: "three_six" }, INITIAL).actions, { primary: "send", secondary: "book" });
  assert.deepEqual(buildBrief({ needs: ["unsure"], primary: "unsure", start: "growing", goal: "other", priorities: [], timing: "now" }, INITIAL).actions, { primary: "send", secondary: "book" });
});

test("help me prioritise gives discovery activities, never the first three menu items", () => {
  const b = buildBrief({ needs: ["identity"], primary: "identity", start: "logo", goal: "credibility", priorities: [HELP], timing: "now" }, INITIAL);
  assert.equal(b.firstPhase.title, "Priorities to confirm together");
  assert.deepEqual(b.firstPhase.items, ["Review your existing materials", "Choose the most useful first deliverables", "Clarify what depends on what", "Review what should be kept"]);
  const fresh = buildBrief({ needs: ["website"], primary: "website", start: "no_site", goal: "clarity", priorities: [HELP], timing: "now" }, INITIAL);
  assert.ok(!fresh.firstPhase.items.includes("Review what should be kept") && !fresh.firstPhase.items.includes("Site structure and navigation"));
  const unsure = buildBrief({ needs: ["unsure"], primary: "unsure", start: "changing", goal: "other", priorities: [], timing: "flexible" }, INITIAL);
  assert.deepEqual(unsure.firstPhase.items, ["What has changed in the business", "What exists today and what still works", "Which piece to do first and why"]);
});

test("also requested lists only chosen services, with the dependency note only for identity from scratch plus website", () => {
  const b = buildBrief({ needs: ["identity", "website", "photo"], primary: "identity", start: "new", goal: "launch", priorities: ["logo_system"], timing: "now" }, INITIAL);
  assert.deepEqual(b.alsoRequested.map((x) => x.service), ["website", "photo"]);
  assert.ok(b.alsoRequested.every((x) => x.note === "Also requested; scope and sequence to confirm together."));
  assert.ok(b.dependencyNote);
  assert.equal(buildBrief({ needs: ["identity", "website"], primary: "identity", start: "system", goal: "launch", priorities: ["refine"], timing: "now" }, INITIAL).dependencyNote, null);
  assert.equal(buildBrief({ needs: ["website", "identity"], primary: "website", start: "redesign", goal: "launch", priorities: ["visual"], timing: "now" }, INITIAL).dependencyNote, null);
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
    const b = buildBrief(a, INITIAL, { investment: "4k_10k", website: "client.example.com", importantDate: "Launch on 1 May" });
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

test("pricing: published choices win, hidden stays hidden, outage shows no figures", async () => {
  assert.equal(INITIAL.source, "initial");
  assert.deepEqual(INITIAL.prices, { identity: BRAND_FOUNDATION.startsFrom, website: 3500, photo: 1000, video: 2500, packaging: 2500, strategy: 2000 });
  const published = pricingFromDocument({
    identity: { showOnSite: true }, website: { startsFrom: 4200, showOnSite: true }, photo: { startsFrom: 1000, showOnSite: false },
    video: { startsFrom: 0, showOnSite: true }, packaging: { startsFrom: -5, showOnSite: true }, strategy: { startsFrom: "2000", showOnSite: true },
  });
  assert.deepEqual(published, { source: "sanity", prices: { identity: BRAND_FOUNDATION.startsFrom, website: 4200, photo: null, video: null, packaging: null, strategy: null } });
  // A published document without an entry never falls back to the initial defaults.
  assert.deepEqual(pricingFromDocument({}).prices, UNAVAILABLE.prices);
  assert.equal(pricingFromDocument({ identity: { showOnSite: false } }).prices.identity, null);
  // The brief follows a changed published price.
  const a: Answers = { needs: ["website"], primary: "website", start: "redesign", goal: "clarity", priorities: ["visual"], timing: "now" };
  assert.equal(buildBrief(a, published).investment.lines[0].text, "Websites start from $4,200.");
  assert.equal(buildBrief({ ...a, needs: ["photo"], primary: "photo", start: "campaign", priorities: ["product"] }, published).investment.lines[0].text, "We'll confirm the investment when we review your brief.");
  // Outage and missing document, through the loader.
  const down = await loadPublishedPricing(async () => { throw new Error("network"); });
  assert.deepEqual(down, UNAVAILABLE);
  assert.ok(buildBrief(a, down).investment.lines.every((l) => l.amount === null && !l.text.includes("$")));
  assert.equal((await loadPublishedPricing(async () => null)).source, "initial");
});

test("output is identical across two runs", () => {
  const run = () => JSON.stringify([...allAnswers()].filter((_, i) => i % 7 === 0).map((a) => buildBrief(a, INITIAL, { investment: "1k_4k" })));
  assert.equal(run(), run());
});
