// Initiatives copy rules: no dashes, no banned words, Canadian spelling, Title Case buttons.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { COMMONS, FALLBACK_INITIATIVES, GLANCE_LABEL, LANDING, PARALLEL } from "@/lib/initiatives/content";

// Every string in the visitor copy, with the key path it came from. URLs are not copy.
function strings(value: unknown, path: string, out: [string, string][] = []): [string, string][] {
  if (typeof value === "string") {
    if (!/^(\/|#|https?:)/.test(value)) out.push([path, value]);
  } else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => strings(v, `${path}.${k}`, out));
  return out;
}

const COPY = strings({ LANDING, PARALLEL, COMMONS, GLANCE_LABEL, FALLBACK: FALLBACK_INITIATIVES.filter((i) => i.status !== "hidden") }, "copy")
  .filter(([path]) => !/\.(slug|status|href)$/.test(path));

const BANNED = ["bespoke", "holistic", "transformative", "synergy", "curated", "elevated", "journey", "passionate", "cutting edge", "timeless", "visionary", "full service", "end to end"];

test("no dashes of any kind", () => {
  for (const [path, text] of COPY) assert.doesNotMatch(text, /[-‐‑‒–—―]/, path);
});

test("no banned words", () => {
  for (const [path, text] of COPY) for (const word of BANNED) assert.ok(!text.toLowerCase().includes(word), `${path}: ${word}`);
});

test("Canadian spelling: program, organization, colour", () => {
  for (const [path, text] of COPY) assert.doesNotMatch(text, /programme|organis|\bcolor\b/i, path);
});

// Sentence case since 22 Nov 2026: a capital first letter, then lower case except names.
test("buttons are in sentence case", () => {
  const buttons = [...LANDING.takePart.map((t) => t.button), PARALLEL.nominate.button, COMMONS.nominate.button];
  for (const button of buttons) {
    assert.match(button, /^[A-Z0-9]/, button);
    button.split(" ").slice(1).forEach((word) => assert.match(word, /^[a-z0-9]/, `${button}: ${word}`));
  }
});

test("FAQ copy: questions end with a question mark and every answer has text", () => {
  for (const q of [...LANDING.questions, ...PARALLEL.questions, ...COMMONS.questions]) {
    assert.ok(q.q.endsWith("?"), q.q);
    assert.ok(q.a.trim().length > 0, q.q);
  }
});
