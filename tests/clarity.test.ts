// Microsoft Clarity follows analytics consent: nothing without it, stops when it is withdrawn, starts
// again when it is given back. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { followClarity, type ClarityWindow } from "@/lib/clarity";

function setup() {
  const w: ClarityWindow = {};
  let tags = 0;
  const load = () => { tags++; };
  const queued = () => (w.clarity?.q ?? []).map((c) => c[0]);
  return { w, load, tags: () => tags, queued };
}

test("without consent (a stricter region before any choice) nothing is loaded or queued", () => {
  const t = setup();
  followClarity("denied", t.w, t.load);
  assert.equal(t.tags(), 0);
  assert.equal(t.w.clarity, undefined, "no stub, so nothing can be queued or sent");
});

test("with consent: the stub, the granted signal, then the tag, once per page", () => {
  const t = setup();
  followClarity("granted", t.w, t.load);
  followClarity("granted", t.w, t.load);
  assert.equal(t.tags(), 1);
  assert.deepEqual(t.w.clarity!.q![0], ["consentv2", { ad_Storage: "denied", analytics_Storage: "granted" }]);
});

test("turning analytics off stops Clarity; on again starts it, without loading the tag twice", () => {
  const t = setup();
  followClarity("granted", t.w, t.load);
  followClarity("denied", t.w, t.load);
  followClarity("denied", t.w, t.load);
  followClarity("granted", t.w, t.load);
  assert.deepEqual(t.queued(), ["consentv2", "stop", "consentv2", "start"]);
  assert.equal(t.tags(), 1);
});

test("consent given later on the page, after a stricter region default: Clarity starts then", () => {
  const t = setup();
  followClarity("denied", t.w, t.load);
  assert.equal(t.tags(), 0);
  followClarity("granted", t.w, t.load);
  assert.equal(t.tags(), 1);
  assert.deepEqual(t.queued(), ["consentv2"]);
});
