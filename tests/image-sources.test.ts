// Sanity image sources, site audit Step 3 (S-03, S-08, 23 Nov 2026): every on-page Sanity image asks
// for at least twice its shown width (capped at 2400), never enlarged past the original (fit max), at
// quality 90 (since 28 Nov 2026 the next/image loader replaces the width and quality, so Sanity's CDN
// compresses once; tests/image-loader.test.ts). Insights frames crop at the Studio hotspot.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CASE_IMAGE_WIDTH, insightImagePosition, insightImageUrl } from "@/lib/sanity/image";

const read = (file: string) => readFileSync(file, "utf8");
const IMAGE = { _type: "image", asset: { _ref: "image-1111111111111111111111111111111111111111-1672x941-jpg", _type: "reference" } };
const params = (url: string) => Object.fromEntries(new URL(url).searchParams);

test("Insights presets: featured and hero 2400, card 1200, body 1600, fit max, quality 90, no fixed height", () => {
  const widths = { featured: "2400", hero: "2400", card: "1200", body: "1600" } as const;
  for (const [preset, w] of Object.entries(widths) as [keyof typeof widths, string][]) {
    const p = params(insightImageUrl[preset](IMAGE));
    assert.equal(p.w, w, preset);
    assert.equal(p.fit, "max", preset);
    assert.equal(p.q, "90", preset);
    assert.equal(p.auto, "format", preset);
    assert.equal(p.h, undefined, `${preset} has no fixed height`);
  }
});

test("the case study images: 2400 at most, through the one shared builder", () => {
  assert.equal(CASE_IMAGE_WIDTH, 2400);
  const projects = read("src/lib/sanity/projects.ts");
  assert.match(projects, /return imageSource\(img as SanityImageSource, CASE_IMAGE_WIDTH\);/, "hero, cards and related rows");
  assert.match(projects, /const src = imageSource\(\{ _id: id \}, CASE_IMAGE_WIDTH\);/, "block images");
  assert.doesNotMatch(projects, /urlFor\(/, "no builder of its own");
});

test("no Sanity image builder outside image.ts, and every on-page one is fit max at quality 90", () => {
  const image = read("src/lib/sanity/image.ts");
  assert.match(image, /export function imageSource\(source: SanityImageSource, maxWidth: number\) \{\s*return urlFor\(source\)\.width\(maxWidth\)\.fit\("max"\)\.auto\("format"\)\.quality\(90\)\.url\(\);/);
  // The crops keep their own chain: the share image (1200 by 630) and the square network photos.
  const network = read("src/lib/sanity/network.ts");
  assert.match(network, /\.width\(PHOTO_EDGE\)\.height\(PHOTO_EDGE\)\.fit\("crop"\)\.auto\("format"\)\.quality\(90\)\.url\(\)/);
});

test("Insights frames crop at the Studio hotspot, inside the crop; the centre without one", () => {
  assert.equal(insightImagePosition({}), "50% 50%");
  assert.equal(insightImagePosition({ hotspot: { x: 0.3, y: 0.2 } }), "30% 20%");
  // A crop moves the hotspot into the cropped frame's own coordinates.
  assert.equal(insightImagePosition({ hotspot: { x: 0.5, y: 0.5 }, crop: { top: 0, bottom: 0, left: 0.25, right: 0.25 } }), "50% 50%");
  assert.equal(insightImagePosition({ hotspot: { x: 0.375, y: 0.5 }, crop: { top: 0, bottom: 0, left: 0.25, right: 0.25 } }), "25% 50%");
  // Every Insights image that crops (object-fit cover) carries it.
  const frames: [string, RegExp][] = [
    ["src/components/insights/InsightCards.tsx", /objectFit: "cover", objectPosition: post\.featuredImage\.position/],
    ["src/components/insights/InsightsClient.tsx", /objectFit: "cover", objectPosition: featuredPost\.featuredImage\.position/],
    ["src/components/insights/InsightArticle.tsx", /objectFit: "cover", objectPosition: post\.featuredImage\.position/],
    ["src/components/insights/ArticleBody.tsx", /objectFit: "cover", objectPosition: value\.position/],
    ["src/components/insights/ArticleMore.tsx", /objectFit: "cover", objectPosition: rp\.featuredImage\.position/],
  ];
  for (const [file, rule] of frames) assert.match(read(file), rule, file);
  const article = read("src/app/(site)/insights/[slug]/page.tsx");
  assert.equal((article.match(/position: insightImagePosition\(/g) || []).length, 3, "hero, body images, related posts");
  assert.match(read("src/lib/insights-cards.ts"), /position: insightImagePosition\(featuredImage\)/);
});
