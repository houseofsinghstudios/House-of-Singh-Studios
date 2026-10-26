// First touch campaign tags. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { CAMPAIGN_KEY, campaignFromSearch, cleanCampaign, readStoredCampaign, referralCode, rememberFirstTouch, resolveCampaign } from "@/lib/campaign";

const memory = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), raw: m };
};
const blocked = { getItem: (): string | null => { throw new Error("SecurityError"); }, setItem: (): void => { throw new Error("SecurityError"); } };
const full = { getItem: () => null, setItem: (): void => { throw new Error("QuotaExceededError"); } };

test("tags are read from the query string; none means null", () => {
  assert.deepEqual(campaignFromSearch("?utm_source=instagram&utm_medium=bio"), { source: "instagram", medium: "bio", campaign: "", referralCode: "" });
  assert.deepEqual(campaignFromSearch("?utm_campaign=autumn&from=home_band_chip"), { source: "", medium: "", campaign: "autumn", referralCode: "" });
  assert.equal(campaignFromSearch(""), null);
  assert.equal(campaignFromSearch("?q=updated:3-5&from=home_band_chip"), null);
  assert.equal(campaignFromSearch("?utm_source=%20%20"), null, "blank tags count as none");
});

test("tags are short labels: trimmed, capped at 100, email addresses dropped", () => {
  assert.equal(campaignFromSearch(`?utm_source=${"a".repeat(150)}`)?.source.length, 100);
  assert.equal(campaignFromSearch("?utm_source=%20news%20")?.source, "news");
  assert.equal(campaignFromSearch("?utm_source=pat%40example.com"), null);
  assert.deepEqual(campaignFromSearch("?utm_source=pat%40example.com&utm_medium=email"), { source: "", medium: "email", campaign: "", referralCode: "" });
});

test("first touch is stored once and never overwritten in the session", () => {
  const s = memory();
  rememberFirstTouch("?utm_source=instagram&utm_medium=bio", s);
  rememberFirstTouch("?utm_source=newsletter&utm_medium=email&utm_campaign=oct", s);
  rememberFirstTouch("", s);
  assert.deepEqual(readStoredCampaign(s), { source: "instagram", medium: "bio", campaign: "", referralCode: "" });
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
  assert.deepEqual(resolveCampaign("?q=updated:3-5&from=home_band_chip", s), { source: "instagram", medium: "bio", campaign: "", referralCode: "" });
  assert.deepEqual(resolveCampaign("?utm_source=newsletter", s), { source: "newsletter", medium: "", campaign: "", referralCode: "" }, "the page's own tags win as a set");
  assert.deepEqual(resolveCampaign("", memory()), { source: "", medium: "", campaign: "", referralCode: "" });
});

test("blocked, full or missing storage never throws", () => {
  assert.doesNotThrow(() => rememberFirstTouch("?utm_source=x", blocked));
  assert.doesNotThrow(() => rememberFirstTouch("?utm_source=x", full));
  assert.doesNotThrow(() => rememberFirstTouch("?utm_source=x", null));
  assert.equal(readStoredCampaign(blocked), null);
  assert.deepEqual(resolveCampaign("", blocked), { source: "", medium: "", campaign: "", referralCode: "" });
  assert.deepEqual(resolveCampaign("?utm_medium=bio", blocked), { source: "", medium: "bio", campaign: "", referralCode: "" });
});

test("stored values that are malformed or not tags are ignored", () => {
  for (const raw of ["{not json", "null", "[]", "42", JSON.stringify({ source: 5 }), JSON.stringify({ source: "a@b.co" })]) {
    const s = memory();
    s.setItem(CAMPAIGN_KEY, raw);
    assert.equal(readStoredCampaign(s), null, raw);
  }
});

test("?ref: lowercased, kept only as 2 to 40 letters or digits", () => {
  assert.equal(campaignFromSearch("?ref=NorthPrint")?.referralCode, "northprint");
  assert.equal(campaignFromSearch("?ref=%20np2%20")?.referralCode, "np2");
  assert.equal(campaignFromSearch(`?ref=${"a".repeat(40)}`)?.referralCode.length, 40);
  for (const bad of ["a", "a".repeat(41), "north-print", "north_print", "north%20print", "pat%40example.com", "%C3%A9t%C3%A9", ""]) {
    assert.equal(campaignFromSearch(`?ref=${bad}`), null, bad);
  }
  assert.deepEqual(campaignFromSearch("?ref=no-good&utm_source=news"), { source: "news", medium: "", campaign: "", referralCode: "" }, "an invalid code is dropped, the tags kept");
  assert.equal(referralCode(42), "");
  assert.equal(referralCode(undefined), "");
});

test("?ref: missing means an empty code", () => {
  assert.equal(resolveCampaign("", memory()).referralCode, "");
  assert.equal(resolveCampaign("?utm_source=news", memory()).referralCode, "");
});

test("?ref: stored with the tags as first touch and never overwritten", () => {
  const s = memory();
  rememberFirstTouch("?ref=northprint", s);
  rememberFirstTouch("?ref=southprint&utm_source=news", s);
  assert.deepEqual(readStoredCampaign(s), { source: "", medium: "", campaign: "", referralCode: "northprint" });
  assert.equal(resolveCampaign("?from=home_band_chip", s).referralCode, "northprint", "later pages use the stored code");
  const t = memory();
  rememberFirstTouch("?utm_source=instagram&ref=northprint", t);
  assert.deepEqual(readStoredCampaign(t), { source: "instagram", medium: "", campaign: "", referralCode: "northprint" });
});

test("?ref: the page's own code wins over the stored one, without dropping the stored tags", () => {
  const s = memory();
  rememberFirstTouch("?utm_source=instagram&ref=northprint", s);
  assert.deepEqual(resolveCampaign("?ref=southprint", s), { source: "instagram", medium: "", campaign: "", referralCode: "southprint" });
  assert.deepEqual(resolveCampaign("?utm_source=news", s), { source: "news", medium: "", campaign: "", referralCode: "northprint" });
  assert.equal(resolveCampaign("?ref=bad-code", s).referralCode, "northprint", "an invalid own code falls back to the stored one");
});

test("?ref: blocked storage never throws; the page's own code still counts", () => {
  assert.doesNotThrow(() => rememberFirstTouch("?ref=northprint", blocked));
  assert.equal(resolveCampaign("?ref=northprint", blocked).referralCode, "northprint");
});

test("server side: a sent campaign is cleaned with the same rules", () => {
  assert.deepEqual(cleanCampaign({ source: " news ", referralCode: "NorthPrint" }), { source: "news", medium: "", campaign: "", referralCode: "northprint" });
  assert.deepEqual(cleanCampaign({ referralCode: "<b>x</b>", source: "pat@example.com" }), { source: "", medium: "", campaign: "", referralCode: "" });
  assert.deepEqual(cleanCampaign(null), { source: "", medium: "", campaign: "", referralCode: "" });
});
