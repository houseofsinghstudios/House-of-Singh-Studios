// Sanity content mapping: case study page blocks, the case study mappers for /work and
// /work/[slug], and the article cards for "Related thinking". Fixtures follow the GROQ projections in
// src/lib/sanity/projects.ts and src/lib/sanity/articles.ts. fetch is replaced, so nothing leaves the
// process. Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { disciplineLabel } from "@/lib/disciplines";

// The Sanity client needs a project to load (CI sets one); every read below is a stand in.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= "test";
process.env.NEXT_PUBLIC_SANITY_DATASET ||= "test";
const projects = () => import("@/lib/sanity/projects");
const articles = () => import("@/lib/sanity/articles");

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

// Collects console.warn while a mapper runs, so skipped blocks can be checked and kept out of the output.
function warnings<T>(run: () => T): { result: T; lines: string[] } {
  const lines: string[] = [];
  const original = console.warn;
  console.warn = (...args: unknown[]) => { lines.push(args.map(String).join(" ")); };
  try {
    return { result: run(), lines };
  } finally {
    console.warn = original;
  }
}

const HASH = (n: number) => String(n).repeat(40).slice(0, 40);
// A block image as blockImageProjection resolves it: the asset with its natural dimensions.
const blockImage = (n: number, alt?: string, width = 1600, height = 1200) => ({
  ...(alt !== undefined && { alt }),
  asset: { _id: `image-${HASH(n)}-${width}x${height}-jpg`, url: `https://cdn.sanity.io/images/test/test/${HASH(n)}-${width}x${height}.jpg`, metadata: { dimensions: { width, height, aspectRatio: width / height } } },
});
// A featured or gallery image as stored: an asset reference.
const storedImage = (n: number, alt?: string) => ({ _type: "image", ...(alt !== undefined && { alt }), asset: { _type: "reference", _ref: `image-${HASH(n)}-2400x1800-jpg` } });
const text = (...lines: string[]) => lines.map((t, i) => ({ _type: "block", _key: `b${i}`, style: "normal", markDefs: [], children: [{ _type: "span", _key: `s${i}`, marks: [], text: t }] }));

test("mapBlocks: every block type maps in order, with keys, sides, captions and natural image sizes", async () => {
  const { mapBlocks } = await projects();
  const { result: blocks, lines } = warnings(() =>
    mapBlocks(
      [
        { _type: "blockSplit", _key: "a", side: "right", heading: "The system", body: text("One."), image: blockImage(1, "the logo") },
        { _type: "blockOffset", _key: "b", heading: "", body: text("Two."), image: blockImage(2) },
        { _type: "blockFull", _key: "c", caption: "", image: blockImage(3, "Nivora: packaging", 2400, 1000) },
        { _type: "blockPair", _key: "d", images: [blockImage(4), blockImage(5)] },
        { _type: "blockStatement", _key: "e", quote: "  A brand that holds.  ", body: [] },
        { _type: "blockFeature", _key: "f", caption: "Detail", image: blockImage(6), detail: blockImage(7, "the seal") },
      ],
      "nivora",
      "Nivora"
    )
  );
  assert.deepEqual(lines, []);
  assert.deepEqual(blocks.map((b) => `${b.key}:${b.type}`), ["a:split", "b:offset", "c:full", "d:pair", "e:statement", "f:feature"]);
  const [split, offset, full, pair, statement, feature] = blocks as never as Array<Record<string, any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
  assert.equal(split.side, "right");
  assert.equal(split.heading, "The system");
  assert.equal(split.body.length, 1);
  // Alt text names the project; an alt that already starts with it is kept as it is.
  assert.equal(split.image.alt, "Nivora: the logo");
  assert.equal(full.image.alt, "Nivora: packaging");
  assert.equal(offset.image.alt, "Nivora");
  // Natural dimensions, never cropped or enlarged: width 2000 at most, fit max, modern format.
  assert.deepEqual([full.image.width, full.image.height], [2400, 1000]);
  assert.match(full.image.src, /^https:\/\/cdn\.sanity\.io\/images\/test\/test\/3{40}-2400x1000\.jpg\?/);
  for (const param of ["w=2000", "fit=max", "auto=format"]) assert.ok(full.image.src.includes(param), param);
  assert.equal(full.caption, undefined, "an empty caption is left out");
  assert.equal(pair.images.length, 2);
  assert.equal(statement.quote, "A brand that holds.");
  assert.equal(statement.body, undefined, "an empty statement body is left out");
  assert.equal(feature.caption, "Detail");
  assert.equal(feature.detail.alt, "Nivora: the seal");
});

