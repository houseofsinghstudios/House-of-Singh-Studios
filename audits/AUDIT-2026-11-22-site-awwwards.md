# Site audit before the Awwwards submission, 22 November 2026

**Date:** 2026-11-22
**Branch:** main at 007f817 (after PR 276)
**Auditor:** Claude Code
**For:** Maninder
**Mode:** read only. No code was changed; only this report is committed.

**What was tested:** the production site, https://studios.houseofsingh.com. Every page except the homepage,
which has its own report (`AUDIT-2026-11-22-homepage-awwwards.md`). The test machine runs Playwright with
Chromium 1243 (headless), Lighthouse 12.8.2 and axe core 4.14.1. Its network proxy blocks third party hosts
(Google Tag Manager, Clarity, cal.com, the social sites, every outside article), which shapes a few results;
each one says so.

**Pages (25):** /work; three case studies, one of each type: /work/the-floreans (client), /work/nivora
(exploration), /work/marell-studio (Parallel); /services and its four service pages; /about; /contact; /start
through all five questions to the brief and its send form; /brand-pulse through all seven questions to the
result and its shared link (`?r=`); /ai; /insights, one article (/insights/how-much-does-a-logo-cost-in-canada)
and one archive page (/insights/page/2); /initiatives, /initiatives/parallel, /initiatives/commons; /partners,
/careers, /privacy, /terms; the 404 page. The error page could not be triggered on production (see Not checked).

**Widths:** 360, 390, 768, 1080, 1081, 1280, 1440 and 1920, each 900 tall.

Scratch evidence (scripts, raw JSON, Lighthouse reports and screenshots) is in the session scratchpad under
`site-audit/` (`out/*.json`, `lh/*.json`, `shots/*.png`); it is not committed.

---

## 1. Summary

### Lighthouse (median of three runs each)

Mobile is the Moto G preset (4x CPU, slow 4G); desktop is the desktop preset.

| Page | Mobile perf (runs) | Mobile LCP | Mobile TBT | Desktop perf | Desktop LCP | A11y m/d | BP | SEO | CLS | Mobile bytes |
|---|---|---|---|---|---|---|---|---|---|---|
| /work | 94 (87, 94, 95) | 2.32 s | 217 ms | 100 | 0.61 s | 98/98 | 96 | 100 | 0.00 | 375 KB |
| /work/the-floreans | 97 (97, 97, 96) | 2.14 s | 156 ms | 100 | 0.53 s | 100/100 | 96 | 100 | 0.00 | 356 KB |
| /work/nivora | 96 (98, 96, 95) | 1.98 s | 206 ms | 100 | 0.57 s | 100/100 | 96 | 100 | 0.00 | 396 KB |
| /work/marell-studio | 97 (97, 96, 97) | 1.99 s | 172 ms | 100 | 0.63 s | 100/100 | 96 | 100 | 0.00 | 359 KB |
| /services | 97 (97, 93, 98) | 2.07 s | 173 ms | 100 | 0.77 s | 100/100 | 96 | 100 | 0.00 | 449 KB |
| /services/brand-identity | 95 (97, 92, 95) | 2.14 s | 202 ms | 100 | 0.47 s | 100/100 | 96 | 100 | 0.00 | 287 KB |
| /services/visual-media | 95 (92, 95, 95) | 2.14 s | 235 ms | 100 | 0.48 s | 100/100 | 96 | 100 | 0.00 | 285 KB |
| /services/digital-design | 94 (97, 94, 94) | 2.18 s | 238 ms | 100 | 0.47 s | 100/100 | 96 | 100 | 0.00 | 286 KB |
| /services/creative-strategy | 95 (95, 97, 95) | 2.15 s | 235 ms | 100 | 0.49 s | 100/100 | 96 | 100 | 0.00 | 285 KB |
| /about | 97 (97, 97, 96) | 2.33 s | 135 ms | 100 | 0.52 s | 100/100 | 96 | 100 | 0.00 | 295 KB |
| /contact | 98 (98, 99, 98) | 2.06 s | 121 ms | 100 | 0.50 s | 100/100 | 96 | 100 | 0.00 | 273 KB |
| /start | 92 (86, 92, 96) | **3.02 s** | 154 ms | 100 | 0.56 s | 100/100 | 96 | 100 | 0.00 | 289 KB |
| /brand-pulse | 92 (92, 93, 90) | 2.51 s | 279 ms | 100 | 0.52 s | 100/100 | 96 | 100 | 0.00 | 279 KB |
| /ai | 97 (97, 97, 98) | 2.13 s | 141 ms | 100 | 0.48 s | 100/100 | 96 | 100 | 0.00 | 285 KB |
| /insights | 97 (97, 97, 89) | 2.30 s | 156 ms | 100 | 0.55 s | 100/100 | 96 | 100 | 0.00 | 394 KB |
| /insights/how-much-does-a-logo-cost-in-canada | 95 (94, 95, 96) | 2.24 s | 203 ms | 100 | 0.56 s | 100/100 | 96 | 100 | 0.00 | 328 KB |
| /insights/page/2 | 98 (98, 97, 98) | 2.09 s | 134 ms | 100 | 0.48 s | 100/100 | 96 | 100 | 0.00 | 399 KB |
| /initiatives | 97 (97, 94, 97) | 2.13 s | 161 ms | 100 | 0.48 s | 100/100 | 96 | 100 | 0.00 | 291 KB |
| /initiatives/parallel | 96 (95, 98, 96) | 2.15 s | 173 ms | 100 | 0.43 s | 100/100 | 96 | 100 | 0.00 | 299 KB |
| /initiatives/commons | 97 (97, 98, 93) | 2.13 s | 151 ms | 100 | 0.49 s | 100/100 | 96 | 100 | 0.00 | 280 KB |
| /partners | 98 (98, 97, 99) | 2.07 s | 134 ms | 100 | 0.50 s | 100/100 | 96 | 100 | 0.00 | 275 KB |
| /careers | 96 (97, 96, 95) | 2.22 s | 182 ms | 100 | 0.54 s | 100/100 | 96 | 100 | 0.00 | 275 KB |
| /privacy | 97 (98, 97, 94) | 1.86 s | 194 ms | 100 | 0.50 s | 100/100 | 96 | 100 | 0.00 | 267 KB |
| /terms | 96 (96, 96, 99) | 2.11 s | 188 ms | 100 | 0.48 s | 100/100 | 96 | 100 | 0.00 | 263 KB |

