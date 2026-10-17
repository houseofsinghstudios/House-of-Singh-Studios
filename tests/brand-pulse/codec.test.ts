// Share code tests. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { decode, encode, isValidAnswers } from "@/lib/brand-pulse/codec";
import { allAnswers } from "./all-answers";

test("every combination round trips through the codec, with unique 4 character codes", () => {
  const seen = new Set<string>();
  for (const a of allAnswers()) {
    const code = encode(a);
    assert.match(code, /^[0-9a-z]{4}$/);
    assert.deepEqual(decode(code), a);
    seen.add(code);
  }
  assert.equal(seen.size, 53760);
});

test("invalid codes return null and never throw", () => {
  const bad: unknown[] = ["", "abc", "abcde", "ZZZZ", "15hd", "zzzz", "15h!", " 0000", null, undefined, 42, {}, [], "0000\n"];
  for (const code of bad) assert.equal(decode(code), null, `expected null for ${JSON.stringify(code)}`);
  assert.notEqual(decode("0000"), null);
  assert.notEqual(decode((53759).toString(36)), null);
  assert.equal(decode((53760).toString(36)), null);
});

test("answer validation accepts only allowed ids", () => {
  const good = decode("0000");
  assert.ok(isValidAnswers(good));
  assert.ok(!isValidAnswers({ ...good, industry: "farming" }));
  assert.ok(!isValidAnswers({ ...good, ahead: undefined }));
  assert.ok(!isValidAnswers(null));
  assert.ok(!isValidAnswers("0000"));
});
