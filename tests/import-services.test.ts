// Services import: the code to Sanity transform, the comparison, and a commit then verify against a
// fake client that keeps documents in memory. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { services, type ServiceData } from "@/data/services";
import {
  DELIVERABLE_FIELDS,
  IMPACT_FIELDS,
  LOCAL_FIELDS,
  LOCAL_ROW_FIELDS,
  FAQ_FIELDS,
  OPTIONAL_FIELDS,
  PROCESS_FIELDS,
  SERVICE_FIELDS,
  checkShape,
  compareService,
  describeService,
  fromServiceDocument,
  otherServiceDocuments,
  serviceDocumentId,
  toServiceDocument,
} from "../scripts/import-services/lib/transform.mjs";
import { commit, dryRun, verify } from "../scripts/import-services/lib/run.mjs";

type Doc = Record<string, unknown> & { _id: string };
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const first = services[0];

// Answers the tool's three queries from an in-memory dataset and records every write.
function fakeClient(initial: Doc[] = []) {
  const docs = new Map(initial.map((d) => [d._id, clone(d)]));
  const writes: string[] = [];
  return {
    docs,
    writes,
    transaction() {
      const pending: Doc[] = [];
      const tx = {
        createOrReplace(doc: Doc) { pending.push(clone(doc)); return tx; },
        async commit() { for (const d of pending) { docs.set(d._id, d); writes.push(d._id); } },
      };
      return tx;
    },
    async fetch(query: string, params: { ids?: string[] } = {}) {
      const all = [...docs.values()];
      if (query.startsWith(`*[_type == "service"]`)) return all.filter((d) => d._type === "service").map(({ _id, title, name }) => ({ _id, title, name }));
      if (query === "*[_id in $ids]._id") return all.filter((d) => params.ids!.includes(d._id)).map((d) => d._id);
      if (query === "*[_id in $ids]") return all.filter((d) => params.ids!.includes(d._id));
      throw new Error(`unexpected query ${query}`);
    },
  };
}
const OLD = [
  { _id: "465c186d-dc15-4c31-863f-f424786fafa8", _type: "service", title: "Strategy", slug: { _type: "slug", current: "strategy" } },
  { _id: "fcd1eb41-d93a-4a8d-8709-47717509c844", _type: "service", title: "Brand Identity & Visual Design", slug: { _type: "slug", current: "brand-identity-and-visual-design" } },
  { _id: "drafts.fcd1eb41-d93a-4a8d-8709-47717509c844", _type: "service", title: "Brand Identity & Visual Design", order: 0 },
];

test("the field lists match ServiceData, and the schema lists the same fields in the same order", () => {
  for (const s of services) {
    assert.deepEqual(Object.keys(s), SERVICE_FIELDS.filter((f) => f in s), s.slug);
    assert.ok(SERVICE_FIELDS.filter((f) => !(f in s)).every((f) => OPTIONAL_FIELDS.includes(f)), `${s.slug} misses a required field`);
    (s.faqs || []).forEach((f) => assert.deepEqual(Object.keys(f), FAQ_FIELDS));
    s.deliverables.forEach((d) => assert.deepEqual(Object.keys(d), DELIVERABLE_FIELDS));
    s.process.forEach((p) => assert.deepEqual(Object.keys(p), PROCESS_FIELDS));
    assert.deepEqual(Object.keys(s.impact), IMPACT_FIELDS);
    assert.deepEqual(Object.keys(s.localSection), LOCAL_FIELDS);
    s.localSection.rows.forEach((r) => assert.deepEqual(Object.keys(r), LOCAL_ROW_FIELDS));
  }
  // The schema module loads Studio's React code, which this runner cannot, so its field names are
  // read from the file in order: the type, then every field, nested ones included, as declared.
  const schema = fs.readFileSync("sanity/schemas/service.ts", "utf8");
  const names = [...schema.matchAll(/^\s+name: "(\w+)",$/gm)].map((m) => m[1]);
  assert.deepEqual(names, [
    "service",
    "referenceNote",
    ...SERVICE_FIELDS.slice(0, SERVICE_FIELDS.indexOf("deliverables") + 1),
    "serviceDeliverable", ...DELIVERABLE_FIELDS,
    "impact", ...IMPACT_FIELDS,
    "localSection", "heading", "intro", "rows", "serviceLocalRow", ...LOCAL_ROW_FIELDS,
    "process", "serviceProcessStep", ...PROCESS_FIELDS,
    "faqs", "serviceFaq", ...FAQ_FIELDS,
    "ctaHeading",
    "order",
    "orderAsc",
  ]);
});

test("all four coded services have a shape the mirror covers", () => {
  assert.equal(services.length, 4);
  for (const s of services) assert.deepEqual(checkShape(s), [], s.slug);
});

