# BRANCH STATUS REPORT — claude/run-tests-WxtWY

Generated: 2026-03-26

---

## 1. Branch State

| Metric | Value |
|--------|-------|
| Current branch | `claude/run-tests-WxtWY` |
| Commits ahead of `origin/main` | **39** |
| Commits `main` is ahead | **0** |
| Uncommitted changes | None |
| Remote tracking | `origin/claude/run-tests-WxtWY` (up to date) |

### Recent Commits (most recent first)

| Hash | Message |
|------|---------|
| c97bbc3 | Global mobile optimization audit — hover, accordion, cursor, reveal fixes |
| 4fedbaa | Refine View Transitions API to V2 directional page-turn spec |
| 9b2522b | Implement V2 navigation overlay system |
| 2540bc0 | Polish /about page UI/UX to Design System V2 interaction vocabulary |
| ff35de2 | Redesign /insights listing page and article template to Design System V2 |
| 6302ed3 | Redesign /work portfolio page to Design System V2 interaction vocabulary |
| e8b1b90 | Apply Design System V2 interaction system across all homepage sections |
| 8fd6bb2 | Services overview: redesign hero, add unpacked accordion, confident CTA |
| e3137b0 | Case study pages: 9-section editorial template with structured pitch flow |
| 4887e68 | Service detail pages: editorial redesign with 7-section pitch flow |
| 09e1c79 | Services: sticky scroll theater with pinned text and scrolling images |
| b84b014 | Full site stability: Safari fixes, orphaned code cleanup, all pages verified |
| ae3b476 | AI page: editorial rebuild with comparison table, citations, proof bar, brand pulse mockup |
| c597404 | Service detail pages: situation-based content, editorial layout, dead code cleanup |
| 2915a14 | Services: fix page padding and layout to match existing site structure |

### Other Local Branches

| Branch | Status |
|--------|--------|
| `claude/house-of-singh-website-CRssj` | Abandoned — 18 commits ahead of main, diverged from WxtWY. Do NOT use. |
| `master` | Stale local copy of main |

---

## 2. Build Status

| Check | Result |
|-------|--------|
| `npm install` | PASS |
| TypeScript compilation | PASS — zero errors |
| `npm run build` | PASS (compilation + static generation) |
| Build failure | `/careers` page only — Sanity API network timeout (pre-existing, not a code issue) |
| Build warnings | None |

All pages except `/careers` (Sanity CMS dependency) compile and generate correctly.

---

## 3. File Inventory

### Full Source Tree (80 files)

```
src/app/
  about/page.tsx
  ai/page.tsx
  api/brand-pulse/route.ts
  api/careers/route.ts
  api/lead/route.ts
  api/subscribe/route.ts
  careers/page.tsx
  contact/page.tsx
  globals.css
  insights/[slug]/page.tsx
  insights/page.tsx
  layout.tsx
  packages/page.tsx
  page.tsx
  services/[slug]/page.tsx
  services/page.tsx
  studio/[[...tool]]/layout.tsx
  studio/[[...tool]]/page.tsx
  work/[slug]/page.tsx
  work/page.tsx

src/components/
  CustomCursor.tsx
  DiagnosticTrigger.tsx
  PageTransition.tsx
  ScrollObserver.tsx
  ServiceRows.tsx
  SliderDiagnostic.tsx
  SmoothScroll.tsx
  about/AboutClient.tsx
  ai/AILabClient.tsx
  careers/CareersClient.tsx
  casestudy/CaseStudyTemplate.tsx
  casestudy/DeliverableGrid.tsx
  casestudy/ImageGallery.tsx
  casestudy/NextProject.tsx
  casestudy/OverviewMeta.tsx
  contact/ContactClient.tsx
  homepage/AboutPreview.tsx
  homepage/ArgumentSection.tsx
  homepage/ClientsSection.tsx
  homepage/CtaSection.tsx
  homepage/HeroSection.tsx
  homepage/ServicesSection.tsx
  homepage/StatsSection.tsx
  homepage/TestimonialsSection.tsx
  homepage/WorkSection.tsx
  insights/InsightArticleClient.tsx
  insights/InsightsClient.tsx
  layout/Footer.tsx
  layout/FooterCities.tsx
  layout/FooterNextPage.tsx
  layout/Header.tsx
  layout/NavigationOverlay.tsx
  layout/SubscribeForm.tsx
  packages/PackagesClient.tsx
  services/ServiceDeliverableRow.tsx
  services/ServiceDetailAccordion.tsx
  services/ServiceDetailClient.tsx
  services/ServiceImageCard.tsx
  services/ServiceScrollSection.tsx
  services/ServicesUnpackedAccordion.tsx
  ui/Button.tsx
  ui/Container.tsx
  ui/Divider.tsx
  ui/EditorialLabel.tsx
  ui/SectionWrapper.tsx
  ui/TextReveal.tsx
  ui/index.ts
  work/CaseStudyClient.tsx
  work/WorkPageClient.tsx

src/data/
  projectDetails.ts
  projects.ts
  services.ts

src/lib/
  config.ts
  constants/homepage-data.ts
  hooks/useScrollProgress.ts
  read-time.ts
  sanity/client.ts
  sanity/image.ts
  sanity/queries.ts
  scroll-fallback.ts

src/styles/
  scroll-animations.css
```