- The 404 page is not in the table: Lighthouse refuses a document that answers 404 (`ERRORED_DOCUMENT_REQUEST`). It was measured with Playwright instead (layout shift 0, no overflow, axe clean).
- One /initiatives/commons mobile run failed to record a trace (`NO_NAVSTART`) and was run again.
- Best practices 96 everywhere comes only from console errors for the third party scripts this machine's proxy blocks (gtag.js, Clarity). On a normal network they would not appear.
- The /work accessibility 98 is one audit, heading order (S-07). Every other page scores 100.
- Lighthouse's CLS is 0 on every page because it measures load only. The layout shift Lighthouse cannot see is in S-02.
- On most pages the mobile LCP element is the header wordmark, or the page's first paragraph, painted when Inter arrives. Images are the LCP element only on desktop case studies, /work, /services and the article.

### axe (WCAG 2.0 to 2.2 A and AA)

352 runs: every interactive state at 390, 1080 and 1440 (239), and the loaded state at 360, 768, 1081, 1280 and 1920 (113).
States covered:
- the drawer, at 390 and 1080;
- the Living Index lists and a choice;
- every service accordion, process and questions;
- each planner question, the brief, the send form and its empty-send errors;
- Brand Pulse questions and the result, and the shared result;
- the contact, careers and newsletter empty-send errors;
- Copy text and Copy link;
- the Insights filter;
- Privacy choices.

| Result | Where |
|---|---|
| 0 violations | every page, state and width, except the two below |
| 1 node, `label-content-name-mismatch` | article, after Copy link is pressed (390, 1080, 1440): S-14 |
| could not run | /careers "Apply for this role" (the button is hidden, S-01); 404 "drawer open" (the menu button is hidden, S-05) |

axe cannot see grounds painted by pseudo elements, hover states or text dimmed by opacity mid transition. Those
were measured separately (hover contrast, below).

### Findings by group

| Group | Count | IDs |
|---|---|---|
| Blocker | 4 | S-01 to S-04 |
| Should fix | 6 | S-05 to S-10 |
| Polish | 9 | S-11 to S-19 |

### What passed (checked and found as specified)

- **Loading and layout shift:**
  - Layout shift on load is 0 on every page at all eight widths.
  - During a full scroll, the only shifts are the small footer crest ones in S-12.
  - Every interaction measured is free of unexpected shift except the Brand Pulse result (S-02): the drawer, the Living Index lists and choice, the accordions, every planner step and its brief, the forms' errors, the Insights filter, Copy text and Copy link.
- **Widths:** no horizontal overflow on any page at any of the eight widths.
- **Console:** no page errors, no hydration warnings and no failed first party requests anywhere. The only console entries are the blocked third party scripts and the preload warnings (S-06). The 404 page logs its own 404.
- **Keyboard:**
  - A full Tab walk of every page at 1440 and 390: 21 to 57 stops per page, and focus always comes back round. There are no traps.
  - Nothing is focused off screen or while hidden, except the careers buttons (S-01).
  - The skip link is the first stop everywhere and shows on focus.
  - Every stop shows a visible change, except the article newsletter field (S-04).
  - The Initiatives Explore links outline their whole row, as built in PR 276.
