// Phone tap areas of at least 44px (homepage audit H-08, 22 Nov 2026): padding taken back by an equal
// negative margin, so nothing moves (a full page screenshot at 390 was pixel identical before and
// after); underlines and bands keep their place under the words. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = (f: string) => readFileSync(f, "utf8");
const phone = (s: string) => s.slice(s.indexOf("@media (max-width: 1080px)"));

test("block links: padding and an equal negative margin, underline moved back under the words", () => {
  const hero = phone(css("src/components/homepage/hero.css"));
  assert.match(hero, /\.hero-caption-link \{[^}]*margin-top: -12px;\s*margin-bottom: -12px;\s*padding: 12px 0;/);
  assert.match(hero, /\.hero-caption-link::after \{\s*bottom: 10px;/, "was -2px below a 0 padding box");
  const home = phone(css("src/components/work/index/home-work.css"));
  assert.match(home, /\.hw-all \{\s*margin: -12px 0;\s*padding: 12px 0;/);
  assert.match(home, /\.hw-all::after \{\s*bottom: 9px;/, "was -3px");
  const wwd = phone(css("src/components/homepage/what-we-do/wwd.css"));
  assert.match(wwd, /\.wwd-panel-phone \.wwd-detail \{\s*margin-top: 14px;\s*margin-bottom: -10px;\s*padding: 10px 0;/, "24px gap less 10px");
  assert.match(wwd, /\.wwd-panel-phone \.wwd-detail::after \{\s*bottom: 10px;/);
  assert.match(wwd, /\.wwd-word-btn \{\s*min-height: 32px;\s*margin: -6px 0;\s*padding: 6px 0;/);
  assert.match(wwd, /\.wwd-word-btn::before \{\s*top: calc\(0\.14em \+ 6px\);/, "the band stays on the word");
  const globals = css("src/app/globals.css");
  assert.match(globals, /\.ft-legal-link \{[^}]*padding: 14px 6px;\s*margin: -14px -6px;/, "17px tall and Terms 32px wide");
  assert.doesNotMatch(css("src/components/consent/consent.css"), /\.ft-legal-button \{[^}]*padding: 0;/, "the Privacy choices button takes the same tap area");
  assert.match(globals, /\.header-wordmark \{\s*margin-right: 16px;[^}]*padding: 14px 0;\s*margin-top: -14px;\s*margin-bottom: -14px;/);
});

test("inline links get vertical padding only, which never moves a line; Pause gets an invisible layer", () => {
  assert.match(phone(css("src/components/work/index/home-work.css")), /\.wi-index--home \.wi-name-link \{\s*padding: 5px 0;/);
  assert.match(phone(css("src/components/homepage/start/start.css")), /\.hs-door-link \{\s*padding: 2px 0;/);
  assert.match(phone(css("src/components/homepage/hero.css")), /\.hero-pause::before \{\s*content: "";\s*position: absolute;\s*inset: -7px;/, "32px square, 46px to the finger");
});
