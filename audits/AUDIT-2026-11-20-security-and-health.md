# Security and code health audit, 20 November 2026

**Date:** 2026-11-20
**Branch:** main
**Commit:** c984832 (after PR 257)
**Auditor:** Claude Code
**For:** Maninder

**Scope:** The whole repository at commit c984832 on main, after PR 257. This is a report only. Nothing was changed.

**How it was done:** The checks below were run and the results recorded.

1. Typecheck, lint, tests and a full build.
2. `npm audit` and `npm outdated`.
3. knip, to find unused files and exports.
4. A secrets scan of every tracked file and of the full git history.
5. Reading the API routes, the security headers, the consent code, the Sanity code and the client code.

---

## 1. Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 8 |
| Low | 17 |
| Code health items | 6 |

**Top three priorities**

1. Give the old n8n lead webhook a new path, because the old one is visible in the public git history, and confirm Header Auth is on for all five webhooks (finding 1).
2. Require `application/json` on the four form routes that do not check it yet (finding 2).
3. Add the `Cross-Origin-Opener-Policy` header and Content Security Policy violation reporting (findings 4 and 3).

**What passed:** typecheck, lint, 488 tests, the build, the working tree secrets scan, the secrets handling in client code, the Sanity client setup, consent gating of GA4 and Clarity, the API route protections and the core security headers. Details are in section 2.

---

## 2. What passed

1. `npx tsc --noEmit`: 0 errors.
2. `npm run lint`: 0 errors, 0 warnings.
3. `npm run test`: 488 pass, 0 fail.
4. `npm run build`: exit 0, 39 of 39 pages generated. Sanity is unreachable on a local build, so fallbacks were used, as on every local build.
5. Next.js is installed and pinned at 16.4.6 (`package.json` line 26, with `eslint-config-next` 16.4.6). `npm audit` lists no Next.js advisory.
6. Secrets scan of the working tree: every tracked file, 11 patterns (AWS, private key, GitHub, Slack, Stripe, Sanity token, Google key, JWT, n8n webhook URL, generic secret assignment, Resend). 0 hits.
7. `.env.example` and `.env.import.example` match every variable the code reads. `VERCEL_ENV` and `NEXT_PHASE` come from the platform.
8. No `NEXT_PUBLIC_` variable holds a secret. No client component reads or imports a secret. `src/lib/n8n.ts` and `src/lib/sanity/image.ts` import `server-only`.
9. Sanity client (`src/lib/sanity/client.ts:11-19`): `useCdn` true, perspective `published`, no token. Queries exclude drafts and versions. No `previewDrafts`.
10. `SANITY_WRITE_TOKEN` is read only by local import scripts (`scripts/import-portfolio/lib/config.mjs:121`, `scripts/import-services/index.mjs:60`, `scripts/import-roles/index.mjs:23`) from `.env.import`, which git ignores (`.gitignore:38`).
11. GA4 (`src/components/GoogleAnalytics.tsx:35-40, 80-89`) and Clarity (`src/components/MicrosoftClarity.tsx:138-155`) load only after a granted state, and only on the production hostname (`(site)/layout.tsx:20`).
12. API routes:
    1. A 64 KB body cap applies before parsing (`src/lib/request-body.ts:8-32`).
    2. JSON failures answer 400.
    3. Only named fields are read, so prototype pollution is not possible.
    4. Honeypots sit on all five form routes.
    5. The shared rate limiter allows 5 a minute for lead, careers and subscribe, and 20 for brand-pulse and planner.
    6. n8n calls time out after 10 seconds.
    7. n8n fails closed without the webhook URL or `N8N_WEBHOOK_SECRET` (`src/lib/n8n.ts:18-24`).
    8. Client errors are generic, and logs carry error names only.
    9. There are no CORS headers, no SSRF and no open redirect.
