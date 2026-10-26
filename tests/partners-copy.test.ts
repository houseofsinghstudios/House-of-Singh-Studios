// Partners copy rules: no dashes, no banned words, Canadian spelling, Title Case buttons.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { BAND, GLANCE, HOW, PARTNERS, QUESTIONS, QUESTIONS_HEADING, SAFE, WHO, WORTH } from "@/lib/partners/content";

// Every string in the visitor copy, with the key path it came from. URLs are not copy.
function strings(value: unknown, path: string, out: [string, string][] = []): [string, string][] {
  if (typeof value === "string") {
    if (!/^(\/|#|https?:)/.test(value)) out.push([path, value]);
  } else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => strings(v, `${path}.${k}`, out));
  return out;
}

const COPY = strings({ PARTNERS, GLANCE, SAFE, HOW, WORTH, WHO, QUESTIONS_HEADING, QUESTIONS, BAND }, "copy")
  .filter(([path]) => !/\.(slug|href)$/.test(path));

const BANNED = ["bespoke", "holistic", "transformative", "synergy", "curated", "elevated", "journey", "passionate", "cutting edge", "timeless", "visionary", "full service", "end to end"];

test("no dashes of any kind, except the Interac e-Transfer brand name", () => {
  for (const [path, text] of COPY) assert.doesNotMatch(text.replace(/Interac e-Transfer/g, ""), /[-‐‑‒–—―]/, path);
});

test("no banned words", () => {
  for (const [path, text] of COPY) for (const word of BANNED) assert.ok(!text.toLowerCase().includes(word), `${path}: ${word}`);
});

test("Canadian spelling: program, organization, colour", () => {
  for (const [path, text] of COPY) assert.doesNotMatch(text, /programme|organis|\bcolor\b/i, path);
});

test("buttons are in Title Case", () => {
  const minor = new Set(["a", "an", "the", "and", "or", "of", "to", "for", "in", "on"]);
  const buttons = [PARTNERS.introduce, PARTNERS.partner, HOW.copy, ...BAND.map((b) => b.button)];
  for (const button of buttons) {
    button.split(" ").forEach((word, i) => {
      if (i > 0 && minor.has(word)) return;
      assert.match(word, /^[A-Z0-9]/, `${button}: ${word}`);
    });
  }
});

test("FAQ copy: nine questions, each ending with a question mark and with an answer", () => {
  assert.equal(QUESTIONS.length, 9);
  for (const q of QUESTIONS) {
    assert.ok(q.q.endsWith("?"), q.q);
    assert.ok(q.a.trim().length > 0, q.q);
  }
});

test("both calls to action point at the contact form presets", () => {
  assert.deepEqual(BAND.map((b) => b.href), ["/contact?service=introduction", "/contact?service=partnership"]);
});
