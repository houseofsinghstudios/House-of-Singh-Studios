// Reads and validates one project folder: project.json, copy.md, the images and the block list.
// Local file reads only (image headers included). No network, no image processing.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { DISCIPLINES, SERVICE_CATEGORIES } from "./config.mjs";
import { OVERVIEW_KEY, readCopy, sectionKey } from "./copy.mjs";

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const IMAGE_FILE = /\.(jpe?g|png|webp)$/i;
const COVER_FILE = "cover.jpg";
const SYSTEM_FILES = new Set([".DS_Store", "Thumbs.db", "desktop.ini"]);
const PROJECT_KEYS = [
  "title",
  "client",
  "industry",
  "year",
  "serviceCategories",
  "serviceCategory",
  "disciplines",
  "deliverables",
  "featured",
  "publishedAt",
  "seoDescription",
  "images",
  "blocks",
];

// Fields each block type takes. Field names match sanity/schemas/blocks/.
const BLOCK_FIELDS = {
  split: { required: ["section", "image"], optional: ["side"] },
  offset: { required: ["section", "image"], optional: [] },
  full: { required: ["image"], optional: ["caption"] },
  pair: { required: ["images"], optional: [] },
  statement: { required: ["section"], optional: [] },
  feature: { required: ["image", "detail"], optional: ["caption"] },
};
const TEXT_BLOCKS = new Set(["split", "offset", "statement"]);
const LONG_QUOTE = 280;

export { COVER_FILE };

export async function validateProject(slug, dir) {
  const errors = [];
  const warnings = [];

  if (!SLUG_PATTERN.test(slug)) {
    errors.push(
      `Folder name "${slug}" is not a valid slug. Use only lowercase letters, numbers and hyphens, for example "tairn-and-co".`
    );
  }

  const meta = readProjectJson(dir, errors, warnings);
  const copy = readCopy(dir, errors, warnings);
  const files = listImageFiles(dir, warnings);
  const altMap = meta && meta.images && typeof meta.images === "object" && !Array.isArray(meta.images) ? meta.images : null;
  const { plan, usage, mentioned } = validateBlocks(meta, copy, files, altMap, errors, warnings);
  checkImageFiles(files, altMap, mentioned, errors, warnings);
  await checkCoverShape(dir, errors, warnings);

  // Each file is processed and uploaded once: the cover first, then in order of first use.
  const uploadFiles = [COVER_FILE, ...[...usage.keys()].filter((f) => f !== COVER_FILE)];
  const cover = { file: COVER_FILE, alt: altText(altMap, COVER_FILE) };

  return { slug, dir, meta, copy, cover, plan, usage, uploadFiles, altMap, errors, warnings };
}

// The site shows the cover in a fixed 16:9 frame (3:2 on mobile), so a portrait cover loses its top and bottom.
async function checkCoverShape(dir, errors, warnings) {
  const file = path.join(dir, COVER_FILE);
  if (!fs.existsSync(file)) return;
  let meta;
  try {
    meta = await sharp(file).metadata();
  } catch (err) {
    errors.push(`cover.jpg could not be read as an image: ${err.message}`);
    return;
  }
  // EXIF orientations 5 to 8 store the image sideways. Judge the shape a viewer sees.
  const sideways = (meta.orientation || 1) >= 5;
  const width = sideways ? meta.height : meta.width;
  const height = sideways ? meta.width : meta.height;
  if (height > width) {
    warnings.push(
      `cover.jpg is portrait (${width}x${height}). The case study page shows the cover in a fixed 16:9 frame, so it will be cropped top and bottom. Use a landscape image to control the framing.`
    );
  }
}

