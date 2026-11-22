// The careers roles (site audit S-01, 22 Nov 2026): each role's title is a button inside its h2, with
// aria-expanded and aria-controls, stretched over the header; the body is inert once the page runs
// and collapses only under html[data-js], so without JavaScript every role reads in full.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const card = readFileSync("src/components/careers/RoleCard.tsx", "utf8");
const css = readFileSync("src/components/careers/careers.css", "utf8");

test("the title is a button inside the h2, named by its own text, controlling the body", () => {
  assert.match(card, /<h2 className="role-card-title"[^>]*>\s*\{inBrowser \? \(\s*<button type="button" className="role-card-btn" aria-expanded=\{isOpen\} aria-controls=\{bodyId\} onClick=\{onToggle\}>\s*\{role\.title\}/);
  assert.match(card, /<div id=\{bodyId\} className="role-card-body" data-open=\{isOpen\} inert=\{inBrowser && !isOpen\}>/);
  assert.match(card, /className="role-card-toggle" data-open=\{isOpen\} aria-hidden="true"/);
  assert.doesNotMatch(card, /role-card-header"\s+onClick/, "no click handler on a div");
  assert.doesNotMatch(readFileSync("src/components/careers/CareersClient.tsx", "utf8"), /role-card-header/);
});

test("the button covers the header, focus outlines the header, the body collapses only under data-js", () => {
  assert.match(css, /\.role-card-header \{\s*position: relative;/);
  assert.match(css, /\.role-card-btn::after \{\s*content: "";\s*position: absolute;\s*inset: 0;/);
  assert.match(css, /\.role-card-header:has\(\.role-card-btn:focus-visible\) \{\s*outline: 2px solid var\(--text-primary\);/);
  assert.match(css, /html\[data-js\] \.role-card-body\[data-open="false"\] \{\s*max-height: 0;/);
  assert.match(css, /html:not\(\[data-js\]\) \.role-card-toggle \{\s*visibility: hidden;/);
  assert.doesNotMatch(css, /\.role-card-body \{[^}]*max-height: 0/, "no collapse without JavaScript");
});
