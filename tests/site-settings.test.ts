// Site Settings: the unused fields are hidden in Studio (never deleted), and nothing in src reads them.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const HIDDEN = ["studioName", "tagline", "description", "email", "phone", "location", "instagramUrl", "linkedinUrl", "ogImage"];
const schema = readFileSync("sanity/schemas/siteSettings.ts", "utf8");
const field = (name: string) => schema.slice(schema.indexOf(`name: "${name}"`), schema.indexOf("}),", schema.indexOf(`name: "${name}"`)));

test("the unused Site Settings fields are hidden, not deleted", () => {
  for (const name of HIDDEN) assert.match(field(name), /hidden: true/, name);
  for (const name of ["aboutStudioImage", "aboutFounderImage", "aboutFounderName", "aboutFounderRole", "aboutFounderBio", "aboutFounderBioSecondary"]) {
    assert.doesNotMatch(field(name), /hidden/, `${name} stays visible`);
  }
  for (const name of ["aboutFounderRole", "aboutFounderBio", "aboutFounderBioSecondary"]) {
    assert.match(field(name), /When empty, the About page shows the text written in the code\./, name);
  }
});

test("nothing in src reads the hidden fields from Site Settings", () => {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(ts|tsx)$/.test(entry)) files.push(full);
    }
  };
  walk("src");
  const settingsQueries = files.flatMap((file) => [...readFileSync(file, "utf8").matchAll(/_type == "siteSettings"[^`]*`?/g)].map((m) => m[0]));
  assert.ok(settingsQueries.length >= 2, "the About page and founder image queries");
  for (const query of settingsQueries) for (const name of HIDDEN) assert.doesNotMatch(query, new RegExp(`\\b${name}\\b`), `${name} in ${query}`);
});
