// Share and booking link tests. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { decode } from "@/lib/brand-pulse/codec";
import { assess } from "@/lib/brand-pulse/engine";
import { bookingNotes, bookingUrl, shareUrl } from "@/lib/brand-pulse/links";
import { allAnswers } from "./all-answers";

test("booking notes stay under 1,000 characters for every combination", () => {
  let longest = 0;
  for (const a of allAnswers()) longest = Math.max(longest, bookingNotes(a, assess(a), shareUrl(a)).length);
  assert.ok(longest < 1000, `longest notes ${longest}`);
});

test("booking link carries notes, and email and name only when given", () => {
  const a = decode("09mg")!;
  const r = assess(a);
  const plain = new URL(bookingUrl(a, r, shareUrl(a)));
  assert.equal(plain.origin + plain.pathname, "https://cal.com/houseofsinghstudios/30min");
  assert.ok(plain.searchParams.get("notes")!.startsWith(`Brand Pulse: ${r.profileName}, ${r.pulseLabel}. Up to date `));
  assert.ok(plain.searchParams.get("notes")!.endsWith(`Result: https://studios.houseofsingh.com/brand-pulse?r=09mg`));
  assert.equal(plain.searchParams.has("email"), false);
  assert.equal(plain.searchParams.has("name"), false);
  const withContact = new URL(bookingUrl(a, r, shareUrl(a), { email: "a@b.co", name: "Ana Ng" }));
  assert.equal(withContact.searchParams.get("email"), "a@b.co");
  assert.equal(withContact.searchParams.get("name"), "Ana Ng");
});
