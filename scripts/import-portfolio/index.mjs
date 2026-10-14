// Portfolio import: turns portfolio-import/<slug>/ folders into published caseStudy documents.
// Local tool only. Lives outside src/ so Next.js never compiles or deploys it.
// Usage and folder format: scripts/import-portfolio/README.md

import fs from "node:fs";
import path from "node:path";
import { IMPORT_DIR, SITE_URL, fail, loadImportEnv, parseCliArgs, requireSanityConfig } from "./lib/config.mjs";
import { validateProject } from "./lib/project.mjs";
import { outputFilename, processImage } from "./lib/images.mjs";
import { buildDocument, createSanityClient, decideTarget, findExisting, uploadImage, writeDocument } from "./lib/sanity.mjs";

async function main() {
  const args = parseCliArgs(process.argv.slice(2));
  const env = loadImportEnv();
  const dryRun = args.mode === "dry-run";

  let client = null;
  if (dryRun) {
    console.log("\nDRY RUN. Nothing will be written to Sanity and no network calls are made.");
    console.log("Run with --commit to write for real.");
    if (args.overwrite) console.log("Note: --overwrite has no effect in a dry run.");
    if (!env || !(env.SANITY_WRITE_TOKEN || "").trim()) {
      console.log("Note: no write token in .env.import yet. You will need one before running with --commit.");
    }
  } else {
    const config = requireSanityConfig(env);
    client = await createSanityClient(config);
    console.log(`\nCOMMIT. Writing to Sanity project ${config.projectId}, dataset ${config.dataset}.`);
    console.log("New case studies are published immediately and appear on the site within about a minute.");
  }

  const results = [];
  for (const slug of listProjectFolders(args.only)) {
    results.push(await runProject(slug, { dryRun, client, overwrite: args.overwrite }));
  }

  printSummary(results, dryRun);
  if (results.some((r) => r.status === "failed")) process.exitCode = 1;
}

