// Homepage accessibility: the hidden descriptive text for each service (protected) now follows the
// visible text of its "<Service name> in detail" link in (02) What we do, so the link's name starts
// with what it shows (WCAG 2.5.3). The Studio fieldset text stays as decided. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { serviceTopic } from "@/lib/service-names";

const read = (file: string) => readFileSync(file, "utf8");

test("What we do: each detail link's name starts with its visible text, then the topic as hidden text", () => {
  const src = read("src/components/homepage/what-we-do/WwdRows.tsx");
  assert.doesNotMatch(src, /aria-label=/, "no aria-label replacing the link's text");
  // Right after the visible words, inside the link, unchanged from the old Capabilities rows.
  assert.match(src, /\{detailLinkText\(service\.name\)\}\s*\{topic && <span className="sr-only">: \{topic\}<\/span>\}\s*<\/Link>/);
  assert.match(read("src/components/homepage/what-we-do/WhatWeDoSection.tsx"), /serviceTopic\(s\.slug\)/);
  assert.equal(serviceTopic("brand-identity"), "Brand identity design and rebranding in Toronto");
});

test("Studio: the Homepage hero fieldset describes what it sets now", () => {
  const schema = read("sanity/schemas/caseStudy.ts");
  assert.match(schema, /description: "The rotating image at the top of the homepage, its caption, and the word in the homepage line\.",/);
  assert.doesNotMatch(schema, /field visitors can pick/);
});
