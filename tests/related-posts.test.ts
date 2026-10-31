import { test } from "node:test";
import assert from "node:assert/strict";
import { relatedPostsFor } from "../src/lib/related-posts";

const post = (id: string, category?: string) => ({ _id: id, category });
const ids = (list: { _id: string }[]) => list.map((p) => p._id);
const current = post("now", "branding");
const latest = [post("l1", "ai"), post("l2", "branding"), post("l3", "business")];

test("the editor's choice wins, in the order chosen", () => {
  assert.deepEqual(ids(relatedPostsFor([post("c2", "ai"), post("c1", "branding")], latest, current)), ["c2", "c1"]);
});

test("a single pick comes first; the second slot is filled from the fallback, same category first", () => {
  assert.deepEqual(ids(relatedPostsFor([post("c1", "ai")], latest, current)), ["c1", "l2"]);
});

test("the fill never repeats a pick, nor shows the article itself", () => {
  const withPick = [post("l2", "branding"), post("now", "branding"), post("l1", "ai")];
  assert.deepEqual(ids(relatedPostsFor([post("l2", "branding")], withPick, current)), ["l2", "l1"]);
  assert.deepEqual(ids(relatedPostsFor([post("c1"), post("c1")], latest, current)), ["c1", "l2"]);
});

test("one pick and nothing else published: one card", () => {
  assert.deepEqual(ids(relatedPostsFor([post("c1")], [], current)), ["c1"]);
});

test("only the first two picks are shown", () => {
  assert.deepEqual(ids(relatedPostsFor([post("c1"), post("c2"), post("c3")], latest, current)), ["c1", "c2"]);
});

test("a removed or unpublished pick, and the article itself, are skipped", () => {
  assert.deepEqual(ids(relatedPostsFor([null, post("now", "branding"), post("c1")], latest, current)), ["c1", "l2"]);
});

test("an empty choice falls back to the latest, the same category first", () => {
  for (const chosen of [null, undefined, [], [null]]) {
    assert.deepEqual(ids(relatedPostsFor(chosen, latest, current)), ["l2", "l1"]);
  }
});

test("the fallback keeps two of the same category when there are two", () => {
  const sameTwice = [post("a", "branding"), post("b", "ai"), post("c", "branding")];
  assert.deepEqual(ids(relatedPostsFor([], sameTwice, current)), ["a", "c"]);
});

test("nothing chosen and nothing published: no cards", () => {
  assert.deepEqual(relatedPostsFor(null, null, current), []);
  assert.deepEqual(relatedPostsFor([], [], current), []);
});
