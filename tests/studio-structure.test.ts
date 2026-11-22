import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { HIDDEN_TYPES, structure } from "../sanity/structure";

test("teamMember and package are hidden in Studio, with their schemas kept; testimonials are listed again", () => {
  assert.deepEqual([...HIDDEN_TYPES].sort(), ["package", "teamMember"]);
  // Read as text: the sanity package cannot load under the test runner's react-server condition.
  const index = readFileSync("sanity/schemas/index.ts", "utf8");
  for (const [type, imported] of [["testimonial", "testimonial"], ["teamMember", "teamMember"], ["package", "packageSchema"]]) {
    assert.match(index, new RegExp(`^  ${imported},$`, "m"), `${type} schema still registered, so existing documents stay readable`);
    assert.match(readFileSync(`sanity/schemas/${type}.ts`, "utf8"), new RegExp(`name: "${type}"`));
  }
});

test("hidden types are left out of the desk and of every create new menu", () => {
  const structure = readFileSync("sanity/structure.ts", "utf8");
  assert.match(structure, /!HIDDEN_TYPES\.includes\(item\.getId\(\)/);
  const config = readFileSync("sanity.config.ts", "utf8");
  assert.match(config, /templates\.filter\(\(t\) => !HIDDEN_TYPES\.includes\(t\.schemaType\)\)/);
});

test("Service Pricing is gone from the code (22 Nov 2026): no schema, no registration, no desk entry", () => {
  assert.ok(!existsSync("sanity/schemas/servicePricing.ts"));
  for (const file of ["sanity/schemas/index.ts", "sanity/structure.ts", "sanity.config.ts"]) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /servicePricing|SINGLETONS/, file);
  }
});

// Behaviour, beside the text checks above: the desk resolver run against a stand in for Sanity's
// Structure Builder, with every registered type, in the order sanity/schemas/index.ts lists them.
type Node = { kind: string; type?: string; [key: string]: unknown };
function chain(kind: string, extra: Record<string, unknown> = {}): Node {
  const node: Node = { kind, ...extra };
  for (const method of ["title", "id", "child", "schemaType", "documentId", "defaultOrdering", "items"]) {
    node[method] = (value: unknown) => { node[method + "Value"] = value; return node; };
  }
  return node;
}
const REGISTERED = ["service", "caseStudy", "post", "package", "testimonial", "teamMember", "siteSettings", "role", "initiative", "networkMember", "redirect"];
const S = {
  list: () => chain("list"),
  listItem: () => chain("listItem"),
  document: () => chain("document"),
  divider: () => ({ kind: "divider" }),
  documentTypeListItems: () => REGISTERED.map((type) => Object.assign(chain("typeItem", { type }), { getId: () => type })),
  documentTypeList: (type: string) => chain("typeList", { type }),
};

test("the desk: every type except the hidden ones", () => {
  const desk = (structure as unknown as (s: typeof S, context: unknown) => Node)(S, {});
  assert.equal(desk.titleValue, "Content");
  const types = desk.itemsValue as Node[];
  assert.deepEqual(types.map((t) => t.type), ["service", "caseStudy", "post", "testimonial", "siteSettings", "role", "initiative", "networkMember", "redirect"]);
  for (const hidden of HIDDEN_TYPES) assert.ok(!types.some((t) => t.type === hidden), `${hidden} is not on the desk`);
  // Services and network members are listed under their own titles, by their order field.
  for (const [type, title] of [["service", "Services (reference copy)"], ["networkMember", "Network members"]]) {
    const item = types.find((t) => t.type === type)!;
    assert.equal(item.titleValue, title);
    assert.deepEqual((item.childValue as Node).defaultOrderingValue, [{ field: "order", direction: "asc" }]);
  }
  assert.equal(types.find((t) => t.type === "post")!.titleValue, undefined, "other types keep their own titles");
  // Testimonials: listed under the plural title, for the homepage Proof.
  const testimonials = types.find((t) => t.type === "testimonial")!;
  assert.equal(testimonials.titleValue, "Testimonials");
  assert.equal((testimonials.childValue as Node).titleValue, "Testimonials");
});
