// Services import: copies the four services in src/data/services.ts into Sanity as a reference copy,
// field for field. The website keeps reading the code. Local tool only, outside src/ so Next.js
// never compiles or deploys it. Shares .env.import and the Sanity client with the portfolio import.
// Runs through tsx (npm run import:services), which loads the TypeScript data file.
// Usage: scripts/import-services/README.md

import { pathToFileURL } from "node:url";
import { fail, loadImportEnv, requireSanityConfig } from "../import-portfolio/lib/config.mjs";
import { createSanityClient } from "../import-portfolio/lib/sanity.mjs";
import { explain } from "../import-roles/lib/run.mjs";
import { SERVICES_FILE, parseCliArgs } from "./lib/config.mjs";
import { commit, dryRun, verify } from "./lib/run.mjs";
import { checkShape } from "./lib/transform.mjs";

async function main() {
  const { mode } = parseCliArgs(process.argv.slice(2));
  const services = await loadServices();
  const env = loadImportEnv();

  if (mode === "dry-run") {
    const { client, reason } = await readClient(env);
    await dryRun(services, client, { notChecked: reason });
    return;
  }
  const client = await createSanityClient(requireSanityConfig(env));
  if (mode === "commit") {
    try {
      await commit(services, client);
    } catch (err) {
      fail(`Nothing was written: ${explain(err)}`);
    }
  }
  if ((await verify(services, client)) > 0) process.exitCode = 1;
}

async function loadServices() {
  let mod;
  try {
    mod = await import(pathToFileURL(SERVICES_FILE).href);
  } catch (err) {
    fail(`Could not read ${SERVICES_FILE}: ${explain(err)}\nRun the tool with npm run import:services, which loads TypeScript files.`);
  }
  const services = mod.services;
  if (!Array.isArray(services) || services.length === 0) fail("src/data/services.ts exports no services.");
  const problems = services.flatMap((s, i) => checkShape(s).map((p) => `${s.slug || `service ${i + 1}`}: ${p}`));
  if (problems.length) {
    fail(
      `The code has changed in a way the Sanity mirror does not cover yet. Nothing was written.\n  - ${problems.join("\n  - ")}\n` +
        "Update sanity/schemas/service.ts and scripts/import-services/lib/transform.mjs to match, then run again."
    );
  }
  return services;
}

// The dry run only reads, and works without a token where the dataset allows public reads.
async function readClient(env) {
  const projectId = (env?.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
  const dataset = (env?.NEXT_PUBLIC_SANITY_DATASET || "").trim();
  if (!projectId || !dataset) return { client: null, reason: ".env.import was not found. See scripts/import-portfolio/README.md." };
  const token = (env.SANITY_WRITE_TOKEN || "").trim() || undefined;
  return { client: await createSanityClient({ projectId, dataset, token }), reason: "" };
}

main().catch((err) => {
  console.error(`\nUnexpected error: ${explain(err)}\n`);
  process.exit(1);
});
