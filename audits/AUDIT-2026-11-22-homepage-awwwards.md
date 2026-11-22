# Homepage audit before the Awwwards submission, 22 November 2026

**Date:** 2026-11-22
**Branch:** main at c3d565f (after PR 272)
**Auditor:** Claude Code
**For:** Maninder
**Mode:** read only. No code was changed and nothing was committed.

**What was tested:** the production site, https://studios.houseofsingh.com (reachable from the test machine;
no local build was used). The test machine runs Playwright with Chromium 1243 (headless), Lighthouse 12.8.2
and axe core 4.14.1. The machine's network proxy blocks third party hosts (Google Tag Manager, Clarity,
cal.com, Instagram, LinkedIn, X) and the Sanity API, which shapes a few results; each one says so.

**Scope:** the homepage end to end, the header, the menu drawer, the footer and FooterReveal, the cursor,
Lenis, the view transitions out of the homepage, and every link the homepage sends people to.

Scratch evidence (scripts, raw output, traces and screenshots) is in the session scratchpad under
`hp-audit/` (`out/*.txt`, `lh/*.json`, `shots/*.png`, `trace-scroll-*.json`); it is not committed.

---

## 1. Summary

### Lighthouse (median of three runs each)

| Preset | Performance | Accessibility | Best practices | SEO | FCP | LCP | CLS | TBT | Total bytes | JS bytes | Requests |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Mobile (Moto G, 4x CPU, slow 4G) | 95 (88, 97, 95) | 96 | 96 | 100 | 1.08 s | 2.44 s (2.43, 2.44, 2.51) | 0 | 151 ms (408, 124, 151) | 450 KB | 253 KB | 63 (29 JS) |
| Desktop | 100 | 100 | 96 | 100 | 0.31 s | 0.55 s | 0 | 0 ms | 451 KB | 254 KB | 65 (29 JS) |

- The mobile accessibility 96 comes from one audit, colour contrast, caused by H-01.
- Best practices 96 on both comes only from console errors for the third party scripts this machine's proxy blocks (gtag.js, Clarity). On a normal network they would not appear.
- INP cannot be measured in the lab. TBT stands in for it.
- The LCP element is the hero's first image at every width. It is preloaded (`<link rel=preload as=image imagesrcset…>`), `fetchpriority="high"`, `loading="eager"`, and served as AVIF.

### axe (WCAG 2.0 to 2.2 A and AA), violations by width and state

Nodes are counted after every section had revealed and the page was back at the top.

| Width | Loaded | Selected work choice open | Drawer open | What we do row 02 open |
|---|---|---|---|---|
| 360 | 20 (color-contrast) | 28 (color-contrast) | 0 | 0 |
| 390 | 20 (color-contrast) | 28 (color-contrast) | 0 | 0 |
| 768 | 0 | 0 | 0 | 0 |
| 1080 | 0 | 0 | 0 | 0 |
| 1081 | 0 | 0 | n/a (no drawer) | 0 |
| 1280 | 0 | 0 | n/a | 0 |
| 1440 | 0 | 0 | n/a | 0 |
| 1920 | 0 | 0 | n/a | 0 |

axe cannot see a background painted by a pseudo element, so it misses H-02. That one was measured by hand.

### Findings by group

| Group | Count | IDs |
|---|---|---|
| Blocker | 3 | H-01, H-02, H-03 |
| Should fix | 5 | H-04 to H-08 |
| Polish | 12 | H-09 to H-20 |

### What passed (checked and found as specified)

- **Loading:**
  - Nothing in Selected work, What we do or Proof downloads before intent. The only images fetched without interaction are the hero's.
  - No layout shift at load, during scroll (Proof compact bar, Start sheet wipe), or from font swap (CLS 0).
  - No hydration warnings and no page errors.
  - Scroll stays smooth, with no long animation frames:
    - 1440: average frame 16.7 ms, p95 16.8 ms, one frame over 20 ms;
    - 390: p95 16.7 ms, none over 20 ms.
