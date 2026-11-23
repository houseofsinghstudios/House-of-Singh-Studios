// The small fixes and hardening from the 20 Nov 2026 audit (PR 1 of the follow up, 22 Nov 2026).
// Run with: npm run test
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { originAllowed } from "@/lib/request-guards";
import { POST as lead } from "@/app/api/lead/route";
import { POST as careers } from "@/app/api/careers/route";
import { sitePath } from "@/lib/form-input";
import { cleanLine } from "@/lib/lead";
import { cleanCampaign } from "@/lib/campaign";
import { cleanLeadSource } from "@/lib/lead-source";
import { clientAddresses, createRateLimiter, platformIp } from "@/lib/rate-limit";
import { deliveryKey } from "@/lib/project-planner/events-server";
import nextConfig from "../next.config";

// Test addresses only: fetch is replaced below, so nothing ever leaves the process.
process.env.N8N_WEBHOOK_URL = "http://n8n.test/lead";
process.env.N8N_CAREERS_WEBHOOK_URL = "http://n8n.test/careers";
process.env.N8N_WEBHOOK_SECRET = "test-secret";
const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });
function stubFetch(answer: () => Response) {
  const bodies: Record<string, unknown>[] = [];
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    bodies.push(JSON.parse(String(init.body)));
    return answer();
  }) as typeof fetch;
  return bodies;
}
let ip = 0;
const post = (path: string, body: unknown) =>
  new Request(`http://localhost${path}`, { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": `10.9.0.${++ip}` }, body: JSON.stringify(body) });
const person = { name: "Ada", email: "ada@example.com", service: "", budget: "", message: "Hello." };

const req = (origin?: string) => new Request("https://studios.houseofsingh.com/api/lead", { method: "POST", headers: origin ? { origin } : {} });

test("origin: only this project's own Vercel addresses, never any vercel.app", () => {
  const own = { url: "house-of-singh-studios-k3x9q2m7p-houseofsinghstudios-projects.vercel.app", branchUrl: "house-of-singh-studios-git-fix-audit-houseofsinghstudios-projects.vercel.app" };
  for (const ok of [
    "https://studios.houseofsingh.com",
    "https://house-of-singh-studios.vercel.app",
    "https://house-of-singh-studios-r60cepoqe-houseofsinghstudios-projects.vercel.app",
    "https://house-of-singh-studios-git-fix-audit-houseofsinghstudios-projects.vercel.app",
  ]) {
    assert.ok(originAllowed(req(ok), "production", own), ok);
  }
  for (const bad of [
    "https://evil.vercel.app",
    "https://house-of-singh-studios-x.vercel.app",
    // Another team whose name ends in our team's name: the old pattern let these through.
    "https://house-of-singh-studios-abc-evil-houseofsinghstudios-projects.vercel.app",
    "https://house-of-singh-studios-r60cepoqe-evil-houseofsinghstudios-projects.vercel.app",
    "https://house-of-singh-studios-git-main-evil-houseofsinghstudios-projects.vercel.app",
    // Another branch of this project is not this deployment's own address.
    "https://house-of-singh-studios-git-other-houseofsinghstudios-projects.vercel.app",
    "http://house-of-singh-studios.vercel.app",
    "https://house-of-singh-studios.vercel.app.evil.example",
    "https://other-project-houseofsinghstudios-projects.vercel.app",
  ]) {
    assert.ok(!originAllowed(req(bad), "production", own), bad);
  }
  assert.ok(originAllowed(req(), "production", {}), "no Origin: judged by the other checks");
});

// ── Finding 15: odd values are a clean 400, never a 500 and never "[object Object]" ──

test("lead: values that are not strings are refused with a 400", async () => {
  const bodies = stubFetch(() => new Response("{}", { status: 200 }));
  for (const odd of [{ name: {} }, { name: ["Ada"] }, { name: 42 }, { email: { a: 1 } }, { email: 7 }, { email: ["ada@example.com"] }]) {
    const res = await lead(post("/api/lead", { ...person, ...odd }));
    assert.equal(res.status, 400, JSON.stringify(odd));
  }
  assert.equal(bodies.length, 0);
});

test("careers: values that are not strings are refused with a 400", async () => {
  const bodies = stubFetch(() => new Response("{}", { status: 200 }));
  const application = { name: "Ada", email: "ada@example.com", role: "Photographer", portfolioUrl: "", message: "Hello." };
  for (const odd of [{ name: {} }, { role: ["Photographer"] }, { email: 9 }]) {
    const res = await careers(post("/api/careers", { ...application, ...odd }) as never);
    assert.equal(res.status, 400, JSON.stringify(odd));
  }
  assert.equal(bodies.length, 0);
});

// ── The lead workflow's answer (docs/integrations/n8n.md, 21 Nov 2026) ──

test("lead: an empty 200 from n8n is a success", async () => {
  const bodies = stubFetch(() => new Response(null, { status: 200 }));
  const res = await lead(post("/api/lead", person));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { success: true });
  assert.equal(bodies.length, 1);
});

test("lead: a non 2xx answer from n8n is still a failure", async () => {
  stubFetch(() => new Response(null, { status: 500 }));
  const res = await lead(post("/api/lead", person));
  assert.notEqual(res.status, 200);
});

// ── Finding 16: one line fields, site paths and tags ──

test("lead: one line fields lose their line breaks, the message keeps them", async () => {
  const bodies = stubFetch(() => new Response(null, { status: 200 }));
  await lead(post("/api/lead", { ...person, name: "Ada\r\nLovelace", message: "One.\nTwo." }));
  assert.equal(bodies[0].name, "Ada Lovelace");
  assert.equal(bodies[0].message, "One.\nTwo.");
  assert.equal(cleanLine("  a\n\t b  ", 20), "a b");
});

test("sitePath: a path on this site only, without its query or fragment", () => {
  assert.equal(sitePath("/work?for=events#top", 200), "/work");
  assert.equal(sitePath("/", 200), "/");
  for (const bad of ["//evil.example/x", "/\\evil.example", "https://evil.example/", "work", "", 42, null, {}]) {
    assert.equal(sitePath(bad, 200), "", String(bad));
  }
  assert.equal(sitePath("/a<script>b", 200), "/ab");
  assert.equal(sitePath("/" + "a".repeat(500), 200).length, 200);
});

test("lead source and campaign tags: tags removed, spaces collapsed, other sites refused", () => {
  assert.equal(cleanLeadSource({ landing_page: "//evil.example/x" }), null);
  assert.equal(cleanLeadSource({ landing_page: "/\\evil.example" }), null);
  assert.deepEqual(cleanLeadSource({ landing_page: "/start", utm_source: "<b>news</b>\n letter" }), { landing_page: "/start", utm_source: "news letter" });
  assert.equal(cleanCampaign({ source: "<i>spring</i>  sale", medium: "a@b.c" }).source, "spring sale");
});

// ── Finding 14: the platform's own address is counted too ──

test("rate limit: a forged x-forwarded-for cannot reset the count", () => {
  const limited = createRateLimiter(2);
  const forged = (n: number) => new Request("http://localhost/", { headers: { "x-forwarded-for": `1.1.1.${n}`, "x-vercel-forwarded-for": "9.9.9.9" } });
  assert.deepEqual(clientAddresses(forged(1)), ["1.1.1.1", "9.9.9.9"]);
  assert.equal(limited(clientAddresses(forged(1))), false);
  assert.equal(limited(clientAddresses(forged(2))), false);
  assert.equal(limited(clientAddresses(forged(3))), true, "the third from the same real address is over");
  // Off Vercel, or when both agree, there is one address, as before.
  assert.deepEqual(clientAddresses(new Request("http://localhost/", { headers: { "x-forwarded-for": "2.2.2.2" } })), ["2.2.2.2"]);
  assert.deepEqual(clientAddresses(new Request("http://localhost/", { headers: { "x-forwarded-for": "2.2.2.2", "x-real-ip": "2.2.2.2" } })), ["2.2.2.2"]);
  assert.equal(platformIp(new Request("http://localhost/", { headers: { "x-real-ip": "3.3.3.3" } })), "3.3.3.3");
  assert.equal(platformIp(new Request("http://localhost/")), null);
  // A single string still works, for any caller that passes one.
  const one = createRateLimiter(1);
  assert.equal(one("4.4.4.4"), false);
  assert.equal(one("4.4.4.4"), true);
});

test("brand pulse: the route uses the shared address helper, not its own header read", () => {
  const src = readFileSync("src/app/api/brand-pulse/route.ts", "utf8");
  assert.match(src, /isRateLimited\(clientAddresses\(request\)\)/);
  assert.doesNotMatch(src, /x-forwarded-for/);
});

// ── Finding 17: the planner's duplicate guard includes the sender ──

test("planner: the same brief and event from another address is not a duplicate", () => {
  assert.notEqual(deliveryKey("b1", "viewed", "1.1.1.1"), deliveryKey("b1", "viewed", "2.2.2.2"));
  assert.equal(deliveryKey("b1", "viewed", "1.1.1.1"), deliveryKey("b1", "viewed", "1.1.1.1"));
  const route = readFileSync("src/app/api/project-planner/route.ts", "utf8");
  assert.match(route, /deliveryKey\(parsed\.briefId, parsed\.event, platformIp\(request\) \?\? clientIp\(request\)\)/);
});

// ── Findings 18 to 21: headers ──

async function headersFor(source: string) {
  const rules = (await nextConfig.headers!()) ?? [];
  return Object.fromEntries(rules.filter((r) => r.source === source).flatMap((r) => r.headers.map((h) => [h.key, h.value])));
}

test("headers: HSTS without preload, a tighter CSP and a fuller Permissions-Policy", async () => {
  const site = await headersFor("/(.*)");
  assert.equal(site["Strict-Transport-Security"], "max-age=63072000; includeSubDomains");
  assert.match(site["Content-Security-Policy"], /frame-src 'none'/);
  assert.match(site["Content-Security-Policy"], /upgrade-insecure-requests/);
  for (const feature of ["camera", "microphone", "geolocation", "payment", "usb", "serial", "hid", "display-capture", "browsing-topics"]) {
    assert.match(site["Permissions-Policy"], new RegExp(`(^|, )${feature}=\\(\\)`), feature);
  }
  assert.doesNotMatch(site["Permissions-Policy"], /interest-cohort|bluetooth/, "Chrome logs an error for these");
});

test("headers: the Studio keeps its own frames, posts only to itself and is never indexed", async () => {
  const studio = await headersFor("/studio/:path*");
  assert.match(studio["Content-Security-Policy"], /form-action 'self'/);
  assert.match(studio["Content-Security-Policy"], /frame-src 'self'/);
  assert.equal(studio["X-Robots-Tag"], "noindex, nofollow");
});

// ── Finding 23: article images ──

test("article images: alt from Studio, then the caption, else empty, never a generic word", () => {
  const src = readFileSync("src/components/insights/ArticleBody.tsx", "utf8");
  assert.doesNotMatch(src, /"Article image"/);
  assert.match(src, /alt=\{value\.alt\?\.trim\(\) \|\| value\.caption\?\.trim\(\) \|\| ""\}/);
});

// ── Labels in sentence case (22 Nov 2026) ──

const OLD_LABELS = [
  "Send My Brief", "See My Brief", "Build My Project Brief", "Edit Brief", "Start Again", "Try Again", "Learn More",
  "Start the Check", "Discuss My Results", "Send My Result", "Add Details", "Show My Result", "Start a Conversation",
  "Take the Check Yourself", "Suggest a Brand", "Nominate an Organization", "Introduce a Client", "Become a Partner",
  "Copy Text", "Copy Link", "Submit Application", "Send Message", "View Our Work", "All Insights",
  "All Projects", "View Careers", "Go to the Homepage", "Contact the Studio", "Privacy Policy\"", "Coming Soon",
];
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : /\.(tsx?|css)$/.test(name) ? [path] : [];
  });
}

