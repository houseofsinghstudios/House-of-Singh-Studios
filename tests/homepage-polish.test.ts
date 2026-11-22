// Approved polish from the homepage audit (22 Nov 2026). Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (f: string) => readFileSync(f, "utf8");

test("the site cursor stays hidden until the pointer first moves, then starts at the pointer", () => {
  const src = read("src/components/CustomCursor.tsx");
  assert.match(src, /className="custom-cursor-dot" data-idle=""/);
  assert.match(src, /className="custom-cursor-ring" data-idle=""/);
  assert.match(src, /ring\.current\.x = e\.clientX;\s*ring\.current\.y = e\.clientY;\s*dotRef\.current\?\.removeAttribute\("data-idle"\);\s*ringRef\.current\.removeAttribute\("data-idle"\);/);
  assert.match(read("src/app/globals.css"), /\.custom-cursor-dot\[data-idle\],\s*\.custom-cursor-ring\[data-idle\] \{\s*visibility: hidden;/);
});

test("the footer reads Privacy policy; the legal page keeps its own wording", () => {
  const footer = read("src/components/layout/Footer.tsx");
  assert.match(footer, />Privacy policy<\/IntentLink>/);
  assert.doesNotMatch(footer, /Privacy Policy/);
  assert.match(read("src/app/(site)/privacy/page.tsx"), /title: 'Privacy Policy'/, "unchanged");
});

test("drawer links dim by colour, never opacity", () => {
  const css = read("src/app/globals.css");
  const hover = css.slice(css.indexOf('.menu-drawer[data-open="true"] .mobile-nav-link:hover {'));
  assert.match(hover, /^[^}]*color: var\(--text-label\);/);
  assert.doesNotMatch(hover.slice(0, hover.indexOf("}")), /opacity/);
});

test("the standalone action link style is shared and recorded: underline at rest, wiped out on hover", () => {
  for (const [f, cls] of [["src/components/homepage/what-we-do/wwd.css", "wwd-detail"], ["src/components/work/index/work-index.css", "wi-invite-link"]]) {
    assert.match(read(f), new RegExp(`\\.${cls}:hover::after \\{\\s*transform: scaleX\\(0\\);\\s*transform-origin: right;`), cls);
  }
  assert.match(read("CLAUDE.md"), /Standalone action links, the second shared style/);
});
