// Project Planner event validation and n8n payload tests. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPayload, parseEvent } from "@/lib/project-planner/events-server";
import { pricingFromDocument } from "@/lib/project-planner/pricing";

const ID = "3f1c2b6e-8a4d-4c1e-9b7a-2d5e6f708192";
const INITIAL = pricingFromDocument(null);
const AT = "2026-10-18T12:00:00.000Z";
const answers = { needs: ["website"], primary: "website", start: "redesign", goal: "clarity", priorities: ["structure"], timing: "now" };
const attribution = { source: "news", medium: "email", campaign: "oct", landingPage: "/start?email=a@b.co", entryPlacement: "services", referrer: "https://example.com/page?name=Pat#top" };
const contact = { name: "  Pat Tester ", email: "pat@example-test.com", company: "Testco", location: "Toronto", note: "Hi", marketingConsent: true };

test("started needs no answers and sends none", () => {
  const e = parseEvent({ event: "started", briefId: ID, attribution });
  assert.ok(typeof e !== "string");
  const p = buildPayload(e, null, AT) as Record<string, unknown>;
  assert.deepEqual(Object.keys(p).sort(), ["attribution", "briefId", "engineVersion", "event", "eventIdempotencyKey", "priceSource", "statusRank", "submittedAt"]);
  assert.equal(p.eventIdempotencyKey, `${ID}:started`);
  assert.equal(p.statusRank, 1);
  // Even with answers and contact in the body, started sends neither.
  const noisy = parseEvent({ event: "started", briefId: ID, attribution, answers, contact });
  assert.ok(typeof noisy !== "string");
  assert.ok(!("answers" in buildPayload(noisy, null, AT)) && !("contact" in buildPayload(noisy, null, AT)));
});

test("call_clicked carries no answers or contact and no status", () => {
  const e = parseEvent({ event: "call_clicked", briefId: ID, attribution, contact });
  assert.ok(typeof e !== "string");
  const p = buildPayload(e, null, AT) as Record<string, unknown>;
  assert.equal(p.statusRank, null);
  assert.ok(!("contact" in p) && !("answers" in p) && !("brief" in p));
});

test("viewed needs valid complete answers and sends the recomputed brief, no free text or contact", () => {
  assert.equal(parseEvent({ event: "viewed", briefId: ID, attribution }), "Invalid answers");
  assert.equal(parseEvent({ event: "viewed", briefId: ID, attribution, answers: { ...answers, timing: undefined } }), "Invalid answers");
  const e = parseEvent({ event: "viewed", briefId: ID, attribution, answers, optional: { website: "secret.example", importantDate: "my birthday" }, contact, brief: { headline: "Forged" } });
  assert.ok(typeof e !== "string");
  const p = buildPayload(e, INITIAL, AT) as { brief: { headline: string; priceLines: unknown[] }; [k: string]: unknown };
  assert.equal(p.brief.headline, "Redesign your website around what visitors need.");
  assert.equal(p.priceSource, "initial");
  assert.equal(p.statusRank, 2);
  const text = JSON.stringify(p);
  assert.ok(!/secret\.example|birthday|Pat|example-test|Forged/.test(text), text);
});

test("sent needs a name and a valid email, recomputes the brief and ignores forged fit", () => {
  assert.equal(parseEvent({ event: "sent", briefId: ID, attribution, answers }), "Name required");
  assert.equal(parseEvent({ event: "sent", briefId: ID, attribution, answers, contact: { ...contact, email: "nope" } }), "Invalid email");
  assert.equal(parseEvent({ event: "sent", briefId: ID, attribution, answers, contact, optional: { investment: "a lot" } }), "Invalid investment");
  const e = parseEvent({ event: "sent", briefId: ID, attribution, answers, contact, optional: { investment: "under_1k", website: "Client.Example/About", importantDate: "Spring launch" }, fitNote: "Your budget fits perfectly", brief: { action: "book" } });
  assert.ok(typeof e !== "string");
  const p = buildPayload(e, INITIAL, AT) as { brief: { fitNote: string; action: { primary: string } }; contact: { name: string }; optional: { website: string }; answerLabels: Record<string, string>; statusRank: number };
  assert.equal(p.statusRank, 3);
  assert.equal(p.contact.name, "Pat Tester");
  assert.equal(p.optional.website, "https://client.example/About");
  assert.equal(p.brief.action.primary, "focused");
  assert.ok(p.brief.fitNote.startsWith("Your range is below our usual starting point"));
  assert.equal(p.answerLabels.primary, "Website");
});

test("ids and shapes are validated; attribution is reduced to safe parts", () => {
  assert.equal(parseEvent({ event: "booked", briefId: ID }), "Invalid event");
  assert.equal(parseEvent({ event: "started", briefId: "123" }), "Invalid briefId");
  assert.equal(parseEvent({ event: "viewed", briefId: ID, answers: { ...answers, needs: ["farming"] } }), "Invalid answers");
  assert.equal(parseEvent(null), "Invalid request");
  const e = parseEvent({ event: "started", briefId: ID, attribution: { ...attribution, entryPlacement: "evil" } });
  assert.ok(typeof e !== "string");
  assert.deepEqual(e.attribution, { source: "news", medium: "email", campaign: "oct", landingPage: "/start", entryPlacement: "direct", referrer: "https://example.com/page" });
});

test("each event has its own idempotency key", () => {
  const keys = (["started", "viewed", "call_clicked", "sent"] as const).map((event) => {
    const e = parseEvent({ event, briefId: ID, attribution, answers, contact });
    assert.ok(typeof e !== "string");
    return (buildPayload(e, INITIAL, AT) as { eventIdempotencyKey: string }).eventIdempotencyKey;
  });
  assert.deepEqual(keys, [`${ID}:started`, `${ID}:viewed`, `${ID}:call_clicked`, `${ID}:sent`]);
});

test("sent carries hearAbout and recommendedBy, cleaned and cut to the contact form's caps", () => {
  const e = parseEvent({ event: "sent", briefId: ID, attribution, answers, contact, hearAbout: " <i>A partner or agency</i> ", recommendedBy: "r".repeat(200) });
  assert.ok(typeof e !== "string" && e.event === "sent");
  if (typeof e === "string" || e.event !== "sent") return;
  assert.equal(e.hearAbout, "A partner or agency");
  assert.equal(e.recommendedBy.length, 160);
  const payload = buildPayload(e, INITIAL, AT) as Record<string, unknown>;
  assert.equal(payload.hearAbout, "A partner or agency");
  const none = parseEvent({ event: "sent", briefId: ID, attribution, answers, contact });
  assert.ok(typeof none !== "string" && none.event === "sent" && none.hearAbout === "" && none.recommendedBy === "");
});