13. `/api/revalidate` fails closed without `SANITY_REVALIDATE_SECRET` (`route.ts:19-23`), answers 401 to a missing or wrong signature, and exports only POST.
14. `/api/consent-region` reads only Vercel geo headers. Unknown counts as strict. The cache is private.
15. Headers set in `next.config.ts:84-102`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a Permissions-Policy, HSTS with a two year max age, and the CSP `SITE_CSP` (lines 9-21). The CSP has no `unsafe-eval`, and sets `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'` and `form-action 'self'`. `/studio` gets its own `STUDIO_CSP` (lines 28-39), with `unsafe-eval` for Sanity Studio only.

---

## 3. Findings

Confidence labels: **High confidence** means verified in code. **Medium confidence** means it depends on n8n or Vercel settings we cannot see from the repository.

### 3.1 Medium

#### Finding 1. Webhook URL in public git history

- **Severity:** Medium
- **Confidence:** Medium confidence. Whether the old path is still live, and whether Header Auth is on, are n8n settings we cannot see.
- **Where:** Commits 102066c, d1641eb and f815b8a (`src/app/contact/page.tsx`, a client page at the time) and commit 92635b7 (`src/app/api/lead/route.ts`), all made on 1 Mar 2026. It is not in the current tree. The mitigation is documented at `docs/integrations/n8n.md:14-18`.
- **What is wrong:** The repository is public on GitHub. A hard coded n8n webhook URL was committed in those four commits. Every webhook now checks the `x-hos-webhook-secret` header with n8n Header Auth, but the old path is still readable by anyone.
- **Why it matters:** If that old path is still live and Header Auth were ever switched off, anyone could send spam straight to the lead workflow and skip the site's honeypot and rate limit.
- **Smallest fix:** Give the lead webhook a new path in n8n. Update `N8N_LEAD_WEBHOOK_URL` on Vercel. Confirm Header Auth is on for all five webhooks. Rewriting git history is not needed.

#### Finding 2. Four form routes accept any content type

- **Severity:** Medium
- **Confidence:** High confidence.
- **Where:** The careers, subscribe, brand-pulse and project-planner routes. Only `src/app/api/lead/route.ts:51` requires `application/json`.
- **What is wrong:** The other four routes accept any content type.
- **Why it matters:** Another website can make its visitors' browsers send plain text POSTs with no preflight check, and each visitor arrives with a fresh IP address that gets past the per IP limit, for example to sign up many third party emails through subscribe.
- **Smallest fix:** Copy the content type check from lead into the four routes, and answer 415 otherwise. Optionally refuse an Origin that is not the site's. Form protections are Protected, owner decision. This change adds a protection and removes nothing.

#### Finding 3. CSP allows inline scripts

- **Severity:** Medium
- **Confidence:** High confidence.
- **Where:** `next.config.ts:11`.
- **What is wrong:** `script-src` allows `'unsafe-inline'` with no nonce or hash. The code comment explains the trade: nonces force every page to render on request, which would lose static ISR.
- **Why it matters:** If any injected HTML ever slipped through, an injected inline script would be allowed to run.
- **Smallest fix:** Add CSP violation reporting so problems become visible. Send the header `Reporting-Endpoints: csp="https://studios.houseofsingh.com/api/csp-report"` and add `report-to csp` to the policy. Move to nonces with `'strict-dynamic'` only if rendering on every request is acceptable.

#### Finding 4. `Cross-Origin-Opener-Policy` missing

- **Severity:** Medium
- **Confidence:** High confidence.
- **Where:** `next.config.ts:84-102`.
- **What is wrong:** The header is not set.
- **Why it matters:** Windows the site opens, such as the Cal.com booking window, keep a link back to the page that opened them.
- **Smallest fix:** `Cross-Origin-Opener-Policy: same-origin`

#### Finding 5. Speed Insights loads before consent

