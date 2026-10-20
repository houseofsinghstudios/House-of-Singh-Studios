// IndexNow submission, shared by `npm run indexnow` and the two imports.
// Nothing here throws on a failed submission: callers get a result and decide what to print.

import { BATCH_SIZE, ENDPOINT, HOST, KEY, KEY_LOCATION } from "../config.mjs";

const MESSAGES = {
  200: "Submitted, Bing accepted the URLs.",
  202: "Submitted, Bing accepted the URLs.",
  400: "Bad request.",
  403: "Key not valid: the key file may not be live yet.",
  422: "A URL does not match the host or key.",
  429: "Too many submissions, try again later.",
};

export function describeStatus(status) {
  return MESSAGES[status] ?? `Unexpected response (HTTP ${status}).`;
}

// Splits URLs into those on our host and the rest. Only https URLs on HOST are accepted.
export function checkUrls(urls) {
  const ok = [];
  const rejected = [];
  for (const raw of urls) {
    let url;
    try {
      url = new URL(String(raw).trim());
    } catch {
      rejected.push({ url: raw, reason: "not a full URL" });
      continue;
    }
    if (url.protocol !== "https:" || url.hostname !== HOST) rejected.push({ url: raw, reason: `not on https://${HOST}` });
    else ok.push(url.href);
  }
  return { ok: [...new Set(ok)], rejected };
}

// One payload per batch of up to BATCH_SIZE URLs.
export function buildPayloads(urls) {
  const payloads = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    payloads.push({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls.slice(i, i + BATCH_SIZE) });
  }
  return payloads;
}

// Sends each batch once. Returns [{ count, status, ok, message }]. A network error becomes status 0.
export async function submitUrls(urls, { endpoint = ENDPOINT, fetchImpl = globalThis.fetch } = {}) {
  const results = [];
  for (const payload of buildPayloads(urls)) {
    try {
      const res = await fetchImpl(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });
      results.push({ count: payload.urlList.length, status: res.status, ok: res.status === 200 || res.status === 202, message: describeStatus(res.status) });
    } catch (err) {
      results.push({ count: payload.urlList.length, status: 0, ok: false, message: `Could not reach IndexNow (${err?.name || "error"}).` });
    }
  }
  return results;
}

// Every <loc> in a sitemap document.
export function urlsFromSitemap(xml) {
  return [...String(xml).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
}

// After an import: submit quietly, and turn any failure into one warning line. Never throws.
export async function submitAfterImport(urls, { label, endpoint, fetchImpl } = {}) {
  try {
    const { ok } = checkUrls(urls);
    if (!ok.length) return;
    const results = await submitUrls(ok, { endpoint, fetchImpl });
    const failed = results.find((r) => !r.ok);
    if (failed) console.log(`  warning: IndexNow submission for ${label} failed: ${failed.message} The import itself succeeded.`);
    else console.log(`  IndexNow: submitted ${ok.length} URL(s) for ${label}. ${results[0].message}`);
  } catch (err) {
    console.log(`  warning: IndexNow submission for ${label} failed (${err?.name || "error"}). The import itself succeeded.`);
  }
}
