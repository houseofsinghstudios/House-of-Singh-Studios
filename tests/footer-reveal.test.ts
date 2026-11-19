// The closing crest section (src/components/layout/FooterReveal.tsx): its line and maple leaf, the
// crest size, and the one Canada red exception. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const read = (file: string) => readFileSync(file, "utf8");
const src = read("src/components/layout/FooterReveal.tsx");

test("the line: Proudly Canadian owned and operated, still the section's label", () => {
  assert.match(src, /<p className="ft-reveal-tagline" id=\{taglineId\}>[\s\S]*Proudly[\s\S]*Canadian owned and operated\.\s*<\/p>/);
  assert.match(src, /aria-labelledby=\{taglineId\}/);
  assert.doesNotMatch(src, /Directed by humans/);
  // The leaf stays beside "Proudly" if the line wraps.
  assert.match(src, /<span className="ft-reveal-lead">\s*<MapleLeaf \/>\s*Proudly\s*<\/span>/);
});

test("the maple leaf: the flag's 11 point leaf, 12px, Canada red, decorative", () => {
  assert.match(src, /viewBox="-2015 -2000 4030 4030" width="12" height="12" fill="#D52B1E" aria-hidden="true"/);
  assert.match(src, /<path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151/);
  const css = read("src/app/globals.css");
  assert.match(css, /\.ft-reveal-leaf \{[^}]*width: 12px;[^}]*height: 12px;[^}]*margin-right: 9px;/);
});

test("the crest is larger: clamp(150px, 20vw, 240px)", () => {
  assert.match(read("src/app/globals.css"), /\.ft-reveal-crest \{\s*height: clamp\(150px, 20vw, 240px\);/);
});

test("Canada red is used for the leaf only, and recorded as the one exception", () => {
  const uses = execSync("grep -rli 'd52b1e' src sanity || true", { encoding: "utf8" }).trim().split("\n").filter(Boolean);
  assert.deepEqual(uses, ["src/components/layout/FooterReveal.tsx"]);
  assert.match(read("CLAUDE.md"), /Canada red #D52B1E, for one element only: the 11 point maple leaf/);
});

test("the line stays on the page: not in metadata, structured data or llms.txt", () => {
  const where = execSync("grep -rl 'Canadian owned and operated' src || true", { encoding: "utf8" }).trim().split("\n").filter(Boolean);
  assert.deepEqual(where, ["src/components/layout/FooterReveal.tsx"]);
});
