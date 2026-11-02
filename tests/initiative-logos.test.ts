// Initiative logos: read from Sanity documents, shown in the programme rows and the program hero only
// when set, and the share image switched to the logo image only when set. Without a logo the rows,
// hero and metadata are exactly as before; every heading's text is the same either way.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import Module from "node:module";
import { isValidElement, type ReactNode } from "react";
import { initiativeLogo, toInitiative, toInitiativeLogo, type Initiative } from "@/lib/initiatives/types";
import { initiativeShareImage } from "@/lib/initiatives/share";
import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";
import { fitLogo } from "@/lib/og/share-image";
import { LOGO_HEIGHTS, logoSizes } from "@/lib/initiatives/logo-scale";
import fs from "node:fs";
import path from "node:path";

// The components import their stylesheets; outside Next those imports load as nothing. The tests
// run as CommonJS, so the components are required after the stylesheet loader is in place.
// next/image and the transition Link are client components that cannot load under the server
// conditions the tests run with; plain stand ins named Image and Link record their props instead.
(Module as unknown as { _extensions: Record<string, () => void> })._extensions[".css"] = () => {};
function stub(id: string, exports: Record<string, unknown>) {
  const file = require.resolve(id);
  const mod = new Module(file);
  Object.assign(mod, { filename: file, loaded: true, exports: { __esModule: true, ...exports } });
  require.cache[file] = mod;
}
stub("next/image", { default: function Image() { return null; } });
stub("next-view-transitions", { Link: function Link() { return null; } });
/* eslint-disable @typescript-eslint/no-require-imports */
const ProgrammeRows: typeof import("@/components/initiatives/ProgrammeRows").default = require("@/components/initiatives/ProgrammeRows").default;
const InitiativeHero: typeof import("@/components/initiatives/InitiativeHero").default = require("@/components/initiatives/InitiativeHero").default;
/* eslint-enable @typescript-eslint/no-require-imports */

const SVG_URL = "https://cdn.sanity.io/images/00iree4d/production/abc123def456-800x200.svg";
const PNG_URL = "https://cdn.sanity.io/images/00iree4d/production/fed654cba321-1600x400.png";

const doc = (extra: Record<string, unknown> = {}) => ({
  name: "Parallel",
  slug: "parallel",
  category: "Brands reimagined",
  tagline: "One brand. Another possibility.",
  summary: "Two sentences.",
  status: "live",
  order: 1,
  hasPage: true,
  ...extra,
});
const logoDoc = (url: string, extension: string, alt = "Parallel wordmark") => ({ url, alt, width: 800, height: 200, extension });

const withoutLogo = toInitiative(doc()) as Initiative;
const withLogo = toInitiative(doc({ logo: logoDoc(SVG_URL, "svg") })) as Initiative;

// The rendered tree as text: our own components are expanded, anything else (Link, Image) is listed
// by name with its props, so a change anywhere in the output shows up.
const OWN = new Set(["RowBody", "Name", "Visual", "Glance", "InitiativeLogo"]);
function tree(node: ReactNode): string {
  if (Array.isArray(node)) return node.map(tree).join("");
  if (!isValidElement<Record<string, unknown>>(node)) return node === null || node === undefined || node === false ? "" : String(node);
  const type = node.type as string | ((p: unknown) => ReactNode) | { displayName?: string; name?: string };
  if (typeof type === "function" && OWN.has(type.name)) return tree(type(node.props));
  const name = typeof type === "string" ? type : (type as { displayName?: string; name?: string }).displayName || (type as { name?: string }).name || "Component";
  const { children, ...props } = node.props;
  const attrs = Object.entries(props)
    .filter(([, v]) => typeof v !== "function")
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join(" ");
  return `<${name}${attrs ? " " + attrs : ""}>${tree(children as ReactNode)}</${name}>`;
}

const rows = (initiative: Initiative) => tree(ProgrammeRows({ rows: [{ initiative, linked: true, newest: null }] }));
const hero = (logo?: Initiative["logo"]) =>
  tree(InitiativeHero({ heading: "One brand. Another possibility.", intro: "Intro.", programme: "Parallel", logo }));

test("a logo with a URL, alt text and size is read; SVG files are marked as SVG", () => {
  assert.deepEqual(withLogo.logo, { url: SVG_URL, alt: "Parallel wordmark", width: 800, height: 200, svg: true });
  assert.equal(toInitiativeLogo(logoDoc(PNG_URL, "png"))?.svg, false);
});

test("without a logo, or with an incomplete one, the initiative has no logo keys at all", () => {
  assert.equal("logo" in withoutLogo, false);
  assert.equal("logoOnDark" in withoutLogo, false);
  assert.deepEqual(toInitiative(doc({ logo: null, logoOnDark: null })), withoutLogo);
  assert.deepEqual(toInitiative(doc({ logo: { ...logoDoc(SVG_URL, "svg"), alt: "" } })), withoutLogo);
  assert.deepEqual(toInitiative(doc({ logo: { alt: "Parallel wordmark" } })), withoutLogo);
});

test("on dark backgrounds the dark logo is used when set, otherwise the logo", () => {
  const dark = toInitiative(doc({ logo: logoDoc(SVG_URL, "svg"), logoOnDark: logoDoc(PNG_URL, "png", "Parallel wordmark, light") })) as Initiative;
  assert.equal(initiativeLogo(dark, "dark")?.url, PNG_URL);
  assert.equal(initiativeLogo(dark, "light")?.url, SVG_URL);
  assert.equal(initiativeLogo(withLogo, "dark")?.url, SVG_URL);
  assert.equal(initiativeLogo(withoutLogo, "dark"), undefined);
});

