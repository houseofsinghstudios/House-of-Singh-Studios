// /api/consent-region: whether a visitor is in a region with stricter consent rules, from the location
// headers Vercel adds. A GET with no body, no rate limiter and no n8n call, so the form routes' 413,
// 429, 502 and 504 cases do not apply; this covers what it does decide. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { GET } from "@/app/api/consent-region/route";
import { STRICT_CONSENT_REGIONS } from "@/lib/constants/analytics";

const ask = (headers: Record<string, string> = {}) => GET(new Request("http://localhost/api/consent-region", { headers }));
const strict = async (headers: Record<string, string>) => ((await (await ask(headers)).json()) as { strict: boolean }).strict;

test("every country on the strict list is strict", async () => {
  for (const entry of STRICT_CONSENT_REGIONS.filter((r) => !r.includes("-"))) {
    assert.equal(await strict({ "x-vercel-ip-country": entry }), true, entry);
  }
});

test("Quebec is strict; the rest of Canada and the United States are not", async () => {
  assert.equal(await strict({ "x-vercel-ip-country": "CA", "x-vercel-ip-country-region": "QC" }), true);
  assert.equal(await strict({ "x-vercel-ip-country": "CA", "x-vercel-ip-country-region": "ON" }), false);
  assert.equal(await strict({ "x-vercel-ip-country": "CA" }), false, "Canada without a region is not strict");
  assert.equal(await strict({ "x-vercel-ip-country": "US", "x-vercel-ip-country-region": "CA" }), false, "California is not Canada");
  assert.equal(await strict({ "x-vercel-ip-country": "US", "x-vercel-ip-country-region": "QC" }), false, "a region counts only with its own country");
});

test("headers are read regardless of case and spacing", async () => {
  assert.equal(await strict({ "x-vercel-ip-country": " de " }), true);
  assert.equal(await strict({ "x-vercel-ip-country": "ca", "x-vercel-ip-country-region": " qc " }), true);
});

test("without a country (not on Vercel, or unknown) the region counts as strict", async () => {
  assert.equal(await strict({}), true);
  assert.equal(await strict({ "x-vercel-ip-country": "   " }), true);
  assert.equal(await strict({ "x-vercel-ip-country-region": "ON" }), true, "a region alone is not enough");
});

test("the answer is JSON, cached privately for an hour, and only says strict or not", async () => {
  const res = await ask({ "x-vercel-ip-country": "FR" });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("cache-control"), "private, max-age=3600");
  assert.match(res.headers.get("content-type") || "", /^application\/json/);
  assert.deepEqual(await res.json(), { strict: true });
});