- **Without JavaScript:**
  - No page shows a control that does nothing, except the careers role headers (S-01).
  - No content is hidden: the services and questions accordions show every answer.
  - The contact and article newsletter forms post to their routes (the written page answers).
  - /start and /brand-pulse show their intro without the start buttons.
- **Reduced motion:** no animation keeps running on any page, and no text is left faded after a full scroll.
- **Contrast:** every hover state on every page was hovered at 1440 and measured against the ground actually behind it:
  - Small text on Cloudy White grounds stays Gunmetal (PR 275).
  - Every hover passes except one decorative arrow (S-18).
  - Dark sections and the take part bands pass in axe.
- **Metadata:**
  - Every page has a title, description, canonical to itself (canonical /brand-pulse for `?r=` results), complete OG and Twitter tags, and `lang="en-CA"`.
  - Every share image answers 200 at 1200 by 630: the site default, the Sanity crops for case studies and the article, and the /start, /brand-pulse and initiative routes.
  - The 404 page and the shared Brand Pulse result are `noindex, follow`. /insights/page/2 has its own canonical and `index, follow`.
- **JSON-LD:** every block on every page parses, with no dangling `@id` (the two houseofsingh.com ids are referenced as intended). These are present where they belong:
  - FAQPage on the four service pages, /initiatives, the two programme pages and /partners;
  - Service and OfferCatalog on service pages;
  - CreativeWork on case studies;
  - Article on the article.

  `foundingDate` is "2023" for the studio and "2014" for the parent brand, as documented. Nothing is priced.
- **Excluded content:**
  - No founding day or month and no trademark number anywhere, in visible text, metadata or JSON-LD.
  - Studio prices: none, except the two items for the owner in S-09.
  - Dollar figures elsewhere are market ranges in service FAQs (allowed), the partners example fee and credit, and the Commons budget threshold.
- **View transitions:** 23 of 24 routes were entered by clicking a real link and left by the header.
  - Each ran exactly one view transition each way, with no rejected promise, no duplicate name and no console error.
  - Case studies carry `project-<slug>` and `project-image-<slug>`, matching /work.
  - /insights/page/2 is reached by "Load more", which loads in place by design, so it does not navigate.
- **Links:** all 66 internal link targets found on these pages answer 200 with no redirect.
- **Tools end to end:**
  - The planner walks through all five questions to its brief, and the send form shows its errors.
  - Brand Pulse walks through seven questions to a result.
  - "Copy a link to this result" gives `/brand-pulse?r=0000`, which opens the same result with the hidden "Brand Pulse result" H1 (protected), `noindex`, and clean axe.

---

## 2. Findings

Each finding gives the page, the widths, what happens, the evidence, the smallest fix, the effort (S, M or L),
and whether it touches a Protected item or an owner decision.

### Blocker

#### S-01. Careers roles cannot be opened from the keyboard, and their hidden Apply buttons take focus

- **Page:** /careers. **Widths:** all.
- **What happens:**
  - Each role's header, its title and the "+" that opens the description, is a plain `div` with an `onClick`. It has no button, no `tabindex`, no `aria-expanded` and no key handler.
  - Keyboard and screen reader users cannot open a role, so they never see its description (WCAG 2.1.1 Keyboard, 4.1.2 Name, Role, Value).
  - The collapsed body is clipped to 0 px (`max-height: 0`) but not inert, so each role's "Apply for this role" button still takes focus while invisible. Three such stops sit in the Tab order (2.4.7, 2.4.11).
  - Without JavaScript the descriptions can never be opened, and the "+" shows but does nothing.
- **Evidence:**
  - In the browser: the header is a `DIV` with no `role`, `tabindex` or `aria-expanded`, and Enter on it does nothing.
  - The first Apply button takes focus with its body 0 px tall and `inert` false.
  - The keyboard walk reports three focused buttons covered by `div.role-card-header` at 1440 and 390, and axe could not click Apply in any width.
  - Code: `src/components/careers/CareersClient.tsx:339-342` (header), `:392-394` (body), `careers.css:53-61`.
- **Smallest fix:**
  - Make the header's title row a `button` (inside the h2) with `aria-expanded` and `aria-controls`.
  - Set `inert` on the collapsed body once the page runs in the browser.
  - Collapse the bodies only under `html[data-js]`, as What we do and the accordions do, so without JavaScript every role reads in full.
- **Effort:** S. **Protected or owner decision:** no.

#### S-02. The Brand Pulse result moves the whole page as it appears (CLS up to 0.55)