test("labels: buttons and links read in sentence case, the old Title Case labels are gone", () => {
  for (const file of sourceFiles("src")) {
    const src = readFileSync(file, "utf8");
    for (const label of OLD_LABELS) assert.ok(!src.includes(label), `${file}: "${label}"`);
  }
});

// Since the site audit (S-15, 23 Nov 2026) the rule, not just the list: every editorial label in
// parentheses ("(02) The challenge", "(Next step)") and every EditorialLabel text, anywhere in src, is
// in sentence case. A capital after the first word is allowed only for a name. Comments are skipped;
// labels written all in capitals (the share images) are their own style.
const NAMES = [
  "House of Singh Studios", "House of Singh", "Registered Graphic Designers of Canada", "Registered Graphic Designers",
  "Brand Pulse", "Brand Pulse Check", "AI Lab", "Studio Guide", "Speed Insights", "Open Graph", "Project Planner",
  "Toronto", "Canada", "GTA", "RGD", "CAD", "Parallel", "Commons", "Twitter", "Instagram", "LinkedIn", "Pinterest", "TEDxToronto",
];
const withoutComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1").replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
function titleCaseWords(label: string): string[] {
  let rest = label.replace(/^\(?(\d{2}\)\s*)?/, "").replace(/\)$/, "");
  for (const name of NAMES) rest = rest.split(name).join("name");
  return rest.split(/\s+/).slice(1).filter((w) => /^[A-Z]/.test(w) && w !== "I");
}
// A label stands alone: its parenthesis opens a string or a text node. One with words before it is
// part of a sentence or a headline, such as an Insights article title, and never a label (article
// titles use Title Case as the editorial headline style; see CLAUDE.md).
const LABEL_START = String.raw`(?<=(?:^|["'\`>}])\s*)`;
function labelsIn(src: string): string[] {
  return [
    ...[...src.matchAll(new RegExp(LABEL_START + String.raw`\((?:\d{2}\) ?)?[A-Z][A-Za-z]*(?: [A-Za-z][A-Za-z.]*)+\)`, "gm"))].map((m) => m[0]),
    ...[...src.matchAll(new RegExp(LABEL_START + String.raw`\(\d{2}\) ([A-Z][^<"\`{}\n]*)`, "gm"))].map((m) => `(00) ${m[1].trim()}`),
    ...[...src.matchAll(/<EditorialLabel[^>]*\btext="([^"]+)"/g)].map((m) => m[1]),
  ];
}

