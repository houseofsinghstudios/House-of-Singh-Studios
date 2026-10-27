// Command line flags for the services import. Sanity settings and the token come from .env.import,
// read by the portfolio import's loader. Local tool only.

import path from "node:path";
import util from "node:util";
import { ROOT, fail } from "../../import-portfolio/lib/config.mjs";

export const SERVICES_FILE = path.join(ROOT, "src/data/services.ts");

const HELP = `
Services import. Copies the four services in src/data/services.ts into Sanity as a reference copy.
The website keeps reading the code; nothing on the site changes.

  npm run import:services                Dry run (the default). Reads Sanity, writes nothing.
  npm run import:services -- --commit    Write the four services, replacing their documents.
  npm run import:services -- --verify    Compare Sanity with the code, field by field.

Full instructions: scripts/import-services/README.md
`;

export function parseCliArgs(argv) {
  let values;
  try {
    ({ values } = util.parseArgs({
      args: argv,
      options: {
        "dry-run": { type: "boolean" },
        commit: { type: "boolean" },
        verify: { type: "boolean" },
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
  const chosen = ["dry-run", "commit", "verify"].filter((m) => values[m]);
  if (chosen.length > 1) fail(`Choose one of --dry-run, --commit or --verify, not ${chosen.map((m) => `--${m}`).join(" and ")}.`);
  return { mode: chosen[0] || "dry-run" };
}