- **Severity:** Medium
- **Confidence:** High confidence.
- **Where:** `(site)/layout.tsx:41`, outside the `analyticsEnabled` gate.
- **What is wrong:** Vercel Speed Insights loads before consent, including in strict regions. It is cookieless, but it sends performance data before a choice is made.
- **Why it matters:** Visitors in strict regions have not agreed to any data collection yet.
- **Smallest fix:** Render it inside the consent gate, or state in the privacy notice that it is cookieless and runs without consent. Consent gated analytics is a protected area. Protected, owner decision.

#### Finding 6. Article images have no sizes

- **Severity:** Medium
- **Confidence:** High confidence.
- **Where:** `src/components/insights/ArticleBody.tsx:72-77`.
- **What is wrong:** Article body images use `fill` with no `sizes`.
- **Why it matters:** The browser assumes the image is full screen width and downloads files far larger than the 740px column, which slows article pages on phones.
- **Smallest fix:** `sizes="(max-width: 820px) 100vw, 740px"`

#### Finding 7. Large client components

- **Severity:** Medium
- **Confidence:** High confidence.
- **Where:** `src/components/about/AboutClient.tsx` (472 lines, one `useState` at line 80), `src/components/careers/CareersClient.tsx` (869 lines, ships `@portabletext/react` to the browser), `ContactClient.tsx` (311 lines) and `InsightsClient.tsx` (213 lines).
- **What is wrong:** Whole pages are client components when only small parts need to be.
- **Why it matters:** Visitors download and run more code before the page responds to them.
- **Smallest fix:** Render static content on the server and keep only the interactive parts as client islands.

#### Finding 8. Studio prices remain in Insights articles

- **Status:** Done 20 Nov 2026 in Sanity (all 29 articles rescanned clean).
- **Severity:** Medium
- **Confidence:** High confidence. This is Sanity content, not code, found by a read only check of published posts.
- **Where:** Sanity Insights articles. Nine articles say "projects start from $1,000": why-your-brand-looks-different-everywhere, 5-signs-your-brand-is-actively-costing-you-business, what-a-brand-identity-system-actually-includes, how-much-does-brand-identity-design-cost-in-canada-a-studio-s-honest-breakdown, branding-agency-pricing-toronto, design-studio-vs-agency-vs-freelancer-vs-canva, how-much-does-a-logo-cost-in-canada, logo-vs-brand-kit-vs-brand-identity and how-much-does-a-website-cost-in-canada. Also: packaging-design-cost-canada ("packaging projects start from $2,000"), what-is-brand-strategy-and-what-does-it-cost ("strategy projects start from $2,000") and full-cost-of-rebranding-in-canada ("a focused project can start from about $1,000"). Most posts also promise "a personal estimate" or "an estimate" from the Project Planner.
- **What is wrong:** These sentences show studio prices and promise an estimate the planner no longer gives.
- **Why it matters:** They contradict the pricing decision of 20 Nov 2026 (CLAUDE.md, PRICING) and promise visitors something the site no longer does.
- **Smallest fix:** Edit those sentences in Studio.

### 3.2 Low

#### Finding 9. Dependency advisories

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `npm audit`. Production: 13 moderate, 0 high, 0 critical. All: 19 moderate.
- **What is wrong:** Two root advisories: minimatch GHSA-g3hv-75wg-m249 (denial of service through glob patterns) and uuid GHSA-w5hq-g745-h8pq (missing buffer bounds check). Both come through `sanity` 5.31.2 and its CLI chain (`@sanity/cli`, `@oclif/*`, `typeid-js`). The fix is `sanity` 6.24.0, a major upgrade. The other 6 (dev only) are in `typescript-eslint` and can be fixed without a major upgrade.
- **Why it matters:** These sit in build and Studio tooling, not in code a visitor can reach with input, so the real risk is low.
- **Smallest fix:** Run `npm audit fix` for `typescript-eslint` now. Plan the Sanity 6 upgrade as its own task.

