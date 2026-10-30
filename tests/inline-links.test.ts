// Links written as text in service page answers, and the FAQPage structured data built from them.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { isExternal, parseInlineLinks, plainText } from "@/lib/inline-links";
import { services } from "@/data/services";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { QUESTIONS_NOTE } from "@/lib/initiatives/content";

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

test("FAQPage text: every service has questions, and the plain text equals what is shown", () => {
  for (const s of services) {
    assert.ok(s.faqs && s.faqs.length > 0, s.slug);
    for (const f of s.faqs!) {
      const shown = parseInlineLinks(f.answer).map((p) => p.text).join("");
      assert.equal(plainText(f.answer), shown);
      assert.doesNotMatch(plainText(f.answer), /\]\(|https?:\/\//, "no markup or addresses left in the plain text");
    }
  }
});

test("question marks inside an answer are ordinary text, beside links", () => {
  const text = "Ask: Who will design my site? Who writes the content? See [our work](/work)?";
  assert.deepEqual(parseInlineLinks(text), [
    { text: "Ask: Who will design my site? Who writes the content? See " },
    { text: "our work", href: "/work" },
    { text: "?" },
  ]);
  assert.equal(plainText(text), "Ask: Who will design my site? Who writes the content? See our work?");
});

test("Website Design answers: 12 links, both calls from the shared constant, every path a site page", () => {
  const faqs = services.find((s) => s.slug === "digital-design")!.faqs!;
  assert.equal(faqs.length, 6);
  const links = faqs.flatMap((f) => parseInlineLinks(f.answer).filter((p) => p.href));
  assert.equal(links.length, 12);
  assert.deepEqual(links.filter((l) => isExternal(l.href!)).map((l) => l.href), [DISCOVERY_CALL_URL, DISCOVERY_CALL_URL]);
  for (const l of links) if (!isExternal(l.href!)) assert.match(l.href!, /^\/(insights|work|start|contact|services|brand-pulse)(\/[a-z0-9-]+)?$/, l.href);
  const five = plainText(faqs[4].answer);
  assert.ok(five.includes("Who will actually design my site? Is there a strategy phase before design? Who writes the content?"), "the questions inside answer 5 survive");
  assert.ok(!/\]\(|\)\]/.test(five));
});

test("Photography and Video answers: 9 links, both calls from the shared constant; a mid answer question mark and a semicolon survive", () => {
  const faqs = services.find((s) => s.slug === "visual-media")!.faqs!;
  assert.equal(faqs.length, 5);
  const links = faqs.flatMap((f) => parseInlineLinks(f.answer).filter((p) => p.href));
  assert.equal(links.length, 9);
  assert.deepEqual(links.filter((l) => isExternal(l.href!)).map((l) => l.href), [DISCOVERY_CALL_URL, DISCOVERY_CALL_URL]);
  for (const l of links) if (!isExternal(l.href!)) assert.match(l.href!, /^\/(insights|work|start|contact|services|brand-pulse)(\/[a-z0-9-]+)?$/, l.href);
  assert.ok(plainText(faqs[1].answer).endsWith("social channels and print for months. Plan your project for a personal estimate."));
  assert.ok(!plainText(faqs[1].answer).includes("Projects start from"), "no studio starting price in answer 2");
  assert.ok(plainText(faqs[3].answer).endsWith("Questions about a specific use? Ask us directly."));
});

test("Brand Strategy answers: 9 links, the call from the shared constant, every path a site page", () => {
  const faqs = services.find((s) => s.slug === "creative-strategy")!.faqs!;
  assert.equal(faqs.length, 5);
  const links = faqs.flatMap((f) => parseInlineLinks(f.answer).filter((p) => p.href));
  assert.equal(links.length, 9);
  assert.deepEqual(links.filter((l) => isExternal(l.href!)).map((l) => l.href), [DISCOVERY_CALL_URL]);
  for (const l of links) if (!isExternal(l.href!)) assert.match(l.href!, /^\/(insights|work|start|contact|services|brand-pulse)(\/[a-z0-9-]+)?$/, l.href);
  assert.ok(plainText(faqs[1].answer).includes("from your website to your pricing"), "pricing here is the client's own");
  assert.ok(plainText(faqs[4].answer).includes("a clear brief; read how to brief a design studio"), "the semicolon survives");
});

// Protocol relative and backslash addresses: browsers open "//host" and "/\host" on another site,
// so neither is ever an internal link; they stay as plain text.
test("//address and /\\address are never internal links; they stay as text", () => {
  for (const href of ["//evil.example", "//evil.example/path", "/\\evil.example", "/\\/evil.example"]) {
    const text = `Read [this](${href}) now.`;
    const parts = parseInlineLinks(text);
    assert.deepEqual(parts, [{ text }], href);
    assert.equal(plainText(text), text, href);
  }
  // Other schemes were never links, and still are not.
  for (const href of ["javascript:alert(1)", "data:text/html,hi", "mailto:a@b.co", "ftp://x.example"]) {
    assert.deepEqual(parseInlineLinks(`[x](${href})`), [{ text: `[x](${href})` }], href);
  }
  assert.equal(isExternal("//evil.example"), false);
  assert.equal(isExternal("https://cal.com/x"), true);
  assert.equal(isExternal("http://example.com"), true);
});

test("every existing answer and note parses exactly as it did with the old pattern", () => {
  const OLD = /\[([^\]\n]+)\]\(((?:\/|https?:\/\/)[^\s()]*)\)/g;
  const oldParse = (text: string) => {
    const out: { text: string; href?: string }[] = [];
    let last = 0;
    for (const m of text.matchAll(OLD)) {
      const at = m.index ?? 0;
      if (at > last) out.push({ text: text.slice(last, at) });
      out.push({ text: m[1], href: m[2] });
      last = at + m[0].length;
    }
    if (last < text.length) out.push({ text: text.slice(last) });
    return out;
  };
  const texts = [
    ...services.flatMap((s) => (s.faqs ?? []).map((f) => f.answer)),
    QUESTIONS_NOTE,
    `Have a question that is not here? [Book a 30 minute discovery call](${DISCOVERY_CALL_URL}).`,
  ];
  let links = 0;
  for (const t of texts) {
    const now = parseInlineLinks(t);
    assert.deepEqual(now, oldParse(t), t.slice(0, 60));
    links += now.filter((p) => p.href).length;
  }
  assert.ok(links >= 20, `${links} links checked`);
});
