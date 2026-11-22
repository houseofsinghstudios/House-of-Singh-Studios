// The Sanity webhook route with a correctly signed request: 200 and every refresh target refreshed;
// 500 when the refresh fails, so Sanity retries. next/cache is replaced by a stand in that records
// the calls (the tests run as CommonJS, so the route is required after the stand in is in place).
// The signature is made the way Sanity makes it: an HMAC SHA256 of "<timestamp>.<body>" with the
// shared secret, base64url, sent as "t=<timestamp>,v1=<signature>". Run with: npm run test
import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import Module from "node:module";
import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";

const calls: Array<[string, string | undefined]> = [];
let failRefresh = false;
const file = require.resolve("next/cache");
const mod = new Module(file);
Object.assign(mod, {
  filename: file,
  loaded: true,
  exports: {
    __esModule: true,
    revalidatePath: (path: string, type?: string) => {
      if (failRefresh) throw new Error("refresh failed");
      calls.push([path, type]);
    },
  },
});
require.cache[file] = mod;
/* eslint-disable @typescript-eslint/no-require-imports */
const { POST }: typeof import("@/app/api/revalidate/route") = require("@/app/api/revalidate/route");
const { REVALIDATE_TARGETS }: typeof import("@/lib/revalidate") = require("@/lib/revalidate");
/* eslint-enable @typescript-eslint/no-require-imports */

const SECRET = "test-secret";
const BODY = JSON.stringify({ _type: "post", slug: "brand-audit-checklist" });

function signed(body = BODY, secret = SECRET, timestamp = Date.now()) {
  const signature = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("base64url");
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: { "content-type": "application/json", "sanity-webhook-signature": `t=${timestamp},v1=${signature}` },
    body,
  }) as unknown as NextRequest;
}

beforeEach(() => {
  process.env.SANITY_REVALIDATE_SECRET = SECRET;
  calls.length = 0;
  failRefresh = false;
});
afterEach(() => { delete process.env.SANITY_REVALIDATE_SECRET; });

test("a correctly signed request returns 200 and refreshes the site, the sitemap and llms.txt", async () => {
  const res = await POST(signed());
  assert.equal(res.status, 200);
  assert.equal((await res.json()).revalidated, true);
  assert.deepEqual(calls, REVALIDATE_TARGETS.map((t) => [t.path, t.type]));
  assert.deepEqual(calls.map(([path]) => path), ["/", "/sitemap.xml", "/llms.txt"]);
});

test("a request signed with another secret is refused and refreshes nothing", async () => {
  const res = await POST(signed(BODY, "another-secret"));
  assert.equal(res.status, 401);
  assert.deepEqual(calls, []);
});

test("when the refresh fails, the answer is 500, so Sanity retries the delivery", async () => {
  failRefresh = true;
  const res = await POST(signed());
  assert.equal(res.status, 500);
});

test("a correctly signed body that is not JSON is a bad request, not a server error", async () => {
  const res = await POST(signed("not json"));
  assert.equal(res.status, 400);
  assert.deepEqual(calls, []);
});

test("a correctly signed delivery replayed after five minutes is refused and refreshes nothing", async () => {
  const res = await POST(signed(BODY, SECRET, Date.now() - 6 * 60 * 1000));
  assert.equal(res.status, 401);
  assert.deepEqual(calls, []);
});