- **Page:** /brand-pulse (and the same component on /ai, not measured there). **Widths:** all; worst on phones.
- **What happens:**
  - After the seventh answer the tool shows "Reading your brand pulse" for a moment.
  - It then swaps in the result, and the result builds in three timed stages. Each stage mounts more content, and the footer below jumps down each time.
  - These shifts happen seconds after the last click, so they count as unexpected layout shift. On a phone the session's CLS reaches 0.55, which is "poor" (over 0.25).
  - This is the page a visitor finishes on. Field data (Chrome's own CLS) would record it.
- **Evidence:**

  | Width | Layout shift entries, all without recent input | CLS |
  |---|---|---|
  | 390 | 0.178 and 0.370 | 0.55 |
  | 1080 | 0.110, 0.164 and 0.037 | 0.31 |
  | 1440 | 0.058 and 0.090 | 0.15 |

  - The sources are `ft-footer` and the footer crest.
  - Code: `src/components/brand-pulse/BrandPulse.tsx:76-95` (`goTo`, `showResult`, the staged `setStage` timers).
- **Smallest fix:**
  - From the reading screen on, give the tool's root a minimum height at least as tall as the result (or `100svh`).
  - Mount the whole result at once and stage its parts with opacity and transform only, not by mounting them.
- **Effort:** S to M. **Protected or owner decision:** no.

#### S-03. Case study hero images are shown far larger than their source

- **Pages:** every case study (/work/the-floreans, /work/nivora and /work/marell-studio measured). **Widths:** 1081 and up; worst on 2x screens.
- **What happens:**
  - The case study hero is full width, 16:9, so 1440 css px wide at 1440, which is 2880 device px on a 2x screen.
  - The code asks Sanity for 1600 px (`width(1600)`, quality 80). Next then recompresses that at quality 75, so the image is compressed twice.
  - The source images are smaller still:

    | Case study | Source width | Shown at 1440 | On a 2x screen |
    |---|---|---|---|
    | The Floreans | 1344 px | upscaled 1.07x | upscaled 2.1x |
    | Nivora | 1448 px | about 1:1 | upscaled 2x |
    | Marell Studio | 1152 px | upscaled 1.25x | upscaled 2.5x |

  - The first image of a case study is the page's LCP on desktop and its first impression, and the jury reviews on large, dense screens.
- **Evidence:**
  - Decoded file sizes in the browser: the AVIF served for `w=3840` is 1600 by 895 for The Floreans, from a 1344 by 752 asset.
  - Sanity image metadata for the three projects.
  - Screenshots: `shots/fold-_work_nivora-1440.png`, `fold-_work_marell-studio-390.png`.
  - Code: `src/lib/sanity/projects.ts:207` (`width(1600).quality(80)`), `case-study.css:47-51` (16:9), `CaseStudyTemplate.tsx:117` (`sizes="100vw"`).
- **Smallest fix:**
  - Request the hero as the homepage hero does: `width(2400).fit("max").quality(90)`, letting Next pick the size.
  - Then replace the three sources in Studio with exports at least 2880 px wide; the Parallel and exploration images are the studio's own.
  - Framing is fine: the case study hero uses the featured image, which has no Studio hotspot, so it centres. The subject stays in frame in all three at 16:9 and at 3:2 on phones.
- **Effort:** S (code) plus content. **Protected or owner decision:** no.

#### S-04. The article newsletter field shows no keyboard focus

- **Page:** every Insights article. **Widths:** all.
- **What happens:**
  - The email field sets `outline: none` and no focus style replaces it, so a keyboard user cannot see where they are (WCAG 2.4.7 Focus Visible).
  - It was the only stop in the whole site's keyboard walk with no visible change on focus.
- **Evidence:** keyboard walk (`input.art-newsletter-input`, no style change between focused and blurred); code `src/components/insights/article.css:293-305`. There is no `:focus` rule anywhere.
- **Smallest fix:** the shared form focus, a 2 px Obsidian bottom rule (the documented inset shadow exception), as `.contact-input:focus-visible` has.
- **Effort:** S. **Protected or owner decision:** no.

### Should fix

#### S-05. On the 404 page the phone menu is missing, because the page never runs its arming script

- **Page:** 404 (any unknown address). **Widths:** 1080 and below.
- **What happens:**
  - The site layout's inline script sets `html[data-js]` before paint, but on the 404 page it arrives only inside the React payload and is inserted in the browser, where inline scripts never run.
  - So `data-js` is never set. Every `.needs-js` control stays hidden, including the menu button and Top, which leaves phone visitors with no header navigation on the 404 (the footer links remain).
  - A regression from PR 275 (H-14).
- **Evidence:**
  - On /no-such-page-audit: `data-js` false, the menu button `display: none`, and the inline script present only as `__html` in the flight data.
  - On /about: a real `<script>` in the HTML and `data-js` true.
  - axe "drawer open" could not run on the 404 at 390 and 1080.
  - Code: `src/app/(site)/layout.tsx` (REVEAL_ARM_SCRIPT), `src/app/(site)/[...not-found]/page.tsx`.
- **Smallest fix:**
  - Render the arming script from the root layout's `<head>`, so it reaches every document as real HTML.
  - As a safety net, have ClientShell set `data-js` on mount when it is missing.
- **Effort:** S. **Protected or owner decision:** no.

#### S-06. Most pages still prefetch on sight, with 3 to 5 console warnings each

- **Pages:** 21 of 25: every page except /contact, /start and /brand-pulse; partly on /initiatives, /initiatives/commons, /partners, /privacy and /terms (desktop only). **Widths:** all.
- **What happens:**
  - The homepage moved to prefetch on intent in PR 274 (IntentLink), but the rest of the site did not.
  - Two pieces use the view transition `Link` directly, which prefetches each linked page as soon as it scrolls into view:
    - the shared Button, with every internal button such as "Learn more", "Plan your project" and the dark CTAs;
    - the "Next" link at the foot of most pages.
  - Chrome then warns about each preloaded stylesheet the page does not use, and unused route data is fetched before any interaction.
- **Evidence:**
  - Console: "The resource …/chunks/….css was preloaded using link preload but not used within a few seconds", three to five times per page load at every width (`out/pagecheck.json`).
  - Code: `src/components/ui/Button.tsx:84,99`, `src/components/layout/NextPageLink.tsx:36`, and the other direct `Link`s listed in CLAUDE.md drift below.
- **Smallest fix:** use IntentLink in Button and NextPageLink (the two shared pieces cover most of it), then the remaining direct links. Extend `tests/intent-link.test.ts` beyond the homepage files.
- **Effort:** S to M. **Protected or owner decision:** no.

#### S-07. /work jumps from H1 to H3

- **Page:** /work. **Widths:** all.
- **What happens:** the hidden H1 is followed directly by the project names as H3s; the only H2, "Other work", comes after them. This is the one failing audit in /work's Lighthouse accessibility, 98 on both presets.
- **Evidence:** Lighthouse `heading-order`; heading outline: `H1(hidden): Work: brand identity…` then `H3: Christmas Carnival`.
- **Smallest fix:** give the index an H2 before the rows. Either make the sentence "Work for [your kind of business], in [every discipline]." the H2, or add a visually hidden "Projects" H2. The homepage Selected work already uses its sentence as the H2.
- **Effort:** S. **Protected or owner decision:** no; the hidden H1 itself is protected and stays.

#### S-08. Insights images are requested smaller than they are shown

- **Pages:** /insights, every article, the archive pages. **Widths:** 1081 and up, and every 2x phone.
- **What happens:**

  | Image | Requested from Sanity | Shown | Result |
  |---|---|---|---|
  | /insights featured card | 1200 px | 1210 css px wide at 1440 | upscaled even on a 1x screen |
  | Article hero | 1600 px | 1440 css px | upscaled 1.8x on 2x screens |
  | Archive cards | 600 px | 589 css px | 2x short on 2x screens |

  The sources themselves are large enough (1672 px).
- **Evidence:** above the fold image check (`out/pagecheck.json`, `img1440`, `img390`); code `src/lib/sanity/image.ts:22-25` (`featured` 1200, `card` 600, `hero` 1600, `body` 1200).
- **Smallest fix:** raise the presets to what a 2x screen needs (featured and hero 2400, card 1200, body 1600) with `fit("max")`, and let Next's `sizes` choose.
- **Effort:** S. **Protected or owner decision:** no.

#### S-09. Two price signals for the owner to decide

- **Pages:** /contact, /insights/how-much-does-a-logo-cost-in-canada. **Widths:** all.
- **What happens:**
  - **Contact budget menu:** the lowest band offered is "$1,000 to $4,000", after "Not sure yet", with no lower band. That reads as a minimum spend. The planner's own investment question offers "under $1,000".
  - **Logo cost article (in Sanity):** it says "Focused studio logo projects start from about $1,000." It describes studios in general, but on this studio's own site it can read as the studio's floor. The no prices guard only scans the code, not Sanity.
- **Evidence:** the contact form's options; the article text at 1440 (the guard's own pattern, "start from … $", matches it).
- **Smallest fix:** owner's choice.
  - Contact: add an "Under $1,000" band as in the planner, or drop the amounts.
  - Article: rephrase in Studio as a market statement ("Smaller studios typically charge…").
