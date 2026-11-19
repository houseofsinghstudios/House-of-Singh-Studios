// The Sanity webhook route (src/app/api/revalidate) refuses anything not signed with
// SANITY_REVALIDATE_SECRET, and refreshes nothing without the secret. Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import type { NextRequest } from "next/server";
import { POST } from "@/app/api/revalidate/route";
import { REVALIDATE_TARGETS, signatureAccepted } from "@/lib/revalidate";

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
  assert.equal(signatureAccepted(true), true);
  assert.equal(signatureAccepted(false), false);
  assert.equal(signatureAccepted(null), false);
  assert.deepEqual(REVALIDATE_TARGETS.map((t) => t.path), ["/", "/sitemap.xml", "/llms.txt"]);
  assert.equal(REVALIDATE_TARGETS[0].type, "layout");
});
