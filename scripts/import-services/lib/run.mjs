// The three things the services import does: a dry run, a commit and a verify. Each takes the
// Sanity client (or null) and a log function, so the tests run them against a fake client.
// Documents are only ever created or replaced. Nothing here deletes a document.

import { explain } from "../../import-roles/lib/run.mjs";
import { compareService, describeService, otherServiceDocuments, serviceDocumentId, toServiceDocument } from "./transform.mjs";

const RULE = "=".repeat(72);

// client: a read client, or null when Sanity was not checked (the reason is in notChecked).
export async function dryRun(services, client, { log = console.log, notChecked = "" } = {}) {
  log("\nDRY RUN. Nothing will be written to Sanity. Run with --commit to write for real.");
  for (const [i, service] of services.entries()) {
    log(`\n${RULE}\n${service.number}  ${service.name}  ->  document ${serviceDocumentId(service.slug)}, order ${i + 1}\n${RULE}`);
    for (const [field, value] of describeService(service)) log(`    ${`${field}:`.padEnd(18)}${value}`);
  }

  log(`\n${RULE}\nIN SANITY NOW\n${RULE}`);
  let existing = null;
  if (client) {
    try {
      existing = await client.fetch(`*[_type == "service"]{ _id, title, name }`);
    } catch (err) {
      notChecked = explain(err);
    }
  }
  if (!existing) {
    log(`  Not checked: ${notChecked || "no Sanity connection."}\n`);
    return { checked: false };
  }
  const ids = new Set(existing.map((d) => d._id));
  for (const service of services) {
    const id = serviceDocumentId(service.slug);
    log(`  ${(ids.has(id) ? "WILL REPLACE" : "WILL CREATE").padEnd(14)}${id}`);
    if (ids.has(`drafts.${id}`)) log(`  warning: an unpublished draft drafts.${id} exists. Studio shows the draft until it is discarded.`);
  }
  const others = otherServiceDocuments(existing, services.map((s) => s.slug));
  if (others.length) {
    log("\n  Other service documents, left untouched:");
    for (const d of others) log(`    ${d._id}  ${d.title || d.name || "(untitled)"}`);
  }
  log("");
  return { checked: true, others };
}

// One transaction: either every service is written or none is.
export async function commit(services, client, { log = console.log } = {}) {
  log(`\nCOMMIT. Writing ${services.length} services to Sanity. Each document is replaced completely; nothing is deleted.`);
  const tx = client.transaction();
  services.forEach((service, i) => tx.createOrReplace(toServiceDocument(service, i + 1)));
  await tx.commit();
  for (const service of services) log(`  WRITTEN       ${serviceDocumentId(service.slug)}  ${service.name}`);
  const drafts = await client.fetch(`*[_id in $ids]._id`, { ids: services.map((s) => `drafts.${serviceDocumentId(s.slug)}`) });
  for (const id of drafts) log(`  warning: ${id} is an unpublished draft. Studio shows it instead of the copy until it is discarded.`);
}

// Returns the number of differences. 0 means Sanity is identical to the code.
export async function verify(services, client, { log = console.log } = {}) {
  const docs = await client.fetch(`*[_id in $ids]`, { ids: services.map((s) => serviceDocumentId(s.slug)) });
  const byId = new Map(docs.map((d) => [d._id, d]));
  log(`\n${RULE}\nVERIFY: Sanity compared with src/data/services.ts\n${RULE}`);
  let total = 0;
  services.forEach((service, i) => {
    const differences = compareService(service, byId.get(serviceDocumentId(service.slug)), i + 1);
    total += differences.length;
    log(`  ${service.slug.padEnd(20)}${differences.length ? `${differences.length} difference(s)` : "identical"}`);
    differences.forEach((d) => log(`      - ${d}`));
  });
  log(total ? `\n${total} difference(s). Run with --commit to copy the code into Sanity again.\n` : "\nIdentical: Sanity matches the code.\n");
  return total;
}