- **Keyboard and focus:**
  - The walk reaches every control in a sensible order (71 stops at 1440, 56 at 390). There are no traps, and every stop shows an outline. The skip link sits above the header with its own border.
  - The drawer moves focus to the menu button, wraps Tab, and makes the page behind inert. Escape closes it and returns focus.
  - The Selected work choice opens on Enter and closes on Escape, keeping focus.
- **Structure:**
  - The heading outline is one H1 (visually hidden, protected), then an H2 per section with H3s under it. Landmarks are present, and `lang="en-CA"`.
  - Reflow at 320 px and 200% zoom (640 px): no horizontal scroll and no clipped text.
- **Motion:**
  - Reduced motion matches every section's "Reduced motion" line in CLAUDE.md: hero still on "businesses" with no Pause, Selected work without the reveal, header never hides, What we do 0 s, Proof all lit with bands at -0.02em, Start without wipe or draw, drawer a 0.3 s fade.
  - Pause stops both the images and the word.
- **Announcements:**
  - Selected work says "3 projects for food and drink brands. 3 more below."
  - Start says "Brand identity or rebrand, Website added. 1 of 5 answered."
- **What we do preview:** at 1081, 1280, 1440 and 1920, all 14 linked words were hovered from both ends. The preview never left the viewport, never went under the header, and never covered its word.
- **Sticky elements:** these follow the header slide without overlapping it:
  - the Proof side (48 px under the header edge);
  - the phone Selected work window;
  - the phone Proof compact bar;
  - the What we do field.
- **Cursor:** View on the hero image, hidden on touch phones.
- **Hover:** every homepage hover rule is inside `@media (hover: hover)`.
- **View transitions:** names on the homepage are unique. Clicking a Selected work name runs one view transition into the case study's `h1.cs-hero-heading`, which carries the same `project-<slug>` name, with no errors. The hero names none, as specified.
- **Links:** every one of the 33 internal targets answers 200 with no redirect. Placement parameters are right:
  - `/start?begin=1&from=home_start` (with `service=identity,website` once chips are chosen);
  - `/brand-pulse?from=home_start`;
  - `/services/<slug>`, `/work`, `/work?for=<type>`, `/work/<slug>`.
- **Analytics:** every event CLAUDE.md names for the homepage fires once, with the right parameters and `content_group: "home"`. `?hos_debug` sets `debug_mode: true` on the GA config. The events checked:
  - `hero_project_click` (image and caption), `hero_pause_toggle`;
  - `home_wwd_service_open`, `home_wwd_word_click` (desktop and phone), `home_service_click`;
  - `proof_index_click`;
  - `home_start_chip`, `home_start_plan_click`, `discovery_call_click`;
  - `header_cta_click`, `menu_open`.
- **Consent:** in a strict region (simulated) nothing third party loads and no cookie is set before a choice, and the consent card shows.
- **Metadata:**
  - Title: 60 characters. Description: 140 characters. Canonical: `https://studios.houseofsingh.com/`.
  - Complete OG and Twitter tags. The OG image answers 200 (1200 by 630 PNG).
  - The JSON-LD parses, with ProfessionalService/Organization and Person nodes, no dangling `@id`, `foundingDate` "2023" and no `priceRange`.
- **Excluded content:** none of these appears in the visible text, metadata or JSON-LD: a studio price, the founding day or month, the trademark number.

---

## 2. Findings

Each finding gives the section, the widths, what happens, the evidence, the smallest fix, the effort (S, M or
L), and whether it touches a Protected item or an owner decision.

### Blocker

#### H-01. Selected work rests half faded in the first phone screen, below AA contrast

