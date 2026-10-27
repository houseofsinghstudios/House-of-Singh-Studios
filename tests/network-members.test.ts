// Network member cards on /about: only what a card needs reaches the page. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { toNetworkCards } from "@/lib/about/network";

const square = (photo: { asset?: { _id?: unknown } | null }) => `https://cdn.sanity.io/square/${String(photo.asset?._id)}`;
const member = (n: number, extra: Record<string, unknown> = {}) => ({
  role: `Role ${n}`,
  photo: { alt: `Portrait ${n}`, hotspot: { x: 0.5, y: 0.3 }, asset: { _id: `image-${n}`, metadata: { lqip: `data:image/jpeg;base64,${n}` } } },
  ...extra,
});

test("each member becomes role, alt, square photo URL and blur placeholder, in order", () => {
  assert.deepEqual(toNetworkCards([member(1), member(2)], square), [
    { role: "Role 1", alt: "Portrait 1", src: "https://cdn.sanity.io/square/image-1", lqip: "data:image/jpeg;base64,1" },
    { role: "Role 2", alt: "Portrait 2", src: "https://cdn.sanity.io/square/image-2", lqip: "data:image/jpeg;base64,2" },
  ]);
});

test("nothing beyond the card fields is passed on, even if a document carries more", () => {
  const [card] = toNetworkCards([member(1, { internalName: "Jane Doe", _id: "abc", order: 1 })], square);
  assert.deepEqual(Object.keys(card).sort(), ["alt", "lqip", "role", "src"]);
  assert.ok(!JSON.stringify(card).includes("Jane"));
});

test("a member without a role, a photo or alt text is left out; no blur placeholder is fine", () => {
  const noLqip = member(4);
  noLqip.photo.asset.metadata = { lqip: "" };
  const cards = toNetworkCards([
    member(1, { role: "  " }),
    member(2, { photo: null }),
    { role: "Role 3", photo: { alt: "", asset: { _id: "image-3" } } },
    noLqip,
  ], square);
  assert.deepEqual(cards, [{ role: "Role 4", alt: "Portrait 4", src: "https://cdn.sanity.io/square/image-4" }]);
});

test("no members, or an unexpected answer, gives an empty list (the placeholders show)", () => {
  for (const docs of [[], null, undefined, {}, "x"]) assert.deepEqual(toNetworkCards(docs, square), [], String(docs));
});

test("the site's query never asks for internalName and only shows switched on, published members", () => {
  const source = fs.readFileSync("src/lib/sanity/network.ts", "utf8");
  const query = source.slice(source.indexOf("`*["), source.indexOf("}`;") + 2);
  assert.ok(!query.includes("internalName"));
  assert.match(query, /showOnWebsite == true/);
  assert.match(query, /!\(_id in path\("drafts\.\*\*"\)\)/);
  assert.match(query, /order\(order asc\)/);
});
