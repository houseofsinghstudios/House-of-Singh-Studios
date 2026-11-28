// Sanity images come from Sanity's image CDN through the next/image loader, never from Vercel's
// /_next/image, whose Hobby allowance ran out on 28 Nov 2026 (every image it had not cached answered 402).
// Share images, the JSON-LD and llms.txt never go through next/image, so their addresses are unchanged.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import loader, { DEFAULT_QUALITY } from "@/lib/sanity/image-loader";

const read = (file: string) => readFileSync(file, "utf8");
const ASSET = "https://cdn.sanity.io/images/00iree4d/production/424e5b5ba7b333ff23c1e6e28237668f0427b11f-1448x1086.jpg";
const params = (u: string) => Object.fromEntries(new URL(u).searchParams);
// Every source file under src.
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(join(dir, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [join(dir, e.name)] : []));
const matching = (re: RegExp) => files("src").filter((f) => re.test(read(f)));

test("next.config.ts hands every next/image to the loader", () => {
  const config = read("next.config.ts");
  assert.match(config, /loader: "custom",\s*loaderFile: "\.\/src\/lib\/sanity\/image-loader\.ts",/);
  assert.doesNotMatch(config, /remotePatterns|formats:/, "nothing left for the Vercel optimizer");
});

test("a Sanity image keeps its crop, fit and format; the width and quality are next/image's", () => {
  const src = `${ASSET}?rect=10,20,1200,900&w=2400&q=90&fit=max&auto=format`;
  const out = params(loader({ src, width: 828, quality: 75 }));
  assert.deepEqual(out, { rect: "10,20,1200,900", w: "828", q: "75", fit: "max", auto: "format" });
  assert.equal(params(loader({ src, width: 1080, quality: 60 })).q, "60", "the hero");
  assert.equal(params(loader({ src, width: 640 })).q, String(DEFAULT_QUALITY), "the default is 75");
  assert.equal(DEFAULT_QUALITY, 75);
});

test("never wider than the builder's cap", () => {
  const out = params(loader({ src: `${ASSET}?w=2400&q=90&fit=max&auto=format`, width: 3840, quality: 75 }));
  assert.equal(out.w, "2400");
});

test("a fixed height scales with the width (the square network photos)", () => {
  const out = params(loader({ src: `${ASSET}?rect=0,0,1086,1086&w=800&h=800&q=90&fit=crop&auto=format`, width: 384, quality: 75 }));
  assert.deepEqual([out.w, out.h, out.fit, out.rect], ["384", "384", "crop", "0,0,1086,1086"]);
});

test("a bare asset address (raw About images, logos) gets fit max and automatic format", () => {
  const out = params(loader({ src: ASSET, width: 750, quality: 75 }));
  assert.deepEqual(out, { w: "750", q: "75", fit: "max", auto: "format" });
});

test("local files and other hosts are returned exactly as given", () => {
  for (const src of ["/images/studio/studio.jpg", "/hos-studios-logo.svg", "https://example.com/a.jpg", "https://cdn.sanity.io/files/00iree4d/production/a.pdf"]) {
    assert.equal(loader({ src, width: 1080, quality: 75 }), src);
  }
});

test("the loader runs in the browser: it imports nothing", () => {
  assert.doesNotMatch(read("src/lib/sanity/image-loader.ts"), /^import /m);
});

test("no source file builds a /_next/image address", () => {
  // An address in code is a string that starts with it; comments may name the old route.
  assert.deepEqual(matching(/["'`]\/_next\/image/), []);
});

test("share images, JSON-LD and llms.txt never pass through next/image or the loader", () => {
  // They are plain addresses in metadata and structured data, built by the Sanity builder alone.
  assert.deepEqual(matching(/from ["'][^"']*image-loader["']/), [], "nothing imports the loader; only next.config.ts names it");
  for (const f of ["src/lib/llms.ts", "src/lib/schema.ts", "src/lib/site-graph.ts"]) assert.doesNotMatch(read(f), /next\/image/, f);
  assert.match(read("src/lib/sanity/image.ts"), /export function shareImageUrl[\s\S]*?\.width\(1200\)\.height\(630\)\.fit\("crop"\)\.auto\("format"\)\.quality\(80\)\.url\(\);/);
});