- **Section:** (01) Selected work. **Widths:** 360 and 390 (any phone where the section starts inside the first screen).
- **What happens:**
  - The section uses the site's scroll linked reveal (`.css-reveal`: `animation-timeline: view()`, `animation-range: entry 0% entry 30%`). Its opacity follows its scroll position.
  - On a 390 by 844 phone the section starts at y 732, so on load it rests at opacity 0.50 until the visitor scrolls. The label then measures 2.57:1. With the choice open, the meta line and counts measure 2.83:1 to 3.07:1.
  - Because the animation is tied to scroll, it also fades out again when scrolling back up. CLAUDE.md Layer 3 says "Elements reveal once. Never re-animate."
  - This is the only failing audit in Lighthouse mobile accessibility (96). A jury running Lighthouse on mobile sees it.
- **Evidence:**
  - axe: 20 nodes at 360 and 390, and 28 with the choice open. Examples: `.hw-head > .editorial-label` #9c9b98 on #f7f6f5, 2.57:1; `li[data-slug="christmas-carnival"] > .wi-meta > span` 3.07:1.
  - Computed opacity 0.501 at load: `.hw-section` with `animation-timeline: view()`.
  - Code: `src/app/globals.css:1680-1685`, `src/components/homepage/SelectedWorkSection.tsx:22`.
  - Screenshot: `shots/H-01-selected-work-faded-390.png`.
- **Smallest fix:** give `.hw-section` a time based, play once reveal (IntersectionObserver adds `.in-view` once, as the fallback block already does), not the scroll linked one. Alternatively, take `css-reveal` off this section on phones.
- **Effort:** S. **Protected or owner decision:** no.

#### H-02. The What we do row number fails contrast on its hover and focus ground

