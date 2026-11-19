// The Insights archive pages and their edges: the /insights/page and /insights/page/1 redirects, the
// 404 past the last page, the hidden h2 that keeps headings in order, the "Load more" click rule and
// the reserved post slug. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import Module from "node:module";
import { readFileSync } from "node:fs";
import { isValidElement, type ReactNode } from "react";
import nextConfig from "../next.config";
import { POSTS_PER_PAGE, archivePageNumber, isPlainLeftClick, reservedPostSlugMessage } from "@/lib/insights-listing";

// The archive page renders cards with client components that cannot load under the server
// conditions the tests run with, and reads Sanity through getInsightCards: stand ins replace them.
(Module as unknown as { _extensions: Record<string, () => void> })._extensions[".css"] = () => {};
function stub(id: string, exports: Record<string, unknown>) {
  const file = require.resolve(id);
  const mod = new Module(file);
  Object.assign(mod, { filename: file, loaded: true, exports: { __esModule: true, ...exports } });
  require.cache[file] = mod;
}
let postCount = 0;
const card = (i: number) => ({ _id: `p${i}`, title: `Post ${i}`, slug: { current: `post-${i}` }, publishedAt: "2026-11-01T00:00:00Z" });
// next/navigation: the server build Next itself uses when it renders a page (the package's default
// entry is the browser build, which needs React's client APIs).
/* eslint-disable @typescript-eslint/no-require-imports */
stub("next/navigation", require("next/dist/client/components/navigation.react-server"));
/* eslint-enable @typescript-eslint/no-require-imports */
stub("next/image", { default: function Image() { return null; } });
stub("next-view-transitions", { Link: function Link() { return null; } });
stub("@/lib/insights-cards", { getInsightCards: async () => Array.from({ length: postCount }, (_, i) => card(i)) });
/* eslint-disable @typescript-eslint/no-require-imports */
const ArchivePage: typeof import("@/app/(site)/insights/page/[page]/page").default = require("@/app/(site)/insights/page/[page]/page").default;
/* eslint-enable @typescript-eslint/no-require-imports */

const render = (page: string) => ArchivePage({ params: Promise.resolve({ page }) });
const isNotFound = (error: unknown) => (error as { digest?: string })?.digest?.startsWith("NEXT_HTTP_ERROR_FALLBACK;404") === true;

// The rendered tree as text, our own markup only (stand ins and components are named, not expanded).
function text(node: ReactNode): string {
  if (Array.isArray(node)) return node.map(text).join("");
  if (!isValidElement<Record<string, unknown>>(node)) return node === null || node === undefined || node === false ? "" : String(node);
  const type = typeof node.type === "string" ? node.type : "C";
  const cls = typeof node.props.className === "string" ? ` class="${node.props.className}"` : "";
  return `<${type}${cls}>${text(node.props.children as ReactNode)}</${type}>`;
}

test("/insights/page and /insights/page/1 redirect to /insights with a 301, from next.config.ts", async () => {
  const redirects = await nextConfig.redirects!();
  for (const source of ["/insights/page", "/insights/page/1"]) {
    const rule = redirects.find((r) => r.source === source);
    assert.ok(rule, source);
    assert.equal(rule.destination, "/insights");
    assert.equal("statusCode" in rule ? rule.statusCode : undefined, 301);
  }
  // The redirect lives only in next.config.ts: no page under /insights/page/ redirects by itself.
  assert.throws(() => readFileSync("src/app/(site)/insights/page/page.tsx"));
  assert.doesNotMatch(readFileSync("src/app/(site)/insights/page/[page]/page.tsx", "utf8"), /permanentRedirect|redirect\(/);
});

test("an archive page past the last page, page 1, or a malformed number is a 404", async () => {
  postCount = 1 + POSTS_PER_PAGE * 3 + 1; // /insights (7), pages 2 and 3 (6 each), page 4 (1)
  await render("4");
  for (const page of ["5", "40", "1", "0", "02", "abc"]) {
    await assert.rejects(render(page), isNotFound, page);
  }
  postCount = 1 + POSTS_PER_PAGE; // everything fits on /insights: no archive pages at all
  await assert.rejects(render("2"), isNotFound);
});

test("archive page numbers: page 2 up to the last page only", () => {
  const total = 1 + POSTS_PER_PAGE * 3; // pages 2 and 3
  assert.equal(archivePageNumber("2", total), 2);
  assert.equal(archivePageNumber("3", total), 3);
  for (const bad of ["1", "4", "0", "02", "-2", "x"]) assert.equal(archivePageNumber(bad, total), null, bad);
});

test("archive page headings go h1, then a hidden h2, then the cards' h3", async () => {
  postCount = 1 + POSTS_PER_PAGE + 3;
  const html = text(await render("2"));
  assert.match(html, /<h1 class="ins-heading css-reveal">Insights, Page 2<\/h1>/);
  assert.match(html, /<h2 class="sr-only">Articles<\/h2><div class="ins-grid">/);
  assert.ok(html.indexOf("<h1") < html.indexOf('<h2 class="sr-only">'));
  // The cards render their titles as h3 (src/components/insights/InsightCards.tsx).
  assert.match(readFileSync("src/components/insights/InsightCards.tsx", "utf8"), /<h3 className="ins-card-title">/);
});

test("Load more reveals cards in place only for a plain left click", () => {
  const click = { button: 0, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, defaultPrevented: false };
  assert.equal(isPlainLeftClick(click), true);
  for (const change of [{ button: 1 }, { button: 2 }, { ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { defaultPrevented: true }]) {
    assert.equal(isPlainLeftClick({ ...click, ...change }), false, JSON.stringify(change));
  }
  const client = readFileSync("src/components/insights/InsightsClient.tsx", "utf8");
  assert.match(client, /if \(!isPlainLeftClick\(event\)\) return;\s*event\.preventDefault\(\);/);
});

test("Studio refuses the post slug \"page\", which the archive uses", () => {
  assert.match(reservedPostSlugMessage("page") ?? "", /reserved for the Insights archive pages/);
  assert.ok(reservedPostSlugMessage(" Page "));
  for (const fine of [undefined, "", "pages", "page-two", "brand-audit-checklist"]) assert.equal(reservedPostSlugMessage(fine), undefined, String(fine));
  // Read as text: the sanity package cannot load under the test runner's react-server condition.
  const schema = readFileSync("sanity/schemas/post.ts", "utf8");
  assert.match(schema, /rule\.required\(\)\.custom\(\(value\) => reservedPostSlugMessage\(value\?\.current\) \?\? true\)/);
});
