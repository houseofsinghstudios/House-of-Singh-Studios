// The Studio Guide teaser on /ai is hidden until the guide launches (owner decision, 23 Nov 2026), kept
// in the code behind one flag. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { STUDIO_GUIDE_LIVE } from "@/lib/constants/features";

test("the teaser is off, and only the flag turns it on", () => {
  assert.equal(STUDIO_GUIDE_LIVE, false);
  const ai = readFileSync("src/components/ai/AILabClient.tsx", "utf8");
  assert.match(ai, /\{STUDIO_GUIDE_LIVE && \(\s*<section/, "the whole section sits behind the flag");
  assert.match(ai, /\(Studio Guide\)/, "kept in the code, ready to turn on");
});
