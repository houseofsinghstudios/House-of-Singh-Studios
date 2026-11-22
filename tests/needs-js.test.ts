// Without JavaScript nothing visible does nothing (homepage audit H-14, 22 Nov 2026): controls that
// only work with JavaScript carry .needs-js and stay hidden until the inline script sets html[data-js];
// controls that carry content (the What we do rows and words, the Living Index choices) are plain text
// until the page runs in the browser; forms post to their route, which answers with a written page.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { noScriptPost } from "@/lib/no-script-page";

const read = (file: string) => readFileSync(file, "utf8");

test("needs-js: the rule hides them until html[data-js]", () => {
  assert.match(read("src/app/globals.css"), /html:not\(\[data-js\]\) \.needs-js \{\s*display: none !important;/);
  assert.match(read("src/lib/reveal.ts"), /data-js/);
});

test("needs-js: every control that only works with JavaScript carries it", () => {
  const marked: [string, RegExp][] = [
    ["src/components/layout/Header.tsx", /className="header-mobile-hamburger needs-js"/],
    ["src/components/homepage/HeroPause.tsx", /className="hero-pause needs-js"/],
    ["src/components/work/index/WorkChoicePanel.tsx", /className="wi-panel needs-js"/],
    ["src/components/homepage/proof/ProofLight.tsx", /className="proof-index needs-js"/],
    ["src/components/homepage/start/StartSheet.tsx", /className="hs-chips needs-js"/],
    ["src/components/layout/Footer.tsx", /className="ft-top-btn needs-js"/],
    ["src/components/insights/InsightsClient.tsx", /className="content-filter-sticky needs-js"/],
    ["src/components/brand-pulse/PulseIntro.tsx", /className="bp-intro-actions needs-js"/],
    ["src/components/project-planner/PlannerIntro.tsx", /pp-btn needs-js/],
    ["src/components/partners/IntroductionBox.tsx", /className="pt-intro-actions needs-js"/],
    ["src/components/careers/CareersClient.tsx", /className="apply-role-btn needs-js"/],
    ["src/components/ShareButtons.tsx", /className="share-btn needs-js"\s+onClick=\{handleCopy\}/],
  ];
  for (const [file, pattern] of marked) assert.match(read(file), pattern, file);
});

test("needs-js: content-bearing controls are plain text until the page runs in the browser", () => {
  const rows = read("src/components/homepage/what-we-do/WwdRows.tsx");
  assert.match(rows, /\{inBrowser \? \(\s*<button type="button" className="wwd-row-btn"/);
  assert.match(rows, /<span className="wwd-row-btn">/);
  const words = read("src/components/homepage/what-we-do/WwdPhoneWords.tsx");
  assert.match(words, /\{inBrowser \? \(\s*<button/);
  assert.match(words, /<span className="wwd-word">\{d\.name\}<\/span>/);
  const choice = read("src/components/work/index/WorkSentence.tsx");
  assert.match(choice, /inBrowser \? \{ role: "button", tabIndex: 0, "aria-expanded": open, "aria-controls": controls \} : \{\}/);
  assert.doesNotMatch(choice, /^\s*role="button"/m);
  assert.match(read("src/components/work/index/work-index.css"), /html:not\(\[data-js\]\) \.wi-choice-words \{\s*border-bottom: 0;/);
});

test("forms without JavaScript post to their route, never a GET to the page address", () => {
  assert.match(read("src/components/careers/CareersClient.tsx"), /<form ref=\{formRef\} onSubmit=\{handleSubmit\} method="post" action="\/api\/careers"/);
  const article = read("src/components/insights/ArticleNewsletter.tsx");
  assert.match(article, /method="post" action="\/api\/subscribe"/);
  assert.match(article, /name="email"/);
  for (const route of ["src/app/api/careers/route.ts", "src/app/api/subscribe/route.ts"]) {
    assert.match(read(route), /noScriptPost\(request,/, route);
  }
  assert.match(read("src/app/api/lead/route.ts"), /noScriptResponse\(\{ heading: "Your message was not sent\."/);
});

const post = (headers: Record<string, string>) => new Request("https://studios.houseofsingh.com/api/careers", { method: "POST", headers });
const copy = { heading: "Your application was not sent.", backHref: "/careers", backLabel: "the careers page" };

test("noScriptPost: a written 415 page for a plain post from the site, nothing for JSON or a foreign origin", async () => {
  const page = noScriptPost(post({ "content-type": "application/x-www-form-urlencoded", origin: "https://studios.houseofsingh.com" }), copy);
  assert.ok(page);
  assert.equal(page.status, 415);
  assert.match(page.headers.get("content-type") ?? "", /text\/html/);
  const html = await page.text();
  assert.match(html, /<h1>Your application was not sent\.<\/h1>/);
  assert.match(html, /<title>Your application was not sent \| House of Singh Studios<\/title>/);
  assert.match(html, /href="\/careers">the careers page<\/a>/);
  assert.match(html, /noindex/);
  assert.equal(noScriptPost(post({ "content-type": "application/json", origin: "https://studios.houseofsingh.com" }), copy), null);
  assert.equal(noScriptPost(post({ "content-type": "application/x-www-form-urlencoded", origin: "https://example.com" }), copy), null);
});

test("the services and questions accordion: every answer reads without JavaScript (owner approved)", () => {
  const acc = read("src/components/services/ServiceDetailAccordion.tsx");
  assert.match(acc, /inBrowser \? \(\s*<button\s+type="button"\s+className="svc-acc-trigger"/);
  assert.match(acc, /<span className="svc-acc-trigger">\{label\(step\)\}<\/span>/);
  assert.match(acc, /inert=\{inBrowser && !isOpen\}/);
  assert.match(acc, /data-open=\{isOpen\}/);
  assert.match(acc, /inBrowser\s*\?\s*\{ maxHeight:/);
  const css = read("src/app/globals.css");
  assert.match(css, /html\[data-js\] \.svc-acc-panel\[data-open="false"\] \{\s*max-height: 0;\s*opacity: 0;/);
  assert.match(css, /html:not\(\[data-js\]\) \.svc-acc-icon \{\s*visibility: hidden;/);
  // The questions, their order and their structured data are untouched: the FAQ pages still pass
  // the questions accordion headingLevel h3.
  for (const file of ["src/components/services/ServiceQuestions.tsx", "src/components/initiatives/InitiativeQuestions.tsx"]) {
    assert.match(read(file), /<ServiceDetailAccordion steps=\{steps\} initialOpen=\{-1\} headingLevel="h3" variant="questions" \/>/, file);
  }
});