- **Effort:** S. **Protected or owner decision:** yes. The Pricing rule (decided 20 Nov 2026) says no floor; market ranges are allowed.

#### S-10. Tap targets under 24 px on phones

- **Pages:** several. **Width:** 390.
- **What happens:** WCAG 2.2's minimum (2.5.8) is 24 by 24, or enough space around the target. The homepage meets 44 px (PR 274), but other pages have:

  | Page | Target | Size |
  |---|---|---|
  | /insights | the category filters | 15 px tall, "AI" 13 px wide |
  | Case studies, service pages, articles | the back links | 20 px tall |
  | Case studies, articles | discipline tags | 17 px tall |
  | Case studies | "Planning something similar?" | 19 px |
  | /ai | source links | 12 px tall |
  | Articles | "Subscribe →" | 20 px |
  | /about | "View careers" | 17 px |
  | /contact | the email link | 17 px |
  | /services | "Prefer to talk?" | 15 px |

  Some may pass through 2.5.8's spacing exception; the filters sit close together and likely do not.
- **Evidence:** `out/targets.json`, inline links in running text excluded.
- **Smallest fix:** the homepage technique, padding with an equal negative margin, so nothing moves. Start with the Insights filters and the back links.
- **Effort:** S. **Protected or owner decision:** no.

