// /studio stays out of search: robots.txt disallows it and the Studio's metadata says noindex.
// The existing robots.txt rules are kept. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import robots from "@/app/robots";
import { metadata } from "@/app/(studio)/studio/[[...tool]]/layout";

test("robots.txt disallows /studio and keeps every existing rule", () => {
  const r = robots();
  const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
  assert.equal(rules.length, 1);
  assert.equal(rules[0].userAgent, "*");
  assert.equal(rules[0].allow, "/");
  assert.deepEqual(rules[0].disallow, ["/api/", "/studio", "/studio/", "/admin/"]);
  assert.equal(r.sitemap, "https://studios.houseofsingh.com/sitemap.xml");
});

test("the Studio is never indexed, and keeps its title", () => {
  assert.equal(metadata.robots, "noindex");
  assert.equal(metadata.referrer, "same-origin");
  assert.deepEqual(metadata.title, { absolute: "Studio — House of Singh Studios CMS" });
});