#### Finding 10. Outdated packages

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `package.json`.
- **What is wrong:** Major versions are available for `sanity` and `@sanity/vision` (6.24.0), `@sanity/client` (8.17.0), `@portabletext/react` (8.0.1), `eslint` (10.15.0), `typescript` (7.0.2) and `@types/node` (26). Minor or patch versions are available for `next-sanity` (13.5.1), `tailwindcss` and `@tailwindcss/postcss` (4.3.5), `@vercel/speed-insights` (2.1.0) and `@sanity/image-url` (2.2.0).
- **Why it matters:** Old versions miss bug and security fixes over time.
- **Smallest fix:** Take the minor updates in one small PR. Take the majors one at a time.

#### Finding 11. Unmaintained page transition package

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `next-view-transitions` 0.3.5, last published 5 Dec 2025, still version 0.x.
- **What is wrong:** Page transitions depend on a package that is not updated often. Next.js is moving View Transitions into the framework. `server-only` 0.0.1 (last published 2022) is intentionally static and is fine.
- **Why it matters:** If the package breaks with a future Next.js release, page transitions stop working.
- **Smallest fix:** Watch it. Plan a move to the built in support when that is stable.

#### Finding 12. `.env.local` was once tracked

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** Tracked from 16 Mar 2026 (3b18460) until 27 Oct 2026 (ca6e7b5, "Stop tracking .env.local").
- **What is wrong:** The file was in git history. It held only `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`, which are public values.
- **Why it matters:** No secret was exposed.
- **Smallest fix:** No action needed beyond keeping `.env.local` ignored.

#### Finding 13. Revalidate signature check is basic

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `/api/revalidate`, using `@sanity/webhook` and `next-sanity` `parseBody`.
- **What is wrong:** The signature check compares with `!==`, which is not constant time. It never checks how old the timestamp is, so a captured delivery can be replayed. It also reads the whole body before verifying, with no cap beyond the platform's.
- **Why it matters:** The worst result is an extra site refresh.
- **Smallest fix:** Read with `readBodyText(req, 64 * 1024)`, verify with `crypto.timingSafeEqual`, and refuse timestamps older than 5 minutes.

#### Finding 14. Rate limiter trusts the first forwarded address

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `src/lib/rate-limit.ts:28-30`, repeated in `src/app/api/brand-pulse/route.ts:128-129`.
- **What is wrong:** The limiter keys on the first `x-forwarded-for` value. That is fine on Vercel, which sets the header. Elsewhere it can be spoofed, and a missing header puts everyone in one bucket.
- **Why it matters:** A caller could dodge the limit by faking the header if the site ever ran outside Vercel.
- **Smallest fix:** Prefer `x-vercel-forwarded-for` or `x-real-ip`, and make brand-pulse call `clientIp`. The rate limiter is Protected, owner decision. Strengthen it only.

#### Finding 15. Odd form values cause a 500

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `src/lib/lead.ts:21-24`.
- **What is wrong:** Text fields in lead and careers are converted with `String(value)`. An object becomes "[object Object]", and a crafted `toString` throws, which gives a 500 instead of a 400.
- **Why it matters:** A bad request gets a confusing server error instead of a clean refusal.
- **Smallest fix:** Treat any value that is not a string as empty, as brand-pulse and planner already do.

#### Finding 16. Cleaned text is not escaped

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `src/lib/form-input.ts:20` (`stripTags`), `src/lib/campaign.ts:26-30`, `src/lib/lead-source.ts:25-29`, the brand-pulse `landingPage` field (`route.ts:118`) and the lead source path check at `lead-source.ts:33`.
- **What is wrong:** `stripTags` removes tags but does not escape. Some fields are not stripped at all. Campaign tags and lead source tags are unstripped, brand-pulse `landingPage` accepts any string, and the lead source path accepts `//host`. Lead and careers names keep line breaks.
- **Why it matters:** If a later step puts these values into an HTML email or a link without escaping, a crafted value could cause trouble there.
- **Smallest fix:** Make sure n8n escapes values in HTML emails and Airtable links. Collapse whitespace in `cleanField`. Require landing pages to start with a single `/`. Lead source capture is Protected, owner decision. Strengthen it only.