function readProjectJson(dir, errors, warnings) {
  const file = path.join(dir, "project.json");
  if (!fs.existsSync(file)) {
    errors.push("project.json is missing.");
    return null;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    errors.push(`project.json is not valid JSON: ${err.message}`);
    return null;
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    errors.push("project.json must contain a single object { ... }.");
    return null;
  }

  for (const key of Object.keys(data)) {
    if (!PROJECT_KEYS.includes(key)) warnings.push(`project.json has an unknown field "${key}". It will be ignored.`);
  }

  const isText = (v) => typeof v === "string" && v.trim() !== "";
  const optionalText = (key) => {
    if (data[key] !== undefined && !isText(data[key])) errors.push(`"${key}" must be text.`);
  };

  if (!isText(data.title)) errors.push(`"title" is required and must be text.`);
  optionalText("client");
  optionalText("industry");

  if (data.year !== undefined && !Number.isInteger(data.year)) {
    errors.push(`"year" must be a whole number without quotes, for example 2026.`);
  }

  checkServiceCategories(data, errors);

  if (!Array.isArray(data.disciplines) || data.disciplines.length === 0) {
    errors.push(`"disciplines" is required and must be a list, for example ["brand-identity", "packaging"].`);
  } else {
    for (const d of data.disciplines) {
      if (!DISCIPLINES.includes(d)) {
        errors.push(`Discipline "${d}" is not valid. It must be one of: ${DISCIPLINES.join(", ")}.`);
      }
    }
    if (new Set(data.disciplines).size !== data.disciplines.length) warnings.push(`"disciplines" lists a value twice.`);
  }

  if (data.deliverables !== undefined && (!Array.isArray(data.deliverables) || !data.deliverables.every(isText))) {
    errors.push(`"deliverables" must be a list of text, for example ["Brand strategy", "Logo system"].`);
  }

  if (data.featured !== undefined && typeof data.featured !== "boolean") {
    errors.push(`"featured" must be true or false without quotes.`);
  }

  if (!isValidDate(data.publishedAt)) {
    errors.push(`"publishedAt" is required and must be a real date written as YYYY-MM-DD, for example "2026-10-14".`);
  }

  if (data.seoDescription === undefined) {
    warnings.push(`"seoDescription" is missing. Search results will fall back to the overview text.`);
  } else if (!isText(data.seoDescription)) {
    errors.push(`"seoDescription" must be text.`);
  } else if (data.seoDescription.length > 155) {
    warnings.push(`"seoDescription" is ${data.seoDescription.length} characters. Search engines cut it off after about 155.`);
  }

  if (!data.images || typeof data.images !== "object" || Array.isArray(data.images)) {
    errors.push(`"images" is required: a list of file names with alt text, for example { "cover.jpg": "..." }.`);
  }

  return data;
}

// serviceCategories: a list of one or more services. The older single "serviceCategory" string is
// still accepted as a one item list. On success data.serviceCategories holds the final list,
// and only that is ever written to Sanity.
function checkServiceCategories(data, errors) {
  const example = `["brand-identity", "visual-media"]`;
  const allowed = `It must be one of: ${SERVICE_CATEGORIES.join(", ")}.`;
  const hasList = data.serviceCategories !== undefined;
  const hasSingle = data.serviceCategory !== undefined;

  if (hasList && hasSingle) {
    errors.push(`project.json has both "serviceCategories" and "serviceCategory". Keep only "serviceCategories", for example ${example}.`);
    return;
  }
  if (!hasList && !hasSingle) {
    errors.push(`"serviceCategories" is required: a list of the services this project covers, for example ${example}. ${allowed}`);
    return;
  }

  const field = hasList ? "serviceCategories" : "serviceCategory";
  const list = hasList ? data.serviceCategories : [data.serviceCategory];
  if (!Array.isArray(list)) {
    errors.push(`"serviceCategories" must be a list in square brackets, for example ${example}.`);
    return;
  }
  if (list.length === 0) {
    errors.push(`"serviceCategories" is empty. List at least one service, for example ${example}.`);
    return;
  }

  const errorsBefore = errors.length;
  for (const value of list) {
    if (!SERVICE_CATEGORIES.includes(value)) errors.push(`"${field}" includes "${value ?? ""}", which is not a service. ${allowed}`);
  }
  const duplicates = [...new Set(list.filter((value, i) => list.indexOf(value) !== i))];
  if (duplicates.length) errors.push(`"${field}" lists ${duplicates.map((d) => `"${d}"`).join(", ")} more than once. List each service once.`);

  if (errors.length === errorsBefore) {
    data.serviceCategories = [...list];
    delete data.serviceCategory;
  }
}

function isValidDate(value) {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T12:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function listImageFiles(dir, warnings) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) warnings.push(`Subfolder "${e.name}" is ignored.`);
    else if (!IMAGE_FILE.test(e.name) && !["project.json", "copy.md"].includes(e.name) && !SYSTEM_FILES.has(e.name)) {
      warnings.push(`File "${e.name}" is not used and will be ignored.`);
    }
  }
  return entries.filter((e) => e.isFile() && IMAGE_FILE.test(e.name)).map((e) => e.name);
}

function altText(altMap, file) {
  return altMap && typeof altMap[file] === "string" ? altMap[file].trim() : "";
}

