// The site never states the studio's own prices, not even a starting price or a floor (decided
// 20 Nov 2026): every path leads to a call, and price comes after it. Market ranges for the industry
// (service FAQs, Insights articles) are allowed. This guard reads every source file under src (page
// components, data and copy files) and the built llms.txt. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildLlmsTxt } from "@/lib/llms";
import { services } from "@/data/services";
import { siteGraph } from "@/lib/site-graph";

// A statement of the studio's own price: "starts from $", "start from $", "starting at $", "projects
// start", or "from $" with "our" or "studio" in the same sentence.
const STUDIO_PRICE = [
  /\bstart(s|ing)? (from|at) \$/i,
  /\bprojects start\b/i,
  /\b(our|studio)\b[^.\n]{0,80}\bfrom \$/i,
  /\bfrom \$[^.\n]{0,80}\b(our|studio)\b/i,
];
const statesStudioPrice = (text: string) => STUDIO_PRICE.some((re) => re.test(text));

function* sourceFiles(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* sourceFiles(full);
    else if (/\.(tsx?|md|txt|json)$/.test(entry.name)) yield full;
  }
}

test("the matcher: studio prices fail, market ranges pass", () => {
  for (const bad of [
    "Projects start from $1,000.",
    "A corporate video with House of Singh Studios starts from $2,000 for a short interview.",
    "Websites start from $3,500.",
    "Our brand packages begin from $4,000.",
    "Photography starting at $1,000 for a half day.",
    "Studio rates: from $150 an hour.",
  ]) assert.ok(statesStudioPrice(bad), bad);
  for (const ok of [
    "Most Canadian businesses pay $8,000 to $35,000 for a complete brand identity from an established studio, before HST.",
    "Freelancers typically charge $1,500 to $8,000, and larger agencies start around $25,000.",
    "A business website in Canada typically costs $3,000 to $12,000 from a freelancer, $12,000 to $45,000 from a design studio.",
    "Product photography is usually priced per image, roughly $50 to $150 each in Toronto.",
  ]) assert.ok(!statesStudioPrice(ok), ok);
});

test("no source file under src states the studio's own price", () => {
  const hits: string[] = [];
  for (const file of sourceFiles(path.join(process.cwd(), "src"))) {
    fs.readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      if (statesStudioPrice(line)) hits.push(`${path.relative(process.cwd(), file)}:${i + 1}: ${line.trim().slice(0, 120)}`);
    });
  }
  assert.deepEqual(hits, []);
});

test("no service answer and no llms.txt line states the studio's own price", () => {
  for (const s of services) for (const f of s.faqs ?? []) assert.ok(!statesStudioPrice(f.answer), `${s.slug}: ${f.question}`);
  const txt = buildLlmsTxt([{ slug: "branding-agency-pricing-toronto", title: "Branding Agency Pricing in Toronto", description: "What Toronto studios and agencies charge." }]);
  for (const line of txt.split("\n")) assert.ok(!statesStudioPrice(line), line);
});

test("the structured data carries no price signal of the studio's own", () => {
  assert.doesNotMatch(JSON.stringify(siteGraph({ founderImage: "https://example.com/portrait.jpg" })), /priceRange|"price"/);
});
