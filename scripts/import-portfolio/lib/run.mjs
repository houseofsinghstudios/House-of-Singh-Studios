// Runs one project folder: validate, check Sanity for the slug (commit only), process images,
// print the page, then upload and write (commit only). The Sanity client is passed in, so a
// dry run gets null and never touches the network.

import path from "node:path";
import { IMPORT_DIR, PARALLEL_REMINDER } from "./config.mjs";
import { validateProject } from "./project.mjs";
import { outputFilename, processImage } from "./images.mjs";
import { buildDocument, decideTarget, findExisting, uploadImage, writeDocument } from "./sanity.mjs";

export async function runProject(slug, { dryRun, client, overwrite, showJson = false, importDir = IMPORT_DIR }) {
  const project = await validateProject(slug, path.join(importDir, slug));
  const title = project.meta && typeof project.meta.title === "string" ? project.meta.title : "(no title)";
  const result = { slug, title, projectType: "", status: "failed", images: 0, bytes: 0, detail: "" };
  // Every message names the project.
  const warn = () => project.warnings.forEach((w) => console.log(`  warning [${slug}]: ${w}`));

  // Shown only once validated, so an invalid list never looks accepted.
  const services = !project.errors.length && Array.isArray(project.meta?.serviceCategories) ? project.meta.serviceCategories : [];
  const servicesLabel = services.length ? `  |  services: ${services.join(", ")}` : "";
  const type = !project.errors.length ? project.meta?.projectType ?? "" : "";
  result.projectType = type;
  const typeLabel = type ? `  |  ${type}` : "";
  console.log(`\n${"=".repeat(72)}\n${slug}  |  ${title}${typeLabel}${servicesLabel}\n${"=".repeat(72)}`);

  if (project.errors.length) {
    console.log(`  FAILED validation, ${project.errors.length} problem(s). Nothing was processed or uploaded:`);
    project.errors.forEach((e) => console.log(`    - [${slug}] ${e}`));
    warn();
    result.detail = `${project.errors.length} validation problem(s)`;
    return result;
  }
  console.log("  Validation passed.");
  if (dryRun && type === "parallel") console.log(`  ${PARALLEL_REMINDER}`);

  let uploaded = 0;
  try {
    // The existing slug check runs before any image work, so a skip costs nothing.
    let target = { action: "create" };
    if (!dryRun) {
      target = decideTarget(await findExisting(client, slug), overwrite);
      if (target.action === "skip") {
        console.log(`  SKIPPED [${slug}]: ${target.reason}`);
        warn();
        return { ...result, status: "skipped", detail: target.reason };
      }
      if (target.action === "overwrite") console.log(`  warning [${slug}]: --overwrite will replace document ${target.id}.`);
      if (target.draftNote) console.log(`  warning [${slug}]: ${target.draftNote}`);
    }

    // Each file is processed once, even when several blocks use it.
    const processed = new Map();
    for (const file of project.uploadFiles) {
      processed.set(file, await processImage(path.join(project.dir, file)));
    }
    result.images = processed.size;
    result.bytes = [...processed.values()].reduce((sum, p) => sum + p.after.bytes, 0);

    printPage(project, processed);
    warn();

    if (dryRun) {
      if (showJson) {
        const placeholders = new Map(project.uploadFiles.map((f) => [f, `(assigned on upload: ${outputFilename(f)})`]));
        console.log("\n  Would create this published caseStudy document:\n");
        console.log(JSON.stringify(buildDocument(project, placeholders), null, 2).replace(/^/gm, "    "));
      }
      return { ...result, status: "would create", detail: "dry run" };
    }

    const refs = new Map();
    for (const file of project.uploadFiles) {
      refs.set(file, await uploadImage(client, processed.get(file).buffer, outputFilename(file)));
      uploaded++;
    }
    const written = await writeDocument(client, buildDocument(project, refs), target);
    const status = target.action === "overwrite" ? "overwritten" : "created";
    console.log(`\n  ${status.toUpperCase()}: document ${written._id}`);
    return { ...result, status, detail: written._id };
  } catch (err) {
    console.log(`  FAILED [${slug}]: ${explain(err)}`);
    if (uploaded > 0) {
      console.log(
        `  ${uploaded} image(s) were uploaded before the failure. They stay in Sanity unattached. Rerunning reuses them, because Sanity recognises identical files.`
      );
    }
    return { ...result, detail: explain(err) };
  }
}

// The composed page as a numbered sequence, so the author can read its shape at a glance.
function printPage(project, processed) {
  const shown = new Map();
  const imageLine = (file, label = "") => {
    const p = processed.get(file);
    const repeat = shown.get(file);
    const note = repeat ? `same file as ${repeat}, uploaded once` : `from ${dims(p.before)}, ${size(p.before.bytes)}`;
    const name = label ? `${file} (${label})` : file;
    console.log(`           ${name.padEnd(34)} ${dims(p.after).padStart(11)}  ${size(p.after.bytes).padStart(9)}   ${note}`);
    if (!repeat) shown.set(file, label === "hero" ? "the hero" : `block ${current}`);
  };
  let current = "hero";

  console.log("\n  Page:");
  console.log("    hero");
  imageLine(project.cover.file, "hero");

  for (const b of project.plan) {
    current = b.n;
    const kind = b.type === "split" ? `split (${b.side})` : b.type;
    const paragraphs = (n) => `${n} paragraph${n === 1 ? "" : "s"}`;
    let text = "";
    if (b.type === "split" || b.type === "offset") {
      text = `${b.section.heading}  (${paragraphs(b.section.paragraphs.length)})`;
    } else if (b.type === "statement") {
      const [first, ...rest] = b.section.paragraphs;
      text = `${b.section.heading}  (quote ${first.plain.length} chars, ${rest.length ? `${paragraphs(rest.length).replace("paragraph", "body paragraph")}` : "no body"})`;
    }
    if (b.caption) text += `${text ? "  " : ""}caption: "${b.caption.length > 50 ? `${b.caption.slice(0, 50)}…` : b.caption}"`;
    console.log(`    ${String(b.n).padEnd(5)} ${kind.padEnd(15)} ${text}`);

    if (b.type === "pair") b.images.forEach((f) => imageLine(f));
    else if (b.type === "feature") {
      imageLine(b.image, "main");
      imageLine(b.detail, "detail");
    } else if (b.image) imageLine(b.image);
  }
}

export function explain(err) {
  if (err && (err.statusCode === 401 || err.statusCode === 403)) {
    return `Sanity rejected the token (HTTP ${err.statusCode}). Check that SANITY_WRITE_TOKEN in .env.import is correct and has Editor permission.`;
  }
  return err && err.message ? err.message : String(err);
}

export const dims = ({ width, height }) => `${width} x ${height}`;

export function size(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