// Validates project.json "blocks" against copy.md and the folder. Returns the page plan,
// usage (a Map of valid image file -> block numbers using it, the cover being "hero"), and
// mentioned (every file name any block refers to, valid or not, so problems are reported once).
function validateBlocks(meta, copy, files, altMap, errors, warnings) {
  const plan = [];
  const usage = new Map();
  const mentioned = new Set();
  const sectionsUsed = new Set();
  const sections = copy ? copy.sections : new Map();
  const types = Object.keys(BLOCK_FIELDS);

  if (files.includes(COVER_FILE)) usage.set(COVER_FILE, ["hero"]);
  else {
    const lookalike = files.find((n) => /^cover\./i.test(n));
    errors.push(`cover.jpg is missing.${lookalike ? ` Found "${lookalike}". Rename it to exactly cover.jpg.` : ""}`);
  }

  if (!meta) return { plan, usage, mentioned };
  const blocks = meta.blocks;
  if (!Array.isArray(blocks) || blocks.length === 0) {
    errors.push(
      `"blocks" is missing or empty. List the page blocks in order, for example [{ "type": "full", "image": "05-applied.jpg" }]. See scripts/import-portfolio/example/project.json.`
    );
    return { plan, usage, mentioned };
  }

  blocks.forEach((raw, index) => {
    const n = index + 1;
    const errorsBefore = errors.length;

    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      errors.push(`Block ${n}: each block must be an object, for example { "type": "full", "image": "05-applied.jpg" }.`);
      return;
    }
    if (raw.type === undefined) {
      errors.push(`Block ${n}, "type": missing. Use one of: ${types.join(", ")}.`);
      return;
    }
    if (!BLOCK_FIELDS[raw.type]) {
      errors.push(`Block ${n}, "type": "${raw.type}" is not a block type. Use one of: ${types.join(", ")}.`);
      return;
    }

    const type = raw.type;
    const at = (field) => `Block ${n} (${type}), "${field}"`;
    const spec = BLOCK_FIELDS[type];
    const allowed = new Set(["type", ...spec.required, ...spec.optional]);

    for (const field of Object.keys(raw)) {
      if (allowed.has(field)) continue;
      if (field === "section") {
        errors.push(`${at("section")}: a ${type} block does not take a section. Only split, offset and statement blocks show text.`);
      } else {
        warnings.push(`${at(field)}: not used by a ${type} block, so it will be ignored.`);
      }
    }
    for (const field of spec.required) {
      if (raw[field] === undefined || raw[field] === null || raw[field] === "") {
        errors.push(`${at(field)}: missing. A ${type} block needs ${spec.required.map((f) => `"${f}"`).join(" and ")}.`);
      }
    }

    if (type === "split" && raw.side !== undefined && raw.side !== "left" && raw.side !== "right") {
      errors.push(`${at("side")}: "${raw.side}" is not valid. Use "left" or "right".`);
    }

    let section = null;
    if (allowed.has("section") && raw.section !== undefined && raw.section !== "") {
      section = checkSection(raw.section, at("section"), sections, errors);
      if (section) sectionsUsed.add(section.key);
    }

    const useImage = (value, field) => {
      if (typeof value === "string") mentioned.add(value);
      if (checkImage(value, at(field), files, altMap, errors)) {
        usage.set(value, [...(usage.get(value) || []), n]);
        return value;
      }
      return null;
    };

    const image = raw.image !== undefined && allowed.has("image") ? useImage(raw.image, "image") : null;
    const detail = raw.detail !== undefined && allowed.has("detail") ? useImage(raw.detail, "detail") : null;

    let images = null;
    if (type === "pair" && raw.images !== undefined) {
      if (!Array.isArray(raw.images) || raw.images.length !== 2) {
        const found = Array.isArray(raw.images) ? raw.images.length : "not a list";
        errors.push(`${at("images")}: a pair needs exactly two images, like ["02-front.jpg", "03-back.jpg"]. Found ${found}.`);
      } else {
        images = raw.images.map((value, i) => useImage(value, `images[${i + 1}]`));
        if (raw.images[0] === raw.images[1]) {
          warnings.push(`${at("images")}: both sides of the pair are "${raw.images[0]}", so the same image shows twice side by side.`);
        }
      }
    }

    if (raw.caption !== undefined && allowed.has("caption") && typeof raw.caption !== "string") {
      errors.push(`${at("caption")}: must be text.`);
    }

    if (errors.length > errorsBefore) return;

    const entry = { n, type, section, image, detail, images };
    if (type === "split") entry.side = raw.side || "left";
    if (typeof raw.caption === "string" && raw.caption.trim()) entry.caption = raw.caption.trim();

    if (type === "statement") {
      const [first] = section.paragraphs;
      if (first.links.length || first.spans.some((s) => s.marks.length)) {
        warnings.push(`${at("section")}: the first paragraph of "## ${section.heading}" becomes the quote, which is plain text. Its bold and links are dropped.`);
      }
      if (first.plain.length > LONG_QUOTE) {
        warnings.push(
          `${at("section")}: the quote (first paragraph of "## ${section.heading}") is ${first.plain.length} characters. Statements are shown large, so it will dominate the page. Aim for under about ${LONG_QUOTE} and move the rest into the next paragraph.`
        );
      }
    }
    plan.push(entry);
  });

  // Page rhythm: two text blocks of the same kind in a row read as one long block.
  for (let i = 1; i < plan.length; i++) {
    const a = plan[i - 1];
    const b = plan[i];
    if (a.n + 1 !== b.n || !TEXT_BLOCKS.has(a.type) || a.type !== b.type) continue;
    if (a.type === "split" && a.side !== b.side) continue;
    const kind = a.type === "split" ? `split (${a.side})` : a.type;
    const fix = a.type === "split" ? "Alternate the side, or put an image block between them." : "Put an image block between them, or use a different block type.";
    warnings.push(`Blocks ${a.n} and ${b.n}, "type": two ${kind} blocks back to back, so the page loses its rhythm. ${fix}`);
  }

  for (const [file, uses] of usage) {
    const blockUses = [...new Set(uses.filter((u) => u !== "hero"))];
    if (blockUses.length > 1) {
      warnings.push(`"${file}" is used in blocks ${blockUses.join(" and ")}. It is uploaded once and shown in each place.`);
    }
  }
  for (const section of sections.values()) {
    if (section.key !== OVERVIEW_KEY && !sectionsUsed.has(section.key)) {
      warnings.push(`copy.md "## ${section.heading}" (section "${section.key}") is not used by any block, so it will not appear on the page.`);
    }
  }

  return { plan, usage, mentioned };
}

