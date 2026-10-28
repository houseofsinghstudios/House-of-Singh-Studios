// "Updated <Month Year>" under an article's date. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { updatedLabel } from "@/lib/article-dates";

test("shown only when the article changed more than 30 days after it was published", () => {
  assert.equal(updatedLabel("2026-04-09T12:00:00Z", "2026-10-20T15:00:00Z"), "Updated October 2026");
  assert.equal(updatedLabel("2026-05-04T12:00:00Z", "2026-05-04T13:00:00Z"), null, "same day");
  assert.equal(updatedLabel("2026-05-01T00:00:00Z", "2026-05-31T00:00:00Z"), null, "exactly 30 days");
  assert.equal(updatedLabel("2026-05-01T00:00:00Z", "2026-05-31T00:00:01Z"), "Updated May 2026", "just over 30 days");
});

test("missing or unreadable dates show nothing", () => {
  for (const [p, u] of [[undefined, "2026-10-20"], ["2026-04-09", undefined], [null, null], ["not a date", "2026-10-20"]]) {
    assert.equal(updatedLabel(p, u), null, `${p} ${u}`);
  }
});

test("the month is the studio's month in Toronto", () => {
  assert.equal(updatedLabel("2026-01-01T00:00:00Z", "2026-11-01T03:00:00Z"), "Updated October 2026", "still October 31 in Toronto");
});
