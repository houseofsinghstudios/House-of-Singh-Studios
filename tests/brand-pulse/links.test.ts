// Share and booking link tests. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { decode } from "@/lib/brand-pulse/codec";
import { assess } from "@/lib/brand-pulse/engine";
import { bookingNotes, bookingUrl, shareUrl } from "@/lib/brand-pulse/links";
import { BOOKING_URL } from "@/lib/brand-pulse/settings";
import { allAnswers } from "./all-answers";

test("booking notes stay under 1,000 characters for every combination", () => {
  let longest = 0;
  for (const a of allAnswers()) longest = Math.max(longest, bookingNotes(a, assess(a), shareUrl(a)).length);
  assert.ok(longest < 1000, `longest notes ${longest}`);
});

test("every booking link carries the notes only: no email, no name, no @ outside the notes", () => {
  for (const a of allAnswers()) {
    const r = assess(a);
    const share = shareUrl(a);
    const url = bookingUrl(a, r, share);
    assert.ok(url.startsWith(`${BOOKING_URL}?`), url);
    assert.ok(!url.includes("email=") && !url.includes("name="), url);
    const parsed = new URL(url);
    assert.deepEqual([...parsed.searchParams.keys()], ["notes"]);
    assert.equal(parsed.searchParams.get("notes"), bookingNotes(a, r, share));
    // Everything except the encoded notes value: the address and the parameter name.
    const outsideNotes = url.replace(`notes=${encodeURIComponent(bookingNotes(a, r, share))}`, "");
    assert.ok(!outsideNotes.includes("@") && !outsideNotes.includes("%40"), outsideNotes);
  }
});

test("booking link notes start with the profile and end with the share link", () => {
  const a = decode("09mg")!;
  const r = assess(a);
  const notes = new URL(bookingUrl(a, r, shareUrl(a))).searchParams.get("notes")!;
  assert.ok(notes.startsWith(`Brand Pulse: ${r.profileName}, ${r.pulseLabel}. Up to date `));
  assert.ok(notes.endsWith("Result: https://studios.houseofsingh.com/brand-pulse?r=09mg"));
});

test("an email typed into any form field can never reach the booking link", () => {
  const stray = "stray.person@example-test.com";
  const a = decode("09mg")!;
  const r = assess(a);
  const clean = bookingUrl(a, r, shareUrl(a));
  // The link is built from answers, the computed result and the share link only. There is no
  // parameter for contact details, and anything extra a caller passes is ignored.
  assert.equal(bookingUrl.length, 3);
  const contactFields = { email: stray, name: stray, company: stray, website: stray, teamSize: stray };
  const withExtra = (bookingUrl as (...args: unknown[]) => string)(a, r, shareUrl(a), contactFields);
  assert.equal(withExtra, clean);
  for (const url of [clean, withExtra]) {
    assert.ok(!url.includes("stray") && !url.includes("@") && !url.includes("%40"), url);
  }
});
