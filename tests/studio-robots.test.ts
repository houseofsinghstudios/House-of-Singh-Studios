// /studio stays out of search: robots.txt disallows it and the Studio's metadata says noindex.
// The existing robots.txt rules are kept. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import robots from "@/app/robots";
import { metadata } from "@/app/(studio)/studio/[[...tool]]/layout";

test("robots.txt disallows /studio and keeps every existing rule", () => {
  const r = robots();
  const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
  assert.equal(rules.length, 2);
  assert.equal(rules[0].userAgent, "*");
  assert.equal(rules[0].allow, "/");
  assert.deepEqual(rules[0].disallow, ["/api/", "/studio", "/studio/", "/admin/"]);
  assert.equal(r.sitemap, "https://studios.houseofsingh.com/sitemap.xml");
});

test("the OpenSEO audit crawler has its own group that repeats every general disallow", () => {
  const r = robots();
  const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
  const general = rules[0].disallow as string[];
  const audit = rules.find((g) => g.userAgent === "OpenSEO-Audit")!;
  assert.equal(audit.allow, "/");
  assert.deepEqual(audit.disallow, ["/api/", "/studio", "/studio/", "/admin/", "/*?from=", "/*&from="]);
  // from= as the first query parameter (/brand-pulse?from=home_start) and as a later one
  // (/start?begin=1&from=home_start).
  const blocks = (url: string) => (audit.disallow as string[]).some((rule) => rule.startsWith("/*") && url.includes(rule.slice(2)));
  assert.ok(blocks("/brand-pulse?from=home_start"));
  assert.ok(blocks("/start?begin=1&from=home_start"));
  assert.ok(!blocks("/start?begin=1"), "other query strings stay allowed");
  // A crawler that matches its own group ignores the general one, so nothing general may be missing.
  for (const path of general) assert.ok((audit.disallow as string[]).includes(path), path);
});

test("the Studio is never indexed, and keeps its title", () => {
  assert.equal(metadata.robots, "noindex");
  assert.equal(metadata.referrer, "same-origin");
  assert.deepEqual(metadata.title, { absolute: "Studio — House of Singh Studios CMS" });
});