test("a new or missing field in the code stops the import", () => {
  assert.match(checkShape({ ...first, questions: [] } as unknown as ServiceData).join(), /does not know: questions/);
  const noTagline: Partial<ServiceData> = { ...first };
  delete noTagline.tagline;
  assert.match(checkShape(noTagline as ServiceData).join(), /missing tagline/);
  assert.match(checkShape({ ...first, deliverables: [{ name: "x", description: "y", image: "z" }] } as unknown as ServiceData).join(), /deliverables\[0\] has a field the mirror does not know: image/);
  assert.match(checkShape({ ...first, impact: { heading: "x" } } as unknown as ServiceData).join(), /impact is missing body/);
  assert.match(checkShape({ ...first, number: 1 } as unknown as ServiceData).join(), /number is not text/);
});

test("transform: every field type becomes its Sanity shape", () => {
  const doc = toServiceDocument(first, 1);
  assert.equal(doc._id, "service-brand-identity");
  assert.equal(doc._type, "service");
  // slug: a string becomes a slug object
  assert.deepEqual(doc.slug, { _type: "slug", current: "brand-identity" });
  // plain strings stay plain strings
  for (const f of ["number", "name", "subtitle", "headline", "description", "tagline", "seoTitle", "seoDescription", "gradient", "ctaHeading"] as const) {
    assert.equal(doc[f], first[f], f);
  }
  // lists of objects gain a type and a fixed key per position
  assert.equal(doc.deliverables.length, 9);
  assert.deepEqual(doc.deliverables[0], { _type: "serviceDeliverable", _key: "deliverable-01", name: "Brand Strategy", description: first.deliverables[0].description });
  assert.equal(doc.deliverables[8]._key, "deliverable-09");
  assert.deepEqual(doc.process[4], { _type: "serviceProcessStep", _key: "step-05", step: "05", name: "Delivery", description: first.process[4].description });
  // a nested object stays a plain object
  assert.deepEqual(doc.impact, first.impact);
  // order is the position in the code
  assert.equal(doc.order, 1);
  assert.equal(toServiceDocument(services[3], 4).order, 4);
  assert.deepEqual(toServiceDocument(first, 1), doc, "the same code always gives the same document");
});

test("round trip: every service comes back from its document unchanged", () => {
  services.forEach((s, i) => {
    assert.deepEqual(fromServiceDocument(toServiceDocument(s, i + 1)), s, s.slug);
    assert.deepEqual(compareService(s, toServiceDocument(s, i + 1), i + 1), [], s.slug);
  });
});

test("compare: names every difference by its path", () => {
  const doc = clone(toServiceDocument(first, 1));
  doc.headline = "Changed.";
  doc.deliverables[2].name = "Logo";
  doc.deliverables.pop();
  doc.impact.body = "Short.";
  doc.process[0].step = "1";
  doc.order = 7;
  (doc as Record<string, unknown>).title = "Old field";
  (doc.deliverables[0] as Record<string, unknown>).image = "x";
  const diff = compareService(first, doc, 1);
  assert.ok(diff.includes(`headline: code ${JSON.stringify(first.headline)}, Sanity "Changed."`), diff.join("\n"));
  assert.ok(diff.includes(`deliverables[2].name: code "Logo System", Sanity "Logo"`));
  assert.ok(diff.includes("deliverables: code has 9, Sanity has 8"));
  assert.ok(diff.includes(`impact.body: code ${JSON.stringify(first.impact.body)}, Sanity "Short."`));
  assert.ok(diff.includes(`process[0].step: code "01", Sanity "1"`));
  assert.ok(diff.includes("order: expected 1, Sanity 7"));
  assert.ok(diff.includes("title: in Sanity but not in the code"));
  assert.ok(diff.includes("deliverables[0].image: in Sanity but not in the code"));
  assert.deepEqual(compareService(first, undefined, 1), ["missing from Sanity"]);
  const noSlug = clone(toServiceDocument(first, 1)) as Record<string, unknown>;
  delete noSlug.slug;
  assert.ok(compareService(first, noSlug, 1).includes(`slug: code "brand-identity", Sanity (empty)`));
});

test("describe: text fields by length, lists by count", () => {
  const rows = Object.fromEntries(describeService(first));
  assert.equal(rows.deliverables, "9");
  assert.equal(rows.process, "5");
  assert.equal(rows.impact, "heading and body");
  assert.equal(rows.number, "2 characters");
  assert.deepEqual(Object.keys(rows), SERVICE_FIELDS);
});

test("older service documents are named, never part of the mirror", () => {
  const others = otherServiceDocuments([...OLD, { _id: "service-brand-identity" }, { _id: "drafts.service-visual-media" }], services.map((s) => s.slug));
  assert.deepEqual(others.map((d: { _id: string }) => d._id), OLD.map((d) => d._id));
  assert.equal(serviceDocumentId("visual-media"), "service-visual-media");
});