### Key Component Existence Check

| Component | Status |
|-----------|--------|
| `src/components/layout/NavigationOverlay.tsx` | EXISTS |
| `src/components/services/ServiceScrollSection.tsx` | EXISTS |
| `src/components/services/ServicesUnpackedAccordion.tsx` | EXISTS |
| `src/components/services/ServiceDetailClient.tsx` | EXISTS |
| `src/components/services/ServiceDetailAccordion.tsx` | EXISTS |
| `src/components/casestudy/CaseStudyTemplate.tsx` | EXISTS |
| `src/components/casestudy/DeliverableGrid.tsx` | EXISTS |
| `src/components/casestudy/ImageGallery.tsx` | EXISTS |
| `src/components/casestudy/NextProject.tsx` | EXISTS |
| `src/components/casestudy/OverviewMeta.tsx` | EXISTS |
| `src/components/work/WorkPageClient.tsx` | EXISTS |
| `src/components/work/CaseStudyClient.tsx` | EXISTS |
| `src/data/projectDetails.ts` | EXISTS |
| `src/data/services.ts` | EXISTS — Full ServiceData interface with deliverables, process, relatedWork |

### Orphaned Files (not imported elsewhere)

| File | Notes |
|------|-------|
| `src/components/layout/FooterCities.tsx` | Old large clock timezone — replaced by compact inline in Footer.tsx |
| `src/components/layout/FooterNextPage.tsx` | Old stub — logic now lives directly in Footer.tsx |
| `src/components/layout/SubscribeForm.tsx` | Newsletter form — not used on any page |
| `src/components/ServiceRows.tsx` | Old services pattern — replaced by ServiceScrollSection |
| `src/components/DiagnosticTrigger.tsx` | Still imported by services/page.tsx (line 87) — candidate for removal |
| `src/components/SliderDiagnostic.tsx` | Imported by DiagnosticTrigger — may be repurposed for Brand Pulse |

---

## 4. Page Route Status

| Route | File | Status | Key Imports |
|-------|------|--------|-------------|
| `/` | `src/app/page.tsx` | EXISTS | HeroSection, WorkSection, ArgumentSection, ServicesSection, AboutPreview, ClientsSection, TestimonialsSection, StatsSection, CtaSection |
| `/services` | `src/app/services/page.tsx` | EXISTS | DiagnosticTrigger, ServiceScrollSection, ServicesUnpackedAccordion, Button, services data |
| `/services/[slug]` | `src/app/services/[slug]/page.tsx` | EXISTS | services data, getServiceBySlug, ServiceDetailClient |
| `/work` | `src/app/work/page.tsx` | EXISTS | WorkPageClient |
| `/work/[slug]` | `src/app/work/[slug]/page.tsx` | EXISTS | projects data, getProjectBySlug, CaseStudyClient |
| `/about` | `src/app/about/page.tsx` | EXISTS | AboutClient |
| `/ai` | `src/app/ai/page.tsx` | EXISTS | AILabClient |
| `/contact` | `src/app/contact/page.tsx` | EXISTS | ContactClient |
| `/packages` | `src/app/packages/page.tsx` | EXISTS | PackagesClient |
| `/insights` | `src/app/insights/page.tsx` | EXISTS | getAllPosts (Sanity), InsightsClient |
| `/insights/[slug]` | `src/app/insights/[slug]/page.tsx` | EXISTS | getPostBySlug (Sanity), InsightArticleClient |
| `/careers` | `src/app/careers/page.tsx` | EXISTS | getAllRoles (Sanity), CareersClient |
| `/studio` | `src/app/studio/[[...tool]]/page.tsx` | EXISTS | Sanity Studio admin panel |

