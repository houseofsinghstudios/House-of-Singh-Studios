// The studio and founder structured data on every site page (src/lib/site-graph.ts), and the one
// founder id shared with houseofsingh.com. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { siteGraph } from "@/lib/site-graph";
import { ORG_ID, PERSON_ID, personRef } from "@/lib/schema";

const PERSON = "https://houseofsingh.com/#maninder-singh";
const PORTRAIT = "https://cdn.sanity.io/images/00iree4d/production/abc123-1200x1500.jpg";
type Node = Record<string, unknown>;
const nodes = (g = siteGraph({ founderImage: PORTRAIT })) => g["@graph"] as Node[];
const person = (g?: ReturnType<typeof siteGraph>) => nodes(g).find((n) => n["@type"] === "Person")!;
const studio = (g?: ReturnType<typeof siteGraph>) => nodes(g).find((n) => n["@id"] === ORG_ID)!;

test("one founder id, shared with houseofsingh.com", () => {
  assert.equal(PERSON_ID, PERSON);
  assert.deepEqual(personRef, { "@id": PERSON });
  assert.equal(person()["@id"], PERSON);
  assert.deepEqual(studio().founder, { "@id": PERSON });
});

test("the Person node: name, url, title, portrait, studio, RGD, fields and profiles", () => {
  const p = person();
  assert.equal(p.name, "Maninder Singh");
  assert.equal(p.url, "https://houseofsingh.com");
  assert.equal(p.jobTitle, "Founder and Creative Director");
  assert.equal(p.image, PORTRAIT);
  assert.deepEqual(p.worksFor, { "@id": "https://studios.houseofsingh.com/#organization" });
  assert.deepEqual(p.memberOf, { "@type": "Organization", name: "RGD (Registered Graphic Designers)", url: "https://rgd.ca" });
  assert.deepEqual(p.knowsAbout, ["Brand identity", "Creative direction", "Art direction", "Photography", "Packaging design", "Web design"]);
  assert.deepEqual(p.sameAs, [
    "https://rgd.ca/members/profile/manindersingh",
    "https://www.linkedin.com/in/manindersingh333",
    "https://www.instagram.com/houseofsingh/",
  ]);
});

test("without a portrait from Site Settings the Person node simply has no image", () => {
  assert.equal("image" in person(siteGraph()), false);
});

test("no source file still uses the old studio founder id", () => {
  const old = "studios.houseofsingh.com/#maninder-singh";
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? walk(p) : /\.(ts|tsx|mjs)$/.test(e.name) ? [p] : [];
    });
  const hits = [...walk(path.join(process.cwd(), "src")), ...walk(path.join(process.cwd(), "scripts"))].filter((f) => fs.readFileSync(f, "utf8").includes(old));
  assert.deepEqual(hits, []);
});

test("the studio: founded 8 September 2023, a venture of House of Singh", () => {
  const s = studio();
  assert.equal(s.foundingDate, "2023-09-08");
  assert.deepEqual(s.parentOrganization, {
    "@type": "Organization",
    "@id": "https://houseofsingh.com/#organization",
    name: "House of Singh",
    url: "https://houseofsingh.com",
    foundingDate: "2014",
    founder: { "@id": PERSON },
  });
  // Every other studio field is as before.
  for (const key of ["name", "url", "logo", "image", "description", "email", "address", "areaServed", "knowsAbout", "sameAs", "numberOfEmployees", "priceRange"]) assert.ok(key in s, key);
  assert.equal(s.name, "House of Singh Studios");
  assert.deepEqual(s["@type"], ["ProfessionalService", "Organization"]);
});

test("/about: an AboutPage whose main entity is the studio", () => {
  const src = fs.readFileSync(path.join(process.cwd(), "src/app/(site)/about/page.tsx"), "utf8");
  assert.match(src, /"@type": "AboutPage"/);
  assert.match(src, /mainEntity: orgRef/);
  assert.match(src, /__html: jsonLd\(ABOUT_PAGE\)/);
});
