// The homepage (04) Start: the copy, the call brief's rules and the section's structure.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { DISCOVERY_CALL_MINUTES } from "@/lib/constants/booking";
import { CALL, NEEDS, SERVICE_LABELS, TOLD_QUESTIONS } from "@/lib/project-planner/content";
import { stepCount } from "@/lib/project-planner/engine";
import { SERVICE_IDS } from "@/lib/project-planner/types";
import {
  CHIP_SERVICES,
  FIRST_QUESTION,
  PULSE_HREF,
  QUESTION_TOTAL,
  START_COPY,
  chipAnnouncement,
  countText,
  laterQuestions,
  planHref,
  startedText,
  toggleChip,
} from "@/lib/home-start";

const read = (file: string) => readFileSync(file, "utf8");

test("the copy, exactly as approved; the count and the call length come from the code", () => {
  assert.equal(START_COPY.heading, "Tell us about your business. We come to the call prepared.");
  assert.equal(QUESTION_TOTAL, 5);
  assert.equal(QUESTION_TOTAL, stepCount(["identity"]), "the planner's own question count");
  assert.equal(DISCOVERY_CALL_MINUTES, 30);
  assert.equal(START_COPY.sub, "Five quick questions, then pick a time. A 30 minute call with the studio. No pitch, no obligation.");
  assert.match(read("src/lib/home-start.ts"), /\$\{countWord\(QUESTION_TOTAL\)\} quick questions[^`]*A \$\{DISCOVERY_CALL_MINUTES\} minute call/);
  assert.equal(`${START_COPY.pulseLead} ${START_COPY.pulseLink}. ${START_COPY.pulseTail}`, "Not sure what needs work? Take the Brand Pulse. One minute, free.");
  assert.equal(`${START_COPY.callLead} ${START_COPY.callLink}.`, "Rather skip the questions? Book a discovery call.");
  assert.equal(START_COPY.thenText, "Choose a time for your call.");
  assert.equal(START_COPY.line, CALL.line);
  assert.equal(START_COPY.line, "Your answers go to the studio before the call, so we start with your business.");
});

test("the brief takes its question, every option and the short titles from the planner", () => {
  assert.deepEqual(FIRST_QUESTION, { text: NEEDS.question, help: NEEDS.helper });
  // All of the planner's first question options, in its order and words.
  assert.deepEqual([...CHIP_SERVICES], [...SERVICE_IDS]);
  assert.deepEqual(CHIP_SERVICES.map((id) => SERVICE_LABELS[id]), [
    "Brand identity or rebrand",
    "Website",
    "Photography",
    "Video",
    "Packaging design",
    "Positioning or brand strategy",
    "I need help defining the work",
  ]);
  assert.deepEqual(laterQuestions([]), [
    { number: "02", title: TOLD_QUESTIONS.start },
    { number: "03", title: TOLD_QUESTIONS.goal },
    { number: "04", title: TOLD_QUESTIONS.priorities },
    { number: "05", title: TOLD_QUESTIONS.timing },
  ]);
  // Unsure: the planner skips Priorities, so the brief does too, and the numbers follow.
  assert.deepEqual(laterQuestions(["unsure"]), [
    { number: "02", title: TOLD_QUESTIONS.start },
    { number: "03", title: TOLD_QUESTIONS.goal },
    { number: "04", title: TOLD_QUESTIONS.timing },
  ]);
  const sheet = read("src/components/homepage/start/StartSheet.tsx");
  assert.doesNotMatch(sheet, /"Brand identity"|"Website"|"Starting point"/, "nothing retyped in the component");
});

test("chips: the planner's own rule, up to three, and unsure stands alone", () => {
  // "I need help defining the work" clears the others; another choice clears it.
  assert.deepEqual(toggleChip(["identity", "website"], "unsure"), ["unsure"]);
  assert.deepEqual(toggleChip(["unsure"], "website"), ["website"]);
  assert.deepEqual(toggleChip(["unsure"], "unsure"), []);
  assert.equal(countText(["unsure"]), "1 of 4", "four questions when unsure, as in the planner");
  assert.equal(chipAnnouncement(["identity"], ["unsure"]), "I need help defining the work added. 1 of 4 answered.");

  let s = toggleChip([], "identity");
  s = toggleChip(s, "website");
  assert.deepEqual(s, ["identity", "website"]);
  s = toggleChip(s, "photo");
  assert.deepEqual(toggleChip(s, "video"), ["identity", "website", "photo"], "a fourth does nothing");
  assert.deepEqual(toggleChip(s, "website"), ["identity", "photo"]);
  assert.equal(countText([]), "0 of 5");
  assert.equal(countText(["identity"]), "1 of 5");
  assert.equal(countText(["identity", "website", "photo"]), "1 of 5", "question 01 is one answer");
});

test("the live line says what changed and how many are answered", () => {
  assert.equal(chipAnnouncement(["identity"], ["identity", "website"]), `${SERVICE_LABELS.identity}, Website added. 1 of 5 answered.`);
  assert.equal(chipAnnouncement(["identity", "website"], ["identity"]), "Website removed. 1 of 5 answered.");
  assert.equal(chipAnnouncement(["video"], []), "Video removed. 0 of 5 answered.");
});

test("Plan your project carries the chosen services, in the planner's own ids, and the placement", () => {
  assert.equal(planHref(["identity", "website"]), "/start?service=identity,website&begin=1&from=home_start");
  assert.equal(planHref(["strategy"]), "/start?service=strategy&begin=1&from=home_start");
  assert.equal(planHref(["unsure"]), "/start?service=unsure&begin=1&from=home_start");
  assert.equal(planHref([]), "/start?begin=1&from=home_start");
  assert.equal(PULSE_HREF, "/brand-pulse?from=home_start");
});

test("the started date is the day in Toronto, whatever the visitor's zone", () => {
  assert.equal(startedText(new Date(Date.UTC(2026, 10, 21, 15, 0))), "Started 21 November 2026");
  assert.equal(startedText(new Date(Date.UTC(2026, 10, 22, 3, 0))), "Started 21 November 2026", "still the 21st in Toronto");
  // Written after mount only, so the server HTML never differs from the first browser render.
  assert.match(read("src/components/homepage/start/StartSheet.tsx"), /useSyncExternalStore\(noSubscribe, \(\) => startedText\(new Date\(\)\), \(\) => ""\)/);
});

test("structure: a labelled section, pressed chips, a live line, the links and the events", () => {
  const section = read("src/components/homepage/start/StartSection.tsx");
  assert.match(section, /<section className="hs" aria-labelledby="hs-heading">/);
  assert.match(section, /<EditorialLabel number=\{START_COPY\.number\} text=\{START_COPY\.label\}/);
  assert.equal(`(${START_COPY.number}) ${START_COPY.label}`, "(04) Start");
  assert.match(section, /<IntentLink href=\{PULSE_HREF\} className="hs-door-link"/);
  assert.match(section, /<a href=\{DISCOVERY_CALL_URL\} className="hs-door-link" data-cursor="link" target="_blank" rel="noopener noreferrer">/);
  const sheet = read("src/components/homepage/start/StartSheet.tsx");
  assert.match(sheet, /aria-pressed=\{selected\.includes\(id\)\}/);
  assert.match(sheet, /<p className="sr-only" aria-live="polite">\{live\}<\/p>/);
  assert.match(sheet, /track\("home_start_chip", \{ service: id, selected: next\.includes\(id\) \}\)/);
  assert.match(sheet, /track\("home_start_plan_click", \{ services_count: selected\.length \}\)/);
  assert.deepEqual([...sheet.matchAll(/track\("([a-z_]+)"/g)].map((m) => m[1]), ["home_start_chip", "home_start_plan_click"]);
  // The Selected work choice: page state only, nothing in the address.
  assert.match(sheet, /const sector = useHomeSector\(\);/);
  assert.match(read("src/components/work/index/HomeWorkIndex.tsx"), /useEffect\(\(\) => setHomeSector\(sector\), \[sector\]\);/);
  assert.doesNotMatch(read("src/lib/home-choice.ts"), /sessionStorage|localStorage|history\.|URLSearchParams/);
});

test("the homepage ends with (04) Start; Two ways to start and the dark call to action are gone", () => {
  const page = read("src/app/(site)/(home)/page.tsx");
  assert.match(page, /<ProofSection chapters=\{proofChapters\} \/>\s*<StartSection \/>\s*<\/>/);
  assert.doesNotMatch(page, /ToolBand|CtaSection/);
  for (const gone of ["ToolBand.tsx", "ToolBandSwitch.tsx", "CtaSection.tsx"]) assert.equal(existsSync(`src/components/homepage/${gone}`), false, gone);
  // The band styles the Initiatives and Partners take part bands use, and only those, now beside them.
  assert.equal(existsSync("src/components/homepage/tool-band.css"), false, "moved out of the homepage folder");
  const band = read("src/components/initiatives/take-part-band.css");
  assert.match(band, /--tb-muted: color-mix\(in srgb, var\(--bg\) 65%, transparent\);/, "the label at 65 percent");
  assert.doesNotMatch(band, /\.tb-(columns|col(?![-\w])|tag|visual|pulse|signs?|brief|question|chips?|tabs?|switch)|data-arrival|tb-chip-border/);
  for (const kept of [".tb {", ".tb .tb-label", ".tb-heading", ".tb-col-heading", ".tb-body", ".tb-action", ".tb-button", ".tb-arrow"]) assert.ok(band.includes(kept), kept);
});

test("the look and the motion", () => {
  const css = read("src/components/homepage/start/start.css");
  assert.match(css, /\.hs \{[^}]*padding: 160px var\(--page-px\) 140px;[^}]*background: var\(--text-primary\);/);
  assert.match(css, /\.hs-heading \{[^}]*font-size: 52px;\n {2}line-height: 1\.08;[^}]*letter-spacing: -0\.035em;/);
  assert.match(css, /\.hs-chip \{[^}]*min-height: 44px;[^}]*border: 1px solid var\(--text-muted\);/);
  assert.match(css, /\.hs-chip\[aria-pressed="true"\] \{\n {2}background: var\(--text-primary\);\n {2}border-color: var\(--text-primary\);\n {2}color: var\(--bg\);/);
  assert.match(css, /clip-path: inset\(0 0 100% 0\);\n {2}transition: clip-path 0\.8s cubic-bezier\(0\.77, 0, 0\.175, 1\) 0\.2s;/);
  assert.match(css, /transition-delay: calc\(1s \+ var\(--i, 0\) \* 80ms\);/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("no prices and no dashes in the Start copy", () => {
  for (const line of Object.values(START_COPY)) {
    assert.doesNotMatch(line, /\$|price|cost|fee|\bCAD\b/i, line);
    assert.doesNotMatch(line, /[‐-―]| - /, line);
  }
});
