// The services mirror: ServiceData (src/data/services.ts) to a Sanity "service" document and back,
// and a field by field comparison of the two. Pure, so it is tested without Sanity.
// The field lists below must match ServiceData and sanity/schemas/service.ts. If the code gains a
// field, checkShape stops the import until the schema and this file are updated too.

// ServiceData's fields, in the order the type declares them.
export const SERVICE_FIELDS = [
  "slug",
  "number",
  "name",
  "subtitle",
  "seoH1",
  "headline",
  "description",
  "tagline",
  "seoTitle",
  "seoDescription",
  "gradient",
  "deliverables",
  "impact",
  "localSection",
  "process",
  "faqs",
  "ctaHeading",
];
// Fields a service may leave out: a service without questions has no faqs at all.
export const OPTIONAL_FIELDS = ["faqs"];
export const DELIVERABLE_FIELDS = ["name", "description"];
export const IMPACT_FIELDS = ["heading", "body"];
export const PROCESS_FIELDS = ["step", "name", "description"];
export const LOCAL_FIELDS = ["heading", "intro", "rows"];
export const LOCAL_ROW_FIELDS = ["name", "description"];
export const FAQ_FIELDS = ["question", "answer"];

// Sanity's own keys, and the mirror's only addition (order). Anything else in a document is reported.
const SYSTEM_KEYS = ["_id", "_type", "_rev", "_createdAt", "_updatedAt", "_key", "_system"];

export const serviceDocumentId = (slug) => `service-${slug}`;
const pad = (n) => String(n).padStart(2, "0");

// Every problem with one service's shape, as plain sentences. Empty when it can be mirrored exactly.
export function checkShape(service) {
  const problems = [];
  const exact = (value, fields, where) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return problems.push(`${where} is not an object`);
    for (const key of Object.keys(value)) if (!fields.includes(key)) problems.push(`${where} has a field the mirror does not know: ${key}`);
    for (const key of fields) if (!(key in value) && !(where === "service" && OPTIONAL_FIELDS.includes(key))) problems.push(`${where} is missing ${key}`);
  };
  const strings = (value, fields, where) => {
    for (const key of fields) if (key in value && typeof value[key] !== "string") problems.push(`${where}.${key} is not text`);
  };
  exact(service, SERVICE_FIELDS, "service");
  if (problems.length) return problems;
  strings(service, SERVICE_FIELDS.filter((f) => !["deliverables", "impact", "localSection", "process", "faqs"].includes(f)), "service");
  const list = (key, fields) => {
    if (!Array.isArray(service[key])) return problems.push(`${key} is not a list`);
    service[key].forEach((item, i) => {
      exact(item, fields, `${key}[${i}]`);
      if (item && typeof item === "object") strings(item, fields, `${key}[${i}]`);
    });
  };
  list("deliverables", DELIVERABLE_FIELDS);
  list("process", PROCESS_FIELDS);
  if ("faqs" in service) list("faqs", FAQ_FIELDS);
  exact(service.impact, IMPACT_FIELDS, "impact");
  if (service.impact && typeof service.impact === "object") strings(service.impact, IMPACT_FIELDS, "impact");
  const local = service.localSection;
  exact(local, LOCAL_FIELDS, "localSection");
  if (local && typeof local === "object" && !Array.isArray(local)) {
    strings(local, ["heading", "intro"], "localSection");
    if (!Array.isArray(local.rows)) problems.push("localSection.rows is not a list");
    else local.rows.forEach((row, i) => {
      exact(row, LOCAL_ROW_FIELDS, `localSection.rows[${i}]`);
      if (row && typeof row === "object") strings(row, LOCAL_ROW_FIELDS, `localSection.rows[${i}]`);
    });
  }
  return problems;
}

// order is the service's position in the code, starting at 1. Array keys are fixed by position, so
// the same code always produces the same document.
export function toServiceDocument(service, order) {
  return {
    _id: serviceDocumentId(service.slug),
    _type: "service",
    slug: { _type: "slug", current: service.slug },
    number: service.number,
    name: service.name,
    subtitle: service.subtitle,
    seoH1: service.seoH1,
    headline: service.headline,
    description: service.description,
    tagline: service.tagline,
    seoTitle: service.seoTitle,
    seoDescription: service.seoDescription,
    gradient: service.gradient,
    deliverables: service.deliverables.map((d, i) => ({
      _type: "serviceDeliverable",
      _key: `deliverable-${pad(i + 1)}`,
      name: d.name,
      description: d.description,
    })),
    impact: { heading: service.impact.heading, body: service.impact.body },
    localSection: {
      heading: service.localSection.heading,
      intro: service.localSection.intro,
      rows: service.localSection.rows.map((r, i) => ({
        _type: "serviceLocalRow",
        _key: `row-${pad(i + 1)}`,
        name: r.name,
        description: r.description,
      })),
    },
    process: service.process.map((p, i) => ({
      _type: "serviceProcessStep",
      _key: `step-${pad(i + 1)}`,
      step: p.step,
      name: p.name,
      description: p.description,
    })),
    ...(Array.isArray(service.faqs)
      ? {
          faqs: service.faqs.map((f, i) => ({
            _type: "serviceFaq",
            _key: `faq-${pad(i + 1)}`,
            question: f.question,
            answer: f.answer,
          })),
        }
      : {}),
    ctaHeading: service.ctaHeading,
    order,
  };
}