test("mapBlocks: a block that cannot render is skipped with a reason; the rest stay", async () => {
  const { mapBlocks } = await projects();
  const { result: blocks, lines } = warnings(() =>
    mapBlocks(
      [
        { _type: "blockSplit", _key: "no-asset", heading: "x", image: { alt: "x", asset: null } },
        { _type: "blockFull", image: blockImage(1) },
        { _type: "blockPair", _key: "one-image", images: [blockImage(2)] },
        { _type: "blockStatement", _key: "blank", quote: "   " },
        { _type: "blockFeature", _key: "no-detail", image: blockImage(3) },
        { _type: "blockVideo", _key: "unknown" },
        null,
      ],
      "three",
      "THREE"
    )
  );
  assert.deepEqual(blocks.map((b) => `${b.key}:${b.type}`), ["block-1:full"], "a block without a key gets one from its position");
  assert.equal(lines.length, 6);
  for (const line of lines) assert.match(line, /^\[sanity\/projects\] Skipping block .+ on "three": /);
  assert.ok(lines.some((l) => l.includes('unknown block type "blockVideo"')));
  assert.ok(lines.some((l) => l.includes("an image pair needs exactly two images")));
});

test("mapBlocks: no blocks, or not a list, is an empty list", async () => {
  const { mapBlocks } = await projects();
  for (const raw of [undefined, null, "blocks", {}, []]) assert.deepEqual(mapBlocks(raw, "x", "X"), []);
});

const fullCaseStudy = {
  _id: "cs-nivora",
  title: "Nivora",
  slug: "nivora",
  client: "Nivora",
  industry: "Skincare",
  year: 2026,
  overview: "A skincare brand outgrowing its first identity. ".repeat(4).trim(),
  challenge: text("The brand looked different everywhere.", ""),
  approach: text("A system first, then the marks."),
  deliverables: ["Logo System", "Packaging"],
  results: text("Consistent across every touchpoint."),
  featuredImage: storedImage(8, "the packaging line"),
  blocks: [{ _type: "blockFull", _key: "hero", image: blockImage(9) }],
  gallery: [{ _key: "g1", ...storedImage(10, "shelf") }, { _key: "g2", alt: "no asset" }],
  projectType: "parallel",
  serviceCategories: ["brand-identity", "visual-media"],
  disciplines: ["brand-identity", "packaging"],
  workDelivered: ["identity", 42, "packaging"],
  seoTitle: "",
  seoDescription: "",
  publishedAt: "2026-05-01T00:00:00Z",
};
const minimalCaseStudy = { _id: "cs-min", title: "Bare", slug: "bare" };

test("mapSanityToProject: a complete case study becomes its /work entry", async () => {
  const { mapSanityToProject } = await projects();
  const p = mapSanityToProject(fullCaseStudy, 2);
  assert.equal(p.slug, "nivora");
  assert.equal(p.number, "03");
  assert.equal(p.name, "Nivora");
  assert.equal(p.year, "2026");
  assert.equal(p.description, fullCaseStudy.overview);
  assert.equal(p.shortDescription, `${fullCaseStudy.overview.slice(0, 120)}…`, "over 120 characters is cut with an ellipsis");
  assert.equal(p.seoTitle, "Nivora", "an empty SEO title falls back to the title");
  assert.equal(p.seoDescription, fullCaseStudy.overview, "an empty SEO description falls back to the overview");
  assert.match(p.image, /^https:\/\/cdn\.sanity\.io\/images\/test\/test\/8{40}-2400x1800\.jpg\?/);
  for (const param of ["w=1600", "q=80", "auto=format"]) assert.ok(p.image.includes(param), param);
  assert.ok(p.shareImage?.includes("w=1200") && p.shareImage.includes("h=630"), "share image is 1200x630");
  assert.deepEqual(p.sections.business.paragraphs, [fullCaseStudy.overview]);
  assert.deepEqual(p.sections.challenge.paragraphs, ["The brand looked different everywhere."], "empty lines are dropped");
  assert.deepEqual(p.sections.result.paragraphs, ["Consistent across every touchpoint."]);
  assert.deepEqual(p.deliverablesList, ["Logo System", "Packaging"]);
  assert.deepEqual(p.disciplines, ["brand-identity", "packaging"]);
  assert.deepEqual(p.serviceCategories, ["brand-identity", "visual-media"]);
  assert.equal(p.projectType, "parallel");
});

