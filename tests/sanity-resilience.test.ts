// What a page does when a Sanity read fails (src/lib/sanity/resilience.ts): the fallback only while
// building or without Sanity; at runtime the error is rethrown so Next.js keeps the last good page.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readSanity, sanityFallbackAllowed } from "@/lib/sanity/resilience";

const configured = { NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123", NEXT_PUBLIC_SANITY_DATASET: "production" };
const building = { ...configured, NEXT_PHASE: "phase-production-build" };
const running = { ...configured, NEXT_PHASE: "phase-production-server" };
const outage = () => Promise.reject(new TypeError("fetch failed"));

// The helper logs each failure once; keep the test output quiet and count the lines instead.
function captureLogs() {
  const lines: string[] = [];
  const original = { warn: console.warn, error: console.error };
  console.warn = (...args: unknown[]) => { lines.push(`warn ${args.join(" ")}`); };
  console.error = (...args: unknown[]) => { lines.push(`error ${args.join(" ")}`); };
  return { lines, restore: () => Object.assign(console, original) };
}

test("a successful read is returned as is, at build time and at runtime, with nothing logged", async () => {
  const logs = captureLogs();
  try {
    assert.deepEqual(await readSanity("cards", async () => ["live"], () => ["fallback"], building), ["live"]);
    assert.deepEqual(await readSanity("cards", async () => ["live"], () => ["fallback"], running), ["live"]);
    assert.deepEqual(logs.lines, []);
  } finally {
    logs.restore();
  }
});

test("during the production build a failed read returns the fallback, logged once with [sanity]", async () => {
  const logs = captureLogs();
  try {
    assert.deepEqual(await readSanity("case study cards", outage, () => ["fallback"], building), ["fallback"]);
    assert.equal(logs.lines.length, 1);
    assert.match(logs.lines[0], /^warn \[sanity\] case study cards failed/);
  } finally {
    logs.restore();
  }
});

test("at runtime a failed read rethrows the same error, logged once with [sanity], and never calls the fallback", async () => {
  const logs = captureLogs();
  let fallbackCalls = 0;
  const error = new TypeError("fetch failed");
  try {
    await assert.rejects(
      readSanity("all case studies", () => Promise.reject(error), () => { fallbackCalls++; return []; }, running),
      (thrown) => thrown === error
    );
    assert.equal(fallbackCalls, 0);
    assert.equal(logs.lines.length, 1);
    assert.match(logs.lines[0], /^error \[sanity\] all case studies failed, rethrown so Next.js keeps any cached version/);
  } finally {
    logs.restore();
  }
});

test("at runtime with no build phase set at all, a failed read still rethrows", async () => {
  const logs = captureLogs();
  try {
    await assert.rejects(readSanity("articles", outage, () => [], configured));
  } finally {
    logs.restore();
  }
});

test("without a Sanity project or dataset the fallback is used, even at runtime", async () => {
  const logs = captureLogs();
  try {
    assert.deepEqual(await readSanity("articles", outage, () => [], { NEXT_PHASE: "phase-production-server" }), []);
    assert.deepEqual(await readSanity("articles", outage, () => [], { NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123" }), []);
  } finally {
    logs.restore();
  }
});

test("the fallback receives the error and can rethrow it, so an unknown slug never becomes a cached not found", async () => {
  const logs = captureLogs();
  const error = new TypeError("fetch failed");
  try {
    await assert.rejects(
      readSanity("article \"x\"", () => Promise.reject(error), (e) => { throw e; }, building),
      (thrown) => thrown === error
    );
  } finally {
    logs.restore();
  }
});

test("the fallback is allowed only during the build or without Sanity", () => {
  assert.equal(sanityFallbackAllowed(building), true);
  assert.equal(sanityFallbackAllowed(running), false);
  assert.equal(sanityFallbackAllowed(configured), false);
  assert.equal(sanityFallbackAllowed({}), true);
  assert.equal(sanityFallbackAllowed({ NEXT_PUBLIC_SANITY_DATASET: "production" }), true);
});
