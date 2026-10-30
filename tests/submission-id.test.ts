// The submission id: kept for retries of the same content, sent to n8n as submissionId by the
// contact (and partner), careers and newsletter routes, and dropped when it is not one the forms
// make. fetch is replaced, so nothing leaves the process. Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createSubmissionKeeper } from "@/lib/submission-id";
import { cleanSubmissionId } from "@/lib/form-input";
import { PARTNER_SERVICES } from "@/lib/partners/forms";
import { POST as lead } from "@/app/api/lead/route";
import { POST as careers } from "@/app/api/careers/route";
import { POST as subscribe } from "@/app/api/subscribe/route";

Object.assign(process.env, {
  N8N_WEBHOOK_URL: "http://n8n.test/lead",
  N8N_CAREERS_WEBHOOK_URL: "http://n8n.test/careers",
  N8N_SUBSCRIBE_WEBHOOK_URL: "http://n8n.test/subscribe",
  N8N_WEBHOOK_SECRET: "test-secret",
});
const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });
function capture() {
  const sent: Record<string, unknown>[] = [];
  globalThis.fetch = (async (_url: string, init: RequestInit) => { sent.push(JSON.parse(String(init.body))); return new Response("{}", { status: 200 }); }) as typeof fetch;
  return sent;
}
let ip = 0;
const post = (body: unknown) =>
  new Request("http://localhost/api", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": `10.6.0.${++ip}` }, body: JSON.stringify(body) });
const quiet = async <T>(run: () => Promise<T>) => {
  const original = { log: console.log, error: console.error };
  console.log = console.error = () => {};
  try { return await run(); } finally { Object.assign(console, original); }
};

const ID = "0123456789abcdef0123456789abcdef";

test("the same content keeps its id for a retry; changed content or a success gets a new one", () => {
  let n = 0;
  const keeper = createSubmissionKeeper(() => `id-${++n}`);
  const form = { name: "Ada", email: "ada@example.com", message: "Hello." };
  const first = keeper.idFor(form);
  assert.equal(keeper.idFor({ ...form }), first, "a retry of the same submission");
  const edited = keeper.idFor({ ...form, message: "Hello again." });
  assert.notEqual(edited, first, "changed content is a new submission");
  keeper.done();
  assert.notEqual(keeper.idFor({ ...form, message: "Hello again." }), edited, "after a success, the next one is new");
});

test("the real ids are 32 lowercase hexadecimal characters, which the server accepts", () => {
  const id = createSubmissionKeeper().idFor({ a: 1 });
  assert.match(id, /^[0-9a-f]{32}$/);
  assert.equal(cleanSubmissionId(id), id);
  for (const bad of [undefined, null, 42, "", "abc", ID.toUpperCase(), `${ID}0`, `${ID.slice(1)}g`, { id: ID }]) {
    assert.equal(cleanSubmissionId(bad), undefined, String(bad));
  }
});

test("contact, both partner forms, careers and newsletter send submissionId to n8n, unchanged", async () => {
  const sent = capture();
  const person = { name: "Ada", email: "ada@example.com", budget: "" };
  await quiet(async () => {
    await lead(post({ ...person, service: "Brand Identity", message: "Hello.", submissionId: ID }) as never);
    await lead(post({ ...person, service: PARTNER_SERVICES.introduction, message: "", who: "Grace", contact: "grace@example.com", permission: true, submissionId: ID }) as never);
    await lead(post({ ...person, service: PARTNER_SERVICES.partnership, message: "We print.", businessName: "Northprint", partnerType: "Printing or signage", website: "northprint.example", submissionId: ID }) as never);
    await careers(post({ name: "Ada", email: "ada@example.com", role: "Photographer", portfolioUrl: "", message: "Hi.", submissionId: ID }) as never);
    await subscribe(post({ email: "ada@example.com", source: "article", submissionId: ID }) as never);
  });
  assert.equal(sent.length, 5);
  for (const payload of sent) assert.equal(payload.submissionId, ID);
});

test("a missing or malformed id is not sent; the submission still goes through", async () => {
  const sent = capture();
  await quiet(async () => {
    await lead(post({ name: "Ada", email: "ada@example.com", service: "Brand Identity", message: "Hello." }) as never);
    await careers(post({ name: "Ada", email: "ada@example.com", role: "Photographer", portfolioUrl: "", message: "Hi.", submissionId: "<script>" }) as never);
    await subscribe(post({ email: "ada@example.com", source: "article", submissionId: 12345 }) as never);
  });
  assert.equal(sent.length, 3);
  for (const payload of sent) assert.ok(!("submissionId" in payload), JSON.stringify(payload).slice(0, 80));
});

test("the three forms send the id with every submission", () => {
  for (const file of ["src/components/contact/ContactClient.tsx", "src/components/careers/CareersClient.tsx", "src/components/insights/ArticleNewsletter.tsx"]) {
    const src = readFileSync(file, "utf8");
    assert.match(src, /submissionId: id \}\)/, file);
    assert.match(src, /submission\.idFor\(/, file);
    assert.match(src, /submission\.done\(\)/, file);
  }
});
