// Constants and command line flags for the roles import. Sanity settings and the token come from
// .env.import, read by the portfolio import's loader. Local tool only.

import path from "node:path";
import util from "node:util";
import { ROOT, fail } from "../../import-portfolio/lib/config.mjs";

export const ROLES_DIR = path.join(ROOT, "roles-import");

// These lists must match sanity/schemas/role.ts exactly.
export const DEPARTMENTS = ["brand-identity", "visual-media", "digital-design", "creative-strategy", "operations"];
export const TYPES = ["full-time", "part-time", "contract", "freelance"];

export const FRONTMATTER_KEYS = ["title", "department", "type", "location", "summary", "order", "active"];
export const SUMMARY_MAX = 300;
export const DEFAULT_ORDER = 10;

// Section heading (compared without case) -> the Sanity field it is written to.
export const SECTIONS = {
  "about the role": { field: "description", kind: "paragraphs" },
  responsibilities: { field: "responsibilities", kind: "list" },
  requirements: { field: "requirements", kind: "list" },
  "nice to have": { field: "niceToHave", kind: "list" },
};

const HELP = `
Roles import. Creates published careers roles in Sanity from roles-import/*.md.

  npm run import:roles                          Dry run (the default). Writes nothing.
  npm run import:roles -- --commit              Write to Sanity.
  npm run import:roles -- --only <slug>         Process one file only (roles-import/<slug>.md).
  npm run import:roles -- --commit --overwrite  Replace roles that already exist.
  npm run import:roles -- --commit --no-indexnow  Write, but do not tell Bing about /careers.

After a --commit, /careers is sent to IndexNow (Bing).

Full instructions: scripts/import-roles/README.md
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
  if (values.commit && values["dry-run"]) fail("Choose either --dry-run or --commit, not both.");
  return {
    mode: values.commit ? "commit" : "dry-run",
    only: values.only ? values.only.replace(/\.md$/i, "") : undefined,
    overwrite: Boolean(values.overwrite),
    indexnow: !values["no-indexnow"],
  };
}
