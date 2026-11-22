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

// Outside the homepage (site audit S-10, 22 Nov 2026): at least 24px at every width (WCAG 2.5.8) and
// 44px at 1080px and below, with the same techniques; a full page screenshot of every touched page at
// 390 and 1440 was pixel identical before and after (the /services cards rotate their projects, so
// there element positions were compared instead).
const below1080 = (s: string) => s.slice(s.lastIndexOf("@media (max-width: 1080px)"));

test("site wide: back links, tags, sources, the contact email, Next and the boxed buttons", () => {
  const globals = css("src/app/globals.css");
  assert.match(globals, /\.cs-back,\s*\.svcd-back \{\s*padding: 3px 0;\s*margin-top: -3px;\s*margin-bottom: -3px;/);
  assert.match(globals, /a\.dtag \{\s*padding: 4px 0;\s*margin: -4px 0;/);
  assert.match(globals, /\.ai-proof-source a,\s*\.contact-email-link \{\s*padding: 6px 0;/, "inline: vertical padding only");
  const phoneGlobals = below1080(globals);
  assert.match(phoneGlobals, /\.cs-back,\s*\.svcd-back \{\s*padding: 12px 0;\s*margin-top: -12px;\s*margin-bottom: -12px;/);
  // Tags wrap into rows: 4px at every width with rows 8px apart, so no tag covers another (axe target-size).
  assert.doesNotMatch(phoneGlobals, /a\.dtag \{/);
  assert.match(globals, /\.dtags:has\(> a\.dtag\) \{\s*row-gap: 8px;/);
  assert.match(phoneGlobals, /\.ai-proof-source a,\s*\.contact-email-link \{\s*padding: 16px 0;/);
  assert.match(phoneGlobals, /\.next-page-anchor \{\s*padding: 2px 0;\s*margin: -2px 0;/);
  // Boxes that show their edges keep them: an invisible layer, never padding. The Initiatives Explore
  // button is left alone: its ::after is the link stretched over the whole row.
  assert.match(phoneGlobals, /\.svc-block-btn:not\(\.init-row-explore\)::after,\s*\.rgd-link::after \{\s*content: "";\s*position: absolute;\s*inset: calc\(50% - 22px\) 0;/);
  assert.match(css("src/components/contact/ContactClient.tsx"), /className="contact-email-link /);
});

test("articles, case studies, /about, the planner link and the Insights filters", () => {
  const article = css("src/components/insights/article.css");
  assert.match(article, /\.art-back,\s*\.art-newsletter-submit \{\s*padding-top: 3px;\s*padding-bottom: 3px;\s*margin-top: -3px;\s*margin-bottom: -3px;/);
  assert.match(below1080(article), /\.share-btn::after \{\s*content: "";\s*position: absolute;\s*inset: calc\(50% - 22px\) 0;/, "the bordered share buttons keep their size");
  assert.match(below1080(article), /\.art-back,\s*\.art-newsletter-submit \{\s*padding-top: 12px;/);
  const cs = css("src/components/casestudy/case-study.css");
  assert.match(cs, /\.cs-plan-similar-link \{\s*padding: 3px 0;\s*\}/);
  assert.match(below1080(cs), /\.cs-plan-similar-link \{\s*padding: 13px 0;/);
  const about = css("src/components/about/about.css");
  assert.match(about, /\.about-careers-link:not\(\.about-initiatives-link\) \{\s*padding: 4px 0;\s*margin: -4px 0;/, "the initiatives link keeps its own 44px");
  assert.match(below1080(about), /\.about-careers-link:not\(\.about-initiatives-link\) \{\s*padding: 14px 0;\s*margin: -14px 0;/);
  const planner = css("src/components/project-planner/planner.css");
  assert.match(planner, /\.pp-link \{\s*padding: 5px 0;\s*\}/);
  assert.match(below1080(planner), /\.pp-link \{\s*padding: 15px 0;/);
  const insights = css("src/components/insights/insights.css");
  assert.match(insights, /\.content-filter \{\s*padding: 5px 6px;\s*margin: -5px -6px;\s*\}\s*\.content-filter::after \{\s*bottom: 1px;\s*left: 6px;\s*right: 6px;\s*width: auto;/, "the underline stays under the words");
  assert.match(below1080(insights), /\.content-filter \{\s*padding: 12px 10px 18px;\s*margin: -12px -10px -18px;\s*\}\s*\.content-filter::after \{\s*bottom: 14px;\s*left: 10px;\s*right: 10px;/);
});
