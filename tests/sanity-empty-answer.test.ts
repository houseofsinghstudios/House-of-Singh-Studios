// When Sanity answers with nothing, the local data stands in only while building (or without Sanity),
// as for a failed read (src/lib/sanity/resilience.ts). At runtime a case study Sanity does not have is
// null, so /work/[slug] goes through redirectOrNotFound and answers 404, never the old coded copy
// (/work/tedxtoronto served it with a 200 until 25 Nov 2026). A missing image or project never shows
// TEDxToronto in its place either. Run with: npm run test
import { test, mock, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { client } from "@/lib/sanity/client";
import { getAllProjects, getProjectBySlug, getProjectDetailBySlug } from "@/lib/sanity/projects";
import { getInitiativesForPage } from "@/lib/sanity/initiatives";
import { projects as localProjects } from "@/data/projects";
import { FALLBACK_INITIATIVES } from "@/lib/initiatives/content";

const LOCAL_ONLY = "tedxtoronto";
const KEYS = ["NEXT_PHASE", "NEXT_PUBLIC_SANITY_PROJECT_ID", "NEXT_PUBLIC_SANITY_DATASET"] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

function phase(name: "runtime" | "build") {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "abc123";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
  process.env.NEXT_PHASE = name === "build" ? "phase-production-build" : "phase-production-server";
}

// Sanity answers successfully, with this.
function sanityAnswers(answer: unknown) {
  mock.method(client, "fetch", async () => answer);
}

afterEach(() => {
  mock.restoreAll();
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

test("the slug exists only in the local data", () => {
  assert.ok(localProjects.some((p) => p.slug === LOCAL_ONLY));
});

test("at runtime an empty answer for a local only slug is null, so the page 404s", async () => {
  phase("runtime");
  sanityAnswers(null);
  assert.equal(await getProjectBySlug(LOCAL_ONLY), null);
  sanityAnswers({ doc: null, order: [{ slug: "nivora", title: "Nivora" }] });
  assert.equal(await getProjectDetailBySlug(LOCAL_ONLY), null);
});

test("while building an empty answer still gets the local copy", async () => {
  phase("build");
  sanityAnswers(null);
  assert.equal((await getProjectBySlug(LOCAL_ONLY))?.slug, LOCAL_ONLY);
  sanityAnswers({ doc: null, order: [] });
  assert.equal((await getProjectDetailBySlug(LOCAL_ONLY))?.slug, LOCAL_ONLY);
});

test("an empty list: nothing at runtime, the local lists while building", async () => {
  phase("runtime");
  sanityAnswers([]);
  assert.deepEqual(await getAllProjects(), []);
  assert.deepEqual(await getInitiativesForPage(), []);
  phase("build");
  sanityAnswers([]);
  assert.deepEqual((await getAllProjects()).map((p) => p.slug), localProjects.map((p) => p.slug));
  assert.deepEqual(await getInitiativesForPage(), FALLBACK_INITIATIVES);
});

test("at runtime a failed read still rethrows, never the local copy (resilience unchanged)", async () => {
  phase("runtime");
  const original = console.error;
  console.error = () => {};
  try {
    mock.method(client, "fetch", async () => { throw new TypeError("fetch failed"); });
    await assert.rejects(getProjectBySlug(LOCAL_ONLY), TypeError);
    await assert.rejects(getProjectDetailBySlug(LOCAL_ONLY), TypeError);
  } finally {
    console.error = original;
  }
});

test("the case study renderer never reads the local details itself", () => {
  const src = readFileSync("src/components/work/CaseStudyClient.tsx", "utf8");
  assert.doesNotMatch(src, /import \{[^}]*getProjectDetail[^}]*\} from "@\/data\/projectDetails"/);
});

test("no TEDxToronto stand in for a missing image or project", () => {
  for (const f of ["src/components/work/WorkCards.tsx", "src/components/services/ServiceBlocks.tsx"]) {
    assert.doesNotMatch(readFileSync(f, "utf8"), /tedxtoronto/i, f);
  }
});
