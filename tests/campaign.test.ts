// First touch campaign tags. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { CAMPAIGN_KEY, campaignFromSearch, readStoredCampaign, rememberFirstTouch, resolveCampaign } from "@/lib/campaign";

const memory = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), raw: m };
};
const blocked = { getItem: (): string | null => { throw new Error("SecurityError"); }, setItem: (): void => { throw new Error("SecurityError"); } };
const full = { getItem: () => null, setItem: (): void => { throw new Error("QuotaExceededError"); } };

test("tags are read from the query string; none means null", () => {
  assert.deepEqual(campaignFromSearch("?utm_source=instagram&utm_medium=bio"), { source: "instagram", medium: "bio", campaign: "" });
  assert.deepEqual(campaignFromSearch("?utm_campaign=autumn&from=home_band_chip"), { source: "", medium: "", campaign: "autumn" });
  assert.equal(campaignFromSearch(""), null);
  assert.equal(campaignFromSearch("?q=updated:3-5&from=home_band_chip"), null);
  assert.equal(campaignFromSearch("?utm_source=%20%20"), null, "blank tags count as none");
});

test("tags are short labels: trimmed, capped at 100, email addresses dropped", () => {
  assert.equal(campaignFromSearch(`?utm_source=${"a".repeat(150)}`)?.source.length, 100);
  assert.equal(campaignFromSearch("?utm_source=%20news%20")?.source, "news");
  assert.equal(campaignFromSearch("?utm_source=pat%40example.com"), null);
  assert.deepEqual(campaignFromSearch("?utm_source=pat%40example.com&utm_medium=email"), { source: "", medium: "email", campaign: "" });
});

test("first touch is stored once and never overwritten in the session", () => {
  const s = memory();
  rememberFirstTouch("?utm_source=instagram&utm_medium=bio", s);
  rememberFirstTouch("?utm_source=newsletter&utm_medium=email&utm_campaign=oct", s);
  rememberFirstTouch("", s);
  assert.deepEqual(readStoredCampaign(s), { source: "instagram", medium: "bio", campaign: "" });
  assert.equal(s.raw.size, 1);
  assert.ok(s.raw.has(CAMPAIGN_KEY));
});

test("a page without tags stores nothing", () => {
  const s = memory();
  rememberFirstTouch("?from=home_band_chip", s);
  assert.equal(s.raw.size, 0);
});

test("tools use the page's own tags if present, otherwise the stored first touch, otherwise empty", () => {
  const s = memory();
  rememberFirstTouch("?utm_source=instagram&utm_medium=bio", s);
  assert.deepEqual(resolveCampaign("?q=updated:3-5&from=home_band_chip", s), { source: "instagram", medium: "bio", campaign: "" });
  assert.deepEqual(resolveCampaign("?utm_source=newsletter", s), { source: "newsletter", medium: "", campaign: "" }, "the page's own tags win as a set");
  assert.deepEqual(resolveCampaign("", memory()), { source: "", medium: "", campaign: "" });
});

test("blocked, full or missing storage never throws", () => {
  assert.doesNotThrow(() => rememberFirstTouch("?utm_source=x", blocked));
  assert.doesNotThrow(() => rememberFirstTouch("?utm_source=x", full));
  assert.doesNotThrow(() => rememberFirstTouch("?utm_source=x", null));
  assert.equal(readStoredCampaign(blocked), null);
  assert.deepEqual(resolveCampaign("", blocked), { source: "", medium: "", campaign: "" });
  assert.deepEqual(resolveCampaign("?utm_medium=bio", blocked), { source: "", medium: "bio", campaign: "" });
});

test("stored values that are malformed or not tags are ignored", () => {
  for (const raw of ["{not json", "null", "[]", "42", JSON.stringify({ source: 5 }), JSON.stringify({ source: "a@b.co" })]) {
    const s = memory();
    s.setItem(CAMPAIGN_KEY, raw);
    assert.equal(readStoredCampaign(s), null, raw);
  }
});