---

## 5. Key Feature Checklist

### Navigation

| Feature | Status | Notes |
|---------|--------|-------|
| Navigation overlay (Menu+/Close) | PRESENT | Header.tsx imports NavigationOverlay.tsx |
| Header shrink on scroll | PRESENT | 64px → 48px at 100px scroll |
| Header hide on scroll down | PRESENT | translateY(-100%) after 400px |
| Crest → wordmark transition | PRESENT | Crest fades out, wordmark fades in |
| Desktop nav links (Services, Work, AI Lab, Insights, Contact) | PRESENT | Correct labels, correct hrefs |
| Mobile: wordmark + Menu+ only | PRESENT | Desktop nav hidden below 899px |

### Services Page (`/services`)

| Feature | Status | Notes |
|---------|--------|-------|
| Typography-only hero (no studio image) | PRESENT | Clean text hero with editorial label |
| Sticky scroll theater (ServiceScrollSection) | PRESENT | Pinned text left, scrolling images right |
| Services Unpacked accordion | PRESENT | ServicesUnpackedAccordion component |
| CTA: "Ready to see which service fits your business?" | PRESENT | Correct copy confirmed |
| DiagnosticTrigger still imported | ISSUE | Line 87 — `<DiagnosticTrigger />` still rendered in hero |

### Service Detail Pages (`/services/[slug]`)

| Feature | Status | Notes |
|---------|--------|-------|
| ServiceDetailClient template | PRESENT | Shared across all 4 services |
| Hero section | PRESENT | ~50vh with viewTransitionName |
| Deliverables grid | PRESENT | ServiceDeliverableRow component |
| Business impact section | PRESENT | Asymmetric layout |
| Process steps (accordion) | PRESENT | ServiceDetailAccordion component |
| Related work | PRESENT | ServiceImageCard component |
| Dark CTA | PRESENT | Consistent across all service pages |

### Case Study Pages (`/work/[slug]`)

| Feature | Status | Notes |
|---------|--------|-------|
| CaseStudyClient + CaseStudyTemplate | PRESENT | Full 9-section architecture |
| Hero + full-width image | PRESENT | With clip-path reveal |
| Overview metadata | PRESENT | OverviewMeta component |
| Challenge/Approach | PRESENT | Two-column layout |
| Deliverables grid | PRESENT | DeliverableGrid component |
| Image gallery | PRESENT | ImageGallery component |
| Next project navigation | PRESENT | NextProject component |
| Dark CTA | PRESENT | Consistent |

### Work Page (`/work`)

| Feature | Status | Notes |
|---------|--------|-------|
| List/Grid toggle | PRESENT | In WorkPageClient |
| Filter bar | PRESENT | Horizontal pill buttons |
| Superscript project count | PRESENT | In heading |
| Hover effects on rows/cards | PRESENT | Background shift, image scale |

### Homepage

| Feature | Status | Notes |
|---------|--------|-------|
| 9 sections in correct order | PRESENT | Hero → Work → Argument → Services → About → Clients → Testimonials → Stats → CTA |
| Stagger reveal system | PRESENT | css-reveal + stagger delays |
| Clip-path reveals on images | PRESENT | .reveal-clip class |
| Counter animation on stats | PRESENT | IntersectionObserver-triggered |

### Footer

| Feature | Status | Notes |
|---------|--------|-------|
| Compact timezone (EST/IST/GMT labels) | PRESENT | No large clocks |
| Year 2026 | PRESENT | Correct |
| Top ↑ button | PRESENT | Smooth scroll to top |
| Instagram/LinkedIn links | REMOVED | No social media links in footer |

