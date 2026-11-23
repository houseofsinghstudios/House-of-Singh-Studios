// Hovers change colour or sweep, never dim text by opacity (site audit S-18, 23 Nov 2026; Layer 4):
// titles turn from Obsidian to Gunmetal, the dark buttons take the primary button's light sweep. Opacity
// on hover is allowed only for the decorative hover grounds (a ::before or ::after layer) and the work
// card's text swap, where the description replaces the name. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const read = (f: string) => fs.readFileSync(f, "utf8");
const cssFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? cssFiles(path.join(dir, e.name)) : e.name.endsWith(".css") ? [path.join(dir, e.name)] : []));

const ALLOWED = [".wp-grid-card:hover .wp-grid-name"];

test("no hover dims text or a button by opacity", () => {
  const found: string[] = [];
  for (const file of cssFiles("src")) {
    const css = read(file).replace(/\/\*[\s\S]*?\*\//g, "");
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = m[1].trim().replace(/\s+/g, " ");
      if (!/:hover/.test(selector)) continue;
      const o = m[2].match(/(?:^|;)\s*opacity\s*:\s*([0-9.]+)/);
      if (!o || parseFloat(o[1]) >= 1) continue;
      const parts = selector.split(",").map((s) => s.trim()).filter((s) => !/::(before|after)$/.test(s) && !ALLOWED.includes(s));
      if (parts.length) found.push(`${file}: ${parts.join(", ")} (${o[1]})`);
    }
  }
  assert.deepEqual(found, []);
});

test("the titles turn Gunmetal; the dark buttons sweep", () => {
  const css = (f: string) => read(f).replace(/\s+/g, " ");
  assert.match(css("src/components/insights/insights.css"), /\.ins-featured:hover \.ins-featured-title \{ color: var\(--text-secondary\); \}/);
  assert.match(css("src/app/globals.css"), /\.ins-card:hover \.ins-card-title \{ color: var\(--text-secondary\); \}/);
  assert.match(css("src/components/insights/article.css"), /\.art-nav-link:hover \.art-nav-title \{ color: var\(--text-secondary\); \}/);
  assert.match(css("src/components/careers/careers.css"), /\.role-card-header:hover \.role-card-title \{ color: var\(--text-secondary\); \}/);
  assert.doesNotMatch(read("src/components/careers/RoleCard.tsx"), /className="role-card-title" style=\{\{[^}]*color:/, "the title's colour lives in the stylesheet, so the hover can change it");
  for (const [file, rule] of [["src/app/globals.css", ".svc-block-btn:hover"], ["src/components/initiatives/initiatives.css", ".init-row:hover .init-row-explore"], ["src/components/careers/careers.css", ".careers-submit-btn:hover"]]) {
    assert.ok(css(file).includes(`${rule} { background-size: 100% 100%; }`), `${file}: ${rule}`);
  }
});
