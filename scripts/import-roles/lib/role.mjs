// Reads and checks one roles-import/<slug>.md file: frontmatter, then "## About the role" and the
// three bullet list sections. Local file read only. Every problem is collected, nothing is thrown,
// so one run reports everything wrong with a file at once.

import fs from "node:fs";
import path from "node:path";
import { ALLOWED_LINK, parseInline } from "../../import-portfolio/lib/copy.mjs";
import { DEFAULT_ORDER, DEPARTMENTS, FRONTMATTER_KEYS, SECTIONS, SUMMARY_MAX, TYPES } from "./config.mjs";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BULLET = /^([-*+]|\d+[.)])(\s+|$)(.*)$/;
const FILL_IN = /FILL IN/i;

export function readRole(file) {
  const slug = path.basename(file).replace(/\.md$/i, "");
  const errors = [];
  const warnings = [];
  const role = { slug, file, errors, warnings, meta: null, paragraphs: [], lists: {} };

  if (!SLUG.test(slug) || slug.length > 96) {
    errors.push(`The file name "${path.basename(file)}" is the slug, so it must be lowercase letters, numbers and single hyphens, like senior-brand-designer.md.`);
  }

  const lines = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n").split("\n");
  lines.forEach((line, i) => {
    if (FILL_IN.test(line)) errors.push(`line ${i + 1} still says "FILL IN": ${line.trim()}`);
  });

  const bodyStart = readFrontmatter(lines, role);
  if (bodyStart !== null) readSections(lines, bodyStart, role);
  return role;
}

// Parses the --- block at the top. Returns the line index where the body starts, or null.
function readFrontmatter(lines, role) {
  const { errors } = role;
  if (lines[0]?.trim() !== "---") {
    errors.push(`The file must start with a --- line, then the frontmatter (title, department, type, location, summary, order, active), then another --- line.`);
    return null;
  }
  const end = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (end === -1) {
    errors.push("The frontmatter has no closing --- line.");
    return null;
  }

  const raw = {};
  for (let i = 1; i < end; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z]+)\s*:\s*(.*)$/);
    if (!match) {
      errors.push(`line ${i + 1}: "${line}" is not "name: value". Each frontmatter value must fit on one line.`);
      continue;
    }
    const [, key, value] = match;
    if (!FRONTMATTER_KEYS.includes(key)) {
      errors.push(`line ${i + 1}: unknown frontmatter field "${key}". Allowed: ${FRONTMATTER_KEYS.join(", ")}.`);
    } else if (key in raw) {
      errors.push(`line ${i + 1}: "${key}" appears twice in the frontmatter.`);
    } else {
      raw[key] = unquote(value.trim()).trim();
    }
  }
  role.meta = checkMeta(raw, errors);
  return end + 1;
}

function checkMeta(raw, errors) {
  const meta = {
    title: raw.title || "",
    department: raw.department || "",
    type: raw.type || "",
    location: raw.location || "",
    summary: (raw.summary || "").replace(/\s+/g, " "),
    order: DEFAULT_ORDER,
    active: true,
    defaults: [],
  };
  if (!meta.title) errors.push("title is missing.");
  if (!meta.summary) errors.push("summary is missing. It is the one or two sentences shown on the careers listing.");
  else if (meta.summary.length > SUMMARY_MAX) errors.push(`summary is ${meta.summary.length} characters. The limit is ${SUMMARY_MAX}.`);

  if (!DEPARTMENTS.includes(meta.department)) {
    errors.push(`${meta.department ? `department "${meta.department}" is unknown` : "department is missing"}. Use one of: ${DEPARTMENTS.join(", ")}.`);
  }
  if (!TYPES.includes(meta.type)) {
    errors.push(`${meta.type ? `type "${meta.type}" is unknown` : "type is missing"}. Use one of: ${TYPES.join(", ")}.`);
  }
  if (!meta.location) {
    meta.location = "Toronto / Remote";
    meta.defaults.push("location");
  }

  if (raw.order === undefined || raw.order === "") meta.defaults.push("order");
  else if (!/^-?\d+$/.test(raw.order)) errors.push(`order "${raw.order}" must be a whole number. Lower numbers appear first.`);
  else meta.order = Number(raw.order);

  if (raw.active === undefined || raw.active === "") meta.defaults.push("active");
  else if (raw.active === "true" || raw.active === "false") meta.active = raw.active === "true";
  else errors.push(`active "${raw.active}" must be true or false.`);
  return meta;
}