- **Section:** (02) What we do, desktop lighting. **Widths:** 1081 and up (hover, or keyboard focus on a row).
- **What happens:** the row pointed at or focused takes the Cloudy White ground (#E5E3E0, painted by `::before`). Its 11 px number ("02") stays Accessible Ash #716F6C: 3.91:1, under 4.5:1. CLAUDE.md's own rule says small text on Cloudy White uses Gunmetal (`.surface-cloudy`). The count and the name are Obsidian and pass.
- **Evidence:**
  - Computed `.wwd-num` colour rgb(113, 111, 108) at 11px.
  - The row's `::before` background is rgb(229, 227, 224).
  - Screenshot: `shots/H-02-wwd-hover-number-1440.png`.
  - axe reports 0, because it cannot read pseudo element backgrounds.
  - Styles in `src/components/homepage/what-we-do/wwd.css`.
- **Smallest fix:** inside the lit row, set `--text-label: var(--text-secondary)`, as `.surface-cloudy` does. Alternatively, darken the number to Obsidian on hover and focus ("Hovers that darken a label go from Accessible Ash to Obsidian").
- **Effort:** S. **Protected or owner decision:** it applies the protected Accessible Ash rule; it does not change it.

#### H-03. The hero's first image is upscaled and crops the client's name (content)

- **Section:** Hero. **Widths:** all; worst on retina desktop.
- **What happens:** the first hero image (The Floreans) has a 1344 by 752 source. It fills a portrait-ish frame with `object-fit: cover`, so it is upscaled:
  - 778 by 828 at 1440, so 2.2x at 2x density;
  - 1037 by 1008 at 1920, so 2.7x at 2x density;
  - 1.7x at 390 on a 3x phone.
- **The result:** the first thing a juror sees is soft. The cover crop also cuts the menu's name to "E FLOREANS" at 1440 and on phones. This is the LCP image and the opening frame of the submission.
- **Evidence:**
  - The source size is in the Sanity URL (`240ebf8d…-1344x752.jpg`).
  - Frame sizes measured in the page.
  - Screenshot: `shots/H-03-hero-crop-1440.png` (also visible in the phone screenshot for H-01).
- **Smallest fix (Studio only, no code):** upload a hero image at least 2400 px on its short side, or a portrait crop, and set the hotspot so the name stays in frame. Check the other hero projects the same way.
- **Effort:** S. **Protected or owner decision:** no (content).

### Should fix

#### H-04. Without JavaScript, Selected work never appears in browsers without scroll timelines

- **Section:** (01) Selected work. **Widths:** all.
- **What happens:** where `animation-timeline: view()` is not supported (Firefox by default, and Safari without scroll driven animations), the fallback starts `.css-reveal` at `opacity: 0`, and only JavaScript (ScrollObserver) adds `.in-view`. With JavaScript off or failed, the section with its six case study links stays invisible. In Chromium without JavaScript it reveals on scroll, which was confirmed: all six links appear.
- **Evidence:** `src/app/globals.css:2185-2195` and `:2222`; no JS run at 1440, before and after scrolling to the section.
- **Smallest fix:** scope the hidden start state to a class the page sets only when JavaScript runs (for example `html.js .css-reveal`). H-01's fix, if it moves this section off `css-reveal`, covers it too.
- **Effort:** S. **Protected or owner decision:** no.

#### H-05. Without JavaScript, three of the four services cannot be read in full

- **Section:** (02) What we do. **Widths:** all.
- **What happens:**
  - Only the first row's panel is open in the server HTML. Rows 02 to 04 are closed, and their buttons need JavaScript, so without it their taglines and descriptions cannot be read. On phones the same goes for their disciplines, since there is no keyword field there.
  - The brief asks that all four services read completely without JavaScript.
  - The service names, the desktop field's thirty words, all four promises and quotes, the Start sheet and the six Selected work links (H-04 aside) do read.
- **Evidence:** no JS run: four rows visible, panels with text "1/4"; field words 30 on desktop, 0 on phones.
- **Smallest fix:** render every panel open in the server HTML and close rows 02 to 04 on hydration, before the section can be seen. Alternatively, use `<details>` and `<summary>` for the rows.
- **Effort:** M. **Protected or owner decision:** no.

#### H-06. The hero word and caption can change before their image

- **Section:** Hero. **Widths:** all.
- **What happens:** the word and the caption come from the rotation index straight away. The image only switches once the new image has loaded. On a slow connection the line can read "events" while the previous project's image still shows. CLAUDE.md says the word follows the image ("while a project's image shows").
- **Evidence:**
  - `src/components/homepage/HeroInteractive.tsx:60-62`: `word` and `entry` from `rotation.index`.
  - `src/components/homepage/HeroImages.tsx:37`: `shown` only follows `current` once it has loaded.
  - Not reproduced on this fast network; found by reading the code.
- **Smallest fix:** drive the word and the caption from the slide actually shown. Lift `shown` out of `useSlides`, or have `onLoad` advance the shared index.
- **Effort:** S. **Protected or owner decision:** no.

#### H-07. About 175 KB is prefetched before intent, and 24 console warnings result

- **Section:** shared (header, footer, hero link). **Widths:** all.
- **What happens:**
  - On load, with no interaction, Next.js prefetches nine routes' data (RSC payloads, about 125 KB, the homepage's own twice: 4.6 KB and 15.0 KB).
  - It also fetches those routes' JavaScript, about 48 KB gzipped. This includes the Brand Pulse question content (`2pyav-7atbg1l.js`, 16.7 KB gzipped) and route CSS.
  - At 1440 the CSS preloads produce 24 console warnings ("preloaded using link preload but not used within a few seconds"), which a juror opening DevTools sees.
- **Evidence:** request log at 1440 and 390 (`out/load.txt`). The prefetched routes are /services, /work, /ai, /about, /insights, /contact, /start, /work/<hero slug> and /.
- **Smallest fix:** `prefetch={false}` on the header, drawer and footer links, so they prefetch on hover or touch instead. Keep viewport prefetch for the hero and Selected work links if wanted.
- **Effort:** S. **Protected or owner decision:** no.

#### H-08. Phone tap targets under 44 px