test("labels: an article title is never read as a label; a label is", () => {
  const title = `<h3 className="ins-card-title">What a Brand Identity System Actually Includes (And Why a Logo Is Not Enough)</h3>`;
  assert.deepEqual(labelsIn(title), []);
  assert.deepEqual(labelsIn(`title: "Branding Toolkit (The Complete Guide)",`), []);
  assert.deepEqual(labelsIn(`<p className="cta-label">(Next Step)</p>`), ["(Next Step)"]);
  assert.deepEqual(labelsIn(`label: "(The Result)",`), ["(The Result)"]);
  assert.deepEqual(labelsIn(`<p>\n  (02) The Challenge\n</p>`), ["(00) The Challenge"]);
});

test("labels: every editorial label in src is in sentence case, names excepted", () => {
  const found: string[] = [];
  for (const file of sourceFiles("src").filter((f) => /\.tsx?$/.test(f))) {
    const src = withoutComments(readFileSync(file, "utf8"));
    const labels = labelsIn(src);
    for (const label of labels) {
      if (label === label.toUpperCase()) continue;
      const caps = titleCaseWords(label);
      if (caps.length) found.push(`${file}: ${label}`);
    }
  }
  assert.deepEqual(found, []);
});

test("labels: missing page titles and the error buttons in sentence case", () => {
  for (const file of sourceFiles("src")) assert.doesNotMatch(readFileSync(file, "utf8"), /[A-Za-z] Not Found"/, file);
  assert.match(readFileSync("src/app/(site)/work/[slug]/page.tsx", "utf8"), /\{ title: "Project not found" \}/);
  for (const f of ["src/app/(site)/error.tsx", "src/app/global-error.tsx"]) {
    const src = readFileSync(f, "utf8");
    assert.match(src, /Go to the homepage/, f);
    assert.match(src, /Contact the studio/, f);
  }
  assert.match(readFileSync("src/components/services/ServiceDetail.tsx", "utf8"), /\n\s*Plan your project\n/, "the service CTA is the main action name");
});

test("labels: the /services Learn more links keep their hidden service names", () => {
  const src = readFileSync("src/components/services/ServiceBlocks.tsx", "utf8");
  assert.match(src, /Learn more/);
  assert.match(src, /sr-only/);
});
