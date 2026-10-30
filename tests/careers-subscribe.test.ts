// Careers application and newsletter signup rules. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { CAREERS_LIMITS, checkCareers, cleanCareers } from "@/lib/careers";
import { SUBSCRIBE_EMAIL_MAX, checkSubscribeEmail } from "@/lib/subscribe";

const valid = { name: "Ada", email: "ada@example.com", role: "Photographer", portfolioUrl: "https://example.com", message: "Hello." };

test("careers: a normal application passes; portfolio and message may be empty", () => {
  assert.equal(checkCareers(cleanCareers(valid)), null);
  assert.equal(checkCareers(cleanCareers({ ...valid, portfolioUrl: "", message: undefined })), null);
});

test("careers: name, email and role are required, after cleaning", () => {
  for (const key of ["name", "email", "role"] as const) {
    assert.equal(checkCareers(cleanCareers({ ...valid, [key]: "  <b></b> " })), "Name, email, and role are required.", key);
  }
  assert.equal(checkCareers(cleanCareers({ ...valid, email: "nope" })), "Invalid email format.");
});

test("careers: each field is capped, with a short reason that never quotes the value", () => {
  const cases: [keyof typeof CAREERS_LIMITS, string][] = [["name", "Name"], ["role", "Role"], ["portfolioUrl", "Portfolio URL"], ["message", "Message"]];
  for (const [key, label] of cases) {
    const max = CAREERS_LIMITS[key];
    // The portfolio must also be a web address, so its value at the cap starts with https://.
    const value = (n: number) => (key === "portfolioUrl" ? `https://${"x".repeat(n - 8)}` : "x".repeat(n));
    assert.equal(checkCareers(cleanCareers({ ...valid, [key]: value(max) })), null, `${key} at the cap`);
    const reason = checkCareers(cleanCareers({ ...valid, [key]: value(max + 1) })) ?? "";
    assert.match(reason, new RegExp(`^${label} must be at most`), key);
    assert.ok(!reason.includes("xxxx"), "reason does not quote the value");
  }
  const longEmail = `${"a".repeat(CAREERS_LIMITS.email)}@example.com`;
  assert.match(checkCareers(cleanCareers({ ...valid, email: longEmail })) ?? "", /^Email must be at most 254/);
  assert.deepEqual(CAREERS_LIMITS, { name: 120, email: 254, role: 120, portfolioUrl: 500, message: 5000 });
});

test("careers: tags are removed before checking and sending", () => {
  assert.equal(cleanCareers({ ...valid, name: " <i>Ada</i> " }).name, "Ada");
});

test("subscribe: valid email passes; bad or over 254 characters is rejected", () => {
  assert.equal(checkSubscribeEmail("ada@example.com"), null);
  assert.equal(checkSubscribeEmail(""), "Invalid email");
  assert.equal(checkSubscribeEmail("nope"), "Invalid email");
  const atCap = `${"a".repeat(SUBSCRIBE_EMAIL_MAX - "@example.com".length)}@example.com`;
  assert.equal(atCap.length, 254);
  assert.equal(checkSubscribeEmail(atCap), null);
  assert.equal(checkSubscribeEmail(`a${atCap}`), "Email must be at most 254 characters");
});

test("careers: a portfolio, when given, must start with http:// or https://", () => {
  for (const ok of ["https://ada.example/work", "http://ada.example", "HTTPS://ADA.EXAMPLE", ""]) {
    assert.equal(checkCareers(cleanCareers({ ...valid, portfolioUrl: ok })), null, ok);
  }
  for (const bad of ["javascript:alert(1)", "ada.example", "//ada.example", "ftp://ada.example", "mailto:ada@example.com", "data:text/html,hi", " javascript:alert(1)"]) {
    assert.equal(checkCareers(cleanCareers({ ...valid, portfolioUrl: bad })), "Portfolio URL must start with http:// or https://", bad);
  }
});