- **Section:** across the page. **Widths:** 360 and 390.
- **What happens:** 25 controls at 360 (26 at 390) are under 44 px in one dimension. All pass WCAG 2.5.8 AA: they are 24 px or more, or spaced, and tapping the footer legal links lands correctly. The brief asks for 44 px on phones. The main ones:
  - hero Pause, 30 by 30;
  - "View project", 78 by 20;
  - "All work (08)", 80 by 20;
  - Selected work names, 35 to 38 px tall;
  - What we do phone words, 32 px tall;
  - Start door links, 43 px;
  - footer legal links, 17 px tall.
- **Evidence:** tap target scan at 360 and 390 (`out/a11y2.txt`).
- **Smallest fix:** padding or a `::before` hit area to 44 px on Pause, "View project", "All work", the phone words and the legal links.
- **Effort:** S. **Protected or owner decision:** no.

### Polish

#### H-09. Mobile LCP sits just under the "good" line

- **Section:** Hero. **Widths:** mobile preset.
- **What happens:** median LCP is 2.44 s, and one run of three reached 2.51 s. Lighthouse puts 51% of it in "load delay" under its simulated network, though the image is preloaded at high priority and requested first.
- **Evidence:** `lh/mobile-*.json`.
- **Smallest fix:** none required. Margin could come from H-07 (less early traffic competing) and H-18 (less JS).
- **Effort:** S. **Protected or owner decision:** no.

#### H-10. On phones the hero word jumps between lines

- **Section:** Hero value line. **Widths:** 360 and 390.
- **What happens:** the three reserved lines keep the box height (105 px), but "businesses" wraps to line three while "events" fits at the end of line two. Each change records a layout shift of 0.021 to 0.025 on `hero-value-w` and `hero-value-i`. CLS stays well inside "good". CLAUDE.md says no word length moves anything.
- **Evidence:** layout shift entries at 5.3 s and 10.3 s (`out/craft2.txt`).
- **Smallest fix:** on phones, break before the word so it always starts its own line.
- **Effort:** S. **Protected or owner decision:** no.

#### H-11. The hero image link reads "View the The Floreans project"

- **Section:** Hero. **Widths:** all.
- **What happens:** the link is named "View the <name> project", which doubles the article for names starting with "The".
- **Evidence:** `src/components/homepage/HeroImages.tsx:76`; keyboard walk, stop 8.
- **Smallest fix:** "View project: <name>", or "<name>, view project".
- **Effort:** S. **Protected or owner decision:** no.

#### H-12. The cursor ring sits in the top left corner until the mouse moves

- **Section:** shared cursor. **Widths:** desktop.
- **What happens:** before any pointer movement (keyboard users, or a mouse resting off the page) the ring renders at -18, -18 at opacity 0.4, a partial circle over the header corner.
- **Evidence:** `shots/focus-skip-1440.png`.
- **Smallest fix:** keep the ring hidden until the first `pointermove`.
- **Effort:** S. **Protected or owner decision:** no.

#### H-13. The Pause button both changes its label and sets aria-pressed

- **Section:** Hero. **Widths:** all.
- **What happens:** after a press it reads "Play the animation, toggle button, pressed", a mixed signal. Use either a fixed name with `aria-pressed`, or a changing name without it.
- **Evidence:** aria-label changes from "Pause the animation" to "Play the animation", with `aria-pressed="true"`.
- **Smallest fix:** keep "Pause the animation" with `aria-pressed`.
- **Effort:** S. **Protected or owner decision:** CLAUDE.md specifies both; the owner's call.

#### H-14. Controls that need JavaScript still show without it

- **Section:** Hero, header, Selected work, Start. **Widths:** all.
- **What happens:** without JavaScript, Pause, the phone menu button, the Selected work choice and the Start chips render but do nothing. The footer still gives navigation.
- **Evidence:** no JS runs and screenshots (`shots/nojs-*.png`).
- **Smallest fix:** hide those controls until hydration (the same class as H-04).
- **Effort:** S. **Protected or owner decision:** no.

