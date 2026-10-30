// Structured data is written with jsonLd (src/lib/json-ld.ts): the same JSON once parsed, but text
// from Sanity can never close the script tag. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { jsonLd } from "@/lib/json-ld";

const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);

test("the parsed JSON is identical to JSON.stringify's, for ordinary and hostile values", () => {
  const values: unknown[] = [
    { "@context": "https://schema.org", "@type": "Article", headline: "Rebrand or Refresh?", author: { "@id": "https://studios.houseofsingh.com/#maninder-singh" } },
    { name: "A < B & C > D", list: [1, "two", null, true], nested: { quote: 'He said "hi"', slash: "a/b\\c" } },
    { name: `</script><script>alert(1)</script>`, line: `one${LS}two${PS}three`, emoji: "caf\u00e9" },
    [],
    "text",
  ];
  for (const v of values) assert.deepEqual(JSON.parse(jsonLd(v)), JSON.parse(JSON.stringify(v)));
});

test("no < and no raw line or paragraph separator ever reaches the HTML", () => {
  const out = jsonLd({ title: `x</script><img src=x onerror=alert(1)>`, line: `a${LS}b${PS}c` });
  assert.ok(!out.includes("<"), out);
  assert.ok(!out.includes(LS) && !out.includes(PS));
  assert.ok(out.includes("\\u003c/script>"));
  assert.ok(out.includes("\\u2028") && out.includes("\\u2029"));
});

test("output without any of these characters is byte for byte JSON.stringify's", () => {
  const v = { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://studios.houseofsingh.com" }] };
  assert.equal(jsonLd(v), JSON.stringify(v));
});

test("every JSON-LD script tag in the site uses jsonLd", () => {
  const files = [
    "src/components/FaqSchema.tsx",
    "src/components/BreadcrumbSchema.tsx",
    "src/app/(site)/services/[slug]/page.tsx",
    "src/app/(site)/work/[slug]/page.tsx",
    "src/app/(site)/insights/[slug]/page.tsx",
    "src/app/(site)/layout.tsx",
  ];
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    assert.match(src, /__html: jsonLd\(/, f);
    assert.doesNotMatch(src, /__html: JSON\.stringify\(/, f);
  }
});
