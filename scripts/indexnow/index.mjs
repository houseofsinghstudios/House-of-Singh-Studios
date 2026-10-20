// IndexNow: tells Bing (and other IndexNow engines) which pages changed. Local tool only.
// Usage: scripts/indexnow/README.md

import fs from "node:fs";
import util from "node:util";
import { ENDPOINT, HOST, SITEMAP_URL } from "./config.mjs";
import { buildPayloads, checkUrls, submitUrls, urlsFromSitemap } from "./lib/submit.mjs";

const HELP = `
IndexNow. Tells Bing which pages on ${HOST} changed.

  npm run indexnow -- --all                     Dry run (the default): every URL in the live sitemap.
  npm run indexnow -- --url <url> [--url <url>] Dry run for specific URLs.
  npm run indexnow -- --all --commit            Send for real.
  npm run indexnow -- --all --sitemap <file>    Read URLs from a local sitemap file or another sitemap URL.

A dry run prints the URLs and the exact payload, and never contacts IndexNow.
Full instructions: scripts/indexnow/README.md
`;

function fail(message) {
  console.error(`\nError: ${message}\n`);
  process.exit(1);
}

function parseCliArgs(argv) {
  let values;
  try {
    ({ values } = util.parseArgs({
      args: argv,
      options: {
        "dry-run": { type: "boolean" },
        commit: { type: "boolean" },
        all: { type: "boolean" },
        url: { type: "string", multiple: true },
        sitemap: { type: "string" },
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
  if (!values.all && !values.url?.length) fail(`Choose --all or at least one --url.\n${HELP}`);
  if (values.sitemap && !values.all) fail("--sitemap only applies with --all.");
  return { commit: Boolean(values.commit), all: Boolean(values.all), urls: values.url ?? [], sitemap: values.sitemap ?? SITEMAP_URL };
}

// The sitemap is read with a plain GET (or from a local file). IndexNow is not contacted.
async function readSitemap(source) {
  if (!/^https?:\/\//i.test(source)) {
    if (!fs.existsSync(source)) fail(`The sitemap file ${source} does not exist.`);
    return urlsFromSitemap(fs.readFileSync(source, "utf8"));
  }
  try {
    const res = await fetch(source, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) fail(`Could not read the sitemap at ${source} (HTTP ${res.status}).`);
    return urlsFromSitemap(await res.text());
  } catch (err) {
    fail(`Could not read the sitemap at ${source} (${err?.name || "error"}). Use --sitemap <file> to read a saved copy.`);
  }
}

async function main() {
  const args = parseCliArgs(process.argv.slice(2));
  const candidates = [...(args.all ? await readSitemap(args.sitemap) : []), ...args.urls];
  const { ok, rejected } = checkUrls(candidates);

  if (rejected.length) {
    fail(`Only URLs on https://${HOST} can be submitted. Nothing was sent.\n${rejected.map((r) => `  - ${r.url} (${r.reason})`).join("\n")}`);
  }
  if (!ok.length) fail(args.all ? "The sitemap has no URLs." : "No URLs to submit.");

  console.log(`\n${args.commit ? "COMMIT. Sending to IndexNow." : "DRY RUN. Nothing will be sent to IndexNow. Run with --commit to send."}`);
  console.log(`\n${ok.length} URL(s)${args.all ? ` from ${args.sitemap}` : ""}:`);
  ok.forEach((u) => console.log(`  ${u}`));

  const payloads = buildPayloads(ok);
  if (!args.commit) {
    console.log(`\nWould POST ${payloads.length} request(s) to ${ENDPOINT}:`);
    payloads.forEach((p) => console.log(JSON.stringify(p, null, 2).replace(/^/gm, "  ")));
    console.log("");
    return;
  }

  const results = await submitUrls(ok);
  console.log("");
  results.forEach((r, i) => console.log(`  Batch ${i + 1} (${r.count} URL(s)): ${r.status ? `HTTP ${r.status}. ` : ""}${r.message}`));
  console.log("");
  if (results.some((r) => !r.ok)) process.exitCode = 1;
}

main().catch((err) => {
  console.error(`\nUnexpected error: ${err?.message || err}\n`);
  process.exit(1);
});
