// Homepage accessibility fixes: The Argument's words never fail text contrast, and the Capabilities
// rows' accessible names start with their visible title (WCAG 2.5.3). Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { serviceTopic } from "@/lib/service-names";

const read = (file: string) => readFileSync(file, "utf8");

test("The Argument: words mix from Accessible Ash to Obsidian, never faded with opacity", () => {
  const css = read("src/components/homepage/homepage.css");
  const rule = css.slice(css.indexOf(".argument-word {"), css.indexOf("}", css.indexOf(".argument-word {")));
  assert.match(rule, /color: color-mix\(in srgb, var\(--text-primary\) calc\(var\(--p\) \* 100%\), var\(--text-label\)\);/);
  assert.doesNotMatch(rule, /opacity/);
  const src = read("src/components/homepage/ArgumentSection.tsx");
  assert.match(src, /word\.style\.setProperty\("--p", wordProgress\.toFixed\(3\)\)/);
  assert.match(src, /word\.style\.setProperty\("--p", "1"\)/, "reduced motion: Obsidian from the start");
  assert.doesNotMatch(src, /style\.opacity/);
});

test("Capabilities rows: the name starts with the visible title, then the topic as hidden text", () => {
  const src = read("src/components/homepage/ServicesSection.tsx");
  assert.doesNotMatch(src, /aria-label=/, "no aria-label replacing the row's text");
  assert.match(src, /<span className="svc-accordion-num" aria-hidden="true">/);
  assert.match(src, /<span className="svc-mob-plus" aria-hidden="true">\+<\/span>/);
  // Right after the title, inside the row link.
  assert.match(src, /\{service\.title\}\s*<\/h3>\s*<TopicText slug=/);
  assert.match(src, /<span className="sr-only">: \{topic\}<\/span>/);
  assert.equal(serviceTopic("brand-identity"), "Brand identity design and rebranding in Toronto");
});

test("Studio: the Homepage hero fieldset describes what it sets now", () => {
  const schema = read("sanity/schemas/caseStudy.ts");
  assert.match(schema, /description: "The rotating image at the top of the homepage, its caption, and the word in the homepage line\.",/);
  assert.doesNotMatch(schema, /field visitors can pick/);
});

test("The Argument: every word's window ends within the scroll range, so the last words reach Obsidian", () => {
  assert.match(read("src/components/homepage/ArgumentSection.tsx"), /const wordEnd = Math\.min\(1, \(i \+ 1\.5\) \/ totalWords\);/);
});
