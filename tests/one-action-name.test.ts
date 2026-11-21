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
  // The homepage closes with (04) Start: "Plan your project" into the planner, "Book a discovery call" to the call.
  const read = (f: string) => fs.readFileSync(path.join(process.cwd(), f), "utf8");
  assert.match(read("src/lib/home-start.ts"), /button: "Plan your project",/);
  assert.match(read("src/lib/home-start.ts"), /callLink: "Book a discovery call",/);
  assert.match(read("src/lib/home-start.ts"), /return selected\.length \? `\/start\?service=\$\{selected\.join\(","\)\}&begin=1&\$\{from\}` : `\/start\?begin=1&\$\{from\}`;/);
  const section = read("src/components/homepage/start/StartSection.tsx");
  assert.match(section, /<a href=\{DISCOVERY_CALL_URL\} className="hs-door-link"[^>]*>\s*\{START_COPY\.callLink\}\s*<\/a>/);
});
