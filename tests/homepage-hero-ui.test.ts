// The homepage hero as it renders (src/components/homepage/Hero*.tsx): the word that follows the image
// and the one clock (src/lib/homepage-hero.ts), and the parts of the markup that must not drift: the hidden H1, the
// label, the client component comments, the images and the analytics events. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { DEFAULT_WORD, IMAGE_HOLD_MS, heroObjectPosition, heroWordFor } from "@/lib/homepage-hero";

const read = (file: string) => readFileSync(file, "utf8");

const PROJECTS = [{ heroWord: "cafés" }, { heroWord: "home brands" }, { heroWord: "  " }, { heroWord: "jewellers" }];

test("the word follows the image: businesses for the first image on the first pass, then each project's word", () => {
  assert.equal(DEFAULT_WORD, "businesses");
  assert.equal(heroWordFor(PROJECTS, 0, false), "businesses", "first image, first pass");
  assert.equal(heroWordFor(PROJECTS, 1, false), "home brands");
  assert.equal(heroWordFor(PROJECTS, 3, false), "jewellers");
  assert.equal(heroWordFor(PROJECTS, 0, true), "cafés", "once looped, the first project shows its own word");
  assert.equal(heroWordFor(PROJECTS, 1, true), "home brands");
});

test("a project without a field word shows businesses for its turn", () => {
  assert.equal(heroWordFor(PROJECTS, 2, false), "businesses");
  assert.equal(heroWordFor(PROJECTS, 2, true), "businesses");
  assert.equal(heroWordFor([{ heroWord: "" }], 0, true), "businesses");
  assert.equal(heroWordFor([], 4, true), "businesses", "nothing there");
});

test("one clock: each image holds 5s, the first included; the word has no clock of its own", () => {
  assert.equal(IMAGE_HOLD_MS, 5000);
  const interactive = read("src/components/homepage/HeroInteractive.tsx");
  assert.doesNotMatch(interactive, /useWordClock|setTimeout|setInterval|imageWait/);
  assert.match(interactive, /heroWordFor\(entries, index, rotation\.looped\)/);
});

test("the focal point: the hotspot measured inside the crop, centred without one", () => {
  assert.equal(heroObjectPosition({}), "50% 50%");
  assert.equal(heroObjectPosition({ hotspot: { x: 0.7, y: 0.4 } }), "70% 40%");
  // A crop of 10% off the left and 30% off the right leaves 60%: x 0.4 sits half way across it.
  assert.equal(heroObjectPosition({ hotspot: { x: 0.4, y: 0.5 }, crop: { left: 0.1, right: 0.3, top: 0, bottom: 0 } }), "50% 50%");
  assert.equal(heroObjectPosition({ hotspot: { x: 0.05, y: 0.95 }, crop: { left: 0.1, right: 0, top: 0, bottom: 0.1 } }), "0% 100%", "kept inside the frame");
});

test("HeroSection: a server component with the hidden H1 unchanged, the label, one image per project", () => {
  const src = read("src/components/homepage/HeroSection.tsx");
  assert.doesNotMatch(src, /^"use client"/);
  assert.match(src, /<h1 className="sr-only">\s*House of Singh Studios, Toronto: brand identity, visual design and creative direction\s*<\/h1>/);
  assert.match(src, /<EditorialLabel text="Brand identity studio, Toronto" \/>/);
  assert.match(src, /const image = project\.heroImages\[0\];/);
  assert.match(src, /heroImageUrl\(image\)/, "image URLs from the Sanity image builder, so the Studio crop applies");
  assert.match(src, /heroWord: project\.heroWord,/, "the word for each project's turn");
  assert.doesNotMatch(src, /heroField/, "the homepage does not read the field");
  const page = read("src/app/(site)/(home)/page.tsx");
  assert.match(page, /Promise\.all\(\[getHeroProjects\(\), getIndexProjects\(\), getWhatWeDoWork\(\)\]\)/);
  assert.match(page, /export const revalidate = 60;/);
});

test("every hero client component says why it is a client component", () => {
  for (const name of ["HeroInteractive", "HeroImages", "HeroCaption", "HeroLine", "HeroPause"]) {
    const src = read(`src/components/homepage/${name}.tsx`);
    assert.match(src, /^"use client";\n\/\/ A client component: /, name);
    assert.ok(src.split("\n").length < 300, `${name} under 300 lines`);
  }
});

test("the value line: nothing interactive, hidden from screen readers, read once from a hidden sentence", () => {
  const src = read("src/components/homepage/HeroLine.tsx");
  assert.match(src, /<p ref=\{ref\} className="hero-value" aria-hidden="true">/);
  assert.match(src, /<p className="sr-only">\{`\$\{LEAD\.join\(" "\)\} \$\{DEFAULT_WORD\}\.`\}<\/p>/);
  assert.doesNotMatch(src, /<button|<a |href=|aria-live|onClick/);
  assert.match(src, /<span className="hero-band" aria-hidden="true" \/>/);
});