### Polish

#### S-11. /start's mobile LCP is 3.0 s

- **Page:** /start (and /brand-pulse at 2.51 s). **Widths:** mobile preset.
- **What happens:**
  - The LCP element is the planner's intro paragraph (`p.pp-lead`). It is in the server HTML, so the time is the Inter swap under slow 4G plus the screen's 0.2 s fade.
  - The runs vary widely: 2.43, 3.02 and 3.15 s.
  - The server answers in about 23 ms, so rendering on request is not the cause.
- **Smallest fix:** no fade on the first screen (`.pp-screen` animation only after the first step), and the same for `.bp-screen`.
- **Effort:** S. **Protected or owner decision:** no.

#### S-12. Small layout shifts while scrolling and on hover

- **Pages:** most. **Widths:** all.
- **What happens:**
  - The footer crest's reveal shifts the footer by 0.0006 to 0.0025 when the bottom is reached. On /services at 360 and 390 it reaches 0.019 to 0.025: a 21 px move of `ft-reveal`.
  - Hovering the case study "Next project" row loosens the name's letter spacing, which moves it (0.0006 to 0.0011). Hover is not an input that CLS excuses.
  - All are well inside "good" (0.1).
- **Smallest fix:** animate the crest with transform only, and do the letter spacing hover as a transform, or accept it.
- **Effort:** S. **Protected or owner decision:** no.

#### S-13. Keyboard focus can land partly under the fixed header

- **Pages:** /services (the four project cards), /partners (the partners email link). **Width:** 1440.
- **What happens:** when focus scrolls an element into view, its top sits under the 72 px header. It stays partly visible, so WCAG 2.4.11's minimum passes, but it looks broken.
- **Smallest fix:** `html { scroll-padding-top: calc(var(--header-edge) + 16px); }`.
- **Effort:** S. **Protected or owner decision:** no.

#### S-14. "Copy link" keeps its label after it reads "Copied"

- **Page:** every article. **Widths:** all.
- **What happens:** the share button has `aria-label="Copy link"`. After a press its visible text becomes "Copied", so the name no longer contains the visible words (2.5.3; axe `label-content-name-mismatch`).
- **Smallest fix:** drop the `aria-label` (the visible text names it) and announce "Link copied" in a polite live region.
- **Effort:** S. **Protected or owner decision:** no.

#### S-15. Title Case labels outside the homepage

- **Pages:** many. **Widths:** all.
- **What happens:** CLAUDE.md asks for sentence case on every button and link label, but the guard only covers some files. Found:
  - **Case studies:** "All Projects", "(Next Project)", "(02) The Challenge", "(03) Our Approach", "(05) The Result".
  - **Dark CTA labels:** "(Next Step)" on /work, /about, /insights and articles (other pages read "(Next step)").
  - **/about:** "How We Are Different" and "View Careers".
  - **Service page CTA:** "Plan a {Service} Project".
  - **Articles:** "(Key Takeaways)".
  - **/ai:** "(Studio Guide)".
  - **/services:** block labels such as "(01) Brand Identity", and the placeholder "Coming Soon".
  - **The planner's privacy link:** "Privacy Policy".
  - **The error page buttons:** "Go to the Homepage", "Contact the Studio".
  - **The 404 title:** "Page Not Found".
- **Evidence:** read in the code (CLAUDE.md drift below) and seen on the pages.
- **Smallest fix:** sentence case each, and widen the guard in `tests/audit-pr1.test.ts` to every component.
- **Effort:** S. **Protected or owner decision:** the /privacy page's own H1 "Privacy Policy" is protected wording and stays; the planner's link label is not.

#### S-16. The About clock always says "EST"

- **Page:** /about. **Widths:** all.
- **What happens:** the Toronto clock is labelled "EST" in the code. It is right today (November) and wrong from March to November under daylight time (EDT).
- **Smallest fix:** label it "Toronto" or derive the abbreviation with `Intl.DateTimeFormat(..., { timeZoneName: "short" })`.
- **Effort:** S. **Protected or owner decision:** no.

#### S-17. Metadata tidy ups

