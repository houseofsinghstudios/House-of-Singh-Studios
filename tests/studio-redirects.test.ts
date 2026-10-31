import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pathProblem } from "../src/lib/site-paths";

// The Sanity client needs a project to load (CI sets one); every read below is a stand-in.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= "test";
process.env.NEXT_PUBLIC_SANITY_DATASET ||= "test";
// Loaded after the variables above. src/lib/redirect-or-not-found.ts only applies next/navigation,
// which runs inside Next.js alone; its decision, resolveMissingSlug, is tested here.
const load = () => import("../src/lib/sanity/redirects");

const RUNTIME = { NEXT_PUBLIC_SANITY_PROJECT_ID: "p", NEXT_PUBLIC_SANITY_DATASET: "d" };
const BUILD = { ...RUNTIME, NEXT_PHASE: "phase-production-build" };
const answer = (value: unknown) => async () => value;
const found = (to: string, permanent: boolean) => async () => ({ to, permanent });
const none = async () => null;
const failing = async () => {
  throw new TypeError("fetch failed");
};
const quiet = async <T>(run: () => Promise<T>) => {
  const { error, warn } = console;
  console.error = console.warn = () => {};
  try {
    return await run();
  } finally {
    Object.assign(console, { error, warn });
  }
};

test("redirect paths: on this site, starting with /, nothing else", () => {
  assert.equal(pathProblem("/insights/new-title"), null);
  assert.equal(pathProblem("/"), null);
  for (const bad of ["", "insights/x", "https://example.com/x", "//example.com/x", "/a b", "/x?y=1", "/x#y", "/insights/x/", undefined, 3]) {
    assert.notEqual(pathProblem(bad), null, String(bad));
  }
});

test("redirect found: permanent unless the editor turned it off", async () => {
  const { findStudioRedirect } = await load();
  assert.deepEqual(await findStudioRedirect("/insights/old", answer({ to: "/insights/new", permanent: true }), RUNTIME), { to: "/insights/new", permanent: true });
  assert.deepEqual(await findStudioRedirect("/insights/old", answer({ to: "/insights/new" }), RUNTIME), { to: "/insights/new", permanent: true });
  assert.deepEqual(await findStudioRedirect("/insights/old", answer({ to: "/insights/new", permanent: false }), RUNTIME), { to: "/insights/new", permanent: false });
});

test("redirect not found, or a target that leaves the site or loops: none", async () => {
  const { findStudioRedirect } = await load();
  assert.equal(await findStudioRedirect("/insights/old", answer(null), RUNTIME), null);
  assert.equal(await findStudioRedirect("/insights/old", answer({ to: "//evil.example/x" }), RUNTIME), null);
  assert.equal(await findStudioRedirect("/insights/old", answer({ to: "https://evil.example/x" }), RUNTIME), null);
  assert.equal(await findStudioRedirect("/insights/old", answer({ to: "/insights/old" }), RUNTIME), null);
});

test("a Sanity failure is an error, never 'no redirect', at runtime and while building", async () => {
  const { findStudioRedirect } = await load();
  await quiet(async () => {
    await assert.rejects(findStudioRedirect("/insights/old", failing, RUNTIME), /fetch failed/);
    await assert.rejects(findStudioRedirect("/insights/old", failing, BUILD), /fetch failed/);
  });
});

test("the route: a redirect found sends the visitor on, permanent or temporary", async () => {
  const { resolveMissingSlug } = await load();
  assert.deepEqual(await resolveMissingSlug("/work/old", found("/work/new", true)), { redirect: { to: "/work/new", permanent: true } });
  assert.deepEqual(await resolveMissingSlug("/work/old", found("/work/new", false)), { redirect: { to: "/work/new", permanent: false } });
});

test("the route: no redirect is the 404", async () => {
  const { resolveMissingSlug } = await load();
  assert.deepEqual(await resolveMissingSlug("/work/old", none), { notFound: true });
});

test("the route: a failed lookup is the error itself, neither a 404 nor a redirect", async () => {
  const { findStudioRedirect, resolveMissingSlug } = await load();
  await quiet(() => assert.rejects(resolveMissingSlug("/work/old", (path) => findStudioRedirect(path, failing, RUNTIME)), /fetch failed/));
});

test("/services only: an unreachable Sanity leaves the 404, logged with the [sanity] prefix", async () => {
  const { findStudioRedirect, resolveMissingSlug } = await load();
  const logged: string[] = [];
  const { error, warn } = console;
  console.error = console.warn = (line: string) => logged.push(line);
  try {
    const outcome = await resolveMissingSlug("/services/old", (path) => findStudioRedirect(path, failing, RUNTIME, { quiet: true }), { notFoundIfUnreachable: true });
    assert.deepEqual(outcome, { notFound: true });
  } finally {
    Object.assign(console, { error, warn });
  }
  // One clear line per event, never readSanity's generic "rethrown" line as well.
  assert.equal(logged.length, 1, logged.join(" | "));
  assert.match(logged[0], /^\[sanity\] redirect lookup for "\/services\/old" failed, answered with the 404 .*fetch failed/);
  // A redirect still wins when Sanity answers.
  assert.deepEqual(await resolveMissingSlug("/services/old", found("/services/new", true), { notFoundIfUnreachable: true }), { redirect: { to: "/services/new", permanent: true } });
});

test("elsewhere the lookup keeps readSanity's single line, and the error stands", async () => {
  const { findStudioRedirect } = await load();
  const logged: string[] = [];
  const { error, warn } = console;
  console.error = console.warn = (line: string) => logged.push(line);
  try {
    await assert.rejects(findStudioRedirect("/work/old", failing, RUNTIME), /fetch failed/);
    await assert.rejects(findStudioRedirect("/work/old", failing, RUNTIME, { quiet: true }), /fetch failed/);
  } finally {
    Object.assign(console, { error, warn });
  }
  assert.equal(logged.length, 1, logged.join(" | "));
  assert.match(logged[0], /^\[sanity\] redirect for "\/work\/old" failed, rethrown/);
});

test("only /services takes the outage 404; insights, work and initiatives keep the error", () => {
  assert.match(readFileSync("src/app/(site)/services/[slug]/page.tsx", "utf8"), /redirectOrNotFound\(`\/services\/\$\{slug\}`, \{ notFoundIfUnreachable: true \}\)/);
  for (const route of ["insights", "work", "initiatives"]) {
    assert.doesNotMatch(readFileSync(`src/app/(site)/${route}/[slug]/page.tsx`, "utf8"), /notFoundIfUnreachable/, route);
  }
});

test("the four slug routes ask for a redirect before the 404", () => {
  for (const route of ["insights", "work", "services", "initiatives"]) {
    const src = readFileSync(`src/app/(site)/${route}/[slug]/page.tsx`, "utf8");
    assert.match(src, new RegExp(`return redirectOrNotFound\\(\`/${route}/\\$\\{slug\\}\`[,)]`), route);
    assert.doesNotMatch(src, /\bnotFound\(\)/, `${route}: no direct 404 left`);
  }
  const helper = readFileSync("src/lib/redirect-or-not-found.ts", "utf8");
  assert.match(helper, /permanent \? permanentRedirect\(to\) : redirect\(to\)/);
});
