// The RGD credential link: whole word matching, and portable text where a link is never placed
// inside another link. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { RGD_MARK, hasRgd, linkRgdInBlocks, splitRgd } from "@/lib/rgd";
import { FOUNDER_PROFILES } from "@/lib/constants/profiles";

const rgd = (text: string) => splitRgd(text).filter((s) => s.rgd).length;

test("the standalone word RGD is found, as many times as it appears", () => {
  assert.deepEqual(splitRgd("Maninder Singh RGD"), [{ text: "Maninder Singh ", rgd: false }, { text: "RGD", rgd: true }]);
  assert.deepEqual(splitRgd("RGD"), [{ text: "RGD", rgd: true }]);
  assert.equal(rgd("a member of RGD (Registered Graphic Designers) of Canada"), 1);
  assert.equal(rgd("RGD, then RGD again."), 2);
  assert.equal(rgd("judges the RGD design awards"), 1);
  assert.equal(rgd("RGD's awards"), 1, "a possessive still links the word");
  assert.equal(rgd("(RGD)"), 1);
  assert.equal(splitRgd("RGD, Creative Director").map((s) => s.text).join(""), "RGD, Creative Director", "nothing is lost");
});

test("never inside another word, an email or a web address, and never lower case", () => {
  for (const text of ["RGDA", "ARGD", "RGD2", "rgd", "Rgd", "RGD.ca", "rgd.ca/members", "https://RGD.ca", "/RGD/", "info@RGD", "RGD@example.com", "pre-RGD", "RGD-certified", "RGD_x", "x.RGD"]) {
    assert.equal(rgd(text), 0, text);
  }
  assert.equal(hasRgd("no credential here"), false);
});

type TestSpan = { _type: string; _key: string; text: string; marks: string[] };
type TestDef = { _key: string; _type: string; href?: string };
const block = (children: TestSpan[], markDefs: TestDef[] = []) => ({ _type: "block", _key: "b1", style: "normal", markDefs, children });
const span = (key: string, text: string, marks: string[] = []): TestSpan => ({ _type: "span", _key: key, text, marks });

test("portable text: RGD becomes its own span with the rgd mark, other marks kept", () => {
  const [out] = linkRgdInBlocks([block([span("s1", "Led by Maninder Singh RGD, in Toronto.", ["strong"])])]);
  assert.deepEqual(out.children.map((c) => [c.text, c.marks]), [["Led by Maninder Singh ", ["strong"]], ["RGD", ["strong", RGD_MARK]], [", in Toronto.", ["strong"]]]);
  assert.deepEqual(out.markDefs, [{ _key: RGD_MARK, _type: "rgdLink" }], "one definition, added once");
  assert.equal(new Set(out.children.map((c) => c._key)).size, 3, "keys stay unique");
});

test("portable text: text already inside a link is left exactly as it is (no nested links)", () => {
  const linkDef = { _key: "l1", _type: "link", href: "https://rgd.ca" };
  const input = [block([span("s1", "See RGD here", ["l1"]), span("s2", " and RGD there.")], [linkDef])];
  const [out] = linkRgdInBlocks(input);
  assert.deepEqual(out.children[0], input[0].children[0], "the linked span is untouched");
  assert.deepEqual(out.children.filter((c) => c.marks.includes(RGD_MARK)).map((c) => c.text), ["RGD"], "only the unlinked RGD is marked");
  assert.ok(out.children.every((c) => !(c.marks.includes(RGD_MARK) && c.marks.includes("l1"))), "never both marks on one span");
});

test("portable text: nothing to do leaves blocks unchanged; other blocks and empty bodies are safe", () => {
  const plain = [block([span("s1", "No credential here.")])];
  assert.deepEqual(linkRgdInBlocks(plain), plain);
  const image = { _type: "image", _key: "i1", alt: "RGD award certificate" };
  assert.deepEqual(linkRgdInBlocks([image]), [image], "image alt text is never touched");
  assert.deepEqual(linkRgdInBlocks(undefined), []);
});

test("the profile URLs are set", () => {
  assert.equal(FOUNDER_PROFILES.rgd, "https://rgd.ca/members/profile/manindersingh");
  assert.equal(FOUNDER_PROFILES.linkedin, "https://www.linkedin.com/in/manindersingh333");
});
