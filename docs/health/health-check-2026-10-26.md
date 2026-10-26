# Website health check: 2026-10-26

**Overall health: Fair.** The site is technically sound. It builds cleanly, every page loads fast, there are no broken links or runtime errors, and every form works and fails safely. The issues are almost all in content and accessibility: the published articles still sell the retired package tiers and link to the removed Packages page, some article claims cannot be verified, the careers form is not accessible, and several pages break the site's own copy standards.

No critical findings. 12 important, 22 minor.

Inspection only: no code, content, styles or configuration were changed. Checked on `main` at `1014afb` (the merge of the search positioning change), which `feature/next-work` matches.

## How this was tested

Everything ran against a local production build (`next build`, then `next start`). Where the sandbox could not reach a service, a stand in was used and nothing was sent to the real service.

| Service | What was used | Effect on results |
|---|---|---|
| Sanity content | **Stand in.** The published dataset was exported read only through the Sanity connector, and the site's own GROQ queries were answered from that export with `groq-js`. | Pages render the real case studies, articles, roles, initiatives and Service Pricing. To keep the export manageable, the two tested articles and the Marell Studio case study were rendered with shortened bodies, using real blocks including every link block. The other six articles were not rendered as pages; their full text was checked with queries against the real dataset. Nivora is complete. |
| Sanity images (cdn.sanity.io) | **Stand in.** Blocked from the sandbox. The browser received photo like placeholder images at each requested width. | Image byte sizes for Sanity images are estimates. Image dimensions, `sizes` and srcset choices are real. |
| n8n | **Stand in.** A local webhook that requires the `x-hos-webhook-secret` header and records each request. | No test request went to the real n8n URLs. |
| Google Analytics, Clarity, Vercel scripts | **Stand in.** Requests were recorded and aborted. | Gating and consent calls were observed; nothing reached Google, Microsoft or Vercel. |
| Real hostname | `studios.houseofsingh.com` was mapped to the local server in the browser only. | Used to test the Clarity hostname rule. |

Pages covered: `/`, `/services`, `/services/brand-identity`, `/services/digital-design`, `/work`, `/work/nivora`, `/work/marell-studio`, `/about`, `/ai`, `/brand-pulse`, `/start`, `/contact`, `/careers`, `/insights`, `/insights/ai-made-design-faster-it-did-not-make-brands-better`, `/insights/5-signs-your-brand-is-actively-costing-you-business`, `/initiatives`, `/initiatives/parallel`, `/initiatives/commons`, `/privacy`, `/terms` and a missing page (`/this-page-does-not-exist`). The link crawl followed every internal link from these, 53 pages in all.

`CLAUDE-BRAND.md` does not exist in the repository. The banned word list used is the one from recent briefs: bespoke, holistic, transformative, synergy, curated, elevated, journey, passionate, cutting edge, timeless, visionary, full service, end to end.

---

## Critical

None.

---

## Important

### 1. Articles still sell the retired package tiers and link to the removed Packages page
- **Where:** Sanity, 6 of 8 published articles. Visible on `/insights/5-signs-your-brand-is-actively-costing-you-business` and the other article pages.
- **What is wrong:** The articles link to `/packages` 8 times. That now redirects to `/start`, so the links work, but the copy around them describes a page that no longer exists. Four articles still publish the tier prices: "Brand Foundation starting at $4,000", "Brand Identity System starting at $10,000" and "Brand Ecosystem starting at $20,000". Several also give price ranges ("expect $10,000 to $30,000"). "Why Your Brand Looks Different Everywhere" says "The full details are on the packages page." "How Much Does Brand Identity Design Cost in Canada?" lists the three tiers with timelines and a "⭐ Most popular" badge, which is an emoji.
  - Links to `/packages`: "Why Your Brand Looks Different Everywhere", "Rebrand or Refresh?", "How to Brief a Design Studio", "5 Signs…", "What a Brand Identity System Actually Includes" and "How Much Does Brand Identity Design Cost in Canada?".
  - Tier prices: "Rebrand or Refresh?", "5 Signs…", "What a Brand Identity System Actually Includes" and "How Much Does…".
