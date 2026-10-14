// Parses copy.md into the required Overview and any number of named sections, and turns
// inline Markdown (**bold** and [text](url) links only) into spans for portable text.
// Local file read only.

import fs from "node:fs";
import path from "node:path";

export const OVERVIEW_KEY = "overview";

// *word* or *a few words*: one asterisk each side, hugging the text. Leaves **bold**, "5 * 3" and a lone footnote * alone.
const SINGLE_ASTERISK_ITALIC = /(?<![*\w])\*(?![\s*])([^*\n]+?)(?<![\s*])\*(?![*\w])/;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)/;
// Matches the link annotation in sanity/schemas/blocks/shared.ts.
const ALLOWED_LINK = /^(https?:\/\/|mailto:)\S+$/i;
const LIST_LINE = /^([-*+]|\d+[.)])\s/;

// "## The Challenge" -> "the-challenge". "## What Changed?" -> "what-changed".
export function sectionKey(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

// Returns { overview, sections } where sections is a Map of key -> { key, heading, line, paragraphs }.
// Each paragraph is { spans, links, plain }. spans carry marks "strong" and "link:<index into links>".
export function readCopy(dir, errors, warnings) {
  const file = path.join(dir, "copy.md");
  if (!fs.existsSync(file)) {
    errors.push("copy.md is missing.");
    return null;
  }

  const lines = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n").split("\n");
  const sections = new Map();
  let current = null;
  let paragraph = [];
  let reportedLeadingText = false;

  const flush = () => {
    if (current && paragraph.length) current.raw.push(paragraph.join(" ").replace(/\s+/g, " ").trim());
    paragraph = [];
  };

  lines.forEach((line, i) => {
    const heading = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (heading) {
      flush();
      current = null;
      if (heading[1] !== "##") {
        errors.push(
          `copy.md line ${i + 1}: "${line.trim()}" is a sub heading, which is not supported. Use a ## heading to start a new section, or make it plain text.`
        );
        return;
      }
      const text = heading[2].trim();
      const key = sectionKey(text);
      if (!key) {
        errors.push(`copy.md line ${i + 1}: the heading "${line.trim()}" has no letters or numbers, so no block can refer to it.`);
        return;
      }
      const existing = sections.get(key);
      if (existing) {
        errors.push(
          `copy.md line ${i + 1}: "## ${text}" and "## ${existing.heading}" (line ${existing.line}) both become the section key "${key}". Rename one of them.`
        );
        return;
      }
      current = { key, heading: text, line: i + 1, raw: [], hasList: false };
      sections.set(key, current);
      return;
    }
    if (line.trim() === "") {
      flush();
      return;
    }
    if (!current) {
      if (sections.size === 0 && !reportedLeadingText) {
        errors.push(`copy.md line ${i + 1}: text before the first ## heading would be lost. Start the file with "## Overview".`);
        reportedLeadingText = true;
      }
      return;
    }
    if (LIST_LINE.test(line.trim())) current.hasList = true;
    paragraph.push(line.trim());
  });
  flush();

  for (const section of sections.values()) {
    const name = section.heading;

    // Italic is not supported on the site. *word* becomes plain "word": asterisks removed, text kept.
    if (section.raw.some((p) => SINGLE_ASTERISK_ITALIC.test(p))) {
      section.raw = section.raw.map((p) => p.replace(new RegExp(SINGLE_ASTERISK_ITALIC.source, "g"), "$1"));
      warnings.push(
        `copy.md "## ${name}" uses *single asterisk* italics. Italics are not supported, so the asterisks will be removed and the words kept as plain text.`
      );
    }

    if (section.hasList || section.raw.some((p) => /__/.test(p))) {
      warnings.push(
        `copy.md "## ${name}" contains list markers or __underscores__. Lists are not supported, so these characters will appear as plain text on the site.`
      );
    }

    section.paragraphs = section.raw.map((p) => parseInline(p));
    for (const p of section.paragraphs) {
      for (const href of p.links) {
        if (!ALLOWED_LINK.test(href)) {
          errors.push(`copy.md "## ${name}": the link "${href}" must start with https://, http:// or mailto:.`);
        }
      }
      if (p.unmatchedBold) {
        warnings.push(`copy.md "## ${name}" has a ** with no closing **. It will appear as plain text.`);
      }
    }
    delete section.raw;
    delete section.hasList;
  }

  const overview = sections.get(OVERVIEW_KEY) || null;
  if (!overview) {
    errors.push(`copy.md is missing "## Overview". It is required: it becomes the page intro and the text on the work page card.`);
  } else if (overview.paragraphs.length === 0) {
    errors.push(`copy.md "## Overview" has no text under it.`);
  } else if (overview.paragraphs.some((p) => p.links.length || p.spans.some((s) => s.marks.length))) {
    warnings.push(`copy.md "## Overview" uses bold or links. The overview is plain text, so the words are kept and the formatting is dropped.`);
  }

  return { overview, sections };
}

// Converts one paragraph of Markdown into spans. Supports **bold** and [text](url), including bold inside links.
export function parseInline(text) {
  const spans = [];
  const links = [];
  let unmatchedBold = false;

  const add = (str, marks) => {
    if (!str) return;
    const last = spans[spans.length - 1];
    if (last && last.marks.join("|") === marks.join("|")) last.text += str;
    else spans.push({ text: str, marks });
  };

  // Walks `str`, returns the bold state at the end so bold can carry across a link boundary.
  const run = (str, linkMark, boldAtStart) => {
    let bold = boldAtStart;
    let buffer = "";
    const marks = () => [...(bold ? ["strong"] : []), ...(linkMark ? [linkMark] : [])];
    const flushBuffer = () => {
      add(buffer, marks());
      buffer = "";
    };

    for (let i = 0; i < str.length; ) {
      if (str.startsWith("**", i)) {
        if (bold || str.indexOf("**", i + 2) !== -1) {
          flushBuffer();
          bold = !bold;
        } else {
          buffer += "**";
          unmatchedBold = true;
        }
        i += 2;
        continue;
      }
      if (!linkMark && str[i] === "[") {
        const match = LINK.exec(str.slice(i));
        if (match) {
          flushBuffer();
          links.push(match[2]);
          bold = run(match[1], `link:${links.length - 1}`, bold);
          i += match[0].length;
          continue;
        }
      }
      buffer += str[i];
      i++;
    }
    flushBuffer();
    return bold;
  };

  run(text, null, false);
  return { spans, links, unmatchedBold, plain: spans.map((s) => s.text).join("") };
}
