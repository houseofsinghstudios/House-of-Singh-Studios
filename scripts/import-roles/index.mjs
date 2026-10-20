// Roles import: turns roles-import/<slug>.md files into published careers roles in Sanity.
// Local tool only. Lives outside src/ so Next.js never compiles or deploys it.
// Shares .env.import, the Sanity client and the Markdown inline parser with the portfolio import.
// Usage and file format: scripts/import-roles/README.md

import fs from "node:fs";
import { SITE_URL, fail, loadImportEnv, requireSanityConfig } from "../import-portfolio/lib/config.mjs";
import { createSanityClient } from "../import-portfolio/lib/sanity.mjs";
import { ROLES_DIR, parseCliArgs } from "./lib/config.mjs";
import { explain, runRole } from "./lib/run.mjs";
import { notifyIndexNow, rolesUrls } from "../indexnow/lib/after-import.mjs";

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
    console.log("New roles are published immediately and appear on the careers page within about a minute.");
  }

  const results = [];
  for (const file of listRoleFiles(args.only)) {
    results.push(await runRole(`${ROLES_DIR}/${file}`, { dryRun, client, overwrite: args.overwrite }));
  }

  printSummary(results, dryRun);
  // Tell Bing the careers page changed. A failure is one warning line, never a failed import.
  if (!dryRun && args.indexnow) await notifyIndexNow(rolesUrls(results), "the careers page");
  if (results.some((r) => r.status === "failed")) process.exitCode = 1;
}

// Every .md file is one role. Files starting with "_" and README.md are notes, not roles.
function listRoleFiles(only) {
  if (!fs.existsSync(ROLES_DIR)) {
    fail(`The folder ${ROLES_DIR} does not exist.\nCreate it and add one .md file per role. See scripts/import-roles/README.md.`);
  }
  const files = fs
    .readdirSync(ROLES_DIR, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.md$/i.test(e.name) && !e.name.startsWith("_") && !e.name.startsWith(".") && e.name.toLowerCase() !== "readme.md")
    .map((e) => e.name)
    .sort();

  if (only) {
    const match = files.find((f) => f.replace(/\.md$/i, "") === only);
    if (!match) fail(`No role file named "${only}.md" in roles-import/. Found: ${files.join(", ") || "none"}.`);
    return [match];
  }
  if (files.length === 0) fail("roles-import/ has no role files yet.");
  return files;
}

function printSummary(results, dryRun) {
  const count = (s) => results.filter((r) => r.status === s).length;
  const row = (label, value) => console.log(`  ${`${label}:`.padEnd(24)}${value}`);

  console.log(`\n${"=".repeat(72)}\nSUMMARY${dryRun ? " (dry run, nothing was written)" : ""}\n${"=".repeat(72)}`);
  if (dryRun) {
    row("Roles ready to create", count("would create"));
  } else {
    row("Roles created", count("created"));
    row("Roles overwritten", count("overwritten"));
    row("Roles skipped", count("skipped"));
  }
  row("Roles failed", count("failed"));

  console.log("");
  for (const r of results) {
    const live = ["created", "overwritten", "would create"].includes(r.status);
    console.log(`  ${r.status.toUpperCase().padEnd(13)} ${r.slug.padEnd(30)} ${live ? `${SITE_URL}/careers` : r.detail}`);
  }
  if (dryRun && count("would create")) console.log("\n  Roles appear on the careers page after a --commit run, if active.");
  console.log("");
}

main().catch((err) => {
  console.error(`\nUnexpected error: ${explain(err)}\n`);
  process.exit(1);
});