test("images: next/image with the agreed sizes and quality, the first preloaded, the View cursor", () => {
  const src = read("src/components/homepage/HeroImages.tsx");
  assert.match(src, /const SIZES = "\(max-width: 1080px\) 100vw, 54vw";/);
  assert.match(src, /quality=\{60\}/);
  assert.match(src, /preload=\{first\}/);
  assert.match(src, /fetchPriority=\{first \? "high" : "auto"\}/);
  assert.match(src, /loading=\{first \? "eager" : "lazy"\}/);
  assert.match(src, /alt=\{image\.alt\}/);
  assert.match(src, /href=\{`\/work\/\$\{entry\.slug\}`\}/);
  assert.match(src, /aria-label=\{`View the \$\{entry\.heroName\} project`\}/);
  assert.match(src, /data-cursor="view"/);
  assert.match(read("src/lib/sanity/image.ts"), /width\(2400\)\.fit\("max"\)\.auto\("format"\)\.quality\(90\)/);
});

test("image settings: AVIF and WebP; qualities 60 for the hero and 75, every other image\x27s", () => {
  const config = read("next.config.ts");
  assert.match(config, /formats: \["image\/avif", "image\/webp"\],/);
  assert.match(config, /qualities: \[60, 75\],/);
  // No other next/image sets a quality, so every other image stays at the default 75.
  const uses = execSync("grep -rln 'quality={' src || true", { encoding: "utf8" }).trim().split("\n").filter(Boolean);
  assert.deepEqual(uses, ["src/components/homepage/HeroImages.tsx"]);
});

test("the caption carries no Client or Exploration tag", () => {
  const src = read("src/components/homepage/HeroCaption.tsx");
  assert.doesNotMatch(src, /projectType|PROJECT_TYPE_LABELS|Exploration"|Client"/);
});

test("Pause: pressed state and both labels; it holds the image, and the word with it", () => {
  assert.match(read("src/components/homepage/HeroPause.tsx"), /aria-pressed=\{paused\}/);
  assert.match(read("src/components/homepage/HeroPause.tsx"), /"Play the animation" : "Pause the animation"/);
  const interactive = read("src/components/homepage/HeroInteractive.tsx");
  assert.match(interactive, /halted=\{paused \|\| hold\.held\}/);
  assert.match(interactive, /const word = moving \? heroWordFor/);
});

test("analytics: hero_project_click from the image or the caption, and hero_pause_toggle", () => {
  const interactive = read("src/components/homepage/HeroInteractive.tsx");
  assert.match(interactive, /track\("hero_project_click", \{ project: slug, source \}\)/);
  assert.match(interactive, /openProject\("image"\)/);
  assert.match(interactive, /openProject\("caption"\)/);
  assert.match(read("src/components/homepage/HeroPause.tsx"), /track\("hero_pause_toggle", \{ state: paused \? "playing" : "paused" \}\)/);
  for (const file of ["HeroInteractive", "HeroImages", "HeroCaption", "HeroLine", "HeroPause"]) {
    assert.doesNotMatch(read(`src/components/homepage/${file}.tsx`), /hero_field_preview|hero_unlisted_field_click/, file);
  }
});

test("the old hero and the field list are gone", () => {
  assert.doesNotMatch(read("src/lib/constants/homepage-data.ts"), /export const HERO\b/);
  // homepage.css itself went with the Testimonials carousel (tests/proof.test.ts).
  assert.equal(existsSync("src/components/homepage/homepage.css"), false);
  const hero = read("src/components/homepage/hero.css");
  for (const old of ["hero-fields", "hero-field", "hero-pick", "hero-word-button", "hero-plus", "aria-expanded"]) assert.ok(!hero.includes(old), old);
});

test("hero.css: every grid-area a part asks for exists in each layout (desktop and 1080px and below)", () => {
  const css = read("src/components/homepage/hero.css");
  const used = new Set([...css.matchAll(/grid-area:\s*([\w-]+)/g)].map((m) => m[1]));
  const templates = [...css.matchAll(/grid-template-areas:([\s\S]*?);/g)].map((m) => new Set(m[1].replace(/"/g, " ").trim().split(/\s+/)));
  assert.equal(templates.length, 2, "one template for each layout");
  for (const template of templates) for (const area of used) assert.ok(template.has(area), `${area} is in ${[...template].join(" ")}`);
});

test("Selected work never competes with the hero image: nothing priority, the window waits for intent", () => {
  for (const file of ["src/components/homepage/SelectedWorkSection.tsx", "src/components/work/index/HomeWorkIndex.tsx", "src/components/work/index/WorkRows.tsx", "src/components/work/index/WorkChoicePanel.tsx", "src/components/work/index/WorkWindow.tsx"]) {
    const src = read(file).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    assert.doesNotMatch(src, /\bpriority\b|fetchPriority|<link[^>]+preload/, file);
  }
  // The window's image (loading eager on /work) only renders once armed; the homepage arms it on intent.
  assert.match(read("src/components/work/index/WorkWindow.tsx"), /\{shown && armed && \(/);
  assert.match(read("src/components/work/index/HomeWorkIndex.tsx"), /armed=\{armed\}/);
});