#### Finding 17. Planner duplicate guard trusts the browser

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `src/app/api/project-planner/route.ts:19, 43-47`.
- **What is wrong:** The duplicate guard is keyed on the `briefId` the browser supplies. Someone who knows a visitor's `briefId` (it travels in booking notes) could send that event first on the same instance.
- **Why it matters:** A visitor's brief event could be blocked or pre empted, though the effect is small.
- **Smallest fix:** Accept the risk, or rely on n8n's own idempotency key only.

#### Finding 18. HSTS preload does nothing here

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `next.config.ts:100`.
- **What is wrong:** The preload list accepts only the parent domain, so `preload` on a subdomain has no effect.
- **Why it matters:** The setting suggests a protection that is not actually in place.
- **Smallest fix:** Set HSTS with `preload` on `houseofsingh.com`, or drop `preload` here.

#### Finding 19. CSP could be tighter

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `next.config.ts:9-21`.
- **What is wrong:** `frame-src 'self'` is set while nothing is framed, and there is no `upgrade-insecure-requests`.
- **Why it matters:** Each unneeded permission is a door that could be used later.
- **Smallest fix:** `frame-src 'none'; upgrade-insecure-requests`

#### Finding 20. `Permissions-Policy` is short

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `next.config.ts:96`.
- **What is wrong:** It covers only camera, microphone and geolocation.
- **Why it matters:** Other browser features stay open that the site never uses.
- **Smallest fix:** `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()`

#### Finding 21. Studio hardening gaps

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `STUDIO_CSP` in `next.config.ts`, and `src/app/robots.ts:12-13`.
- **What is wrong:** `STUDIO_CSP` has no `form-action`. There is no `X-Robots-Tag`, and `robots.txt` disallows `/studio`, so crawlers never see its noindex meta tag.
- **Why it matters:** The editing area could show up in search results as a bare link.
- **Smallest fix:** Add `form-action 'self'` to `STUDIO_CSP`. Add the header `X-Robots-Tag: noindex, nofollow` for `/studio/:path*`.

#### Finding 22. Consent defaults to granted outside strict regions

- **Severity:** Low
- **Confidence:** Medium confidence. It depends on how the regional rules are meant to work, which is a policy choice.
- **Where:** `src/lib/consent.ts:34-37`.
- **What is wrong:** Outside strict regions, GA4 and Clarity load on the first page view without a prompt. This is deliberate. But the protected item in CLAUDE.md says "nothing loads before consent", which does not match.
- **Why it matters:** The written rule and the real behaviour disagree, which causes confusion in later work.
- **Smallest fix:** Reword the CLAUDE.md line to describe the regional default, or change the default. Consent gated analytics is protected. Protected, owner decision.

#### Finding 23. Weak alt text on article images

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `ArticleBody.tsx:74`.
- **What is wrong:** Alt text falls back to "Article image".
- **Why it matters:** A screen reader user hears nothing useful about the picture.
- **Smallest fix:** `alt={value.alt ?? ""}`, or make alt required in the schema.

#### Finding 24. Deprecated `priority` prop

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `CaseStudyTemplate.tsx:119`, `InsightArticle.tsx:129`, `InsightsClient.tsx:163`, `ServiceProjectCard.tsx:59` and `InitiativeLogo.tsx:24`.
- **What is wrong:** `next/image` `priority` is deprecated in Next 16 in favour of `preload`.
- **Why it matters:** It may stop working in a later release.
- **Smallest fix:** Rename it to `preload` when convenient.

#### Finding 25. Client components that could be server components

- **Severity:** Low
- **Confidence:** High confidence.
- **Where:** `src/components/homepage/CtaSection.tsx` and `src/components/casestudy/NextProject.tsx`.
- **What is wrong:** Neither uses hooks or handlers, yet both are client components.
- **Why it matters:** They send extra JavaScript to the browser for no reason.
- **Smallest fix:** Remove `"use client"`.

### 3.3 Code health

#### Finding 26. Unused files