// A document read back from Sanity, in ServiceData's shape: Sanity's keys removed, the slug unwrapped.
export function fromServiceDocument(doc) {
  const pick = (value, fields) => (value && typeof value === "object" ? Object.fromEntries(fields.map((f) => [f, value[f]])) : value);
  const service = {
    slug: doc.slug && typeof doc.slug === "object" ? doc.slug.current : doc.slug,
    ...Object.fromEntries(SERVICE_FIELDS.slice(1).map((f) => [f, doc[f]])),
    deliverables: Array.isArray(doc.deliverables) ? doc.deliverables.map((d) => pick(d, DELIVERABLE_FIELDS)) : doc.deliverables,
    impact: pick(doc.impact, IMPACT_FIELDS),
    localSection:
      doc.localSection && typeof doc.localSection === "object"
        ? {
            heading: doc.localSection.heading,
            intro: doc.localSection.intro,
            rows: Array.isArray(doc.localSection.rows) ? doc.localSection.rows.map((r) => pick(r, LOCAL_ROW_FIELDS)) : doc.localSection.rows,
          }
        : doc.localSection,
    process: Array.isArray(doc.process) ? doc.process.map((p) => pick(p, PROCESS_FIELDS)) : doc.process,
    faqs: Array.isArray(doc.faqs) ? doc.faqs.map((f) => pick(f, FAQ_FIELDS)) : doc.faqs,
  };
  // Optional fields Sanity does not have are left out, as in the code.
  for (const field of OPTIONAL_FIELDS) if (service[field] === undefined) delete service[field];
  return service;
}

// Every difference between the code and a Sanity document, one line each. Empty means identical.
// Checks values, list lengths and order, the order field, and fields Sanity has that the code does not.
export function compareService(service, doc, order) {
  if (!doc) return ["missing from Sanity"];
  const differences = [];
  const show = (v) => (v === undefined ? "(empty)" : JSON.stringify(v));
  const walk = (a, b, path) => {
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) return differences.push(`${path}: code has a list of ${a.length}, Sanity has ${show(b)}`);
      if (a.length !== b.length) differences.push(`${path}: code has ${a.length}, Sanity has ${b.length}`);
      a.forEach((item, i) => (i < b.length ? walk(item, b[i], `${path}[${i}]`) : null));
      return;
    }
    if (a && typeof a === "object") {
      if (!b || typeof b !== "object") return differences.push(`${path}: Sanity has ${show(b)}`);
      for (const key of Object.keys(a)) walk(a[key], b[key], path ? `${path}.${key}` : key);
      return;
    }
    if (a !== b) differences.push(`${path}: code ${show(a)}, Sanity ${show(b)}`);
  };
  walk(service, fromServiceDocument(doc), "");
  if (doc.order !== order) differences.push(`order: expected ${order}, Sanity ${show(doc.order)}`);
  for (const field of OPTIONAL_FIELDS) {
    if (!(field in service) && doc[field] !== undefined) differences.push(`${field}: in Sanity but not in the code`);
  }
  const extra = (value, fields, where) => {
    if (!value || typeof value !== "object") return;
    for (const key of Object.keys(value)) if (!fields.includes(key) && !SYSTEM_KEYS.includes(key)) differences.push(`${where}${key}: in Sanity but not in the code`);
  };
  extra(doc, [...SERVICE_FIELDS, "order", "referenceNote"], "");
  (Array.isArray(doc.deliverables) ? doc.deliverables : []).forEach((d, i) => extra(d, DELIVERABLE_FIELDS, `deliverables[${i}].`));
  (Array.isArray(doc.process) ? doc.process : []).forEach((p, i) => extra(p, PROCESS_FIELDS, `process[${i}].`));
  extra(doc.impact, IMPACT_FIELDS, "impact.");
  (Array.isArray(doc.faqs) ? doc.faqs : []).forEach((f, i) => extra(f, FAQ_FIELDS, `faqs[${i}].`));
  extra(doc.localSection, LOCAL_FIELDS, "localSection.");
  (Array.isArray(doc.localSection?.rows) ? doc.localSection.rows : []).forEach((r, i) => extra(r, LOCAL_ROW_FIELDS, `localSection.rows[${i}].`));
  return differences;
}

// One line per field for the dry run: text fields by length, lists by count.
export function describeService(service) {
  return SERVICE_FIELDS.map((field) => {
    const value = service[field];
    if (value === undefined) return [field, "none"];
    if (Array.isArray(value)) return [field, `${value.length}`];
    if (field === "localSection" && value && Array.isArray(value.rows)) return [field, `heading, intro and ${value.rows.length} rows`];
    if (value && typeof value === "object") return [field, Object.keys(value).join(" and ")];
    return [field, `${String(value).length} characters`];
  });
}

// Service documents in Sanity that are not part of the mirror (older documents), by id and title.
export function otherServiceDocuments(docs, slugs) {
  const ids = new Set(slugs.map(serviceDocumentId));
  return docs.filter((d) => !ids.has(d._id.replace(/^drafts\./, "")));
}