### About Page

| Feature | Status | Notes |
|---------|--------|-------|
| Capabilities tabs | PRESENT | Interactive tab switching |
| Founder section | PRESENT | Photo + bio |
| Process steps with ghost numbers | PRESENT | Numbered phases |
| Stats with counters | PRESENT | Animated on scroll |

### CSS & Interactions

| Feature | Status | Notes |
|---------|--------|-------|
| .reveal-clip with clip-path animation | PRESENT | In @supports (animation-timeline: view()) |
| @supports fallback (IntersectionObserver) | PRESENT | For Safari/Firefox |
| Mobile .reveal-clip fallback (fade-up) | PRESENT | clip-path: none on ≤767px |
| View Transition keyframes | PRESENT | Directional fade (translateY -12px/+16px) |
| Button sweep hovers | PRESENT | Wrapped in @media(hover: hover) |
| Accordion hover effects | PRESENT | Letter-spacing, background shift |
| border-radius: 0 globally | PRESENT | `*,*::before,*::after { border-radius: 0 !important }` |
| All hovers in @media(hover: hover) | PRESENT | Applied in mobile optimization commit |
| Accordions auto-expand on mobile | PRESENT | ServicesUnpackedAccordion, ServiceDetailAccordion, ClientsSection |

### API & Integrations

| Endpoint | Status | Purpose |
|----------|--------|---------|
| `/api/lead` | EXISTS | Contact form → N8N webhook |
| `/api/brand-pulse` | EXISTS | Brand assessment → Claude API + N8N |
| `/api/careers` | EXISTS | Job applications → N8N webhook |
| `/api/subscribe` | EXISTS | Newsletter → N8N webhook |

### Data Architecture

| Source | Pages |
|--------|-------|
| Static (`src/data/`) | Services, Work/Case Studies, Homepage, About, AI, Contact, Packages |
| Sanity CMS | Insights (blog), Careers (job postings) |

---

## 6. Issues Found

### Must Fix

1. **DiagnosticTrigger still in services page** — `src/app/services/page.tsx` line 87 renders `<DiagnosticTrigger />` in the hero. This component is a holdover from the slider diagnostic era and should be removed from the services page.

2. **Orphaned component files** — 4 files are not imported anywhere and should be deleted:
   - `src/components/layout/FooterCities.tsx`
   - `src/components/layout/FooterNextPage.tsx`
   - `src/components/layout/SubscribeForm.tsx`
   - `src/components/ServiceRows.tsx`

3. ~~**Duplicate View Transition definitions**~~ — **RESOLVED 2026-04-28** (commits `a702f05..919fd6c`). The duplicate was eliminated during the V2 globals.css rewrite. Current file contains one `::view-transition-old(root)`, one `::view-transition-new(root)`, and one `::view-transition-group(*)` wildcard. Visual verification completed in Chrome confirms all morphs (service titles, project titles, project images, site logo) fire correctly. The View Transitions API is Chromium only by design.

### Should Fix

4. ~~**framer-motion in package.json**~~ — **RESOLVED 2026-04-28**. Dependency removed via `npm uninstall framer-motion`.

5. **`/careers` page build failure** — Fails during static generation due to Sanity API network timeout. Not a code issue but blocks full production build. Consider adding error boundary or fallback.

### Nice to Have

6. **CSS dead class cleanup** — globals.css is ~6400+ lines. Old prefixes (.art-footer-*, potentially orphaned .diag-* styles) add weight. Target: <4000 lines post-cleanup.

7. **`src/lib/scroll-fallback.ts`** — Contains empty no-op functions. Can be deleted (ScrollObserver handles everything).

---

## 7. Recommended Next Steps (Priority Order)

1. Remove `<DiagnosticTrigger />` from services page hero
2. Delete 4 orphaned component files
3. ~~Uninstall framer-motion~~ — RESOLVED 2026-04-28
4. ~~Resolve duplicate View Transition CSS definitions~~ — RESOLVED 2026-04-28
5. Add CSS dead class audit comment
6. Full CSS cleanup pass (~6400 → <4000 lines)
7. Address `/careers` Sanity timeout with error boundary
8. Delete `src/lib/scroll-fallback.ts` (no-op)