- **Severity:** Code health
- **Confidence:** High confidence. knip reports them.
- **Where:** `archive/brand-diagnostic/diag-styles.css`, `DiagnosticTrigger.tsx` and `SliderDiagnostic.tsx`.
- **What is wrong:** Nothing imports these files.
- **Why it matters:** Dead files make the codebase harder to read.
- **Smallest fix:** Delete the archive folder if nothing there is wanted.

#### Finding 27. Unused exports

- **Severity:** Code health
- **Confidence:** High confidence.
- **Where:** 50 exports and 23 types that nothing imports. Notable groups: `ToolBand.tsx` (`TOOL_BAND`, `pulseChipHref`, `plannerChipHref`, `PULSE_BUTTON_HREF`, `PLANNER_BUTTON_HREF`, `PulseColumn`, `PlannerColumn`), the id lists in `brand-pulse/types.ts`, the lists in `initiatives/types.ts`, project-planner (`stepCount`, `PLANNER_EVENTS`, `STATUS_RANK`, `DELIVERED_IDS`), `analytics.ts` (`INTERNAL_PARAM`, `DEBUG_PARAM`, `syncFlag`, `CONFIG_ONLY`, `eventParams`) and some script helpers.
- **What is wrong:** They are used only inside their own file.
- **Why it matters:** It is harmless, but it adds noise.
- **Smallest fix:** Drop the `export` keyword when touching a file. The analytics helper (`src/lib/analytics.ts`) is Protected, owner decision. Leave it as it is.

#### Finding 28. Unused CSS class

- **Severity:** Code health
- **Confidence:** High confidence.
- **Where:** `.contact-helper` in `src/components/contact/contact.css:19`.
- **What is wrong:** It was left behind when the contact budget help line was removed.
- **Why it matters:** Dead rules clutter the stylesheet.
- **Smallest fix:** Delete the rule.

#### Finding 29. Duplicate definitions

- **Severity:** Code health
- **Confidence:** High confidence.
- **Where:** An `Attribution` interface in both `src/components/brand-pulse/events.ts:10` and `src/components/project-planner/events.ts:10`. Client IP logic in `rate-limit.ts` and again in the brand-pulse route. Small `clean()` helpers in several modules.
- **What is wrong:** The same code lives in more than one place.
- **Why it matters:** A fix made in one copy can be missed in the other.
- **Smallest fix:** Share one copy of each when next touched.

#### Finding 30. Price removal leftovers

- **Severity:** Code health
- **Confidence:** High confidence.
- **Where and what:**
  1. Sanity Service Pricing: `sanity/schemas/servicePricing.ts`, its registration in `sanity/schemas/index.ts:9` and `:30`, and the singleton desk entry in `sanity/structure.ts:3-28`. Nothing on the site reads it.
  2. n8n payload price fields sent empty: `priceSource` null (`src/lib/project-planner/events-server.ts:140`), `brief.priceLines` empty (line 125) and `brief.fitNote` null (line 126). The n8n contract is Protected, owner decision.
  3. `src/data/packages.ts`: the planner reads only title and timeline (`src/lib/project-planner/config.ts:8`). The fields `number`, `description`, `includes`, `bestFor`, `cta` and `recommended` are unused since the Packages page was retired.
  4. Kept on purpose, not leftovers: the optional investment range question in the planner and the contact budget question, which are the visitor's own range.
- **Why it matters:** Old price code could confuse later work after the 20 Nov 2026 pricing decision.
- **Smallest fix:** For item 1, delete the document in Studio first, then the schema and the desk entry. For item 2, change it only together with the n8n workflow change. For item 3, shrink the file to the timelines, or move them into the planner config.

#### Finding 31. Dead Sanity queries check

- **Severity:** Code health
- **Confidence:** High confidence.
- **Where:** `src/lib/sanity` and `queries.ts`.
- **What is wrong:** Every exported query function is used. Only three exported types in `queries.ts` are unused: `ArticleImage`, `ArticleLink` and `ArticleBodyBlock`. Every route builds.
- **Why it matters:** This is mostly a clean result. The three types are small clutter.
- **Smallest fix:** Drop the `export` keyword on those three types when touching the file.