test("mapSanityToProject: missing optional fields give empty values, never undefined text", async () => {
  const { mapSanityToProject } = await projects();
  const p = mapSanityToProject(minimalCaseStudy, 0);
  assert.equal(p.number, "01");
  assert.equal(p.year, "");
  assert.equal(p.description, "");
  assert.equal(p.shortDescription, "");
  assert.equal(p.seoTitle, "Bare");
  assert.equal(p.seoDescription, "");
  assert.equal(p.image, "");
  assert.equal(p.shareImage, undefined);
  for (const section of Object.values(p.sections)) assert.deepEqual(section.paragraphs, []);
  assert.deepEqual(p.deliverablesList, []);
  assert.equal(p.disciplines, undefined);
  assert.equal(p.serviceCategories, undefined);
  assert.equal(p.projectType, "client", "no project type: client work (shown without a label)");
  assert.equal(mapSanityToProject({ ...minimalCaseStudy, projectType: "unknown" }, 0).projectType, "client");
  // A short overview is not cut, and a non string overview is ignored.
  assert.equal(mapSanityToProject({ ...minimalCaseStudy, overview: "Short." }, 0).shortDescription, "Short.");
  assert.equal(mapSanityToProject({ ...minimalCaseStudy, overview: ["not", "text"] }, 0).description, "");
});

test("mapSanityToProjectDetail: the case study page, with gallery, blocks and the next project", async () => {
  const { mapSanityToProjectDetail } = await projects();
  const all = [fullCaseStudy, { ...minimalCaseStudy, title: "Second" }];
  const d = mapSanityToProjectDetail(fullCaseStudy, all);
  assert.equal(d.name, "Nivora");
  assert.equal(d.industry, "Skincare");
  assert.equal(d.summary, fullCaseStudy.overview);
  // The cover's alt names the project and its first discipline.
  assert.equal(d.heroImage.alt, `Nivora, ${disciplineLabel("brand-identity").toLowerCase()}: the packaging line`);
  assert.deepEqual(d.images.set1.map((i) => i.alt), ["Nivora: shelf"], "a gallery image without an asset is dropped");
  assert.deepEqual(d.deliverables, [{ title: "Logo System", description: "" }, { title: "Packaging", description: "" }]);
  assert.deepEqual(d.workDelivered, ["identity", "packaging"], "only text values are kept");
  assert.deepEqual((d.blocks ?? []).map((b) => b.type), ["full"]);
  assert.deepEqual(d.nextProject, { slug: "bare", name: "Second" });
  // The last project's next project is the first one.
  assert.deepEqual(mapSanityToProjectDetail(all[1], all).nextProject, { slug: "nivora", name: "Nivora" });
});

test("mapSanityToProjectDetail: missing optional fields, and a cover standing in for an empty gallery", async () => {
  const { mapSanityToProjectDetail } = await projects();
  const bare = mapSanityToProjectDetail(minimalCaseStudy, [minimalCaseStudy]);
  assert.equal(bare.year, "");
  assert.equal(bare.industry, undefined);
  assert.equal(bare.heroImage.src, "");
  assert.deepEqual(bare.images.set1, [], "no gallery and no cover: no images");
  assert.deepEqual(bare.deliverables, []);
  assert.deepEqual(bare.blocks, []);
  assert.deepEqual(bare.workDelivered, []);
  assert.deepEqual(bare.nextProject, { slug: "bare", name: "Bare" }, "a single project is its own next project");
  const coverOnly = mapSanityToProjectDetail({ ...minimalCaseStudy, featuredImage: storedImage(11) }, [minimalCaseStudy]);
  assert.equal(coverOnly.images.set1.length, 1, "no gallery: the cover stands in");
  assert.equal(coverOnly.images.set1[0].alt, coverOnly.heroImage.alt);
});

// The Sanity client posts its query with fetch; the stand in answers as the API does.
function sanityAnswers(result: unknown, status = 200) {
  const queries: string[] = [];
  globalThis.fetch = (async (url: string) => {
    queries.push(String(url));
    return new Response(JSON.stringify(status === 200 ? { result, ms: 1 } : { error: { description: "down" } }), { status, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  return queries;
}

test("getArticleCards: each published article becomes a card; incomplete ones are dropped", async () => {
  const { getArticleCards } = await articles();
  const queries = sanityAnswers([
    { title: "Brand guidelines", slug: "brand-guidelines-what-to-include", line: "What to include.", readingTime: 7 },
    { title: "No line yet", slug: "no-line", line: null, readingTime: 0 },
    { title: "No slug", slug: null, line: "x", readingTime: 3 },
    { slug: "no-title", line: "x", readingTime: 3 },
    null,
  ]);
  const cards = await getArticleCards();
  assert.equal(queries.length, 1);
  assert.deepEqual(cards, [
    { slug: "brand-guidelines-what-to-include", title: "Brand guidelines", line: "What to include.", readingTime: 7 },
    { slug: "no-line", title: "No line yet", line: "", readingTime: 1 },
  ]);
});

test("getArticleCards: an answer that is not a list is no cards; a failed read is an error, not an empty row", async () => {
  const { getArticleCards } = await articles();
  sanityAnswers(null);
  assert.deepEqual(await getArticleCards(), []);
  sanityAnswers(null, 500);
  const original = console.error;
  console.error = () => {};
  try {
    await assert.rejects(getArticleCards());
  } finally {
    console.error = original;
  }
});