function checkSection(value, where, sections, errors) {
  if (typeof value !== "string") {
    errors.push(`${where}: must be a section key like "the-challenge".`);
    return null;
  }
  if (value === OVERVIEW_KEY) {
    errors.push(`${where}: "overview" is the page intro and cannot be used inside a block. Write a separate section in copy.md.`);
    return null;
  }
  const section = sections.get(value);
  if (!section) {
    const keys = [...sections.keys()].filter((k) => k !== OVERVIEW_KEY);
    const guess = sections.get(sectionKey(value));
    errors.push(
      `${where}: "${value}" does not exist in copy.md.${guess && guess.key !== OVERVIEW_KEY ? ` Did you mean "${guess.key}"?` : ""} Sections found: ${keys.join(", ") || "none"}.`
    );
    return null;
  }
  if (section.paragraphs.length === 0) {
    errors.push(`${where}: "## ${section.heading}" has no text under it in copy.md.`);
    return null;
  }
  return section;
}

function checkImage(value, where, files, altMap, errors) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${where}: must be an image file name, like "01-chair.jpg".`);
    return false;
  }
  if (value === COVER_FILE) {
    errors.push(`${where}: cover.jpg is reserved for the hero at the top of the page and cannot be used inside a block.`);
    return false;
  }
  if (!files.includes(value)) {
    const lookalike = files.find((f) => f.toLowerCase() === value.toLowerCase());
    errors.push(`${where}: "${value}" does not exist in the folder.${lookalike ? ` Did you mean "${lookalike}"? Names must match exactly.` : ""}`);
    return false;
  }
  if (!altText(altMap, value)) {
    errors.push(`${where}: "${value}" has no alt text in project.json "images".`);
    return false;
  }
  return true;
}

// Alt text for every image file, and the reverse: every alt entry has a file.
// Files a block refers to were already checked there, so they are not reported twice.
function checkImageFiles(files, altMap, mentioned, errors, warnings) {
  if (!altMap) return;
  for (const name of files) {
    if (name !== COVER_FILE && mentioned.has(name)) continue;
    if (!altText(altMap, name)) {
      errors.push(`"${name}" has no alt text in project.json "images". Every image in the folder needs one.`);
    }
    if (name !== COVER_FILE) {
      warnings.push(`"${name}" is in the folder but not used by the cover or any block, so it will not be uploaded.`);
    }
  }
  for (const name of Object.keys(altMap)) {
    if (!files.includes(name)) errors.push(`project.json "images" lists "${name}", but no file with that exact name exists.`);
  }
}