- **Impact:** This contradicts the decision to show prices only in context (the Planner's guide and the $1,000 floor). Visitors who read an article see fixed tiers that the site no longer offers, which was the problem the change was meant to solve.
- **Suggested fix:** In Studio, replace the tier paragraphs with a line pointing to the Project Planner, and change each `/packages` link to `/start`. Decide whether the cost article keeps market ranges for the industry in general; it can still be useful without the studio's tiers.
- **Effort:** Medium (content edits in 6 articles).

### 2. Article booking links go to a different Cal.com event
- **Where:** Sanity: "Rebrand or Refresh?" (3 links), "How Much Does…" (3), "5 Signs…" (2) and "What AI Can and Cannot Do…" (1).
- **What is wrong:** All 9 links point to `https://cal.com/houseofsinghstudios/hr`. The rest of the site uses `https://cal.com/houseofsinghstudios/discovery-call`.
- **Impact:** If `/hr` is not the discovery call, readers who are ready to buy book the wrong meeting type or reach a dead event.
- **Suggested fix:** Confirm what `/hr` is. If it isn't the discovery call, change the 9 links in Studio to the discovery call URL.
- **Effort:** Small.

### 3. Article claims that cannot be verified
- **Where:** Sanity, visible on article pages.
- **What is wrong:**
  - "5 Signs…": "A 2024 study by the Brand Leadership Institute found that businesses with inconsistent visual identity across touchpoints saw a 23 percent drop in customer recognition…". There is no source link, and I could not confirm the organization or the study.
  - "AI Made Design Faster": "reduces the 40% revision cycles that plague most design engagements". This is also unsourced.
- **Impact:** An invented or unsourced statistic undermines credibility with exactly the established businesses the site targets, and can be quoted back at the studio.
- **Suggested fix:** Link a real source or remove the figures.
- **Effort:** Small.

### 4. Homepage labels show doubled brackets
- **Where:** `/`, from `src/components/homepage/WorkSection.tsx:30`, `ArgumentSection.tsx:63`, `ServicesSection.tsx:75` and `TestimonialsSection.tsx:79`.
- **What is wrong:** `EditorialLabel` already wraps its text in brackets, and these four pass text that includes them, so the page shows "((01) Featured Work)", "((02))", "((03) Capabilities)" and "((06) Testimonials)".
- **Impact:** A visible typo on the homepage, the most visited page.
- **Suggested fix:** Pass the text without brackets, for example `text="01 Featured Work"`, matching how other pages use the component.
- **Effort:** Small.

### 5. Careers form is not accessible
- **Where:** `/careers`, `src/components/careers/CareersClient.tsx` (around lines 600 to 727).
- **What is wrong:**
  - The visible labels ("Name", "Email", "Role", "Portfolio", "Message") are not connected to their fields (no `htmlFor`/`id`). The inputs only get a name from their placeholders, and the role `<select>` has none; axe rates this "critical".
  - The fields are not inside a `<form>`, so the browser's form behaviour (submitting with Enter, built-in validation) doesn't apply.
  - The labels measure 2.33:1 contrast.
- **Impact:** Screen reader users cannot tell what the role menu is for. Keyboard users get a less predictable form. Candidates are lost.
- **Suggested fix:** Give each field an `id` and its label `htmlFor`, wrap the fields in a `<form onSubmit>`, and use the contact form's label style. The contact form's labels have the same contrast issue (item 6).
- **Effort:** Small.

### 6. Text contrast fails beyond the known Marble label baseline
- **Where:** Site wide.
- **What is wrong:** axe flagged 787 elements across 44 page views. Most are the known Marble labels (2.24:1). These are not labels, and also fail:

  | Element | Ratio | Where |
  |---|---|---|
  | Footer copyright | 2.6:1 | every page |
  | Footer legal links and "Top" | 3.54:1 | every page |
  | Footer column heads | 4.13:1 | every page |
  | Form labels | 2.47:1 (contact), 2.33:1 (careers) | `/contact`, `/careers` |
  | "What we are not" list, 22px text | 2.24:1 | `/about` |
  | Deliverable lists | 2.24:1 | `/services` |
  | Grey body text ("Or email us directly", "4 network positions", role locations) | 3.11:1 | `/contact`, `/careers` |
  | Body lines ("Prefer a guided start?", "Book a discovery call…") | 4.19:1 | `/contact`, `/careers` |
  | Article "Subscribe →" button | 4.19:1 | articles |
  | Footer tagline "Directed by humans. Accelerated by AI." | 2.24:1 | footer reveal |

- **Impact:** Hard to read for visitors with low vision or on bright screens. These elements don't meet WCAG AA.
- **Suggested fix:** Use Gunmetal (`--text-secondary`) for body text and form labels on light grounds, and raise the footer's Mist opacity to at least 65% for text. Keep Marble for decorative labels only, or accept that baseline knowingly.
- **Effort:** Medium.

### 7. Invisible keyboard focus stops
- **Where:**
  - Header on every page: `src/components/layout/Header.tsx`, the `header-wordmark` link.
  - Homepage on phones: `src/components/homepage/ServicesSection.tsx:109`.
- **What is wrong:**
  - At the top of every page, the second Tab stop is the header wordmark link, which is fully transparent (`.header-wordmark-wrap` opacity 0) while the crest shows. Keyboard users land on something they cannot see.
  - On phones, each services row on the homepage contains a "Learn More" `span role="link" tabIndex={0}` inside the row's `<a>`. That is an interactive element inside another one, and it takes focus while its row is collapsed and transparent.
- **Impact:** Confusing for keyboard and screen reader users, and the nested link is announced twice.
- **Suggested fix:** Give the hidden wordmark `tabIndex={-1}` and `aria-hidden` while it is invisible, and the crest while it is hidden after scroll. Remove the nested span and let the row link do the work, or move "Learn More" outside the `<a>`.
- **Effort:** Small.

### 8. Job listing structured data is placed and described incorrectly
- **Where:** `/careers`, `src/app/(site)/careers/page.tsx:50-81`.
- **What is wrong:**
  - All four JobPosting entries sit on the `/careers` list page. Google's guidelines require JobPosting on a page for that one job and treat it on list pages as a violation.
  - Every role is marked `jobLocationType: "TELECOMMUTE"`, including the Videographer ("Based in Toronto or the GTA… able to travel to locations") and the Photographer (GTA preferred).
  - The remote roles lack `applicantLocationRequirements`, and there is no `validThrough`. The `description` is the one line summary rather than the full description.
- **Impact:** At best the job data is ignored; at worst it draws a structured data penalty. On site roles are advertised as remote.
- **Suggested fix:** Either remove the JobPosting data until each role has its own page, or add `/careers/<slug>` pages with one JobPosting each. Set `jobLocationType` per role from Sanity and add the missing fields.
- **Effort:** Medium.

### 9. Most pages have no share image
- **Where:** 18 of 22 pages, for example `/services`, `/work`, case studies, `/about`, `/contact`, `/insights` and the initiatives pages.
- **What is wrong:** Only `/`, `/brand-pulse`, `/start` and the articles (their Sanity image) have `og:image`. The root layout's default image is commented out (`src/app/layout.tsx`).
- **Impact:** Links shared to LinkedIn, Slack or iMessage show a bare text card, the weakest possible presentation for a design studio. Case studies are the most shared pages, and they have no image even though each has a strong featured image.
- **Suggested fix:**
  - Add a site default `opengraph-image` in the shared frame. Place it so the homepage's own image still wins, or give the homepage its own as now.
  - Give case studies their featured image (sized to 1200×630 through the Sanity image builder) in `generateMetadata`.
- **Effort:** Small.

### 10. Careers and newsletter endpoints are easier to abuse than the others
- **Where:** `src/app/api/careers/route.ts`, `src/app/api/subscribe/route.ts`.
- **What is wrong:**
  - **Careers:** no honeypot, no length limits (a 20,000 character message was accepted and forwarded to n8n), and no timeout on the n8n call. The other routes use 10 seconds.
  - **Subscribe:** no honeypot and no length limit on the email.
  - **Contact, Brand Pulse and Planner:** these have all three guards, and they work.
- **Impact:** Bots can fill the careers table and the mailing list. A slow n8n response can hold a careers request open.
- **Suggested fix:** Reuse `checkLeadLengths` style caps, a honeypot field, and `postToN8n(target, payload, 10000)`.
- **Effort:** Small.

### 11. Banned words in visible copy
- **Where:**
  - **"curated":**
    - About: `src/components/about/AboutClient.tsx` lines 33, 273 and 420
    - Careers: `src/components/careers/CareersClient.tsx:273`
    - Sanity role "Senior Brand Designer"
  - **"journey":**
    - About: "Explore the full creative journey", `AboutClient.tsx:378`
    - Creative Strategy service: "customer journey mapping", `src/data/services.ts:335`
    - Sanity article "Why Your Brand Looks Different Everywhere"
  - **"end to end":** Sanity article "How to Brief a Design Studio".
- **Impact:** These are the words the brand avoids; they make the copy sound like every other agency.
- **Suggested fix:** Rewrite each instance. "Customer journey mapping" is a term of art, so keep it only if you choose to allow that use.
- **Effort:** Small.

### 12. Dashes in visitor copy
- **Where:** Built pages and Sanity.
- **What is wrong:** 40 distinct em dash uses and 41 hyphenated words on the rendered pages, against the no dashes rule. The main sources:
  - Homepage testimonial attributions ("— Yanina, People and Culture, TEDxToronto"), in the homepage data.
  - Body copy on `/services` and `/services/brand-identity` (`src/data/services.ts`).
  - About section labels such as "(02 — Process)".
  - The careers role lists, which render "—" as a bullet between items.
  - Privacy and Terms (the service list and "including but not limited to").
  - Sanity: "AI Made Design Faster" (5 em dashes), the cost article (1).
  - Hyphenated words across the services data, About ("AI-powered", "senior-level", "six-month"), Careers ("Remote-first, outcome-driven") and the legal pages ("third-party").
- **Impact:** Inconsistent with the house style the rest of the site now follows.
- **Suggested fix:** One copy pass through `src/data/services.ts`, `AboutClient.tsx`, `CareersClient.tsx`, the homepage data, the legal pages and the listed Sanity articles. Use bullets or rules instead of "—" for the careers lists. Legal text may keep "third party" (no hyphen).
- **Effort:** Medium.

---

## Minor

1. **Spelling, Canadian standard.**
   - British spellings:
     - "organise" on `/start` (Planner intro, code)
     - "recognised" ×2 on `/work/marell-studio`
     - Bruno Bakehouse: two -ise spellings and one "organis"
     - Sanity articles: "organisation", "recognise", "formalising" and "programme" (once, in "Rebrand or Refresh?")
     - two Sanity roles: "organised"
   - US "color": `/services` and `/services/brand-identity` ("Color Architecture", "color architecture"), `/careers` (Sanity roles) and "AI Made Design Faster". Canadian spelling is "colour".
   - Fix in the code and in Studio. Small.
2. **Long titles.** "5 Signs Your Brand Is Costing You Business — House of Singh Studios" (67 characters). "Commons: Pro Bono Design and Branding in Toronto — House of Singh Studios" (73: the Sanity SEO title plus the site name). Shorten the SEO titles in Studio. Small.
3. **Long descriptions (over 155 characters).**

   | Page | Length |
   |---|---|
   | AI article | 204 |
   | 5 Signs | 190 |
   | `/initiatives` | 184 |
   | `/initiatives/commons` | 170 |
   | `/initiatives/parallel` | 162 |
   | 404 | 164 |

   Google truncates these. Small.
4. **The 404 page renders in the browser only.** `src/app/(site)/[...not-found]/page.tsx`:
   - Its heading and text are in the React data payload, not the HTML, so the server HTML has no h1.
   - It loads the most JavaScript of any page (279 KB) and has the slowest LCP (2.2 s throttled).
   - It shows the old default description ("A design studio powered by AI systems…").
   - Its `og:url` points to the homepage.
   - Small to medium.
5. **`/work` h1 reads "Work ( 6 )"** to screen readers and search engines, because the count is inside the h1. Move the count out of the heading or hide it from assistive tech. Small.
6. **Heading order skips a level** on `/` (featured work names are h3 with no h2 above) and `/work` (card names are h3 with no h2). Known from earlier work. Small.
7. **Article share images use full size originals.** For example, "AI Made Design Faster" shares a 5905×3937 JPG, and `og:image` has no width or height. Use the Sanity image builder for a 1200×630 crop. Small.
8. **Content Security Policy is permissive.** `script-src` allows `'unsafe-inline'` and `'unsafe-eval'`. `connect-src` still allows `*.n8n.cloud`, which the browser never needs because forms post to the site's own API. Responses also send `X-Powered-By: Next.js`. `next.config.ts`. Medium for nonces, small for the rest.
9. **Google Analytics has no hostname check.** It loads on any production build, including the project's `.vercel.app` production address. Clarity already checks the hostname. `src/app/(site)/layout.tsx:18`, `src/components/GoogleAnalytics.tsx`. Small.
10. **Rate limits live in memory per server instance,** so on Vercel they reset with each new instance and are not shared between instances. Fine as a speed bump. A shared store (Vercel KV or Upstash) would make them real. Medium.
11. **npm audit.** Production tree: 9 advisories (5 high, 4 moderate):

    | Package | Severity | Fix |
    |---|---|---|
    | undici | high | non breaking |
    | zod | high | non breaking |
    | adm-zip | high | npm's only suggestion is an unexpected downgrade of `sanity` |
    | @sanity/cli, @sanity/runtime-cli | high | through `sanity` |
    | uuid, typeid-js, next-sanity, sanity | moderate | through the Sanity packages |

    All come through `sanity`, `@sanity/vision` and `next-sanity`, mainly CLI and Studio tooling; little reaches the public pages at runtime. Development adds `sharp` (high, libvips). Run `npm audit fix` for the non breaking ones; watch Sanity releases for the rest. Small.
12. **Outdated major versions:**

    | Package | Installed | Latest |
    |---|---|---|
    | sanity | 5.31 | 6.20 |
    | @sanity/vision | 5.31 | 6.20 |
    | next-sanity | 12.4 | 13.4 |
    | @sanity/client | 7.27 | 8.11 |
    | @portabletext/react | 6.2 | 8.0 |
    | typescript | 5.9 | 7.0 |
    | eslint | 9 | 10 |
    | @types/node | 20 | 26 |

    Next is one patch behind (16.4.2 to 16.4.3). Plan a Sanity 6 upgrade separately. Large.
13. **Unused dependency.** `@sanity/client` is never imported directly; `next-sanity` provides it. Remove it or keep it deliberately to pin the version. Small.
14. **Dead query.** `getAllPackages()` in `src/lib/sanity/queries.ts` is not called anywhere since the Packages page was removed. Small.
15. **Unused large images in `public/`.** Six files, about 34 MB in all, are referenced nowhere:
    - `photography-ideas-creative-occupation-design-studio-concept.jpg` (12.6 MB)
    - `office-desk-table-with-supplies-freelance-business-workplace-objects.jpg` (11.4 MB)
    - `founder/hf_20260223_….png` (4.9 MB)
    - `blank-stationery-concept-with-tablet-brochure.jpg` (4.1 MB)
    - `white-laptop-cylinders-boxes-white-surface.jpg` (2.3 MB)
    - `earthly-elements.jpg` (1.2 MB)

    They are still downloadable from the site. Small.
16. **Preload warnings.** On 5 to 15 page views, a few CSS files and one font file were preloaded but not used within a few seconds of load. This is small wasted bandwidth on first visits. Small.
17. **Tiny layout shift on the homepage:** CLS 0.001 (all other pages 0). Far below the 0.1 threshold, but you asked for any shift to be flagged. Small.
18. **Articles render on every request.** `/insights/[slug]` has no `generateStaticParams`, so articles are rendered on request instead of prerendered like case studies. Small.
19. **Footer crest uses a plain `<img>`.** `src/components/layout/FooterReveal.tsx:40`: a 108 KB SVG (42 KB compressed) on every page. This is the known lint warning. Small.
20. **`.env.example` lists `NEXT_PUBLIC_SITE_URL`,** which no code reads. Small.
21. **Lint baseline** is unchanged at 5 problems:
    - `AboutClient.tsx`: two `no-explicit-any` errors
    - `ServicesSection.tsx` and `ServiceDetailAccordion.tsx`: setState called inside an effect
    - `FooterReveal.tsx`: the plain `<img>` warning
22. **Emoji in an article.** "⭐ Most popular" in the cost article (part of item 1). Remove it with the tier block.

---

## What passed

- **Code and build:**
  - TypeScript: 0 errors.
  - Lint at the known baseline.
  - Tests: 109 of 109 pass.
  - The production build compiles with no warnings.
- **Status codes:** all 21 pages return 200; the missing page returns 404 with `noindex`.
- **Links:**
  - The crawl of 53 pages found no broken internal links and no orphan pages.
  - The only internal link to a redirect is `/packages` from the articles (item 1).
- **Redirects:** all return 301 and keep the query string:
  - `/journal` and `/journal/<slug>`, including the renamed article
  - `/pulse`
  - `/plan`
  - `/packages` and `/packages?x=1`
  - Trailing slashes return 308 to the clean URL.
  - `/initiatives/foundry` is 404.
- **Sitemap and robots:**
  - The sitemap lists all 33 public pages, with last modified dates for Sanity content, and nothing hidden, redirected or retired.
  - `robots.txt` allows the site, blocks `/api/`, `/studio/` and `/admin/`, and points to the sitemap.
- **Search basics:**
  - Every page has a self-referencing canonical URL.
  - No duplicate titles or descriptions.
  - Exactly one h1 per page when rendered.
  - `og:title`, `og:description` and the twitter card on every page.
  - The homepage, Brand Pulse and Planner share images load at 1200×630.
- **Structured data:**
  - All JSON-LD parses.
  - The FAQ JSON-LD on the three initiatives pages matches the visible questions and answers.
  - The Organization and LocalBusiness data matches the site: Toronto, founder Maninder Singh, the real social links and studios@houseofsingh.com.
  - Article data names the real author and dates.
- **Performance:** every real page has LCP under 1.6 s with no layout shift beyond 0.001 (table below). Images are sized correctly for each screen: no image is served at more than twice its displayed size, and none lacks alt text.
- **Console and runtime:** no console errors, hydration errors, page errors, CSP violations, broken images or failed requests on any page. The only exceptions are Vercel's own Speed Insights script (404 outside Vercel) and the link prefetches cancelled when each test page closed.
- **Forms and tools,** end to end against the n8n stand in:

  | Form | Result | Confirmation shown |
  |---|---|---|
  | Contact, with no budget | delivered | "Thank you. We have received your brief." |
  | Careers | delivered | "Application received." |
  | Newsletter | delivered | "Thank you. You're on the list." |
  | Brand Pulse | `completed` and `lead` events delivered | result page |
  | Project Planner | `started`, `viewed` and `sent` events delivered | "Your brief has been received…" |

  - Every request carried the secret header.
  - Invalid input is rejected with clear messages. Examples: "Invalid email", "Name must be 1 to 120 characters", "Message must be 1 to 5,000 characters", "Name, email, and role are required.", "Invalid event". A plain form post returns 415.
  - The honeypot on contact, Brand Pulse and the Planner returns success but forwards nothing.
  - Rate limits trigger at 5 a minute (contact, careers, subscribe) and 20 a minute (Brand Pulse, Planner).
  - With no secret, every route refuses with a 500 and sends nothing. With a wrong secret, n8n returns 401 and the visitor sees an error, not a false success.
  - Server logs contain no names, emails, IP addresses, the secret or webhook addresses.
- **Privacy, consent and security:**
  - All six security headers are on every response: CSP, HSTS with preload, `X-Frame-Options: DENY` with `frame-ancestors 'none'`, nosniff, referrer policy and permissions policy.
  - In a production build, GA starts with ads denied everywhere and analytics denied in the strict regions, with Google signals and ad personalisation off.
  - Clarity loads only on `studios.houseofsingh.com` and starts denied when the region is strict or unknown.
  - Region rules are correct: no location counts as strict, Ontario and the US are open, and Quebec and France are strict.
  - The consent prompt only appears in strict regions, so "Off until you say yes." is accurate.
  - Every form is marked `data-clarity-mask`.
- **Content integrity:**
  - No lorem, TODO, placeholder or test text.
  - No old email (`studio@houseofsingh.com`) and no old booking link (`/30min`) anywhere in the code or Sanity.
  - Code copy prices match the current decision: the $1,000 floor, the budget ranges and the Commons budget limit.
  - Case studies are clean apart from a few British -ise spellings.

### Performance (390 px, 2× screen, 4× CPU slowdown, Lighthouse mobile network: 1.6 Mbps, 150 ms round trip, cache off, median of 3)

| Page | LCP | CLS | JavaScript over the wire (unzipped) |
|---|---|---|---|
| / | 1.03 s | 0.001 | 177 KB (561 KB) |
| /services | 0.98 s | 0.000 | 175 KB (555 KB) |
| /services/brand-identity | 1.00 s | 0.000 | 183 KB (579 KB) |
| /services/digital-design | 1.00 s | 0.000 | 183 KB (579 KB) |
| /work | 0.99 s | 0.000 | 177 KB (561 KB) |
| /work/nivora | 0.96 s | 0.000 | 177 KB (561 KB) |
| /work/marell-studio | 0.99 s | 0.000 | 177 KB (561 KB) |
| /about | 1.58 s | 0.000 | 177 KB (564 KB) |
| /ai | 1.51 s | 0.000 | 191 KB (603 KB) |
| /brand-pulse | 1.17 s | 0.000 | 249 KB (778 KB) |
| /start | 1.14 s | 0.000 | 261 KB (814 KB) |
| /contact | 1.51 s | 0.000 | 180 KB (570 KB) |
| /careers | 1.55 s | 0.000 | 179 KB (572 KB) |
| /insights | 0.96 s | 0.000 | 214 KB (680 KB) |
| /insights/ai-made-design-faster… | 0.98 s | 0.000 | 222 KB (703 KB) |
| /insights/5-signs… | 0.99 s | 0.000 | 222 KB (703 KB) |
| /initiatives | 1.42 s | 0.000 | 172 KB (549 KB) |
| /initiatives/parallel | 1.41 s | 0.000 | 172 KB (549 KB) |
| /initiatives/commons | 1.41 s | 0.000 | 172 KB (549 KB) |
| /privacy | 0.96 s | 0.000 | 172 KB (547 KB) |
| /terms | 0.94 s | 0.000 | 172 KB (547 KB) |
| 404 | 2.20 s | 0.000 | 279 KB (869 KB) |

No page is over 2.5 s. The browser's network emulation slows every request except the first HTML document, so real world LCP will be a few hundred milliseconds higher. The 404 page is the only one that could cross 2.5 s. The text heavy pages (`/about`, `/contact`, `/careers`, `/initiatives`) are slower because their largest element is text that waits for the entrance animations.

**Largest images.** In `public/`, the largest files actually used are:
- `projects/tedxtoronto/tedxtoronto.jpg` (5.5 MB), used on `/services` and `/work`
- `studio/studio.jpg` (5.2 MB), used on `/about`

Both go through `next/image`, so visitors receive resized versions. The Sanity uploads are also large originals, served resized through `next/image`. Only the article share images (Minor 7) go out at full size.

---

## Configuration: environment variables

| Variable | Required in production | Used by | If missing |
|---|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | `src/lib/sanity/client.ts` | `createClient` throws when imported: the build fails and every page that reads Sanity errors. |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | `src/lib/sanity/client.ts` | Same as above. |
| `N8N_WEBHOOK_SECRET` | Yes | `src/lib/n8n.ts`, all five form routes | Every form refuses to send: 500 "Server configuration error" or "Application system is not configured." Nothing reaches n8n (fails closed, verified). |
| `N8N_WEBHOOK_URL` | Yes | `/api/lead` (contact form) | Contact form returns 500; nothing is sent. |
| `N8N_CAREERS_WEBHOOK_URL` | Yes | `/api/careers` | Careers form returns 500. |
| `N8N_SUBSCRIBE_WEBHOOK_URL` | Yes | `/api/subscribe` (newsletter) | Newsletter returns 500. |
| `N8N_BRAND_PULSE_WEBHOOK_URL` | Yes | `/api/brand-pulse` | Brand Pulse results still show, but events and email leads are not delivered (500). |
| `N8N_PROJECT_PLANNER_WEBHOOK_URL` | Yes | `/api/project-planner` | The planner works, but events and sent briefs are not delivered (500). |
| `VERCEL_ENV` | Set by Vercel | `src/app/(site)/layout.tsx` | Read at build time. Only `production` builds include Google Analytics, Clarity, the consent manager and the footer "Privacy choices" link. Previews and local builds have none. |
| `NEXT_PUBLIC_SITE_URL` | No | nothing | Listed in `.env.example` but not read by the code (Minor 20). |

The Sanity Studio (`sanity.config.ts`, `sanity.cli.ts`) has the project ID and dataset written into the files and needs no variables. Location headers from Vercel (`x-vercel-ip-country`, `x-vercel-ip-country-region`) drive the consent region; without them the region counts as strict. `.env.local` is tracked in git by design; its contents were not read for this check.

---

## Not tested, and why

- **http to https redirect:** not testable locally. Vercel redirects to https at the edge, and the HSTS header with `preload` is present on every response.
- **Real Sanity images:** `cdn.sanity.io` is blocked from the sandbox. Image byte sizes for Sanity content are estimates; dimensions and srcset choices are real.
- **Six article pages and the full Marell case study as rendered pages:** shortened in the stand in (see "How this was tested"). Their full text and links were checked against the real dataset with queries.
- **Real n8n workflows:** whether each live workflow actually rejects requests without the secret header can only be checked in n8n. The site side sends the header and fails closed without it.
- **Vercel only scripts:** Speed Insights and Vercel Analytics exist only on Vercel.
- **The first network round trip:** the browser's network emulation does not slow the first HTML request, so real world LCP is a few hundred milliseconds higher than measured.
- **Consent prompt flow in a strict region:** the region rules, defaults and gating were verified. Clicking through the prompt itself, which appears from the second page view in a strict region, was not.
- **Studio (`/studio`):** out of scope beyond its security headers, which are present.
- **Email delivery after n8n:** outside the site.

---

## Comparison with previous health checks

There is no previous health check report in `docs/health`; this is the first. The `audits/` folder holds earlier audits of a different kind (branch status, dead code, lint baseline, header review), dated March and April 2026, so there is no like for like comparison. One comparable number: the lint baseline audit of 2026-04-28 recorded 8 problems across 6 files; today there are 5, so lint has improved since then.