test("programme row without a logo: the visible h3 name, no image", () => {
  const html = rows(withoutLogo);
  assert.match(html, /<h3 className="svc-block-name">Parallel<\/h3>/);
  assert.doesNotMatch(html, /init-row-logo|init-logo-img/);
  // The same output as an initiative read from a document whose logo fields are empty.
  assert.equal(rows(toInitiative(doc({ logo: null, logoOnDark: null })) as Initiative), html);
});

test("programme row with a logo: decorative logo in place of the name, the same h3 text visually hidden", () => {
  const html = rows(withLogo);
  assert.match(html, /<div className="svc-block-name init-row-logo"><Image src="[^"]+abc123def456-800x200\.svg" alt="" width=800 height=200 [^>]*unoptimized=true/);
  assert.match(html, /<h3 className="sr-only">Parallel<\/h3>/);
  assert.equal((html.match(/<h3/g) || []).length, 1);
  // Everything else in the row is unchanged.
  const strip = (s: string) =>
    s.replace(/<div className="svc-block-name init-row-logo">.*?<h3 className="sr-only">(.*?)<\/h3><\/div>/, '<h3 className="svc-block-name">$1</h3>');
  assert.equal(strip(html), rows(withoutLogo));
});

test("a PNG logo goes through the image optimizer", () => {
  const png = toInitiative(doc({ logo: logoDoc(PNG_URL, "png") })) as Initiative;
  assert.match(rows(png), /<Image src="[^"]+\.png" alt="" [^>]*unoptimized=false/);
});

test("program hero: the decorative logo sits above the unchanged H1 only when set", () => {
  const plain = hero();
  assert.doesNotMatch(plain, /init-hero-logo/);
  const shown = hero(withLogo.logo);
  // Empty alt: the breadcrumb label names the programme, so the logo adds nothing to read.
  assert.match(shown, /<div className="init-hero-logo svc-hero-stagger"><Image src="[^"]+\.svg" alt=""/);
  assert.doesNotMatch(shown, /Parallel wordmark/);
  const h1 = (s: string) => s.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1];
  assert.equal(h1(shown), "One brand. Another possibility.");
  assert.equal(h1(shown), h1(plain));
  assert.ok(shown.indexOf("init-hero-logo") < shown.indexOf("<h1"));
  assert.equal(shown.replace(/<div className="init-hero-logo svc-hero-stagger">.*?<\/div>/, ""), plain);
});

test("share image: the default without a logo, the versioned logo image with one", () => {
  assert.equal(initiativeShareImage(withoutLogo), DEFAULT_SHARE_IMAGE);
  const image = initiativeShareImage(withLogo);
  assert.equal(image.url, "/initiatives/parallel/share-image?v=abc123def456");
  assert.equal(image.width, 1200);
  assert.equal(image.height, 630);
  assert.equal(image.alt, "Parallel, an initiative by House of Singh Studios.");
});

test("the share image fits the logo in its box and keeps its proportions", () => {
  assert.deepEqual(fitLogo(800, 200), { width: 560, height: 140 });
  assert.deepEqual(fitLogo(200, 200), { width: 180, height: 180 });
  assert.deepEqual(fitLogo(3000, 300), { width: 560, height: 56 });
});

// The live logos' proportions: Parallel 1600 by 401, Commons 1600 by 334 (PNG).
const PARALLEL_PNG = { width: 1600, height: 401 };
const COMMONS_PNG = { width: 1600, height: 334 };

test("logo sizes: the drawn width at each breakpoint, from the height and the logo's proportions", () => {
  assert.equal(logoSizes(PARALLEL_PNG, "hero"), "(min-width: 1024px) 256px, (min-width: 768px) 208px, 160px");
  assert.equal(logoSizes(COMMONS_PNG, "hero"), "(min-width: 1024px) 307px, (min-width: 768px) 250px, 192px");
  assert.equal(logoSizes(PARALLEL_PNG, "row"), "(min-width: 1024px) 176px, (min-width: 768px) 152px, 128px");
  assert.equal(logoSizes(COMMONS_PNG, "row"), "(min-width: 1024px) 211px, (min-width: 768px) 183px, 154px");
});

test("logo sizes: at 2x a PNG is requested at least twice as wide as drawn", () => {
  // next/image candidates (the default image and device sizes); the browser takes the first at or
  // above sizes x pixel ratio.
  const candidates = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  for (const logo of [PARALLEL_PNG, COMMONS_PNG]) {
    for (const place of ["hero", "row"] as const) {
      // The drawn widths: each "NNNpx" that ends an entry (the breakpoints end in "px)").
      const widths = [...logoSizes(logo, place).matchAll(/(\d+)px(?=,|$)/g)].map((m) => Number(m[1]));
      assert.equal(widths.length, 3);
      for (const width of widths) {
        const picked = candidates.find((c) => c >= width * 2);
        assert.ok(picked !== undefined && picked >= width * 2, `${place} ${width}px drawn picks ${picked}`);
      }
    }
  }
});

test("the logo heights in the CSS match the scale", () => {
  const css = fs.readFileSync(path.join(process.cwd(), "src/components/initiatives/initiatives.css"), "utf8");
  const block = css.slice(css.indexOf("/* ── Initiative logos"), css.indexOf("/* ── Hero: intro left"));
  const heights = (selector: string) => [...block.matchAll(new RegExp(`\\${selector} \\.init-logo-img \\{[^}]*?height: (\\d+)px`, "g"))].map((m) => Number(m[1]));
  assert.deepEqual(heights(".init-hero-logo"), [LOGO_HEIGHTS.hero.base, LOGO_HEIGHTS.hero.md, LOGO_HEIGHTS.hero.lg]);
  assert.deepEqual(heights(".init-row-logo"), [LOGO_HEIGHTS.row.base, LOGO_HEIGHTS.row.md, LOGO_HEIGHTS.row.lg]);
});