---

## 4. Summary table

| # | Finding | Severity | Confidence |
|---|---------|----------|------------|
| 1 | Webhook URL in public git history | Medium | Medium |
| 2 | Four form routes accept any content type | Medium | High |
| 3 | CSP allows inline scripts | Medium | High |
| 4 | Cross-Origin-Opener-Policy missing | Medium | High |
| 5 | Speed Insights loads before consent (Protected, owner decision) | Medium | High |
| 6 | Article images have no sizes | Medium | High |
| 7 | Large client components | Medium | High |
| 8 | Studio prices in Insights articles (Done 20 Nov 2026 in Sanity, all 29 articles rescanned clean) | Medium | High |
| 9 | Dependency advisories | Low | High |
| 10 | Outdated packages | Low | High |
| 11 | Unmaintained page transition package | Low | High |
| 12 | `.env.local` once tracked | Low | High |
| 13 | Revalidate signature check is basic | Low | High |
| 14 | Rate limiter trusts first forwarded address (Protected, owner decision) | Low | High |
| 15 | Odd form values cause a 500 | Low | High |
| 16 | Cleaned text not escaped (Protected, owner decision) | Low | High |
| 17 | Planner duplicate guard trusts the browser | Low | High |
| 18 | HSTS preload does nothing here | Low | High |
| 19 | CSP could be tighter | Low | High |
| 20 | Permissions-Policy is short | Low | High |
| 21 | Studio hardening gaps | Low | High |
| 22 | Consent default outside strict regions (Protected, owner decision) | Low | Medium |
| 23 | Weak alt text on article images | Low | High |
| 24 | Deprecated `priority` prop | Low | High |
| 25 | Client components that could be server components | Low | High |
| 26 | Unused files | Code health | High |
| 27 | Unused exports (analytics helper: Protected, owner decision) | Code health | High |
| 28 | Unused CSS class | Code health | High |
| 29 | Duplicate definitions | Code health | High |
| 30 | Price removal leftovers (n8n contract: Protected, owner decision) | Code health | High |
| 31 | Dead Sanity queries check | Code health | High |

---

## 5. Recommended next steps

### Now

1. Give the lead webhook a new path in n8n, update `N8N_LEAD_WEBHOOK_URL` on Vercel, and confirm Header Auth is on for all five webhooks (finding 1).
2. Require `application/json` on careers, subscribe, brand-pulse and project-planner (finding 2).
3. Add `Cross-Origin-Opener-Policy: same-origin` (finding 4).
4. Add CSP violation reporting (finding 3).
5. Edit the price sentences and estimate promises in the Insights articles in Studio (finding 8). Done 20 Nov 2026 in Sanity (all 29 articles rescanned clean).

### Next

1. Decide on Speed Insights and the consent default, then update the code or the CLAUDE.md wording (findings 5 and 22). Protected, owner decision.
2. Add `sizes` and a real alt fallback to article images (findings 6 and 23).
3. Run `npm audit fix` for `typescript-eslint`, and take the minor package updates in one PR (findings 9 and 10).
4. Tighten the headers: CSP, `Permissions-Policy`, HSTS and Studio (findings 18, 19, 20 and 21).
5. Harden the form inputs and the rate limiter, adding protection only (findings 14, 15 and 16).
6. Harden the revalidate route (finding 13).

### Later

1. Split the large client components, and remove `"use client"` where it is not needed (findings 7 and 25).
2. Plan the Sanity 6 upgrade as its own task (findings 9 and 10).
3. Watch `next-view-transitions` and plan a move to the built in support (finding 11).
4. Rename `priority` to `preload` (finding 24).
5. Clean up unused files, exports, CSS and duplicates, and remove the price leftovers together with the n8n change (findings 26 to 31).

**Contact:** Maninder.