- **Pages:** listed. **Widths:** n/a.
- **What happens:**
  - **Titles at 61 characters,** just over what search results show: /services and /services/brand-identity.
  - **/services/visual-media's title** ends "| House of Singh", not "| House of Singh Studios".
  - **The 404 page** uses the generic site description (183 characters).
  - **Case studies** declare `og:type` "website" (an article or CreativeWork page could say "article"; SITE_OG is protected, so only note it).
- **Smallest fix:** shorten the two titles, add the missing word, and give the 404 its own short description.
- **Effort:** S. **Protected or owner decision:** `og:type` touches SITE_OG (protected); leave it unless approved.

#### S-18. Hovers that dim by opacity

- **Pages:** /about, /services, /insights. **Width:** 1440.
- **What happens:**
  - /about's "View careers" and initiatives links fade to 0.6 on hover, taking the 11 px arrow to 4.19:1. That is decorative, but it is the only hover under 4.5:1 site wide.
  - "Learn more" on /services dims to 0.8.
  - The Insights featured title dims to 0.65.
  - Layer 4 says hovers change colour or sweep, never opacity on text.
- **Smallest fix:** the shared hovers (underline wipe, primary sweep).
- **Effort:** S. **Protected or owner decision:** no.

#### S-19. Content gaps seen on the pages

- **What happens:**
  - The Floreans has no Studio "Year", so its /work row shows none while the others do.
  - The case study hero image starts 593 to 674 px down at 1440 by 900 (Nivora, The Floreans, Marell Studio), under the hero text, so most of it is below the fold. CLAUDE.md asks for a compact hero (about 50vh); the text block takes two thirds to three quarters of the first screen. See drift.
- **Smallest fix:** fill the year in Studio. Decide whether the case study hero text block should be shorter so the image rises into the first screen.
- **Effort:** S. **Protected or owner decision:** the hero layout is a design call.

---

## 3. Not checked

- **The error pages** (`src/app/(site)/error.tsx`, `src/app/global-error.tsx`): they appear only when a page throws at runtime, which cannot be caused on production without changing code. They were read in the code only; their Title Case buttons are in S-15.
- **External links (13):** cal.com, the studio's Instagram, LinkedIn and X, the RGD profile, the /ai and article sources, and the share intents. This machine's network cannot reach them, and a second attempt through a separate fetch agent failed the same way (DNS). Internal links were all checked.
- **INP and real devices:** lab tools stand in (TBT, scripted interactions). No Safari or Firefox, and no real phone.
- **The Brand Pulse result on /ai:** the same component as S-02, but only its first step was run there.
- **Analytics events** on these pages, and what n8n receives: forms were sent empty only, to see their errors. Nothing was ever posted to the live n8n routes.
- **Interactive axe states at 360, 768, 1081, 1280 and 1920:** those widths ran the loaded state only. The interactive states ran at 390, 1080 and 1440.
- **Studio (/studio):** outside this audit.
- **Hotspots on Insights images:** the card, featured and article images centre (`object-position: 50% 50%`) via the Sanity crop. Studio hotspots were checked only for the three case studies, which have none on the image the hero uses.

---

## 4. CLAUDE.md drift

**Where the code differs from CLAUDE.md** (file and line; read in the code, and those marked "seen" also on the page):

- **Links (Performance budget):** "links to other pages are IntentLink". The shared Button (`ui/Button.tsx:84,99`), NextPageLink (`layout/NextPageLink.tsx:36`), the case study back link, tags and next project (`CaseStudyTemplate.tsx:80,142,271`, `NextProject.tsx:12`), the article links (`InsightArticle.tsx:79,103,187`, `ArticleMore.tsx:22,40,70`), the archive pagination, Brand Pulse's follow-up links, the Initiatives breadcrumb and Explore link, and the /about and /partners hero links all use the view transition `Link`. The planner and /contact use plain `next/link`. Seen as S-06.
- **/services:**
  - "Compact hero (~60vh) with full-width image below": the hero is text only, with no image (`ServiceBlocks.tsx:110-149`; seen).
  - "alternating image/text layout": every block is text left, image right (`globals.css:2277`; seen).
  - "Services Unpacked: multi-column capability grid": no such section.
  - "Placeholder state: no text, no labels": the placeholder shows "Project image coming soon" (`ServiceBlocks.tsx:210`).
- **Service detail:**
  - "Compact hero (~50vh)": padding only (`ServiceDetail.tsx:53-55`).
  - "Deliverables: two-column grid": one column of rows with an empty 40% spacer (`service-detail.css:106-114`).
  - "Business Impact … on --bg-shift": it is on Silver Mist (`:114-128`).
  - "Process: two-column grid": it is the accordion (`:153-165`; seen).
  - The section numbering skips (03).
  - The h2's `service-<slug>` view transition name has no partner on /services, so it never morphs.
