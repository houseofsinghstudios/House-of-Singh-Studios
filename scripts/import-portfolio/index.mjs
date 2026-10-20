// Portfolio import: turns portfolio-import/<slug>/ folders into published caseStudy documents
// composed from page blocks. Local tool only. Lives outside src/ so Next.js never compiles or deploys it.
// Usage and folder format: scripts/import-portfolio/README.md

import fs from "node:fs";
import { IMPORT_DIR, SITE_URL, fail, loadImportEnv, parseCliArgs, requireSanityConfig } from "./lib/config.mjs";
import { createSanityClient } from "./lib/sanity.mjs";
import { explain, runProject, size } from "./lib/run.mjs";
import { notifyIndexNow, portfolioUrls } from "../indexnow/lib/after-import.mjs";

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
    if (args.showJson) console.log("Note: --json only applies to a dry run.");
    const config = requireSanityConfig(env);
    client = await createSanityClient(config);
    console.log(`\nCOMMIT. Writing to Sanity project ${config.projectId}, dataset ${config.dataset}.`);
    console.log("New case studies are published immediately and appear on the site within about a minute.");
  }

  const results = [];
  for (const slug of listProjectFolders(args.only)) {
    results.push(await runProject(slug, { dryRun, client, overwrite: args.overwrite, showJson: args.showJson }));
  }

  printSummary(results, dryRun);
  // Tell Bing about the new pages. A failure is one warning line, never a failed import.
  if (!dryRun && args.indexnow) await notifyIndexNow(portfolioUrls(results), "the case studies");
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

main().catch((err) => {
  console.error(`\nUnexpected error: ${explain(err)}\n`);
  process.exit(1);
});
