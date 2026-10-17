// Runs one role file: validate, print what will be written, then (commit only) check Sanity for the
// slug and write. The Sanity client is passed in, so a dry run gets null and never touches the network.
// Roles are only ever created or replaced. Nothing here deletes a document.

import { toPortableText, uniqueKey } from "../../import-portfolio/lib/sanity.mjs";
import { readRole } from "./role.mjs";

const LISTS = [
  ["responsibilities", "Responsibilities"],
  ["requirements", "Requirements"],
  ["niceToHave", "Nice to have"],
];

export async function runRole(file, { dryRun, client, overwrite, now = () => new Date().toISOString() }) {
  const role = readRole(file);
  const { slug, meta, errors, warnings } = role;
  const title = meta?.title || "(no title)";
  const result = { slug, title, status: "failed", detail: "" };
  const warn = () => warnings.forEach((w) => console.log(`  warning [${slug}]: ${w}`));

  console.log(`\n${"=".repeat(72)}\n${slug}  |  ${title}\n${"=".repeat(72)}`);
  if (errors.length) {
    console.log(`  FAILED validation, ${errors.length} problem(s). Nothing was written:`);
    errors.forEach((e) => console.log(`    - [${slug}] ${e}`));
    warn();
    return { ...result, detail: `${errors.length} validation problem(s)` };
  }
  console.log("  Validation passed.");
  printRole(role);
  warn();

  if (dryRun) return { ...result, status: "would create", detail: "dry run" };

  try {
    const target = decideTarget(await findExisting(client, slug), overwrite);
    if (target.action === "skip") {
      console.log(`  SKIPPED [${slug}]: ${target.reason}`);
      return { ...result, status: "skipped", detail: target.reason };
    }
    if (target.action === "overwrite") console.log(`  warning [${slug}]: --overwrite will replace document ${target.id}.`);
    if (target.draftNote) console.log(`  warning [${slug}]: ${target.draftNote}`);

    const doc = buildRoleDocument(role, target.publishedAt || now());
    const written = target.action === "overwrite" ? await client.createOrReplace({ ...doc, _id: target.id }) : await client.create(doc);
    const status = target.action === "overwrite" ? "overwritten" : "created";
    console.log(`\n  ${status.toUpperCase()}: document ${written._id}`);
    return { ...result, status, detail: written._id };
  } catch (err) {
    console.log(`  FAILED [${slug}]: ${explain(err)}`);
    return { ...result, detail: explain(err) };
  }
}

function printRole({ slug, meta, paragraphs, lists }) {
  const row = (label, value) => console.log(`    ${`${label}:`.padEnd(19)}${value}`);
  const defaulted = (field) => (meta.defaults.includes(field) ? "  (default, not set in the file)" : "");
  row("title", meta.title);
  row("slug", slug);
  row("department", meta.department);
  row("type", meta.type);
  row("location", `${meta.location}${defaulted("location")}`);
  row("active", `${meta.active ? "yes" : "no, hidden from the careers page"}${defaulted("active")}`);
  row("order", `${meta.order}${defaulted("order")}`);
  row("summary", `${meta.summary.length} characters`);
  row("About the role", `${paragraphs.length} paragraph${paragraphs.length === 1 ? "" : "s"}`);
  for (const [field, label] of LISTS) {
    const items = lists[field];
    row(label, items ? `${items.length} item${items.length === 1 ? "" : "s"}` : "none (no section)");
  }
}

export async function findExisting(client, slug) {
  return client.fetch(`*[_type == "role" && slug.current == $slug]{ _id, title, publishedAt }`, { slug });
}

// Create, skip or overwrite for one slug. Overwrite keeps the original publishedAt.
export function decideTarget(existing, overwrite) {
  if (existing.length === 0) return { action: "create" };

  const published = existing.filter((d) => !d._id.startsWith("drafts.") && !d._id.startsWith("versions."));
  const drafts = existing.filter((d) => d._id.startsWith("drafts."));
  const names = existing.map((d) => `${(d.title || "(untitled)").trim()} [${d._id}]`).join(", ");

  if (!overwrite) return { action: "skip", reason: `A role with this slug already exists: ${names}. Pass --overwrite to replace it.` };
  if (published.length > 1) return { action: "skip", reason: `More than one published role uses this slug (${names}). Fix this in Studio first.` };

  const source = published[0] || drafts[0];
  const draftNote = drafts.length
    ? `An unpublished draft also exists (${drafts.map((d) => d._id).join(", ")}). Studio will keep showing the draft until it is discarded.`
    : null;
  return { action: "overwrite", id: source._id.replace(/^drafts\./, ""), publishedAt: source.publishedAt || null, draftNote };
}

export function buildRoleDocument({ slug, meta, paragraphs, lists }, publishedAt) {
  const keys = new Set();
  const doc = {
    _type: "role",
    title: meta.title,
    slug: { _type: "slug", current: slug },
    department: meta.department,
    type: meta.type,
    location: meta.location,
    summary: meta.summary,
    description: toPortableText(paragraphs, () => uniqueKey(keys)),
    responsibilities: lists.responsibilities,
    requirements: lists.requirements,
    niceToHave: lists.niceToHave,
    isActive: meta.active,
    order: meta.order,
    publishedAt,
  };
  return Object.fromEntries(Object.entries(doc).filter(([, v]) => v !== undefined));
}

// Same wording as the portfolio import. Kept here so the roles import never loads the image tools.
export function explain(err) {
  if (err && (err.statusCode === 401 || err.statusCode === 403)) {
    return `Sanity rejected the token (HTTP ${err.statusCode}). Check that SANITY_WRITE_TOKEN in .env.import is correct and has Editor permission.`;
  }
  return err && err.message ? err.message : String(err);
}
