// Portfolio import: projectType. Run with: npm run test
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { checkProjectType, validateProject } from "../scripts/import-portfolio/lib/project.mjs";
import { buildDocument } from "../scripts/import-portfolio/lib/sanity.mjs";
import { runProject } from "../scripts/import-portfolio/lib/run.mjs";
import { PARALLEL_REMINDER, PROJECT_TYPES } from "../scripts/import-portfolio/lib/config.mjs";

const EXAMPLE = path.join(process.cwd(), "scripts/import-portfolio/example");
let root = "";

// One project folder made from the bundled example, with plain images and the given projectType.
async function makeProject(slug: string, projectType?: unknown) {
  const dir = path.join(root, slug);
  fs.mkdirSync(dir, { recursive: true });
  const meta = JSON.parse(fs.readFileSync(path.join(EXAMPLE, "project.json"), "utf8"));
  if (projectType === undefined) delete meta.projectType;
  else meta.projectType = projectType;
  fs.writeFileSync(path.join(dir, "project.json"), JSON.stringify(meta));
  fs.copyFileSync(path.join(EXAMPLE, "copy.md"), path.join(dir, "copy.md"));
  for (const file of Object.keys(meta.images)) {
    await sharp({ create: { width: 1200, height: 900, channels: 3, background: { r: 229, g: 227, b: 224 } } }).jpeg().toFile(path.join(dir, file));
  }
  return dir;
}

before(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "hos-import-test-"));
});
after(() => fs.rmSync(root, { recursive: true, force: true }));

test("checkProjectType: missing fails naming the file; every allowed value passes; anything else names the allowed values", () => {
  const missing: Record<string, unknown> = {};
  const errors: string[] = [];
  checkProjectType(missing, errors, "imports/bruno/project.json");
  assert.equal(missing.projectType, undefined, "never defaulted to client");
  assert.equal(errors.length, 1);
  assert.match(errors[0], /^imports\/bruno\/project\.json has no "projectType"\./);
  assert.match(errors[0], /add one of client, exploration, parallel, commons/);

  assert.deepEqual(PROJECT_TYPES, ["client", "exploration", "parallel", "commons"]);
  for (const value of PROJECT_TYPES) {
    const e: string[] = [];
    checkProjectType({ projectType: value }, e);
    assert.deepEqual(e, [], value);
  }
  for (const bad of ["Client", "pro-bono", "", 3, null, ["parallel"]]) {
    const e: string[] = [];
    checkProjectType({ projectType: bad }, e);
    assert.equal(e.length, 1, String(bad));
    assert.match(e[0], /must be one of: client, exploration, parallel, commons/);
  }
});

test("import: a project.json without a type fails, naming the file, and is never imported as client work", async () => {
  const dir = await makeProject("no-type");
  const missing = await validateProject("no-type", dir);
  const message = missing.errors.find((e: string) => e.includes('has no "projectType"'));
  assert.ok(message, "a missing type is an error");
  assert.ok(message.startsWith(`${path.relative(process.cwd(), path.join(dir, "project.json"))} has no "projectType".`), message);
  assert.notEqual(missing.meta?.projectType, "client", "never defaulted to client");
  // The run stops before anything is processed or uploaded.
  const log = console.log;
  console.log = () => {};
  try {
    const result = await runProject("no-type", { dryRun: true, client: null, overwrite: false, importDir: root });
    assert.equal(result.status, "failed");
    assert.equal(result.projectType, "");
  } finally {
    console.log = log;
  }
});

test("validateProject: a typed project passes; an invalid value names the allowed values", async () => {
  const ok = await validateProject("client-type", await makeProject("client-type", "client"));
  assert.deepEqual(ok.errors, []);
  assert.equal(ok.meta.projectType, "client");

  const bad = await validateProject("bad-type", await makeProject("bad-type", "case-study"));
  assert.ok(bad.errors.some((e: string) => /"projectType" "case-study" is not valid/.test(e)));
});

test("buildDocument writes projectType", async () => {
  const project = await validateProject("explore", await makeProject("explore", "exploration"));
  assert.deepEqual(project.errors, []);
  const refs = new Map(Object.keys(project.meta.images).map((f: string) => [f, `image-${f}`]));
  const doc = buildDocument(project, refs);
  assert.equal(doc._type, "caseStudy");
  assert.equal(doc.projectType, "exploration");
});

test("dry run prints the type next to the title, and the reminder for Parallel only", async () => {
  await makeProject("parallel-one", "parallel");
  await makeProject("commons-one", "commons");
  const lines: string[] = [];
  const log = console.log;
  console.log = (...a: unknown[]) => void lines.push(a.map(String).join(" "));
  try {
    const p = await runProject("parallel-one", { dryRun: true, client: null, overwrite: false, importDir: root });
    const c = await runProject("commons-one", { dryRun: true, client: null, overwrite: false, importDir: root });
    assert.equal(p.projectType, "parallel");
    assert.equal(c.projectType, "commons");
  } finally {
    console.log = log;
  }
  const text = lines.join("\n");
  assert.match(text, /parallel-one {2}\| {2}Harbour and Pine {2}\| {2}parallel/);
  assert.match(text, /commons-one {2}\| {2}Harbour and Pine {2}\| {2}commons/);
  assert.equal(text.split(PARALLEL_REMINDER).length - 1, 1, "the reminder appears once, for the Parallel project");
});
