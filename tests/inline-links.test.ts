// Links written as text in service page answers, and the FAQPage structured data built from them.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { isExternal, parseInlineLinks, plainText } from "@/lib/inline-links";
import { services } from "@/data/services";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";

test("an internal link", () => {
  assert.deepEqual(parseInlineLinks("Read [the guide](/insights/a-guide) first."), [
    { text: "Read " },
    { text: "the guide", href: "/insights/a-guide" },
    { text: " first." },
  ]);
});

test("an external link", () => {
  const [, link] = parseInlineLinks("Book a [discovery call](https://cal.com/x/y).");
  assert.deepEqual(link, { text: "discovery call", href: "https://cal.com/x/y" });
  assert.equal(isExternal(link.href!), true);
  assert.equal(isExternal("/start"), false);
});

test("several links, side by side and at the edges", () => {
  const parts = parseInlineLinks("[plan your project](/start), or [tell us](/contact)");
  assert.deepEqual(parts.map((p) => p.href ?? "text"), ["/start", "text", "/contact"]);
  assert.equal(plainText("[plan your project](/start), or [tell us](/contact)"), "plan your project, or tell us");
});

test("text with no links comes back whole", () => {
  assert.deepEqual(parseInlineLinks("No links here, at $1,000."), [{ text: "No links here, at $1,000." }]);
  assert.deepEqual(parseInlineLinks(""), []);
});

test("brackets without a path or web address stay as text", () => {
  for (const text of ["[note] for later", "[a](not a link)", "[a](mailto:x@y.z)", "[a] (/start)", "[](/start)", "a ](/start) b"]) {
    assert.deepEqual(parseInlineLinks(text), [{ text }], text);
  }
});

test("Brand Identity answers: 13 links, the call link from the shared constant, every path a site page", () => {
  const faqs = services.find((s) => s.slug === "brand-identity")!.faqs!;
  const links = faqs.flatMap((f) => parseInlineLinks(f.answer).filter((p) => p.href));
  assert.equal(links.length, 13);
  assert.deepEqual(links.filter((l) => isExternal(l.href!)).map((l) => l.href), [DISCOVERY_CALL_URL]);
  for (const l of links) if (!isExternal(l.href!)) assert.match(l.href!, /^\/(insights|work|start|contact|services|brand-pulse)(\/[a-z0-9-]+)?$/, l.href);
});

test("FAQPage text: only Brand Identity has questions, and the plain text equals what is shown", () => {
  for (const s of services) {
    if (s.slug !== "brand-identity") {
      assert.ok(!s.faqs || s.faqs.length === 0, s.slug);
      continue;
    }
    for (const f of s.faqs!) {
      const shown = parseInlineLinks(f.answer).map((p) => p.text).join("");
      assert.equal(plainText(f.answer), shown);
      assert.doesNotMatch(plainText(f.answer), /\]\(|https?:\/\//, "no markup or addresses left in the plain text");
    }
  }
});
