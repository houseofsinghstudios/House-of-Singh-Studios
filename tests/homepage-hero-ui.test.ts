// The homepage hero as it renders (src/components/homepage/Hero*.tsx): the helpers that decide what
// shows (src/lib/homepage-hero.ts) and the parts of the markup that must not drift: the hidden H1,
// the label, the client component comments, the image sizes and the analytics events. Run with:
// npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  DEFAULT_WORD,
  HOLD_MS,
  heroFieldItems,
  heroFrames,
  heroObjectPosition,
  holdMs,
  wordLabel,
  type HeroEntry,
} from "@/lib/homepage-hero";

const slide = (n: number) => ({ src: `/img-${n}.jpg`, alt: `Image ${n}`, position: "50% 50%" });
const entry = (slug: string, field: string, word: string, images = 1): HeroEntry => ({
  slug,
  heroName: slug,
  heroLine: "",
  heroField: field,
  heroWord: word,
  heroFit: "cover",
  slides: Array.from({ length: images }, (_, i) => slide(i)),
});
const ENTRIES = [entry("tairn", "Home and lifestyle", "home brands", 3), entry("bruno", "Food and drink", "food brands", 2), entry("nivora", "", "", 1)];
const read = (file: string) => readFileSync(file, "utf8");

test("at rest each project's first image, in hero order; a field shows that project's images in order", () => {
  assert.deepEqual(heroFrames(ENTRIES, null), [{ project: 0, image: 0 }, { project: 1, image: 0 }, { project: 2, image: 0 }]);
  assert.deepEqual(heroFrames(ENTRIES, 0), [{ project: 0, image: 0 }, { project: 0, image: 1 }, { project: 0, image: 2 }]);
  assert.deepEqual(heroFrames(ENTRIES, 9), heroFrames(ENTRIES, null), "an unknown field falls back to the rest set");
  assert.deepEqual(heroFrames([], null), []);
});

test("a project without a field or a field word rotates but is left out of the field list", () => {
  assert.deepEqual(heroFieldItems(ENTRIES), [
    { index: 0, field: "Home and lifestyle", word: "home brands" },
    { index: 1, field: "Food and drink", word: "food brands" },
  ]);
  assert.deepEqual(heroFieldItems([entry("a", "Jewellery", "  "), entry("b", " ", "jewellers")]), []);
  assert.equal(heroFrames(ENTRIES, null).length, 3, "nivora still rotates");
});

test("hold: desktop 7s for the first image then 6s; phones 9s then 8s", () => {
  assert.equal(holdMs(true, false), 7000);
  assert.equal(holdMs(false, false), 6000);
  assert.equal(holdMs(true, true), 9000);
  assert.equal(holdMs(false, true), 8000);
  assert.deepEqual(HOLD_MS, { desktop: { first: 7000, rest: 6000 }, phone: { first: 9000, rest: 8000 } });
});

test("the focal point: the hotspot measured inside the crop, centred without one", () => {
  assert.equal(heroObjectPosition({}), "50% 50%");
  assert.equal(heroObjectPosition({ hotspot: { x: 0.7, y: 0.4 } }), "70% 40%");
  // A crop of 10% off the left and 30% off the right leaves 60%: x 0.4 sits half way across it.
  assert.equal(heroObjectPosition({ hotspot: { x: 0.4, y: 0.5 }, crop: { left: 0.1, right: 0.3, top: 0, bottom: 0 } }), "50% 50%");
  assert.equal(heroObjectPosition({ hotspot: { x: 0.05, y: 0.95 }, crop: { left: 0.1, right: 0, top: 0, bottom: 0.1 } }), "0% 100%", "kept inside the frame");
});

test("the word button's name follows the word", () => {
  assert.equal(DEFAULT_WORD, "businesses");
  assert.equal(wordLabel("businesses"), "Growing businesses. Show work by field");
  assert.equal(wordLabel("home brands"), "Growing home brands. Show work by field");
});

test("HeroSection: a server component with the hidden H1 unchanged and the label", () => {
  const src = read("src/components/homepage/HeroSection.tsx");
  assert.doesNotMatch(src, /^"use client"/);
  assert.match(src, /<h1 className="sr-only">\s*House of Singh Studios, Toronto: brand identity, visual design and creative direction\s*<\/h1>/);
  assert.match(src, /<EditorialLabel text="Brand identity studio, Toronto" \/>/);
  assert.match(src, /heroImageUrl\(image\)/, "image URLs from the Sanity image builder, so the Studio crop applies");
  const page = read("src/app/(site)/(home)/page.tsx");
  assert.match(page, /Promise\.all\(\[getHeroProjects\(\), getFeaturedProjects\(\)\]\)/);
  assert.match(page, /export const revalidate = 60;/);
});

test("every hero client component says why it is a client component", () => {
  for (const name of ["HeroInteractive", "HeroImages", "HeroCaption", "HeroLine", "HeroFieldList", "HeroPause"]) {
    const src = read(`src/components/homepage/${name}.tsx`);
    assert.match(src, /^"use client";\n\/\/ A client component: /, name);
    assert.ok(src.split("\n").length < 300, `${name} under 300 lines`);
  }
});

test("images: next/image with the agreed sizes, the first preloaded, alt from Sanity, the View cursor", () => {
  const src = read("src/components/homepage/HeroImages.tsx");
  assert.match(src, /const SIZES = "\(max-width: 1080px\) 100vw, 54vw";/);
  assert.match(src, /preload=\{first\}/);
  assert.match(src, /fetchPriority=\{first \? "high" : "auto"\}/);
  assert.match(src, /loading=\{first \? "eager" : "lazy"\}/);
  assert.match(src, /alt=\{slide\.alt\}/);
  assert.match(src, /aria-label=\{`View the \$\{entry\.heroName\} project`\}/);
  assert.match(src, /data-cursor="view"/);
});

test("the caption carries no Client or Exploration tag", () => {
  const src = read("src/components/homepage/HeroCaption.tsx");
  assert.doesNotMatch(src, /projectType|PROJECT_TYPE_LABELS|Exploration"|Client"/);
});

test("Pause: pressed state and both labels", () => {
  const src = read("src/components/homepage/HeroPause.tsx");
  assert.match(src, /aria-pressed=\{paused\}/);
  assert.match(src, /"Play the project images" : "Pause the project images"/);
});

test("analytics: the four hero events with their parameters", () => {
  const interactive = read("src/components/homepage/HeroInteractive.tsx");
  assert.match(interactive, /trackOnce\("hero_field_preview", entries\[field\]\.heroField, \{ field: entries\[field\]\.heroField \}\)/);
  assert.match(interactive, /track\("hero_project_click", \{ project: slug, source \}\)/);
  assert.match(interactive, /openProject\("image"\)/);
  assert.match(interactive, /openProject\("caption"\)/);
  assert.match(interactive, /openProject\("list"\)/);
  assert.match(read("src/components/homepage/HeroFieldList.tsx"), /track\("hero_unlisted_field_click"\)/);
  assert.match(read("src/components/homepage/HeroPause.tsx"), /track\("hero_pause_toggle", \{ state: paused \? "playing" : "paused" \}\)/);
});

test("the old hero is gone: no HERO constant, no cycling words, no scroll indicator", () => {
  assert.doesNotMatch(read("src/lib/constants/homepage-data.ts"), /export const HERO\b/);
  const css = read("src/components/homepage/homepage.css");
  for (const old of ["hero-cycle", "hero-headline", "scroll-indicator", "scroll-track", "heroHeadingEnter"]) assert.ok(!css.includes(old), old);
});