function listProjectFolders(only) {
  if (!fs.existsSync(IMPORT_DIR)) {
    fail(`The folder ${IMPORT_DIR} does not exist.\nCreate it and add one subfolder per project. See scripts/import-portfolio/README.md.`);
  }
  const folders = fs
    .readdirSync(IMPORT_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort();

  if (only) {
    if (!folders.includes(only)) {
      fail(`No project folder named "${only}" in portfolio-import/. Found: ${folders.join(", ") || "none"}.`);
    }
    return [only];
  }
  if (folders.length === 0) fail("portfolio-import/ has no project folders yet.");
  return folders;
}

async function runProject(slug, { dryRun, client, overwrite }) {
  const project = validateProject(slug, path.join(IMPORT_DIR, slug));
  const title = project.meta && typeof project.meta.title === "string" ? project.meta.title : "(no title)";
  const result = { slug, title, status: "failed", images: 0, bytes: 0, detail: "" };

  console.log(`\n${"=".repeat(72)}\n${slug}  |  ${title}\n${"=".repeat(72)}`);
  project.warnings.forEach((w) => console.log(`  warning: ${w}`));

  if (project.errors.length) {
    console.log(`  FAILED validation, ${project.errors.length} problem(s). Nothing was processed or uploaded:`);
    project.errors.forEach((e) => console.log(`    - ${e}`));
    result.detail = `${project.errors.length} validation problem(s)`;
    return result;
  }
  console.log("  Validation passed.");

  let uploaded = 0;
  try {
    // The existing slug check runs before any image work, so a skip costs nothing.
    let target = { action: "create" };
    if (!dryRun) {
      target = decideTarget(await findExisting(client, slug), overwrite);
      if (target.action === "skip") {
        console.log(`  SKIPPED: ${target.reason}`);
        return { ...result, status: "skipped", detail: target.reason };
      }
      if (target.action === "overwrite") console.log(`  warning: --overwrite will replace document ${target.id}.`);
      if (target.draftNote) console.log(`  warning: ${target.draftNote}`);
    }

    const files = [project.images.cover, ...project.images.gallery];
    const processed = [];
    console.log("\n  Images:");
    for (const img of files) {
      const out = await processImage(path.join(project.dir, img.file));
      processed.push({ ...img, ...out });
      console.log(
        `    ${img.file.padEnd(28)} ${dims(out.before).padStart(11)} -> ${dims(out.after).padEnd(11)}  ${size(out.before.bytes).padStart(9)} -> ${size(out.after.bytes)}`
      );
    }
    result.images = processed.length;
    result.bytes = processed.reduce((sum, p) => sum + p.after.bytes, 0);

    if (dryRun) {
      const placeholder = (file) => `(assigned on upload: ${outputFilename(file)})`;
      const doc = buildDocument(project, {
        cover: placeholder(project.images.cover.file),
        gallery: project.images.gallery.map((g) => placeholder(g.file)),
      });
      console.log("\n  Would create this published caseStudy document:\n");
      console.log(JSON.stringify(doc, null, 2).replace(/^/gm, "    "));
      return { ...result, status: "would create", detail: "dry run" };
    }

    const assetIds = [];
    for (const p of processed) {
      assetIds.push(await uploadImage(client, p.buffer, outputFilename(p.file)));
      uploaded++;
    }
    const doc = buildDocument(project, { cover: assetIds[0], gallery: assetIds.slice(1) });
    const written = await writeDocument(client, doc, target);
    const status = target.action === "overwrite" ? "overwritten" : "created";
    console.log(`\n  ${status.toUpperCase()}: document ${written._id}`);
    return { ...result, status, detail: written._id };
  } catch (err) {
    console.log(`  FAILED: ${explain(err)}`);
    if (uploaded > 0) {
      console.log(
        `  ${uploaded} image(s) were uploaded before the failure. They stay in Sanity unattached. Rerunning reuses them, because Sanity recognises identical files.`
      );
    }
    return { ...result, detail: explain(err) };
  }
}

function explain(err) {
  if (err && (err.statusCode === 401 || err.statusCode === 403)) {
    return `Sanity rejected the token (HTTP ${err.statusCode}). Check that SANITY_WRITE_TOKEN in .env.import is correct and has Editor permission.`;
  }
  return err && err.message ? err.message : String(err);
}

function printSummary(results, dryRun) {
  const count = (s) => results.filter((r) => r.status === s).length;
  const images = results.reduce((sum, r) => sum + r.images, 0);
  const bytes = results.reduce((sum, r) => sum + r.bytes, 0);

  const row = (label, value) => console.log(`  ${`${label}:`.padEnd(27)}${value}`);

  console.log(`\n${"=".repeat(72)}\nSUMMARY${dryRun ? " (dry run, nothing was written)" : ""}\n${"=".repeat(72)}`);
  if (dryRun) {
    row("Projects ready to create", count("would create"));
  } else {
    row("Projects created", count("created"));
    row("Projects overwritten", count("overwritten"));
    row("Projects skipped", count("skipped"));
  }
  row("Projects failed", count("failed"));
  row(dryRun ? "Images processed" : "Images uploaded", images);
  row(dryRun ? "Bytes that would upload" : "Bytes uploaded", size(bytes));

  console.log("");
  for (const r of results) {
    const live = ["created", "overwritten", "would create"].includes(r.status);
    const url = live ? `${SITE_URL}/work/${r.slug}` : r.detail;
    console.log(`  ${r.status.toUpperCase().padEnd(13)} ${r.slug.padEnd(28)} ${url}`);
  }
  if (dryRun && count("would create")) console.log("\n  URLs above are where each project will be live after a --commit run.");
  console.log("");
}

const dims = ({ width, height }) => `${width}x${height}`;

function size(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

main().catch((err) => {
  console.error(`\nUnexpected error: ${explain(err)}\n`);
  process.exit(1);
});
