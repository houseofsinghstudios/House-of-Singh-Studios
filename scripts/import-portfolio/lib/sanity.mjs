// Everything that talks to Sanity, plus the document builder.
// The client module is imported lazily so a dry run never loads it or opens a connection.

import crypto from "node:crypto";
import { API_VERSION } from "./config.mjs";

export async function createSanityClient({ projectId, dataset, token }) {
  const { createClient } = await import("@sanity/client");
  return createClient({
    projectId,
    dataset,
    token,
    apiVersion: API_VERSION,
    useCdn: false,
    // Raw sees drafts too, so an unpublished draft with the same slug still counts as existing.
    perspective: "raw",
  });
}

export async function findExisting(client, slug) {
  return client.fetch(`*[_type == "caseStudy" && slug.current == $slug]{ _id, title }`, { slug });
}

// Decides create, skip or overwrite for one slug, from the documents found by findExisting.
export function decideTarget(existing, overwrite) {
  if (existing.length === 0) return { action: "create" };

  const published = existing.filter((d) => !d._id.startsWith("drafts.") && !d._id.startsWith("versions."));
  const drafts = existing.filter((d) => d._id.startsWith("drafts."));
  const names = existing.map((d) => `${d.title || "(untitled)"} [${d._id}]`).join(", ");

  if (!overwrite) {
    return { action: "skip", reason: `A case study with this slug already exists: ${names}. Pass --overwrite to replace it.` };
  }
  if (published.length > 1) {
    return { action: "skip", reason: `More than one published case study uses this slug (${names}). Fix this in Studio first.` };
  }

  const id = published[0] ? published[0]._id : drafts[0]._id.replace(/^drafts\./, "");
  const draftNote = drafts.length
    ? `An unpublished draft also exists (${drafts.map((d) => d._id).join(", ")}). Studio will keep showing the draft until it is discarded.`
    : null;
  return { action: "overwrite", id, draftNote };
}

export async function uploadImage(client, buffer, filename) {
  const asset = await client.assets.upload("image", buffer, { filename, contentType: "image/jpeg" });
  return asset._id;
}

export async function writeDocument(client, doc, target) {
  // create() makes a new published document. createOrReplace() is only reached with --overwrite.
  if (target.action === "overwrite") return client.createOrReplace({ ...doc, _id: target.id });
  return client.create(doc);
}

// refs: { cover: assetId, gallery: [assetId, ...] }. In a dry run these are placeholders.
export function buildDocument(project, refs) {
  const { slug, meta, copy, images } = project;
  const keys = new Set();

  const doc = {
    _type: "caseStudy",
    title: meta.title.trim(),
    slug: { _type: "slug", current: slug },
    client: meta.client,
    industry: meta.industry,
    year: meta.year,
    serviceCategory: meta.serviceCategory,
    disciplines: meta.disciplines,
    deliverables: meta.deliverables,
    featured: meta.featured,
    publishedAt: `${meta.publishedAt}T12:00:00.000Z`,
    seoDescription: meta.seoDescription,
    // overview is a plain text field, not portable text.
    overview: copy.Overview.join("\n\n"),
    challenge: toBlocks(copy.Challenge, keys),
    approach: toBlocks(copy.Approach, keys),
    results: toBlocks(copy.Results, keys),
    featuredImage: imageField(refs.cover, images.cover.alt),
    gallery: images.gallery.length
      ? images.gallery.map((img, i) => ({ _key: uniqueKey(keys), ...imageField(refs.gallery[i], img.alt) }))
      : undefined,
    // seoTitle is deliberately not set. The layout already appends the studio name.
  };

  return Object.fromEntries(Object.entries(doc).filter(([, v]) => v !== undefined));
}

function toBlocks(paragraphs, keys) {
  return paragraphs.map((text) => ({
    _type: "block",
    _key: uniqueKey(keys),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: uniqueKey(keys), text, marks: [] }],
  }));
}

function imageField(assetId, alt) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId }, alt };
}

function uniqueKey(keys) {
  let key;
  do key = crypto.randomBytes(6).toString("hex");
  while (keys.has(key));
  keys.add(key);
  return key;
}
