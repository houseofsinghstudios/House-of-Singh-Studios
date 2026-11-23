// Brand Pulse, site audit Step 2 (23 Nov 2026): the result never moves the page after the last answer
// (S-02), the section below the tool with its FAQPage data, and the two services titles.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { GUIDE, PROFILES, VITALS } from "@/lib/brand-pulse/content";
import { QUESTION_ORDER } from "@/lib/brand-pulse/types";
import { services } from "@/data/services";

const read = (file: string) => readFileSync(file, "utf8");

test("the section copy, word for word as approved", () => {
  assert.equal(GUIDE.reads.heading, "What the Brand Pulse Check reads");
  assert.equal(GUIDE.reads.intro, "Seven questions, about a minute. Your answers are scored against five vital signs that decide how a business is seen and chosen.");
  assert.equal(GUIDE.how.heading, "How it works");
  assert.deepEqual(GUIDE.how.steps, [
    "Answer seven questions about your business, your brand and the year ahead.",
    "See a reading for each vital sign and the brand profile that fits you.",
    "Get one clear next step.",
  ]);
  assert.equal(GUIDE.profiles.heading, "The brand profiles");
  assert.equal(GUIDE.questions.heading, "Questions");
  assert.deepEqual(GUIDE.questions.items, [
    { q: "Is the Brand Pulse Check free?", a: "Yes. It is free and takes about a minute." },
    { q: "Who is it for?", a: "Owners and marketing leads of growing businesses who want a quick, plain read on whether their brand is holding them back." },
    { q: "What happens after I get my result?", a: "You see your five vital signs, your brand profile and one next step. If you want to go further, you can book a 30 minute discovery call with the studio." },
    { q: "Can I share my result?", a: "Yes. A shared link carries only your answers, not your personal details." },
  ]);
});

test("the counts come from the questions and the vital signs, not from the copy", () => {
  // If either count changes, the words must follow; these lines fail first.
  assert.equal(QUESTION_ORDER.length, 7);
  assert.equal(VITALS.length, 5);
  const src = read("src/lib/brand-pulse/content.ts");
  assert.match(src, /const QUESTION_WORD = countWord\(QUESTION_ORDER\.length\);/);
  assert.match(src, /const VITALS_WORD = countWord\(VITALS\.length\)\.toLowerCase\(\);/);
  assert.match(src, /book a \$\{DISCOVERY_CALL_MINUTES\} minute discovery call/);
});

test("no hyphens or dashes anywhere in the section's copy", () => {
  const all = JSON.stringify([GUIDE, VITALS.map((v) => [v.label, v.explainer]), Object.values(PROFILES)]);
  assert.doesNotMatch(all, /[-‐-―]/);
});

test("the section shows below the tool only when the page is not a shared result", () => {
  const page = read("src/app/(site)/brand-pulse/page.tsx");
  assert.match(page, /\{!shared && <PulseGuide \/>\}/);
  assert.ok(page.indexOf("<PulseGuide />") > page.indexOf("</section>"), "below the tool's section");
  const guide = read("src/components/brand-pulse/PulseGuide.tsx");
  for (const n of ["01", "02", "03", "04"]) assert.match(guide, new RegExp(`number="${n}"`), `the (${n}) label`);
  assert.match(guide, /VITALS\.map/);
  assert.match(guide, /Object\.values\(PROFILES\)/);
  // FAQPage JSON-LD from the same four questions, inside the section only (FaqSchema in InitiativeQuestions).
  assert.match(guide, /<InitiativeQuestions questions=\{GUIDE\.questions\.items\} \/>/);
  assert.match(read("src/components/initiatives/InitiativeQuestions.tsx"), /<FaqSchema questions=\{questions\} \/>/);
  assert.doesNotMatch(page, /FaqSchema/, "never on the page itself, so a shared result has none");
});

test("S-02: every part of the result is always in the page, staged by a data attribute", () => {
  const view = read("src/components/brand-pulse/PulseResultView.tsx");
  assert.doesNotMatch(view, /stage >= \d &&/, "no part mounts late");
  assert.equal((view.match(/\{\.\.\.staged\(stage >= [0-3]\)\}/g) || []).length, 4, "header, vital signs, paragraphs, services");
  const flow = read("src/components/brand-pulse/BrandPulse.tsx");
  assert.doesNotMatch(flow, /stage >= \d &&/, "the gate and the follow up do not mount late either");
  // The result goes in place on the last click, in the same grid cell as the screen over it.
  assert.match(flow, /setFinal\(\{ \.\.\.answers, \[QUESTION_ORDER\[step\]\]: id \} as Answers\);/);
  assert.match(flow, /className="bp-stack"/);
  const css = read("src/components/brand-pulse/brand-pulse.css");
  assert.match(css, /\.bp-stack > \* \{\s*grid-area: 1 \/ 1;/);
  // Hidden parts are invisible (so Tab skips them) and only opacity and transform move.
  assert.match(css, /\.bp-stage\[data-shown="false"\] \{\s*opacity: 0;\s*transform: translateY\(8px\);\s*visibility: hidden;\s*\}/);
});

test("S-02: a part not yet shown is inert", () => {
  // Read from the source: importing the component pulls in the view transition Link, which needs a browser.
  const view = read("src/components/brand-pulse/PulseResultView.tsx");
  assert.match(view, /export function staged\(shown: boolean\) \{\s*return \{ "data-shown": shown \? "true" : "false", inert: !shown \} as const;\s*\}/);
});

test("the services titles: exact and 59 characters", () => {
  const page = read("src/app/(site)/services/page.tsx");
  const overview = "Branding & Design Services Toronto | House of Singh Studios";
  assert.equal(overview.length, 59);
  assert.ok(page.includes(`title: { absolute: '${overview}' }`), "the page title");
  assert.ok(page.includes(`title: '${overview}',`), "the openGraph title");
  const identity = services.find((s) => s.slug === "brand-identity")!.seoTitle;
  assert.equal(identity, "Branding & Brand Identity, Toronto | House of Singh Studios");
  assert.equal(identity.length, 59);
});
