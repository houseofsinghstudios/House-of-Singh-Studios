// Constants, command line flags and .env.import loading for the portfolio import.
// Local tool only. Nothing under scripts/ is imported by the Next.js app.

import fs from "node:fs";
import path from "node:path";
import util from "node:util";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
export const IMPORT_DIR = path.join(ROOT, "portfolio-import");
export const ENV_FILE = path.join(ROOT, ".env.import");

export const SITE_URL = "https://studios.houseofsingh.com";
export const API_VERSION = "2024-01-01";
export const MAX_EDGE = 2800;
export const JPEG_QUALITY = 85;

// These lists must match sanity/schemas/caseStudy.ts.
export const SERVICE_CATEGORIES = ["brand-identity", "visual-media", "digital-design", "creative-strategy"];
export const DISCIPLINES = [
  "brand-identity",
  "packaging",
  "publication",
  "art-direction",
  "website",
  "video",
  "photography",
  "social-content",
  "strategy",
];
// Block types an author can use in project.json, and the Sanity _type each one is written as.
export const BLOCK_TYPES = {
  split: "blockSplit",
  offset: "blockOffset",
  full: "blockFull",
  pair: "blockPair",
  statement: "blockStatement",
  feature: "blockFeature",
};

const HELP = `
Portfolio import. Creates published case studies in Sanity from portfolio-import/.

  npm run import:portfolio                         Dry run (the default). Writes nothing.
  npm run import:portfolio -- --commit             Write to Sanity.
  npm run import:portfolio -- --only <slug>        Process one project folder only.
  npm run import:portfolio -- --commit --overwrite Replace projects that already exist.
  npm run import:portfolio -- --json               Dry run that also prints the full document.
  npm run import:portfolio -- --commit --no-indexnow  Write, but do not tell Bing about the new pages.

After a --commit, the new or replaced case study URLs and /work are sent to IndexNow (Bing).

Full instructions: scripts/import-portfolio/README.md
`;

export function parseCliArgs(argv) {
  let values;
  try {
    ({ values } = util.parseArgs({
      args: argv,
      options: {
        "dry-run": { type: "boolean" },
        commit: { type: "boolean" },
        only: { type: "string" },
        overwrite: { type: "boolean" },
        json: { type: "boolean" },
        "no-indexnow": { type: "boolean" },
        help: { type: "boolean", short: "h" },
      },
      strict: true,
      allowPositionals: false,
    }));
  } catch (err) {
    fail(`${err.message}\n${HELP}`);
  }

  if (values.help) {
    console.log(HELP);
    process.exit(0);
  }
  if (values.commit && values["dry-run"]) {
    fail("Choose either --dry-run or --commit, not both.");
  }
  return {
    mode: values.commit ? "commit" : "dry-run",
    only: values.only,
    overwrite: Boolean(values.overwrite),
    showJson: Boolean(values.json),
    indexnow: !values["no-indexnow"],
  };
}

// Reads .env.import only. Never .env.local, and never the shell environment,
// so the target project is always exactly what .env.import says.
export function loadImportEnv() {
  if (!fs.existsSync(ENV_FILE)) return null;
  return util.parseEnv(fs.readFileSync(ENV_FILE, "utf8"));
}

const TOKEN_HELP = `
The import needs a Sanity write token.

  1. Open https://www.sanity.io/manage and choose the House of Singh Studios project.
  2. Open the API tab, then Tokens, then click "Add API token".
  3. Name it "Portfolio import", choose Editor permission, and copy the token.
  4. Paste it into .env.import at the project root, after SANITY_WRITE_TOKEN=

Never put the token in .env.local. That file is committed to git.`;

export function requireSanityConfig(env) {
  if (!env) {
    fail(`.env.import was not found at ${ENV_FILE}\nCopy .env.import.example to .env.import first.\n${TOKEN_HELP}`);
  }
  const token = (env.SANITY_WRITE_TOKEN || "").trim();
  const projectId = (env.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
  const dataset = (env.NEXT_PUBLIC_SANITY_DATASET || "").trim();
  if (!token) fail(`SANITY_WRITE_TOKEN in .env.import is empty.\n${TOKEN_HELP}`);
  if (!projectId || !dataset) {
    fail(
      "NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must both be set in .env.import.\n" +
        "Copy them from .env.import.example."
    );
  }
  return { token, projectId, dataset };
}

export function fail(message) {
  console.error(`\nError: ${message}\n`);
  process.exit(1);
}