#### H-15. "<Service name> in detail" wipes its underline the wrong way

- **Section:** (02) What we do. **Widths:** all with hover.
- **What happens:** the underline shows at rest and wipes out on hover. The site's text link pattern (CLAUDE.md Layer 4) is hidden at rest and wiped in on hover.
- **Evidence:** `src/components/homepage/what-we-do/wwd.css:341-357`; screenshot `shots/H-02-wwd-hover-number-1440.png`, where the link is underlined at rest.
- **Smallest fix:** start at `scaleX(0)` with origin right, and go to `scaleX(1)` with origin left on hover. Alternatively, record the inverse as intended.
- **Effort:** S. **Protected or owner decision:** no.

#### H-16. Drawer links dim by opacity on hover

- **Section:** menu drawer. **Widths:** 1080 and below with a mouse.
- **What happens:** hovered drawer links fade to opacity 0.6. Navigation links are specified with the underline wipe, and the site dims with colour, never opacity.
- **Evidence:** `src/app/globals.css:1969-1972`.
- **Smallest fix:** the underline wipe, or a colour change to Accessible Ash.
- **Effort:** S. **Protected or owner decision:** no.

#### H-17. "Privacy Policy" is in Title Case

- **Section:** footer. **Widths:** all.
- **What happens:** the sentence case rule (22 Nov 2026) covers every link label. The guard test does not list this one.
- **Evidence:** footer legal links (keyboard walk stop 67).
- **Smallest fix:** "Privacy policy", and add it to the guard list.
- **Effort:** S. **Protected or owner decision:** it is legal page naming; confirm with the owner.

#### H-18. Legacy polyfills and unused JavaScript

- **Section:** shared bundle. **Widths:** all.
- **What happens:**
  - `3rrt_qpjch6td.js` carries polyfills for `Array.prototype.at`, `Object.fromEntries`, `flatMap` and `trimEnd`; Lighthouse estimates 14 KiB of savings.
  - 21 KiB of the React DOM chunk is unused on this page.
- **Evidence:** Lighthouse `legacy-javascript` and `unused-javascript`.
- **Smallest fix:** a modern `browserslist`, so Next.js drops the polyfills.
- **Effort:** S. **Protected or owner decision:** no.
- **The five largest JS chunks (gzipped), for reference:**
  1. `16n9e3l83wsh1.js`, 65.3 KB: React DOM and the Next.js client.
  2. `17-6of0mqqu89.js`, 44.4 KB: the Next.js app router.
  3. `2pyav-7atbg1l.js`, 16.7 KB: Brand Pulse question content, prefetched (H-07).
  4. `0_usg5ou1b_-5.js`, 12.1 KB: the Selected work index.
  5. `43234mam2826h.js`, 10.0 KB: the shared shell (drawer, consent, analytics loaders, Lenis wiring, Toronto time).

#### H-19. Selected work is the only section without an accessible name

- **Section:** (01) Selected work. **Widths:** all.
- **What happens:** What we do, Proof and Start are named regions (labelled by their h2). Selected work is a plain section, so it is missing from the landmark list.
- **Evidence:** landmark list (`out/kb.txt`).
- **Smallest fix:** `aria-labelledby` pointing at its h2.
- **Effort:** S. **Protected or owner decision:** no.

#### H-20. Leftovers from the removed sections, and stale notes

