import { createHmac, timingSafeEqual } from "node:crypto";

// What the Sanity webhook (src/app/api/revalidate/route.ts) refreshes when content is published,
// changed or deleted. Every page reads Sanity somewhere (articles, case studies, testimonials,
// initiatives, open roles, network members, the About page settings, the founder portrait in every
// page's structured data), so the whole site is refreshed rather than a list of pages that would
// drift out of date. The sitemap and llms.txt are route handlers, named as well so they never wait
// for their hourly refresh.
export type RevalidateTarget = { path: string; type?: "layout" | "page" };

export const REVALIDATE_TARGETS: readonly RevalidateTarget[] = [
  { path: "/", type: "layout" },
  { path: "/sitemap.xml" },
  { path: "/llms.txt" },
];

// The webhook's signature, checked here rather than by next-sanity's parseBody (audit of 20 Nov 2026,
// finding 13). Sanity sends "t=<timestamp in milliseconds>,v1=<signature>", the signature being an
// HMAC SHA256 of "<timestamp>.<body>" with the shared secret, in base64url. Compared in constant time,
// and refused when the timestamp is more than five minutes from now, so a captured delivery cannot be
// replayed later.
export const SIGNATURE_HEADER = "sanity-webhook-signature";
export const MAX_SIGNATURE_AGE_MS = 5 * 60 * 1000;

export type SignatureCheck = "valid" | "missing" | "malformed" | "expired" | "invalid";

export function checkSignature(body: string, header: string | null, secret: string, now: number = Date.now()): SignatureCheck {
  if (!header) return "missing";
  const match = /^t=(\d{1,16})[, ]+v1=([A-Za-z0-9_-]{1,128})$/.exec(header.trim());
  if (!match) return "malformed";
  const timestamp = Number(match[1]);
  if (Math.abs(now - timestamp) > MAX_SIGNATURE_AGE_MS) return "expired";
  const expected = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest();
  const given = Buffer.from(match[2], "base64url");
  return given.length === expected.length && timingSafeEqual(given, expected) ? "valid" : "invalid";
}
