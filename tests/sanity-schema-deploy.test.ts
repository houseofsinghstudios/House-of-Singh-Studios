// The Sanity schema deploy workflow: schema deploy only, on pushes to main that change the schema or the
// Studio config, with the token from a GitHub secret. Never `sanity deploy` (a separate hosted Studio).
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const workflow = readFileSync(".github/workflows/sanity-schema-deploy.yml", "utf8");
const commands = workflow.split("\n").filter((line) => /^\s*run:|^\s{10,}\S/.test(line) && !/^\s*#/.test(line)).join("\n");

// The push trigger's paths, as written in the workflow.
const triggerPaths = (() => {
  const block = workflow.slice(workflow.indexOf("    paths:\n"), workflow.indexOf("  workflow_dispatch:"));
  return [...block.matchAll(/^ {6}- "([^"]+)"$/gm)].map((m) => m[1]);
})();

// A path pattern as GitHub reads it here: an exact file, or a folder followed by /**.
const covered = (file: string) => triggerPaths.some((p) => (p.endsWith("/**") ? file.startsWith(p.slice(0, -2)) : file === p));

// Every local file the Studio config and the schemas load, directly or through their imports: static
// imports, export from and dynamic import(), relative or through the "@/" alias for src/.
function importGraph(entries: string[]): { files: Set<string>; unresolved: string[] } {
  const files = new Set<string>();
  const unresolved: string[] = [];
  const specifiers = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(?\s*['"]([^'"]+)['"]/g;
  const resolve = (from: string, spec: string): string | null | undefined => {
    let base: string;
    if (spec.startsWith("@/")) base = path.join("src", spec.slice(2));
    else if (spec.startsWith(".")) base = path.normalize(path.join(path.dirname(from), spec));
    else return undefined; // a package
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
      if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
    }
    return null;
  };
  const stack = [...entries];
  while (stack.length) {
    const file = stack.pop()!;
    if (files.has(file)) continue;
    files.add(file);
    for (const m of readFileSync(file, "utf8").matchAll(specifiers)) {
      const target = resolve(file, m[1] ?? m[2]);
      if (target === null) unresolved.push(`${m[1] ?? m[2]} from ${file}`);
      else if (target) stack.push(target);
    }
  }
  return { files, unresolved };
}

const sanityFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? sanityFiles(full) : /\.(ts|tsx)$/.test(entry) ? [full] : [];
  });

test("every file under src/ that the schemas import is in the trigger, so a new import never goes stale", () => {
  const { files, unresolved } = importGraph(["sanity.config.ts", "sanity.cli.ts", ...sanityFiles("sanity")]);
  assert.deepEqual(unresolved, [], "every local import resolves");
  const fromSrc = [...files].filter((f) => f.startsWith("src/")).sort();
  // The walk itself works: these chains are known (a broken walker must not pass by finding nothing).
  for (const known of ["src/lib/sanity/project.ts", "src/data/services.ts", "src/lib/proof.ts", "src/lib/constants/homepage-data.ts"]) {
    assert.ok(fromSrc.includes(known), `found ${known}`);
  }
  const missing = fromSrc.filter((f) => !covered(f));
  assert.deepEqual(missing, [], `add these to the push paths in .github/workflows/sanity-schema-deploy.yml: ${missing.join(", ")}`);
  // Every Sanity file is covered too.
  for (const f of files) if (!f.startsWith("src/") && !f.startsWith("node_modules/")) assert.ok(covered(f) || f === "sanity.cli.ts", `${f} in the trigger`);
});

test("it runs on pushes to main that change sanity/, sanity.config.ts or a file they import", () => {
  assert.match(workflow, /on:\n {2}push:\n {4}branches: \[main\]\n {4}paths:\n/);
  assert.ok(triggerPaths.includes("sanity/**") && triggerPaths.includes("sanity.config.ts"), triggerPaths.join(", "));
  for (const p of ["src/data/services.ts", "src/lib/what-we-do.ts", "src/lib/proof.ts"]) assert.ok(triggerPaths.includes(p), p);
  assert.ok(covered("sanity/schemas/testimonial.ts") && !covered("src/lib/proof.test.ts") && !covered("src/app/page.tsx"));
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