test("dry run: counts per service, plans per document, old documents named and untouched", async () => {
  const client = fakeClient([...OLD, toServiceDocument(first, 1) as unknown as Doc]);
  const out: string[] = [];
  const result = await dryRun(services, client, { log: (l: string) => out.push(l) });
  const text = out.join("\n");
  assert.match(text, /deliverables:\s+9/);
  assert.match(text, /WILL REPLACE\s+service-brand-identity/);
  assert.match(text, /WILL CREATE\s+service-creative-strategy/);
  assert.match(text, /465c186d-dc15-4c31-863f-f424786fafa8  Strategy/);
  assert.equal(result.others.length, 3);
  assert.deepEqual(client.writes, [], "a dry run writes nothing");
  const offline: string[] = [];
  await dryRun(services, null, { log: (l: string) => offline.push(l), notChecked: ".env.import was not found." });
  assert.match(offline.join("\n"), /Not checked: .env.import was not found./);
});

test("commit then verify: identical; old documents untouched; a later edit in Studio is reported", async () => {
  const client = fakeClient(OLD);
  const out: string[] = [];
  const log = (l: string) => out.push(l);
  await commit(services, client, { log });
  assert.deepEqual(client.writes, services.map((s) => `service-${s.slug}`));
  for (const old of OLD) assert.deepEqual(client.docs.get(old._id), old, `${old._id} untouched`);
  assert.equal(await verify(services, client, { log }), 0);
  assert.match(out.join("\n"), /Identical: Sanity matches the code./);

  (client.docs.get("service-visual-media") as Record<string, unknown>).ctaHeading = "Edited in Studio";
  const again: string[] = [];
  assert.equal(await verify(services, client, { log: (l: string) => again.push(l) }), 1);
  assert.match(again.join("\n"), /visual-media\s+1 difference\(s\)\n\s+- ctaHeading: code "Ready to build a content system\?", Sanity "Edited in Studio"/);

  await commit(services, client, { log });
  assert.equal(await verify(services, client, { log }), 0, "a second commit restores the copy");
});

test("transform: the GTA section keeps heading and intro as text and gives each row a type and a fixed key", () => {
  const doc = toServiceDocument(first, 1);
  assert.equal(doc.seoH1, "Brand identity design and rebranding in Toronto");
  assert.equal(doc.localSection.heading, first.localSection.heading);
  assert.equal(doc.localSection.intro, first.localSection.intro);
  assert.equal(doc.localSection.rows.length, 3);
  assert.deepEqual(doc.localSection.rows[2], { _type: "serviceLocalRow", _key: "row-03", ...first.localSection.rows[2] });
  const changed = clone(doc);
  changed.localSection.rows[1].name = "Edited";
  assert.ok(compareService(first, changed, 1).includes(`localSection.rows[1].name: code ${JSON.stringify(first.localSection.rows[1].name)}, Sanity "Edited"`));
  assert.match(checkShape({ ...first, localSection: { heading: "x", intro: "y" } } as unknown as ServiceData).join(), /localSection is missing rows/);
  assert.equal(Object.fromEntries(describeService(first)).localSection, "heading, intro and 3 rows");
});

test("questions: optional; written to Sanity only when the code has them, and compared both ways", () => {
  const withFaqs = services.find((s) => s.faqs && s.faqs.length > 0)!;
  // Every service has questions now, so one without is made by leaving them out.
  const without = clone(services.find((s) => s.slug === "creative-strategy")!);
  delete without.faqs;
  assert.equal(withFaqs.slug, "brand-identity");
  const doc = toServiceDocument(withFaqs, 1);
  assert.equal(doc.faqs.length, 6);
  assert.deepEqual(doc.faqs[0], { _type: "serviceFaq", _key: "faq-01", ...withFaqs.faqs![0] });
  assert.ok(!("faqs" in toServiceDocument(without, 2)), "no faqs field at all without questions");
  assert.deepEqual(fromServiceDocument(toServiceDocument(without, 2)), without);
  assert.deepEqual(compareService(without, toServiceDocument(without, 2), 2), []);
  const extraFaqs = { ...toServiceDocument(without, 2), faqs: doc.faqs };
  assert.ok(compareService(without, extraFaqs, 2).includes("faqs: in Sanity but not in the code"));
  const edited = clone(doc);
  edited.faqs[4].answer = "Changed.";
  assert.equal(compareService(withFaqs, edited, 1).filter((d) => d.startsWith("faqs[4].answer")).length, 1);
  assert.match(checkShape({ ...without, faqs: [{ question: "Q?" }] } as unknown as ServiceData).join(), /faqs\[0\] is missing answer/);
  assert.equal(Object.fromEntries(describeService(without)).faqs, "none");
  assert.equal(Object.fromEntries(describeService(withFaqs)).faqs, "6");
});
