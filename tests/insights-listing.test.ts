// The Insights listing order and pages (src/lib/insights-listing.ts). Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { POSTS_PER_PAGE, orderForListing, pageCount, pageHref, parsePageNumber, postsForPage } from "@/lib/insights-listing";

const post = (id: string, publishedAt?: string, featured?: boolean) => ({ id, publishedAt, featured });
const ids = (list: Array<{ id: string }>) => list.map((p) => p.id);

test("the hero is the newest featured post; everything else is newest first", () => {
  const posts = [
    post("old-featured", "2026-04-01T00:00:00Z", true),
    post("new", "2026-11-18T14:00:00Z"),
    post("mid-featured", "2026-10-01T00:00:00Z", true),
    post("mid", "2026-10-15T00:00:00Z"),
  ];
  assert.deepEqual(ids(orderForListing(posts)), ["mid-featured", "new", "mid", "old-featured"]);
});

test("featured never pushes a newer post below an older one", () => {
  const ordered = orderForListing([
    post("a", "2026-01-01T00:00:00Z", true),
    post("b", "2026-02-01T00:00:00Z", true),
    post("c", "2026-03-01T00:00:00Z"),
    post("d", "2026-04-01T00:00:00Z"),
  ]);
  assert.equal(ordered[0].id, "b");
  const rest = ordered.slice(1).map((p) => Date.parse(p.publishedAt!));
  assert.deepEqual(rest, [...rest].sort((x, y) => y - x));
});

test("without a featured post the newest is the hero; undated posts go last", () => {
  assert.deepEqual(ids(orderForListing([post("x"), post("y", "2026-05-01T00:00:00Z"), post("z", "2026-06-01T00:00:00Z")])), ["z", "y", "x"]);
  assert.deepEqual(orderForListing([]), []);
});

test("page 1 holds the hero and six; later pages six each; nothing is lost or repeated", () => {
  for (const total of [0, 1, 7, 8, 13, 14, 35]) {
    const list = Array.from({ length: total }, (_, i) => i);
    const pages = pageCount(total);
    const seen = Array.from({ length: pages }, (_, i) => postsForPage(list, i + 1)).flat();
    assert.deepEqual(seen, list, `total ${total}`);
    assert.ok(postsForPage(list, 1).length <= 1 + POSTS_PER_PAGE);
    assert.equal(postsForPage(list, pages + 1).length, 0, `total ${total}: no page after the last`);
  }
  assert.equal(pageCount(0), 1);
  assert.equal(pageCount(7), 1);
  assert.equal(pageCount(8), 2);
  assert.equal(pageCount(35), 6);
});

test("page addresses: page 1 is /insights; only plain page numbers are accepted", () => {
  assert.equal(pageHref(1), "/insights");
  assert.equal(pageHref(3), "/insights/page/3");
  assert.equal(parsePageNumber("2"), 2);
  for (const bad of ["0", "02", "-1", "2.5", "abc", "", "99999"]) assert.equal(parsePageNumber(bad), null, bad);
});