function unquote(value) {
  const match = value.match(/^(["'])(.*)\1$/);
  return match ? match[2] : value;
}

// The body: ## sections only. "About the role" is paragraphs; the others are bullet lists.
function readSections(lines, start, role) {
  const { errors } = role;
  const seen = new Map();
  let current = null;
  let paragraph = [];
  let reportedLeadingText = false;

  const flushParagraph = () => {
    if (current && paragraph.length) current.raw.push(paragraph.join(" ").replace(/\s+/g, " ").trim());
    paragraph = [];
  };

  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    const n = i + 1;
    const heading = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (heading) {
      flushParagraph();
      current = null;
      const text = heading[2].trim();
      const spec = SECTIONS[text.toLowerCase()];
      if (heading[1] !== "##") {
        errors.push(`line ${n}: "${line.trim()}" is not supported. Sections use ## headings only.`);
      } else if (!spec) {
        errors.push(`line ${n}: unknown section heading "## ${text}". Use: ## About the role, ## Responsibilities, ## Requirements, ## Nice to have.`);
      } else if (seen.has(spec.field)) {
        errors.push(`line ${n}: "## ${text}" appears twice (first on line ${seen.get(spec.field).line}).`);
      } else {
        current = { heading: text, line: n, ...spec, raw: [], items: [] };
        seen.set(spec.field, current);
      }
      continue;
    }

    const trimmed = line.trim();
    if (!current) {
      if (trimmed && !reportedLeadingText && seen.size === 0) {
        errors.push(`line ${n}: text before the first ## heading would be lost. Start the body with "## About the role".`);
        reportedLeadingText = true;
      }
      continue;
    }
    if (current.kind === "paragraphs") {
      if (!trimmed) flushParagraph();
      else if (BULLET.test(trimmed)) errors.push(`line ${n}: "## ${current.heading}" is paragraphs only. Put bullet points under Responsibilities, Requirements or Nice to have.`);
      else paragraph.push(trimmed);
      continue;
    }
    readListLine(current, trimmed, n, role);
  }
  flushParagraph();
  finishSections(seen, role);
}

// One line of a bullet list section. A line without a marker continues the bullet above it.
function readListLine(section, trimmed, n, role) {
  if (!trimmed) return;
  const bullet = trimmed.match(BULLET);
  if (bullet) {
    const text = bullet[3].trim();
    if (!text) role.errors.push(`line ${n}: empty bullet under "## ${section.heading}". Remove it or add the text.`);
    else section.items.push({ text, line: n });
  } else if (section.items.length) {
    section.items[section.items.length - 1].text += ` ${trimmed}`;
  } else {
    role.errors.push(`line ${n}: "## ${section.heading}" is a bullet list. Start each item with "- ".`);
  }
}

function finishSections(seen, role) {
  const { errors, warnings } = role;
  const about = seen.get("description");
  if (!about) errors.push(`"## About the role" is missing. It is required: it becomes the full role description.`);
  else if (!about.raw.length) errors.push(`"## About the role" has no text under it.`);
  else {
    role.paragraphs = about.raw.map((p) => parseInline(p));
    role.paragraphs.forEach((p) => {
      p.links.filter((href) => !ALLOWED_LINK.test(href)).forEach((href) => errors.push(`"## About the role": the link "${href}" must start with https://, http:// or mailto:.`));
      if (p.unmatchedBold) warnings.push(`"## About the role" has a ** with no closing **. It will appear as plain text.`);
    });
  }

  for (const section of seen.values()) {
    if (section.kind !== "list") continue;
    if (!section.items.length) {
      errors.push(`"## ${section.heading}" has no bullets. Add some, or remove the heading.`);
      continue;
    }
    // List items are plain text in Sanity, so **bold** and [links](url) keep their words only.
    role.lists[section.field] = section.items.map(({ text, line }) => {
      const parsed = parseInline(text.replace(/\s+/g, " ").trim());
      if (parsed.links.length || parsed.spans.some((s) => s.marks.length)) {
        warnings.push(`line ${line}: list items are plain text, so bold and links are dropped and only the words are kept.`);
      }
      return parsed.plain.trim();
    });
  }
}
