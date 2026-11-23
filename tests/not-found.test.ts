// The site 404 (Step 1b of the site audit, 23 Nov 2026). An address no route matches reaches the root
// src/app/not-found.tsx, which Next.js builds as /_not-found and serves as real HTML with a 404 status:
// it draws the site shell around the 404 copy. notFound() from a site page uses (site)/not-found.tsx,
// drawn in the browser only (vercel/next.js #99287). No catch-all route may come back: it would turn
// every unknown address into a notFound() call and an empty document again.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { NOT_FOUND_METADATA } from "@/lib/not-found";

const read = (file: string) => readFileSync(file, "utf8");

test("no catch-all route in the site: unknown addresses reach the root not-found", () => {
  assert.ok(!existsSync("src/app/(site)/[...not-found]"), "the old catch-all is gone");
  const catchAll = readdirSync("src/app/(site)", { withFileTypes: true }).filter((e) => e.isDirectory() && /^\[\[?\.\.\./.test(e.name));
  assert.deepEqual(catchAll.map((e) => e.name), [], "no top level catch-all in (site)");
});

test("the root not-found draws the site shell around the 404 copy", () => {
  const root = read("src/app/not-found.tsx");
  assert.match(root, /<SiteShell>\s*<NotFoundContent \/>\s*<\/SiteShell>/);
  assert.match(root, /export const metadata = NOT_FOUND_METADATA;/);
  // The arming script comes from the root layout's head, never from the 404 itself.
  assert.doesNotMatch(root, /REVEAL_ARM_SCRIPT/);
});

test("the in-app 404 keeps the same copy and metadata inside the site layout", () => {
  const site = read("src/app/(site)/not-found.tsx");
  assert.match(site, /return <NotFoundContent \/>;/);
  assert.match(site, /export const metadata = NOT_FOUND_METADATA;/);
  assert.doesNotMatch(site, /SiteShell/, "the site layout already draws the shell");
  assert.match(read("src/app/(site)/layout.tsx"), /<SiteShell>\{children\}<\/SiteShell>/);
});

test("404 metadata: sentence case title, noindex, follow, no canonical", () => {
  assert.equal(NOT_FOUND_METADATA.title, "Page not found");
  assert.deepEqual(NOT_FOUND_METADATA.robots, { index: false, follow: true });
  assert.deepEqual(NOT_FOUND_METADATA.alternates, { canonical: null });
});

test("the 404 copy is unchanged", () => {
  const copy = read("src/components/layout/NotFoundContent.tsx");
  for (const words of ["(404)", "This page didn&apos;t make the final&nbsp;cut.", "It may have moved or been retired. The work that did is one click away.", "View our work", "Plan your project"]) {
    assert.ok(copy.includes(words), words);
  }
  assert.match(copy, /href="\/work"/);
  assert.match(copy, /href="\/start"/);
});

test("/initiatives/foundry stays a 404: it is not a built programme page", async () => {
  const { BUILT_PAGES } = await import("@/lib/initiatives/pages");
  assert.ok(!(BUILT_PAGES as readonly string[]).includes("foundry"));
  assert.match(read("src/app/(site)/initiatives/[slug]/page.tsx"), /if \(!initiative\) return redirectOrNotFound\(`\/initiatives\/\$\{slug\}`\);/);
});
