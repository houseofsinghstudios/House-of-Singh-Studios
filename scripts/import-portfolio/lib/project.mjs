// Reads and validates one project folder: project.json, copy.md and the images.
// Pure file reads. No network, no image processing.

import fs from "node:fs";
import path from "node:path";
import { COPY_HEADINGS, DISCIPLINES, SERVICE_CATEGORIES } from "./config.mjs";

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const IMAGE_FILE = /\.(jpe?g|png|webp)$/i;
const GALLERY_FILE = /^\d+-.+\.(jpe?g|png|webp)$/i;
const COVER_FILE = "cover.jpg";
const SYSTEM_FILES = new Set([".DS_Store", "Thumbs.db", "desktop.ini"]);
const PROJECT_KEYS = [
  "title",
  "client",
  "industry",
  "year",
  "serviceCategory",
  "disciplines",
  "deliverables",
  "featured",
  "publishedAt",
  "seoDescription",
  "images",
];

export function validateProject(slug, dir) {
  const errors = [];
  const warnings = [];

  if (!SLUG_PATTERN.test(slug)) {
    errors.push(
      `Folder name "${slug}" is not a valid slug. Use only lowercase letters, numbers and hyphens, for example "tairn-and-co".`
    );
  }

  const meta = readProjectJson(dir, errors, warnings);
  const copy = readCopy(dir, errors, warnings);
  const images = readImages(dir, meta, errors, warnings);

  return { slug, dir, meta, copy, images, errors, warnings };
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

  if (!SERVICE_CATEGORIES.includes(data.serviceCategory)) {
    errors.push(
      `"serviceCategory" is "${data.serviceCategory ?? ""}". It must be one of: ${SERVICE_CATEGORIES.join(", ")}.`
    );
  }

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

function isValidDate(value) {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T12:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// copy.md must contain exactly the four headings, in order, each followed by text.
function readCopy(dir, errors, warnings) {
  const file = path.join(dir, "copy.md");
  if (!fs.existsSync(file)) {
    errors.push("copy.md is missing.");
    return null;
  }

  const lines = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n").split("\n");
  const sections = {};
  const order = [];
  let current = null;
  let paragraph = [];
  let reportedLeadingText = false;

  const flush = () => {
    if (current && paragraph.length) sections[current].push(paragraph.join(" ").replace(/\s+/g, " ").trim());
    paragraph = [];
  };

  lines.forEach((line, i) => {
    const heading = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (heading) {
      flush();
      const name = COPY_HEADINGS.find((h) => h.toLowerCase() === heading[2].toLowerCase());
      if (heading[1] !== "##" || !name) {
        errors.push(
          `copy.md line ${i + 1}: unexpected heading "${line.trim()}". Only these four are allowed: ${COPY_HEADINGS.map((h) => `## ${h}`).join(", ")}.`
        );
        current = null;
        return;
      }
      if (sections[name]) {
        errors.push(`copy.md line ${i + 1}: "## ${name}" appears more than once.`);
        current = null;
        return;
      }
      sections[name] = [];
      order.push(name);
      current = name;
      return;
    }
    if (line.trim() === "") {
      flush();
      return;
    }
    if (!current) {
      if (order.length === 0 && !reportedLeadingText) {
        errors.push(`copy.md line ${i + 1}: text before the first heading would be lost.`);
        reportedLeadingText = true;
      }
      return;
    }
    paragraph.push(line.trim());
  });
  flush();

  for (const name of COPY_HEADINGS) {
    if (!sections[name]) errors.push(`copy.md is missing the heading "## ${name}".`);
    else if (sections[name].length === 0) errors.push(`copy.md: "## ${name}" has no text under it.`);
  }
  const found = order.filter((n) => COPY_HEADINGS.includes(n));
  if (found.length === COPY_HEADINGS.length && found.some((n, i) => n !== COPY_HEADINGS[i])) {
    errors.push(`copy.md headings are out of order. They must be: ${COPY_HEADINGS.map((h) => `## ${h}`).join(", ")}.`);
  }

  for (const [name, paras] of Object.entries(sections)) {
    if (paras.some((p) => /\*\*|__|\[[^\]]+\]\([^)]+\)|^[-*+]\s|^\d+\.\s/.test(p))) {
      warnings.push(`copy.md "## ${name}" contains Markdown formatting (bold, links or lists). It will appear as plain characters on the site.`);
    }
  }

  return sections;
}

function readImages(dir, meta, errors, warnings) {
  if (!fs.existsSync(dir)) return null;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);

  for (const e of entries) {
    if (e.isDirectory()) warnings.push(`Subfolder "${e.name}" is ignored.`);
  }
  for (const name of files) {
    if (!IMAGE_FILE.test(name) && !["project.json", "copy.md"].includes(name) && !SYSTEM_FILES.has(name)) {
      warnings.push(`File "${name}" is not used and will be ignored.`);
    }
  }

  const imageFiles = files.filter((n) => IMAGE_FILE.test(n));
  if (!imageFiles.includes(COVER_FILE)) {
    const lookalike = imageFiles.find((n) => /^cover\./i.test(n));
    errors.push(`cover.jpg is missing.${lookalike ? ` Found "${lookalike}". Rename it to exactly cover.jpg.` : ""}`);
  }

  const gallery = imageFiles
    .filter((n) => GALLERY_FILE.test(n))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const name of imageFiles) {
    if (name !== COVER_FILE && !GALLERY_FILE.test(name)) {
      errors.push(`"${name}" is not cover.jpg and does not start with a number like 01-name.jpg, so it would not be used. Rename or remove it.`);
    }
  }
  if (gallery.length === 0) warnings.push("No numbered gallery images found. The case study will show the cover only.");

  const altMap = meta && meta.images && typeof meta.images === "object" && !Array.isArray(meta.images) ? meta.images : null;
  if (altMap) {
    for (const name of imageFiles) {
      if (!(name in altMap)) errors.push(`"${name}" has no alt text entry in project.json "images".`);
      else if (typeof altMap[name] !== "string" || altMap[name].trim() === "") {
        errors.push(`Alt text for "${name}" in project.json is empty.`);
      }
    }
    for (const name of Object.keys(altMap)) {
      if (!files.includes(name)) errors.push(`project.json "images" lists "${name}", but no file with that exact name exists.`);
    }
  }

  const alt = (name) => (altMap && typeof altMap[name] === "string" ? altMap[name].trim() : "");
  return {
    cover: { file: COVER_FILE, alt: alt(COVER_FILE) },
    gallery: gallery.map((file) => ({ file, alt: alt(file) })),
  };
}
