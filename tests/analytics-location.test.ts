// page_location carries only known query parameters: campaign tags and the site's own, each exactly
// as written; everything else, and any value with an "@", is dropped. page_path stays the path.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanLocation, pageContext } from "@/lib/analytics";

const SITE = "https://studios.houseofsingh.com";
const loc = (path: string) => pageContext(`${SITE}${path}`, "Title").page_location;

test("an email in the address is dropped; utm_source stays", () => {
  assert.equal(loc("/?email=a@b.com&utm_source=google"), `${SITE}/?utm_source=google`);
  assert.equal(pageContext(`${SITE}/services?email=a@b.com&utm_source=google`, "T").page_path, "/services");
});

test("every known parameter is kept exactly as written, in its order", () => {
  const known = "utm_source=news&utm_medium=email&utm_campaign=Fall%202026&utm_term=brand+identity&utm_content=hero&ref=northprint&from=home&service=identity&begin=1&q=industry:professional-services&r=a1b2c3&category=branding";
  assert.equal(loc(`/start?${known}`), `${SITE}/start?${known}`);
  assert.equal(loc("/services/brand-identity?from=home#faq"), `${SITE}/services/brand-identity?from=home#faq`);
});

test("unknown parameters and the site's own flags are never sent", () => {
  assert.equal(loc("/?hos_internal=1&hos_debug=1"), `${SITE}/`);
  assert.equal(loc("/?gclid=abc&fbclid=def&token=xyz&utm_source=google"), `${SITE}/?utm_source=google`);
  assert.equal(loc("/contact?name=Ada&service=identity"), `${SITE}/contact?service=identity`);
});

test("a known parameter whose value holds an @, written or encoded, is dropped too", () => {
  assert.equal(loc("/?utm_source=a@b.com&ref=northprint"), `${SITE}/?ref=northprint`);
  assert.equal(loc("/?utm_content=ada%40example.com&from=home"), `${SITE}/?from=home`);
  assert.equal(loc("/?q=x%2540y"), `${SITE}/?q=x%2540y`, "only a real @ counts, not a double encoded one");
});

test("odd addresses: no query, empty parts, broken encoding", () => {
  assert.equal(loc("/work"), `${SITE}/work`);
  assert.equal(loc("/work?"), `${SITE}/work`);
  assert.equal(loc("/work?&&from=home&"), `${SITE}/work?from=home`);
  assert.equal(loc("/work?from=%E0%A4%A&x=%"), `${SITE}/work?from=%E0%A4%A`);
  assert.equal(cleanLocation(new URL(`${SITE}/?begin`)), `${SITE}/?begin`);
});
