// Internal linking: the article slug prefix map, the discipline to service map, related work and
// descriptive link names. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ARTICLE_LINES,
  RELATED_THINKING,
  articleLine,
  SERVICE_SLUGS,
  matchSlug,
  relatedThinking,
  relatedWork,
  serviceLinkLabel,
  servicesForArticle,
  servicesForDisciplines,
} from "@/lib/linking";

// The article slugs in Sanity today (the stand in export used for local builds).
const ARTICLES = [
  "why-your-brand-looks-different-everywhere-and-what-it-is-actually-costing-you",
  "rebrand-or-refresh-how-established-businesses-should-decide",
  "how-to-brief-a-design-studio-so-you-actually-get-what-you-want",
  "ai-made-design-faster-it-did-not-make-brands-better",
  "5-signs-your-brand-is-actively-costing-you-business",
  "what-a-brand-identity-system-actually-includes-and-why-a-logo-is-not-enough",
  "how-much-does-brand-identity-design-cost-in-canada-a-studio-s-honest-breakdown",
  "what-ai-can-and-cannot-do-for-your-brand-from-a-studio-that-uses-it",
];
const posts = ARTICLES.map((slug) => ({ slug }));

test("every prefix in the map matches exactly one real article", () => {
  for (const service of SERVICE_SLUGS) {
    for (const prefix of RELATED_THINKING[service]) {
      assert.equal(ARTICLES.filter((s) => s.startsWith(prefix)).length, 1, `${service}: ${prefix}`);
    }
  }
  assert.equal(matchSlug(ARTICLES, "rebrand-or-refresh"), "rebrand-or-refresh-how-established-businesses-should-decide");
  assert.equal(matchSlug(ARTICLES, "no-such-article"), undefined);
});

test("each service page gets two or three related articles, in the configured order", () => {
  assert.deepEqual(relatedThinking("brand-identity", posts).map((p) => p.slug.slice(0, 20)), ["what-a-brand-identit", "rebrand-or-refresh-h", "how-much-does-brand-"]);
  for (const service of SERVICE_SLUGS) {
    const n = relatedThinking(service, posts).length;
    assert.ok(n >= 2 && n <= 3, `${service}: ${n}`);
  }
  assert.deepEqual(relatedThinking("unknown", posts), []);
  assert.deepEqual(relatedThinking("brand-identity", []), [], "no articles, no row");
});

test("discipline tags map to services, as stored or as display names; unknown tags map to nothing", () => {
  assert.deepEqual(servicesForDisciplines(["brand-identity", "packaging", "website"]), ["brand-identity", "digital-design"]);
  assert.deepEqual(servicesForDisciplines(["Art Direction", "Social Content", "Photography", "video"]), ["visual-media"]);
  assert.deepEqual(servicesForDisciplines(["Strategy", "Positioning", "Naming"]), ["creative-strategy"]);
  assert.deepEqual(servicesForDisciplines(["Logo", "Print", "UX", "UI", "Digital", "Content"]), ["brand-identity", "visual-media", "digital-design"]);
  assert.deepEqual(servicesForDisciplines(["publication", "illustration"]), []);
  assert.deepEqual(servicesForDisciplines(undefined), []);
});

test("an article's services: Sanity first, then the slug prefix map, then brand identity", () => {
  assert.deepEqual(servicesForArticle(ARTICLES[0]), ["visual-media", "digital-design"]);
  assert.deepEqual(servicesForArticle(ARTICLES[4]), ["creative-strategy"]);
  assert.deepEqual(servicesForArticle(ARTICLES[0], ["creative-strategy", "strategy"]), ["creative-strategy"], "old service slugs in Sanity are ignored");
  assert.deepEqual(servicesForArticle("a-new-article"), ["brand-identity"]);
  for (const slug of ARTICLES) assert.ok(servicesForArticle(slug).length > 0, slug);
});

test("related work: chosen first, then matching disciplines, then newest; at most two; never twice", () => {
  const projects = [
    { slug: "a", disciplines: ["website"] },
    { slug: "b", disciplines: ["strategy"] },
    { slug: "c", disciplines: ["photography"] },
    { slug: "d", disciplines: ["strategy", "brand-identity"] },
  ];
  assert.deepEqual(relatedWork(["creative-strategy"], projects).map((p) => p.slug), ["b", "d"]);
  assert.deepEqual(relatedWork(["visual-media"], projects).map((p) => p.slug), ["c", "a"], "one match, then the newest");
  assert.deepEqual(relatedWork(["visual-media"], projects, ["d", "missing"]).map((p) => p.slug), ["d", "c"]);
  assert.deepEqual(relatedWork(["brand-identity"], []), []);
});

test("descriptive link names keep the visible text first", () => {
  assert.equal(serviceLinkLabel("brand-identity", "Learn More"), "Learn More: Brand identity design and rebranding in Toronto");
  assert.equal(serviceLinkLabel("digital-design", "Digital Design and Experience"), "Digital Design and Experience: Website design for brands in Toronto");
  assert.equal(serviceLinkLabel("unknown", "Learn More"), "Learn More");
});

test("every related article has a one line summary in house style; new articles fall back", () => {
  const BANNED = ["bespoke", "holistic", "transformative", "synergy", "curated", "elevated", "journey", "passionate", "cutting edge", "timeless", "visionary", "full service", "end to end", "established"];
  for (const service of SERVICE_SLUGS) for (const prefix of RELATED_THINKING[service]) assert.ok(ARTICLE_LINES[prefix], prefix);
  for (const line of Object.values(ARTICLE_LINES)) {
    assert.doesNotMatch(line, /[-‐‑‒–—―]|\$\d/, line);
    for (const word of BANNED) assert.ok(!line.toLowerCase().includes(word), `${line}: ${word}`);
  }
  assert.equal(articleLine(ARTICLES[1], "fallback"), ARTICLE_LINES["rebrand-or-refresh"]);
  assert.equal(articleLine("a-new-article", "Its SEO description."), "Its SEO description.");
});

test("/services: each service link says where it goes, never Learn More", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("src/components/services/ServicesClient.tsx", "utf8");
  assert.doesNotMatch(src, /Learn More/);
  for (const [slug, text] of [["brand-identity", "Explore Brand Identity"], ["visual-media", "Explore Visual Media"], ["digital-design", "Explore Digital Design"], ["creative-strategy", "Explore Creative Strategy"]]) {
    assert.match(src, new RegExp(`slug: "${slug}",\\s*linkText: "${text}",`), slug);
    // The accessible name starts with the visible words, then names the page.
    assert.ok(serviceLinkLabel(slug, text).startsWith(`${text}: `), slug);
  }
});
