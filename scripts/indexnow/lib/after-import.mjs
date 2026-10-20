// Which URLs each import tells IndexNow about, after a successful --commit. Dry runs never call these.
import { HOST } from "../config.mjs";
import { submitAfterImport } from "./submit.mjs";

const SITE = `https://${HOST}`;
const WRITTEN = ["created", "overwritten"];

// Every case study the portfolio import created or replaced, plus /work.
export function portfolioUrls(results) {
  const slugs = results.filter((r) => WRITTEN.includes(r.status)).map((r) => r.slug);
  return slugs.length ? [...slugs.map((s) => `${SITE}/work/${s}`), `${SITE}/work`] : [];
}

// /careers, when the roles import created or replaced at least one role.
export function rolesUrls(results) {
  return results.some((r) => WRITTEN.includes(r.status)) ? [`${SITE}/careers`] : [];
}

export async function notifyIndexNow(urls, label, options = {}) {
  if (!urls.length) return;
  await submitAfterImport(urls, { label, ...options });
}
