// The Sanity webhook route (src/app/api/revalidate) refuses anything not signed with
// SANITY_REVALIDATE_SECRET, and refreshes nothing without the secret. Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import type { NextRequest } from "next/server";
import { POST } from "@/app/api/revalidate/route";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { checkSignature, MAX_SIGNATURE_AGE_MS, REVALIDATE_TARGETS } from "@/lib/revalidate";

afterEach(() => { delete process.env.SANITY_REVALIDATE_SECRET; });

const request = (headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/revalidate", { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify({ _type: "post" }) }) as unknown as NextRequest;

test("fails closed without the secret", async () => {
  const res = await POST(request({ "sanity-webhook-signature": "t=1,v1=abc" }));
  assert.equal(res.status, 500);
});

test("refuses a request without a signature", async () => {
  process.env.SANITY_REVALIDATE_SECRET = "test-secret";
  const res = await POST(request());
  assert.equal(res.status, 401);
});

test("refuses a request with a wrong signature", async () => {
  process.env.SANITY_REVALIDATE_SECRET = "test-secret";
  const res = await POST(request({ "sanity-webhook-signature": `t=${Date.now()},v1=bm90LXZhbGlk` }));
  assert.equal(res.status, 401);
});

test("only a matched signature is accepted; the whole site, sitemap and llms.txt are refreshed", () => {
  // Finding 13: signed as Sanity signs, compared in constant time, and never older than five minutes.
  const now = Date.UTC(2026, 10, 22, 12);
  const sign = (body: string, t: number, secret = "test-secret") => `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${body}`).digest("base64url")}`;
  const body = JSON.stringify({ _type: "post" });
  assert.equal(checkSignature(body, sign(body, now), "test-secret", now), "valid");
  assert.equal(checkSignature(body, sign(body, now - 60_000), "test-secret", now), "valid", "a minute old is fine");
  assert.equal(checkSignature(body, sign(body, now - MAX_SIGNATURE_AGE_MS - 1), "test-secret", now), "expired", "a replay after five minutes");
  assert.equal(checkSignature(body, sign(body, now + MAX_SIGNATURE_AGE_MS + 1), "test-secret", now), "expired", "or from the future");
  assert.equal(checkSignature(body, sign(body, now, "another"), "test-secret", now), "invalid");
  assert.equal(checkSignature(`${body} `, sign(body, now), "test-secret", now), "invalid", "a changed body");
  assert.equal(checkSignature(body, null, "test-secret", now), "missing");
  for (const bad of ["", "nonsense", "t=,v1=abc", `t=${now}`, `v1=abc`, `t=${now},v1=not base64!`]) {
    assert.ok(["missing", "malformed"].includes(checkSignature(body, bad, "test-secret", now)), bad);
  }
  const lib = readFileSync("src/lib/revalidate.ts", "utf8");
  assert.match(lib, /timingSafeEqual\(given, expected\)/);
  assert.doesNotMatch(readFileSync("src/app/api/revalidate/route.ts", "utf8"), /from "next-sanity\/webhook"|parseBody\(/);
  assert.deepEqual(REVALIDATE_TARGETS.map((t) => t.path), ["/", "/sitemap.xml", "/llms.txt"]);
  assert.equal(REVALIDATE_TARGETS[0].type, "layout");
});