- **Section:** code health. **Widths:** none.
- **What happens:** nothing that only served a removed section is still imported, and no homepage stylesheet has an unused class. What is left:
  - `src/lib/use-count-up.ts`: the `sessionKey` option and the `finishedRuns` set (lines 15, 25, 35, 39, 52, 84 and 96), and the per number `duration` array (line 19), served only the old Proof counters. The header comment (line 2) still names the homepage.
  - `src/components/ScrollObserver.tsx:49-52` still watches `.cta-section-mobile` children, and no CSS uses the class it adds.
  - `heroField` is still queried and mapped (`src/lib/sanity/projects.ts:95, 525, 569`). The site does not read it; CLAUDE.md says the Studio field is kept for later. Leave the field, and stop fetching it only if wanted.
  - `docs/analytics/debug-checklist.md:36, 49` still lists `tool_band_click`. It has no rows for:
    - `home_start_chip` and `home_start_plan_click`;
    - `home_wwd_service_open`, `home_wwd_word_click` and `home_service_click`;
    - `proof_index_click`.
  - Stale comments:
    - `home-work.css:108` mentions "homepage.css";
    - `what-we-do.ts:2` mentions `what-we-do-data.ts`, which does not exist;
    - `globals.css:1501` is headed "Homepage CTA Dark Section", though its rules serve AI Lab and service pages;
    - `globals.css:1082-1083` refers to `.svc-mob-plus`;
    - `globals.css:1741` says "wordmark artwork".
  - Exports used only by tests or only in their own file: `totalDisciplines`, `rankWorkProjects`, `PROOF_PROMISES`, `codedQuote`, `publishedId`, `QUESTION_TOTAL`, `homeSelection` and others; the types `PreviewPlace`, `WwdImageDoc`, `ProofPromise`, `ProofQuote` and `IndexImage`.
  - knip reports only the five protected `src/lib/analytics.ts` exports, and no unused dependencies.
- **Smallest fix:** delete the dead options and the observer branch, update the comments and the checklist. Drop `export` where nothing imports.
- **Effort:** S. **Protected or owner decision:** the analytics helper exports are protected and stay.

---

## 3. Not checked

- **INP in the field:** no access to real user data (Speed Insights, CrUX). TBT is reported instead.
- **External link targets:** cal.com (DISCOVERY_CALL_URL) and the Instagram, LinkedIn and X profiles in the footer. The test machine's proxy blocks those hosts. They are `target=_blank rel="noopener noreferrer"`.
- **Analytics delivery to Google and Clarity:** gtag.js and the Clarity tag are blocked here, so the events were read from `window.dataLayer`, not from the network.
- **A real strict region:** simulated by answering `/api/consent-region` with `strict: true`. Vercel's location headers cannot be set from outside.
- **Real device rendering:** headless Chromium only. The frame timings and traces are indicative; nothing ran on a real GPU or under trackpad momentum with Lenis.
- **Safari and Firefox:** only Chromium is installed. H-04 is inferred from the CSS, not observed in those browsers. View transitions and the scroll timeline fallback were not exercised there.
- **Screen reader listening:** NVDA, VoiceOver and TalkBack were not run. Names, roles, states and live regions were checked in the DOM.
- **Whether a view transition "jumps":** the mechanics were verified (one transition, a matching name, no errors), not the visual feel.
- **JSON-LD:** validated structurally only (parse, `@context`, `@id` references). Google's Rich Results test is not reachable from here.
- **Lighthouse at all eight widths:** Lighthouse ran with its mobile and desktop presets. axe and every Playwright check covered the widths listed.

## 4. CLAUDE.md drift

**Where the code differs from CLAUDE.md** (file and line; read in the code, and the first three also seen on the page):

1. **"Elements reveal once. Never re-animate." (Layer 3).** `.css-reveal` is scroll linked and reverses on scroll up (`globals.css:1680-1685`). See H-01.
2. **"The word follows the image."** The word and caption follow the rotation index (H-06).
3. **Text links "underline wipe scaleX(0) to 1".** The What we do detail link is inverted (H-15).
4. **Navigation links "same underline wipe".** The drawer links use opacity 0.6 (H-16).
5. **"Accordion sections: all content visible by default" (Mobile strategy).** The homepage section says the first row is open, one at a time, and the code follows that. CLAUDE.md contradicts itself; one line should go.
6. **"Fewer than six when fewer are featured".** With none featured, the whole section returns null (`SelectedWorkSection.tsx:20`), leaving (02) to (04) numbered without (01). Not described.
7. **The hero entrance is not described.**
   - Image wipe 1.1 s, where the easing table says image clip reveals take 0.8 s (`hero.css:358-359`).
   - From the bottom on phones (`hero.css:377-381`).
   - Value line from 0.5 s, 70 ms per line, 0.9 s each (`hero.css:362-365`, `HeroLine.tsx:17`).
   - Label at 0.3 s, caption at 0.9 s (`hero.css:367-373`).
