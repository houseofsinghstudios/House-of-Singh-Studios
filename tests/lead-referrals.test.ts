// Introductions, partnerships and "How did you hear about us?" on the contact form: the ?service=
// presets, the field rules and what /api/lead forwards. fetch is replaced, so nothing leaves the
// process. Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { POST as lead } from "@/app/api/lead/route";
import { checkLeadLengths } from "@/lib/lead";
import {
  asksWhoRecommended,
  checkReferralFields,
  contactServiceFromQuery,
  FORM_COPY,
  HEAR_ABOUT,
  PARTNER_SERVICES,
  PARTNER_TYPES,
  REFERRAL_LIMITS,
} from "@/lib/partners/forms";

process.env.N8N_WEBHOOK_URL = "http://n8n.test/lead";
process.env.N8N_WEBHOOK_SECRET = "test-secret";

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

function stubFetch() {
  const bodies: Record<string, unknown>[] = [];
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    bodies.push(JSON.parse(String(init.body)));
    return new Response("{}", { status: 200 });
  }) as typeof fetch;
  return bodies;
}
let ip = 0;
const post = (body: unknown) =>
  lead(new Request("http://localhost/api/lead", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": `10.2.0.${++ip}` }, body: JSON.stringify(body) }));

const person = { name: "Ada", email: "ada@example.com", budget: "" };
const introduction = { ...person, service: PARTNER_SERVICES.introduction, message: "", who: "Grace at Northprint", contact: "grace@example.com", permission: true };
const partnership = { ...person, service: PARTNER_SERVICES.partnership, message: "We print for restaurants.", businessName: "Northprint", partnerType: "Printing or signage", website: "northprint.example" };
const empty = { who: "", contact: "", permission: false, businessName: "", partnerType: "", website: "", hearAbout: "", recommendedBy: "" };

test("?service=introduction and ?service=partnership preselect; nominations still work; others are ignored", () => {
  assert.equal(contactServiceFromQuery("introduction"), "Introducing a client");
  assert.equal(contactServiceFromQuery("partnership"), "Becoming a partner");
  assert.equal(contactServiceFromQuery(["partnership", "introduction"]), "Becoming a partner");
  assert.equal(contactServiceFromQuery("commons"), "Commons nomination (pro bono)");
  for (const bad of [undefined, "", "Introduction", "toString", "__proto__", 1]) assert.equal(contactServiceFromQuery(bad), "", String(bad));
});

test("an introduction needs who, how to reach them and permission; its message is optional", () => {
  assert.equal(checkReferralFields(PARTNER_SERVICES.introduction, { ...empty, who: "Grace", contact: "grace@example.com", permission: true }), null);
  assert.match(checkReferralFields(PARTNER_SERVICES.introduction, { ...empty, contact: "x", permission: true }) ?? "", /^Who/);
  assert.match(checkReferralFields(PARTNER_SERVICES.introduction, { ...empty, who: "x", permission: true }) ?? "", /^How to reach/);
  assert.match(checkReferralFields(PARTNER_SERVICES.introduction, { ...empty, who: "x", contact: "x" }) ?? "", /^Permission/);
  assert.equal(checkLeadLengths({ name: "Ada", email: "a@b.co", service: PARTNER_SERVICES.introduction, budget: "", message: "" }), null);
  assert.match(checkLeadLengths({ name: "Ada", email: "a@b.co", service: "Brand Identity", budget: "", message: "" }) ?? "", /^Message must be 1/);
});

test("a partnership needs a business name and what they do; the website and message are optional", () => {
  assert.equal(checkLeadLengths({ name: "Ada", email: "a@b.co", service: PARTNER_SERVICES.partnership, budget: "", message: "" }), null);
  assert.equal(checkReferralFields(PARTNER_SERVICES.partnership, { ...empty, businessName: "Northprint", partnerType: "Other" }), null);
  assert.match(checkReferralFields(PARTNER_SERVICES.partnership, { ...empty, partnerType: "Other" }) ?? "", /^Business name/);
  assert.match(checkReferralFields(PARTNER_SERVICES.partnership, { ...empty, businessName: "Northprint" }) ?? "", /^What you do/);
});

test("length caps apply to every lead and never quote the value", () => {
  for (const [key, limit] of Object.entries(REFERRAL_LIMITS)) {
    const long = "x".repeat(limit + 1);
    const reason = checkReferralFields("Brand Identity", { ...empty, [key]: long }) ?? "";
    assert.match(reason, new RegExp(`^${key} must be at most ${limit}`), key);
    assert.ok(!reason.includes(long));
    assert.equal(checkReferralFields("Brand Identity", { ...empty, [key]: "x".repeat(limit) }), null, key);
  }
});

test("only a recommendation or a partner reveals Who recommended us?", () => {
  assert.deepEqual(HEAR_ABOUT.filter(asksWhoRecommended), ["Recommended by someone", "A partner or agency"]);
});

test("route: an introduction with permission forwards the structured introduction", async () => {
  const bodies = stubFetch();
  const res = await post({ ...introduction, hearAbout: "A partner or agency", recommendedBy: "Northprint" });
  assert.equal(res.status, 200);
  assert.deepEqual(bodies[0].introduction, { clientName: "Grace at Northprint", clientContact: "grace@example.com", permission: true });
  assert.equal(bodies[0].partnership, undefined);
  assert.equal(bodies[0].hearAbout, "A partner or agency");
  assert.equal(bodies[0].recommendedBy, "Northprint");
});

test("route: an introduction without permission is refused and nothing is sent", async () => {
  const bodies = stubFetch();
  for (const permission of [false, "true", "on", undefined]) {
    const res = await post({ ...introduction, permission });
    assert.equal(res.status, 400, String(permission));
    assert.deepEqual(await res.json(), { success: false, error: "Permission to share their details is required" });
  }
  assert.equal(bodies.length, 0);
});

test("route: a partnership forwards the structured partnership", async () => {
  const bodies = stubFetch();
  const res = await post(partnership);
  assert.equal(res.status, 200);
  assert.deepEqual(bodies[0].partnership, { businessName: "Northprint", partnerType: "Printing or signage", website: "northprint.example" });
  assert.equal(bodies[0].introduction, undefined);
});

test("route: a normal enquiry carries hearAbout and recommendedBy, cleaned", async () => {
  const bodies = stubFetch();
  const res = await post({ ...person, service: "Brand Identity", message: "Hello.", hearAbout: " Recommended by someone ", recommendedBy: "<b>Grace</b>" });
  assert.equal(res.status, 200);
  assert.equal(bodies[0].hearAbout, "Recommended by someone");
  assert.equal(bodies[0].recommendedBy, "Grace");
  assert.equal(bodies[0].introduction, undefined);
  assert.equal(bodies[0].partnership, undefined);
});

test("route: an over long recommendedBy is refused with a short reason", async () => {
  const bodies = stubFetch();
  const res = await post({ ...person, service: "Brand Identity", message: "Hello.", recommendedBy: "r".repeat(161) });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { success: false, error: "recommendedBy must be at most 160 characters" });
  assert.equal(bodies.length, 0);
});

test("form copy: no dashes, options within their caps", () => {
  for (const text of [...Object.values(FORM_COPY), ...HEAR_ABOUT, ...PARTNER_TYPES, ...Object.values(PARTNER_SERVICES)]) {
    assert.doesNotMatch(text, /[-‐‑‒–—―]/, text);
  }
  for (const option of HEAR_ABOUT) assert.ok(option.length <= REFERRAL_LIMITS.hearAbout, option);
  for (const option of PARTNER_TYPES) assert.ok(option.length <= REFERRAL_LIMITS.partnerType, option);
});

test("route: every lead carries attribution with the referral code, cleaned", async () => {
  const bodies = stubFetch();
  await post({ ...person, service: "Brand Identity", message: "Hello.", attribution: { source: "news", referralCode: "NorthPrint" } });
  await post({ ...person, service: "Brand Identity", message: "Hello.", attribution: { referralCode: "north-print", source: "pat@example.com" } });
  await post({ ...person, service: "Brand Identity", message: "Hello." });
  assert.deepEqual(bodies.map((b) => b.attribution), [
    { source: "news", medium: "", campaign: "", referralCode: "northprint" },
    { source: "", medium: "", campaign: "", referralCode: "" },
    { source: "", medium: "", campaign: "", referralCode: "" },
  ]);
});

test("route: a partnership without a message is accepted", async () => {
  const bodies = stubFetch();
  const res = await post({ ...partnership, message: "" });
  assert.equal(res.status, 200);
  assert.equal(bodies[0].message, "");
  assert.equal(bodies[0].partnership && (bodies[0].partnership as { businessName: string }).businessName, "Northprint");
});
