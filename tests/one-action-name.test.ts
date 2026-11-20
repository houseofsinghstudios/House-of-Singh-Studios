// One name for the main action (owner decision, Nov 2026): "Plan your project" everywhere, in sentence
// case, to /start; the second action is "Book a discovery call", also in sentence case. This guard reads
// every file under src and fails on the old labels. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const OLD_LABELS = ["Start a Project", "Start a project", "Plan Your Project", "Book a Discovery Call"];

function* files(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* files(full);
    else yield full;
  }
}

test("no old name for the main or second action anywhere under src", () => {
  const hits: string[] = [];
  for (const file of files(path.join(process.cwd(), "src"))) {
    if (!/\.(tsx?|css|md|json|txt)$/.test(file)) continue;
    fs.readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      for (const label of OLD_LABELS) if (line.includes(label)) hits.push(`${path.relative(process.cwd(), file)}:${i + 1}: ${label}`);
    });
  }
  assert.deepEqual(hits, []);
});

test("the main action and the second action keep their names and links", () => {
  const cta = fs.readFileSync(path.join(process.cwd(), "src/components/homepage/CtaSection.tsx"), "utf8");
  assert.match(cta, /href="\/start"[^>]*>\s*Plan your project\s*</);
  assert.match(cta, /href=\{DISCOVERY_CALL_URL\}[^>]*>\s*Book a discovery call\s*</);
});