8. **Two hero easings are not in the easing reference:** cubic-bezier(0.45, 0, 0.25, 1) for the crossfade (`hero.css:59`), and cubic-bezier(0.55, 0, 0.75, 0) for the word leaving (`hero.css:233, 237`).
9. **Hero word timing.** The letters wait 240 ms and the band 290 ms before coming in (`hero.css:242, 246, 251`). CLAUDE.md says "as the new image fades in".
10. **Proof caption "Name, Role".** Sanity testimonials add the company: "Name, Role, Company" (`proof.ts:68`).
11. **Labels are 11 px.** The footer column headings are 10 px (`globals.css:593`). The footer also hard codes #F7F6F5 and an rgba hover colour instead of tokens (`globals.css:578, 609`).
12. **Selected work names "44px".** On phones they are clamp(28px, 8vw, 44px), measured 31.2 px at 390 (`home-work.css:93-95`). The closing row stacks there too.
13. **What we do phone rows "the same rows".**
    - The name is 24/32, not 25/32, with 20 px padding, not 24 px (`wwd.css:457-469`).
    - The tagline is 16/24 Gunmetal, not 20/28 (`wwd.css:478-482`).
14. **What we do lighting.** The field words' colour change is also staggered 12 ms apart, not only the bands (`wwd.css:105-107`).
15. **Proof chapter "40px padding" and "24px padding".** These are top padding only (`proof.css:120, 211`).

**What the code does that CLAUDE.md does not say:**

- The drawer prints the time zone abbreviation after the time (`TorontoTime.tsx:31`).
- The Start sheet shows the planner's helper line under question 01, and its entrance fires at 15% visibility (`StartSheet.tsx:36, 51`).
- The homepage Selected work has its own aria-live status, which reads "6 projects." at rest (`HomeWorkIndex.tsx:92-94`); CLAUDE.md mentions the status only for /work.
- The hero image link has an aria-label (`HeroImages.tsx:76`, see H-11).

**Confirmed matching** (measured on the page at 1440, 1280, 1081, 1080 and 390, and read in the code):

- **Header:** 72 and 56 px bar, the 400 px and 8 px hide rules, 0.35 s slide, z-index 130, 121 and 120.
- **Drawer:** the menu icon morph timings, 85vw up to 420 px, 0.55 s slide and 0.45 s scrim, link stagger from 0.16 s at 50 ms, Toronto time refreshed every 15 s.
- **Hero:**
  - label 64 px under the header;
  - 5 s hold, 1.2 s and 1.4 s crossfade, 240 ms/12 ms and 600 ms/25 ms letters, 700 ms band;
  - quality 60 from a quality 90 source, the sizes attribute, the first image preloaded.
- **Selected work:** h2 46 px (32 px at 1080 and below), names 44 px on desktop.
- **What we do:**
  - h2 48/56 on one line from 1280 and two lines at 1081;
  - rows 25/32;
  - label to last row 760 px at 1440 by 900 (spec: about 762);
  - the 300 by 220 preview with 24 px gaps, the 150 ms leave delay.
- **Proof:**
  - 160 and 96 px padding;
  - promises 31/40 and 24/32;
  - the 55% line with root margin `0px 0px -45% 0px`;
  - the side panel 48 px under the header edge.
- **Start:**
  - padding 160/140 and 72/80, h2 52 and 34 px;
  - the chip rules;
  - the URLs with `from=home_start`;
  - `home_start_chip` and `home_start_plan_click`.
