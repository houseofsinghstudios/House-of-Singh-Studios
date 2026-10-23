// Everything that talks to Sanity, plus the document builder.
// The client module is imported lazily so a dry run never loads it or opens a connection.

import crypto from "node:crypto";
import { API_VERSION, BLOCK_TYPES } from "./config.mjs";

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

// refs: a Map of image file -> asset id. In a dry run the ids are placeholders.
// Writes the overview, the cover and the composed blocks. Legacy challenge, approach,
// results and gallery are never written.
export function buildDocument(project, refs) {
  const { slug, meta, copy, cover, plan, altMap } = project;
  const keys = new Set();
  const key = () => uniqueKey(keys);

  const reference = (file) => ({ _type: "reference", _ref: refs.get(file) });
  const blockImage = (file) => ({ _type: "blockImage", asset: reference(file), alt: altMap[file].trim() });

  const blocks = plan.map((b) => {
    const base = { _type: BLOCK_TYPES[b.type], _key: key() };
    switch (b.type) {
      case "split":
        return { ...base, side: b.side, heading: b.section.heading, body: toPortableText(b.section.paragraphs, key), image: blockImage(b.image) };
      case "offset":
        return { ...base, heading: b.section.heading, body: toPortableText(b.section.paragraphs, key), image: blockImage(b.image) };
      case "full":
        return withOptional({ ...base, image: blockImage(b.image) }, "caption", b.caption);
      case "pair":
        return { ...base, images: b.images.map((file) => ({ _key: key(), ...blockImage(file) })) };
      case "statement": {
        // First paragraph is the quote, as plain text. Any further paragraphs are the body.
        const [first, ...rest] = b.section.paragraphs;
        return withOptional({ ...base, quote: first.plain }, "body", rest.length ? toPortableText(rest, key) : undefined);
      }
      case "feature":
        return withOptional({ ...base, image: blockImage(b.image), detail: blockImage(b.detail) }, "caption", b.caption);
      default:
        throw new Error(`Unhandled block type "${b.type}"`);
    }
  });

  const doc = {
    _type: "caseStudy",
    title: meta.title.trim(),
    slug: { _type: "slug", current: slug },
    client: meta.client,
    industry: meta.industry,
    year: meta.year,
    // Only the list is written. The legacy single serviceCategory field is never written.
    serviceCategories: meta.serviceCategories,
    disciplines: meta.disciplines,
    deliverables: meta.deliverables,
    featured: meta.featured,
    // Always written, also with --overwrite: "client" when project.json does not set it.
    projectType: meta.projectType,
    publishedAt: `${meta.publishedAt}T12:00:00.000Z`,
    seoDescription: meta.seoDescription,
    // overview is a plain text field, not portable text.
    overview: copy.overview.paragraphs.map((p) => p.plain).join("\n\n"),
    featuredImage: { _type: "image", asset: reference(cover.file), alt: cover.alt },
    blocks,
    // seoTitle is deliberately not set. The layout already appends the studio name.
  };

  return Object.fromEntries(Object.entries(doc).filter(([, v]) => v !== undefined));
}

// Paragraphs from copy.md become portable text blocks. Bold is the "strong" decorator;
// links become markDefs with their own keys, referenced from the span marks.
export function toPortableText(paragraphs, key) {
  return paragraphs.map((p) => {
    const linkKeys = p.links.map(() => key());
    return {
      _type: "block",
      _key: key(),
      style: "normal",
      markDefs: p.links.map((href, i) => ({ _type: "link", _key: linkKeys[i], href })),
      children: p.spans.map((span) => ({
        _type: "span",
        _key: key(),
        text: span.text,
        marks: span.marks.map((m) => (m.startsWith("link:") ? linkKeys[Number(m.slice(5))] : m)),
      })),
    };
  });
}

function withOptional(object, field, value) {
  return value === undefined ? object : { ...object, [field]: value };
}

export function uniqueKey(keys) {
  let key;
  do key = crypto.randomBytes(6).toString("hex");
  while (keys.has(key));
  keys.add(key);
  return key;
}
