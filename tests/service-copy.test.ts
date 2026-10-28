// Service page copy rules: no dashes, no banned words, describe clients by situation (no
// "established business", no revenue figures), Canadian spelling, Toronto in every title and h1.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { services } from "@/data/services";
import { plainText } from "@/lib/inline-links";

// Every visitor facing string of a service, with where it came from. slug and gradient are code.
function strings(value: unknown, path: string, out: [string, string][] = []): [string, string][] {
  if (typeof value === "string") out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => strings(v, `${path}.${k}`, out));
  return out;
}
// Answers are checked as a reader sees them: links reduced to their visible words (paths are code).
const COPY = services
  .flatMap((s) => strings(s, s.slug))
  .filter(([path]) => !/\.(slug|gradient)$/.test(path))
  .map(([path, text]): [string, string] => [path, /\.faqs\[\d+\]\.answer$/.test(path) ? plainText(text) : text]);
const BANNED = ["bespoke", "holistic", "transformative", "synergy", "curated", "elevated", "journey", "passionate", "cutting edge", "timeless", "visionary", "full service", "end to end"];

test("no dashes and no banned words", () => {
  for (const [path, text] of COPY) {
    assert.doesNotMatch(text, /[-‐‑‒–—―]/, path);
    for (const word of BANNED) assert.ok(!text.toLowerCase().includes(word), `${path}: ${word}`);
  }
});

test("clients by situation: no established businesses, no revenue figures", () => {
  for (const [path, text] of COPY) {
    assert.doesNotMatch(text, /established business/i, path);
    // Answers may quote prices (what branding costs); nothing else names a figure.
    if (!path.includes(".faqs[")) assert.doesNotMatch(text, /\$\d|revenue/i, path);
  }
});

test("Canadian spelling", () => {
  for (const [path, text] of COPY) assert.doesNotMatch(text, /\bcolor|organis|\bcenter\b|programme|\bfavor|\bbehavior/i, path);
});

test("every title and h1 names Toronto; titles carry the studio name once", () => {
  for (const s of services) {
    assert.match(s.seoTitle, /Toronto/, s.slug);
    assert.match(s.seoH1, /Toronto$/, s.slug);
    assert.equal(s.seoTitle.split("House of Singh Studios").length, 2, s.slug);
    assert.equal(s.localSection.rows.length, 3, s.slug);
    assert.ok(s.localSection.intro.startsWith("House of Singh Studios works from Toronto and Mississauga"), s.slug);
  }
});

test("questions: each ends with a question mark and has an answer; Brand Identity and Website Design have them", () => {
  for (const s of services) for (const f of s.faqs || []) {
    assert.ok(f.question.endsWith("?"), f.question);
    assert.ok(plainText(f.answer).trim().length > 0, f.question);
  }
  assert.deepEqual(services.filter((s) => s.faqs && s.faqs.length > 0).map((s) => s.slug), ["brand-identity", "digital-design"]);
});
