// The shared reveal: one time, every browser, armed only when JavaScript runs (homepage audit H-01 and
// H-04, 22 Nov 2026). Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { onScreen, REVEAL_ARM_SCRIPT, REVEAL_SAFETY_MS, REVEAL_SELECTOR } from "@/lib/reveal";
import nextConfig from "../next.config";

const files = (dir: string, ext: RegExp): string[] =>
  readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? files(p, ext) : ext.test(n) ? [p] : []; });
const css = readFileSync("src/app/globals.css", "utf8");
// Each selector: the text between the previous brace or comment end and its own opening brace.
const selectorsOf = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").split("{").slice(0, -1).map((chunk) => chunk.slice(Math.max(chunk.lastIndexOf("}"), chunk.lastIndexOf(";")) + 1).trim()).filter(Boolean);
const shared = css.slice(css.indexOf("@media (prefers-reduced-motion: no-preference) {", css.indexOf("The shared reveal")), css.indexOf("/* ── Button text variant ── */"));

test("no stylesheet drives a reveal with a scroll linked view() timeline", () => {
  for (const f of files("src", /\.css$/)) assert.doesNotMatch(readFileSync(f, "utf8"), /animation-timeline:\s*view\(\)|@supports[^{]*view\(\)/, f);
});

test("every hidden starting state is armed by html[data-reveal], and only with motion allowed", () => {
  assert.ok(shared.length > 500, "the shared block exists");
  assert.match(shared, /@media \(prefers-reduced-motion: no-preference\)/);
  const selectors = selectorsOf(shared).filter((sel) => !sel.startsWith("@"));
  for (const sel of selectors) for (const part of sel.split(",")) assert.match(part.trim(), /^html\[data-reveal\] /, part);
  for (const f of ["src/components/work/work-cards.css", "src/components/insights/insights.css"]) {
    const s = readFileSync(f, "utf8");
    for (const sel of selectorsOf(s).filter((x) => /\.(reveal-clip|ins-card)\b/.test(x))) for (const part of sel.split(",")) assert.match(part.trim(), /^html\[data-reveal\] /, `${f}: ${part}`);
  }
});

test("every class the shared block hides is one ScrollObserver reveals", () => {
  const hidden = new Set([...shared.matchAll(/html\[data-reveal\] \.([a-z-]+)/g)].map((m) => m[1]));
  hidden.delete("in-view");
  for (const cls of hidden) assert.ok(cls === "cs-hero-image-reveal" || REVEAL_SELECTOR.includes(`.${cls}`), cls);
});

test("the arming script: sets data-reveal, disarms after the safety time, rendered in the root layout head, allowed by the CSP", async () => {
  assert.match(REVEAL_ARM_SCRIPT, /setAttribute\('data-reveal',''\)/);
  assert.match(REVEAL_ARM_SCRIPT, new RegExp(`window\\.__hosReveal\\)d\\.removeAttribute\\('data-reveal'\\)\\},${REVEAL_SAFETY_MS}\\)`));
  assert.match(REVEAL_ARM_SCRIPT, /IntersectionObserver' in window/);
  // data-js is set first and never removed: the What we do accordion collapses under it.
  // The Studio shares the root layout and is skipped; everything else sets data-js first.
  assert.match(REVEAL_ARM_SCRIPT, /^\(function\(\)\{try\{if\(\/\^\\\/studio\(\\\/\|\$\)\/\.test\(location\.pathname\)\)return;var d=document\.documentElement;d\.setAttribute\('data-js',''\);/);
  assert.doesNotMatch(REVEAL_ARM_SCRIPT, /removeAttribute\('data-js'\)/);
  // From the root layout's head, so every document has it as real HTML, the 404 included (site audit S-05).
  const root = readFileSync("src/app/layout.tsx", "utf8");
  assert.match(root, /<head>[\s\S]*<script dangerouslySetInnerHTML=\{\{ __html: REVEAL_ARM_SCRIPT \}\} \/>[\s\S]*<\/head>/);
  for (const f of ["src/app/(site)/layout.tsx", "src/components/layout/SiteShell.tsx"]) {
    assert.doesNotMatch(readFileSync(f, "utf8"), /REVEAL_ARM_SCRIPT/, `rendered once, never again in ${f}`);
  }
  // The safety net: ClientShell sets data-js on mount when it is missing, never data-reveal.
  const shell = readFileSync("src/components/ClientShell.tsx", "utf8");
  assert.match(shell, /if \(!root\.hasAttribute\("data-js"\)\) root\.setAttribute\("data-js", ""\);/);
  assert.doesNotMatch(shell, /data-reveal"\s*,/);
  const headers = (await nextConfig.headers!()).find((r) => r.source === "/(.*)")!.headers;
  assert.match(headers.find((h) => h.key === "Content-Security-Policy")!.value, /script-src 'self' 'unsafe-inline'/);
  const observer = readFileSync("src/components/ScrollObserver.tsx", "utf8");
  assert.match(observer, /window\.__hosReveal = true/);
  assert.doesNotMatch(observer, /classList\.remove/, "nothing ever un-reveals");
  assert.match(readFileSync("src/components/ClientShell.tsx", "utf8"), /^import ScrollObserver from "@\/components\/ScrollObserver";$/m);
});

test("on screen: any part inside the viewport counts, nothing outside or empty does", () => {
  assert.equal(onScreen({ top: 732, bottom: 2400, width: 390, height: 1668 }, 844), true, "a tall section starting near the bottom");
  assert.equal(onScreen({ top: -500, bottom: 10, width: 390, height: 510 }, 844), true);
  assert.equal(onScreen({ top: 844, bottom: 900, width: 390, height: 56 }, 844), false);
  assert.equal(onScreen({ top: 0, bottom: 0, width: 0, height: 0 }, 844), false, "display none");
});

test("no reveal element switches its class string on state (React would drop .in-view)", () => {
  const reveal = /(css-reveal|scroll-reveal-up|scroll-clip-reveal|reveal-clip|reveal-stagger-parent|reveal-text|about-team-card|about-process-step|ins-card|ins-featured)/;
  for (const f of files("src", /\.tsx$/)) {
    for (const m of readFileSync(f, "utf8").matchAll(/className=\{`([^`]*)`\}/g)) {
      if (reveal.test(m[1])) assert.doesNotMatch(m[1], /\$\{[^}]*\?/, `${f}: ${m[1].slice(0, 80)}`);
    }
  }
});
