// The Sanity schema deploy workflow: schema deploy only, on pushes to main that change the schema or the
// Studio config, with the token from a GitHub secret. Never `sanity deploy` (a separate hosted Studio).
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workflow = readFileSync(".github/workflows/sanity-schema-deploy.yml", "utf8");
const commands = workflow.split("\n").filter((line) => /^\s*run:|^\s{10,}\S/.test(line) && !/^\s*#/.test(line)).join("\n");

test("it runs on pushes to main that change sanity/ or sanity.config.ts", () => {
  assert.match(workflow, /on:\n {2}push:\n {4}branches: \[main\]\n {4}paths:\n {6}- "sanity\/\*\*"\n {6}- "sanity\.config\.ts"/);
  assert.doesNotMatch(workflow, /pull_request/, "never from a pull request, where the secret must not be used");
  assert.match(workflow, /permissions:\n {2}contents: read/);
});

test("schema deploy only, never sanity deploy", () => {
  assert.match(commands, /npx sanity schema deploy --workspace hos-studios --verbose/);
  assert.doesNotMatch(commands, /sanity(@latest)? deploy\b/, "no Studio deploy");
  assert.doesNotMatch(commands, /schemas? delete/);
});

test("the token comes from the SANITY_SCHEMA_DEPLOY_TOKEN secret and is never written into the file", () => {
  assert.match(workflow, /SANITY_AUTH_TOKEN: \$\{\{ secrets\.SANITY_SCHEMA_DEPLOY_TOKEN \}\}/);
  assert.doesNotMatch(workflow, /\bsk[A-Za-z0-9]{20,}/, "no token value");
  assert.doesNotMatch(commands, /echo .*\$SANITY_AUTH_TOKEN/, "never printed");
});

test("CLAUDE.md explains the difference next to the never run sanity deploy line", () => {
  const claude = readFileSync("CLAUDE.md", "utf8");
  const at = claude.indexOf("Never run `sanity deploy`");
  assert.ok(at > 0);
  assert.match(claude.slice(at, at + 1500), /sanity schema deploy/);
  assert.match(claude.slice(at, at + 1500), /SANITY_SCHEMA_DEPLOY_TOKEN/);
});