- **Case study:**
  - "4:3 landscape for case study heroes": it is 16:9 (3:2 on phones) (`case-study.css:50,304`; seen).
  - "~50vh": not set; the image starts 593 to 674 px down on a 900 px screen (seen).
  - The hero wipe runs 1 s, not 0.8 s (`globals.css:2229`).
  - With page blocks, the Business, Challenge, Approach and Result sections are not rendered: (01) Overview, the blocks, then "(02) What we delivered".
  - The next project name's letter spacing has no transition (`case-study.css:243,260`); CLAUDE.md says "ease 0.5s".
- **/about:**
  - "(01) Capabilities, (02) Process, (03) Network, (04) Founder, (05) Stats": it is (02) Process, (03) How we are different, (04) Network, a full width image, (05) Founder and (06) Collaborators (`AboutClient.tsx:146,216,265,311,407`; seen).
  - The founder grid is 1fr 1fr (`about.css:36`); Layer 5 says never 50/50.
- **/contact:** "Contact details grid below form": none; only the email line in the right column (`ContactClient.tsx:291-304`). "No bottom CTA": there is no CTA, but there is a "Next" link to Work (`:308`).
- **/ai:**
  - "How AI Powers the Process (stage list)": no stage list. The page has a comparison table, the argument (dark), proof stats, outcomes, Brand Pulse and a "Studio Guide… Coming soon." teaser.
  - The labels are unnumbered.
  - The CTA's second button is "View our work", not "Plan your project" (`AILabClient.tsx:365-367`).
  - Two dark sections, the maximum.
- **/insights:**
  - "Filter bar (sticky below header)": `.content-filter-sticky` has no `position: sticky` (`insights.css:60-65`; seen, it scrolls away).
  - The empty state uses Accessible Ash; Layer 7 says `--text-muted`, and CLAUDE.md contradicts itself here.
- **/initiatives:**
  - Section labels are the number only, e.g. "(01)" (`InitiativeSection.tsx:24`).
  - The take part band's label is Silver Mist at 50% (`tool-band.css:9,24`); CLAUDE.md says 65% or more for dark section labels. It passes axe (4.6:1).
  - The pages import the homepage's `tool-band.css`, though ToolBand is documented as gone.
- **/partners:** "introduction form with permission checkbox": the form lives on /contact (`?service=introduction`). /partners links to it.
- **Text dimmed by opacity** instead of colour tokens: /about body text 0.7 (`AboutClient.tsx:115,161,181,276,357,364,371`), /careers role text 0.7 and the empty heading 0.6, the article h4s 0.7 (`article.css:170`), the dark CTA sub line 0.7 (`service-detail.css:208`), and planner hints 0.75 (`planner.css:197`). All pass contrast, but the palette has tokens for these.
- **Raw colours:** `rgba(247, 246, 245, 0.65)` in `AILabClient.tsx:226`, and hex in `global-error.tsx:10-12` (deliberate, per its comment).

**What the code does that CLAUDE.md does not say:**

- Most pages end with a "Next" link (NextPageLink) before the dark CTA. CLAUDE.md mentions only that the homepage has none.
- /work: an initiatives note ("About our initiatives.") and a dark CTA ("Have a project in mind?") after the index. The whole section fades in on load with its own CSS animation.
- /services: a planner invite section before the CTA.
- Service pages: "Is this for you?", "(04) Across the GTA", "(Related thinking)", "(06) Related work" and "(07) Questions".
- Case studies: "Planning something similar? Build your brief." and both a next project row and a "Next" link.
- Articles: key takeaways, a Brand Pulse CTA, related work, share buttons, the newsletter and a second back link. Dates are formatted en-US.
- /brand-pulse: `?q=` preselects one answer.
- /contact: a budget menu (S-09) and nomination and partner options in the service menu.
- The 404 page: "(404)", "This page didn't make the final cut.", with "View our work" and "Plan your project".

**Confirmed matching** (measured on the page and read in the code):

- /work (the Living Index): sentence, choices, lists, rows, window, numbering, status line, address handling, phone window and reduced motion behave as specified. View transition names are unique, and a click into a case study morphs `project-<slug>`.
- The services and questions accordion: every answer without JavaScript, collapse only under `html[data-js]`, no shift on hydration (PR 276).
- The Initiatives rows: Explore is the stretched link, named by its visible words plus the tagline (PR 276).
- /about process numbers: Accessible Ash, read with their step (PR 276).
- The planner: no prices anywhere. It ends in "Choose a time for your call" first and "Send my brief" second. `?service` and `?begin=1` open it as described.
- Brand Pulse: result share link, hidden result H1 and `noindex` as specified.
- Header, drawer and footer: as on the homepage report, on every page.
- Rendering per route matches the site map table: ISR 60 s pages, request-rendered /start, /brand-pulse and /contact, and daily /ai, /partners, /privacy and /terms through the founder image fetch.
