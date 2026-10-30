# HOUSE OF SINGH STUDIOS — DEFINITIVE UI/UX DESIGN SYSTEM
# Version 2.1 | Evolved from editorial minimalism toward confident interactive editorial
# Updated 2026-10-30 from the code: page map, header, homepage, Work, Packages, design exceptions, protected list.
# This document governs all design and development decisions across the entire site.

---

## DESIGN PHILOSOPHY

The site operates at the intersection of editorial calm and interactive confidence. Every page should feel like a luxury magazine that responds to your touch. The aesthetic is typographically driven, spatially generous, and interaction rich without being performative.

Three governing principles:

1. CONTENT AS EXPERIENCE — The content does not sit on the page. It arrives. Every heading, image, and section enters the viewport with intention. The scroll is the narrative device.

2. QUIET UNTIL ENGAGED — Elements are restrained at rest but responsive on interaction. A row is a simple line of text until you hover it and the background shifts, the spacing breathes, the description reveals. The site rewards attention without demanding it.

3. CONTINUOUS FLOW — The page is one long story, not disconnected sections. Sections flow into each other through shared rhythm, consistent dividers, and progressive revelation. Hard visual breaks (dark sections) are used sparingly and only at narrative turning points.

---

## NON-NEGOTIABLE FOUNDATIONS

These never change. They are the identity of House of Singh.

### Color Palette

| Token              | Name           | Hex       | Usage                                              |
|--------------------|----------------|-----------|-----------------------------------------------------|
| --bg               | Silver Mist    | #F7F6F5   | Page background, lightest surface                   |
| --bg-shift         | Cloudy White   | #E5E3E0   | Alternate sections, hover states, cards              |
| --text-primary     | Obsidian Black | #22211F   | Headlines, primary text, dark section backgrounds   |
| --text-secondary   | Gunmetal Gray  | #5C5B58   | Body text, descriptions                             |
| --text-muted       | Marble Ash     | #A9A6A2   | Hairlines, borders, dividers, decorative shapes; text on dark backgrounds |
| --text-label       | Accessible Ash | #716F6C   | Small text on light backgrounds: labels, metadata, numbers, back links (4.64:1 on Silver Mist) |
| --border           | Cloudy White   | #E5E3E0   | Dividers, borders, structural lines                 |

No saturated colors. No gradients. No neon. The entire visual language operates in warm neutrals.

Accessible Ash (decided 30 Oct 2026): every small text element on a light background uses --text-label,
never Marble Ash: editorial labels, metadata lines, numbers, tags, back links, share labels, placeholders.
Marble Ash stays for non text uses (hairlines, borders, dividers, decorative shapes) and for text on dark
backgrounds, where it passes (6.6:1 on Obsidian). On Cloudy White panels (#E5E3E0) Accessible Ash
is only 3.91:1, so small text there uses Gunmetal (5.3:1): the panel carries .surface-cloudy, which
sets --text-label to Gunmetal for everything inside it. Dark section labels in Silver Mist at reduced opacity
stay at 65 percent or more. Hovers that darken a label go from Accessible Ash to Obsidian.

### Typography

Font: Inter (--sans). Everywhere. No exceptions.
Weights: 400 (regular) and 500 (medium) only.
Headlines: Tight negative letter-spacing (-0.02em to -0.03em). This is the editorial signature.
Body: 1.6 line height. Max width 680px.
Labels: 11px, uppercase, letter-spacing 0.1em to 0.12em, --text-label color (--text-muted on dark backgrounds).

### Spacing

8px base grid. Section padding uses clamp() for responsive scaling.
Page horizontal padding: var(--page-px) = max(40px, 8vw).
Generous whitespace is non-negotiable. When in doubt, add more space.

### Anti-Patterns

Zero border-radius. Zero box-shadow. Zero gradients. Zero colored accent buttons.
Zero serif fonts. Zero animation libraries. Zero generic component defaults.
Left-aligned by default. Maximum 2 font weights per page.

Known exceptions, as built:
- Box shadow: one, deliberate. Contact form fields show keyboard focus as a 2px Obsidian bottom rule; the second pixel is an inset shadow so the field keeps its size (globals.css, contact-input focus-visible). No other shadow is allowed.
- Font weights: only 400 and 500 are loaded (src/app/layout.tsx), so only those render. One leftover font-weight: 300 sits in unused CSS (.clients-accordion-toggle) and is due for removal with the dead CSS.

---

## EVOLVED INTERACTION SYSTEM

Inspired by Dash Digital's interaction philosophy, adapted to our editorial language.

### Layer 1: Navigation

Philosophy: Minimal. The nav should almost disappear. Content is king.

AS BUILT (src/components/layout/Header.tsx):
- Sticky header. At the top of the page the crest logo sits top left; once scrolled, the header becomes a thin bar with the text wordmark on the left.
- Above 1080px: six text links on the right (Services, Work, AI Lab, About, Insights, Contact), with the underline wipe.
- At 1080px and below: a hamburger button (aria-label "Open menu" / "Close menu", aria-expanded) replaces the links. It opens a full screen panel on --bg with the same six links stacked large and left aligned, and the studio email and location at the bottom. The page behind does not scroll while it is open.
- Partners, Initiatives, Commons, Careers, Privacy and Terms are reached from the footer, not the header.

NOT BUILT: the earlier "Menu +" overlay with a 48px bar, link counts ("Work 04") and a "Close" label was never shipped. Do not rebuild it without the owner's approval. Open accessibility work on the mobile panel (health check F-10): Escape to close, focus kept inside the panel, aria-controls.

### Layer 2: Page Transitions

CURRENT BEHAVIOR — View Transitions API with simple crossfade (0.4s).

EVOLVED BEHAVIOR:
- Keep the View Transitions API as the foundation
- Outgoing page: fade out + slight upward shift (-12px) over 0.3s
- Incoming page: fade in + slight downward origin (+16px) over 0.5s with 0.1s delay
- For project-to-case-study transitions: the project image or title should morph between pages using viewTransitionName (already partially implemented)
- Page transitions should feel like turning a page, not teleporting

WHY: Smooth page transitions are one of the highest-impact Awwwards criteria. They make the site feel like a native app, not a website.

IMPLEMENTATION: Update the View Transition keyframes in globals.css. No new libraries needed.

### Layer 3: Scroll Storytelling

CURRENT BEHAVIOR — css-reveal class triggers fade-up on viewport entry.

EVOLVED BEHAVIOR:
- Every section still uses scroll-triggered reveals but with MORE variety in how elements enter
- Standard reveal: opacity 0 + translateY(30px) → visible (the current pattern, keep it)
- Stagger reveal: Children of a section enter sequentially with 80-100ms delays between siblings
- Text reveal: Headlines use the TextReveal mask-up animation for major section headings
- Image reveal: Images use clip-path wipe (inset(0 100% 0 0) → inset(0)) for a curtain effect
- Counter reveal: Stats count up from 0 on viewport entry (already implemented)
- The scroll progress indicator (1px line at top) remains as a subtle orientation device

REVEAL TIMING:
- Stagger base delay: 80ms between siblings
- Reveal duration: 0.6s to 0.8s depending on element size
- Easing: cubic-bezier(0.23, 1, 0.32, 1) for all reveals
- Elements reveal once. Never re-animate.

WHY: Variety in entrance animations prevents the page from feeling monotonous. One single fade-up for everything gets boring after 3 sections. Different elements deserve different entrances.

IMPLEMENTATION: Add new CSS classes: .reveal-clip (clip-path wipe), .reveal-stagger-parent (applies stagger delays to children). Extend ScrollObserver to handle these. All pure CSS with IntersectionObserver fallback.

### Layer 4: Hover Interactions

CURRENT BEHAVIOR — Various hover effects across components.

EVOLVED BEHAVIOR — Standardize to a consistent interaction vocabulary:

ACCORDION ROWS (services, brands, work list):
- Background: ::before pseudo with --bg-shift, opacity 0 → 1 over 0.5s, extends full bleed
- Title: letter-spacing loosens from -0.02em to +0.01em over 0.5s
- Metadata: color shifts from --text-muted to --text-secondary over 0.3s
- Description (if hover-reveal): max-height 0 → content over 0.6s, opacity 0 → 1
- Arrow: fades in with 0.15s delay, translateX(-4px) → 0

IMAGE CARDS (work grid, case studies, homepage featured):
- Image: scale(1.03) over 0.7s cubic-bezier(0.23, 1, 0.32, 1)
- Custom cursor: switches to VIEW state (80px frosted glass circle with "View" label)
- Title: opacity shifts to 0.7 over 0.3s

TEXT LINKS:
- Underline wipe: scaleX(0) → scaleX(1) via ::after pseudo, transform-origin switches from right (rest) to left (hover)

BUTTONS:
- Primary: light sweep overlay via ::before translateX(-100% → 0) over 0.4s
- Secondary: dark fill sweep via ::before, text color inverts
- Magnetic hover: button follows cursor at 0.15 strength via translate3d

NAVIGATION LINKS:
- Same underline wipe as text links

### Layer 5: Section Composition

EVOLVED PATTERNS for how sections are structured:

NUMBERED SECTIONS:
- Major sections get a number label: "(01) Featured Work", "(02) The Argument", etc.
- The number is rendered as part of the editorial label, not as a decorative element
- Numbers create narrative progression and help the user orient within the page

SECTION ANNOUNCEMENTS:
- Each section begins with: editorial label (number + title) → section heading → optional supporting text → content
- This is consistent across all pages. The label-heading-content pattern is the signature structural rhythm.

DARK SECTIONS:
- Used sparingly. Maximum 2 per page (typically the argument/problem section and the CTA)
- --text-primary background, --bg text
- Creates narrative emphasis. "This is the important part."

DIVIDERS:
- 1px solid var(--border) between all major content blocks within a section
- Full-bleed dividers between sections
- Dividers are structural, not decorative. They create rhythm like bar lines in music.

ASYMMETRIC LAYOUTS:
- Default split for two-column sections: 55/45 or 60/40
- Never 50/50 unless both columns have identical content types
- The wider column contains the primary content (heading, description)
- The narrower column contains secondary content (steps, metadata, image)

### Layer 6: Image Presentation

EVOLVED APPROACH:

- Images are DOMINANT. They should be the largest visual element in any section that contains them.
- Minimum image height on desktop: 400px for inline images, 500px for hero/featured images
- Aspect ratios: 3:4 portrait for project cards, 4:3 landscape for case study heroes, 16:9 for full-width banners
- Images enter viewport with clip-path reveal: inset(0 100% 0 0) → inset(0 0 0 0) over 0.8s
- On hover (when image is a link): scale(1.03) zoom
- All images use Next.js Image component with proper sizes, alt, and priority attributes
- Placeholder state (before real images): --bg-shift background, no text, no labels

### Layer 7: Loading and Empty States

- No spinning loaders anywhere
- Page loads: content enters via the staggered reveal system. The page appears to "build" itself.
- Form submissions: button text changes to "Sending..." with reduced opacity
- Empty content states: a quiet centered message in --text-muted, no decorative elements
- Skeleton loading: not built (pages are static or ISR, so content arrives with the HTML). If ever needed: thin horizontal bars (8px height, --bg-shift fill, subtle pulse animation) in place of text blocks
- Errors: src/app/(site)/error.tsx shows "This page could not load right now." inside the site layout, with Try Again, the homepage and /contact; src/app/global-error.tsx shows the same outside it. Both are noindex.

---

## PAGE-SPECIFIC INTERACTION MAPS

### Homepage
Flow, as built (src/app/(site)/(home)/page.tsx): Hero → (01) Featured Work → (02) The Argument → (03) Capabilities → (04) Two ways to start → (06) Testimonials → (07) Proof → Next page link (Services) → CTA. There is no (05) label on the page today.

- Hero: page load entrance with staggered data attributes. Label "Creative Direction Studio"; the H1 is visually hidden (sr-only) and the visible headline is presentational.
- Featured Work: case study cards from Sanity. Stagger reveal.
- The Argument: the headline's words reveal on scroll.
- Capabilities: the four services as rows (ServicesSection). Desktop: hover reveal, each row a link to its service page. Below 1024px: rows open and close on tap, the first opens after the stagger, "Learn More" follows the link.
- Two ways to start (ToolBand): Brand Pulse Check and Project Planner. Desktop: two columns. Phones: a two tab switch.
- Testimonials: carousel with auto rotate and pause.
- Proof: animated counters (50+ projects, 12+ years, 8+ industries).
- CTA: dark inverted. The close.
- About Preview and Brands sections no longer exist.

### Work Page
- Default view: GRID (2 columns of image cards), with a GRID / LIST switch in the filter bar (WorkPageClient.tsx).
- List view: text rows with dividers, hover background shift.
- Filter bar: disciplines, in a fixed order.
- Heading: "Work" with the project count beside it, outside the H1.
- Phones: single column grid, no list/grid switch.

### Services Overview
- Compact hero (~60vh) with full-width image below
- Service blocks: alternating image/text layout
- Services Unpacked: multi-column capability grid (not accordion)
- Dark CTA at bottom

### Service Detail
- Compact hero (~50vh) with viewTransitionName
- Deliverables: two-column grid
- Business Impact: asymmetric 40/60 layout on --bg-shift
- Process: two-column grid
- Dark CTA at bottom

### Case Study
- Compact hero (~50vh) with viewTransitionName
- Full-width hero image with clip-path reveal
- Content sections: Business, Challenge (two-column), Approach, Deliverables (numbered grid), Result
- Image gallery
- Next Project link with letter-spacing hover
- Dark CTA

### About
- Compact hero
- Numbered sections: (01) Capabilities, (02) Process, (03) Network, (04) Founder, (05) Stats
- Founder section: two-column with photo and bio
- Dark CTA

### Contact
- Compact hero
- Two-column: form left, booking CTA right
- Contact details grid below form
- No bottom CTA (the form IS the CTA)

### AI Lab
- Compact hero
- Three content sections: The Argument (why creative direction matters), How AI Powers the Process (stage list), Brand Pulse Check (interactive tool)
- Each section uses the standard label-heading-content pattern
- Brand Pulse Check: interactive multi-step flow, self-contained
- Dark CTA

### Packages (retired)
- The Packages page no longer exists. /packages redirects (301) to /start, the Project Planner.
- src/data/packages.ts stays: the planner takes its Brand Foundation price and timelines from it.

### Project Planner (/start)
- Multi step brief builder; the result can be sent to the studio. Rendered on every request (it reads ?service and ?begin).
- Prices come from the Sanity Service Pricing document; if Sanity fails, prices are hidden and the planner still works.

### Brand Pulse Check (/brand-pulse)
- Self contained multi step tool with a shareable result (?r=, never indexed). Rendered on every request.

### Initiatives (/initiatives, /initiatives/parallel, /initiatives/commons)
- The initiatives overview and two programme pages. Other initiatives are listed but have no page; /initiatives/foundry returns 404 on purpose.

### Partners, Careers, Privacy, Terms
- /partners: the partner programme, introduction form with permission checkbox, FAQs.
- /careers: open roles from Sanity, apply form.
- /privacy and /terms: legal wording, approved by the owner. Change only with approval.

### Insights
- Compact hero
- Filter bar (sticky below header)
- Two-column post grid with images
- Dark CTA

### Insight Article
- Compact hero with back link, metadata, reading time
- Full-width featured image
- Body content at max-width 740px
- Previous/Next navigation
- Related posts grid
- Dark CTA

---

## MOBILE STRATEGY

Mobile gets a simplified experience prioritizing speed and readability.

- All hover interactions disabled (CSS @media(hover: hover) wrapper)
- Accordion sections: all content visible by default, no hover-reveal
- Custom cursor: hidden on touch devices
- Navigation: crest or wordmark + hamburger at 1080px and below. Full screen panel for nav.
- Image sizes reduced for performance
- Stagger delays reduced or removed
- Column layouts collapse to single column
- Scroll-driven animations: simplified to basic fade-in via IntersectionObserver
- Stats: 2x2 grid below 600px
- Work page: single column grid, no list/grid toggle

---

## PERFORMANCE BUDGET

Target: Lighthouse 80+ across all metrics. Experience takes priority over perfect scores.

- No animation libraries (GSAP, Framer Motion, etc.)
- All animations: pure CSS + IntersectionObserver
- Images: Next.js Image with proper sizes and priority
- Fonts: Inter loaded via next/font with display swap
- Cursor: requestAnimationFrame for 60fps tracking
- Page transitions: View Transitions API (native, zero bundle cost)
- Scroll animations: animation-timeline: view() in Chrome (GPU compositor, zero main thread), IntersectionObserver fallback in Safari
- Exception: Lenis (smooth scroll) is the only approved third-party animation dependency. It provides the decelerated scroll feel that CSS cannot replicate. No other animation libraries are permitted.

---

## EASING REFERENCE

| Purpose                  | Easing                              | Duration    |
|--------------------------|-------------------------------------|-------------|
| Hover transitions        | cubic-bezier(0.23, 1, 0.32, 1)     | 0.2s - 0.3s |
| Fill sweeps              | cubic-bezier(0.23, 1, 0.32, 1)     | 0.4s        |
| Scroll reveals           | cubic-bezier(0.23, 1, 0.32, 1)     | 0.6s - 0.8s |
| Text reveals             | cubic-bezier(0.22, 1, 0.36, 1)     | 0.8s        |
| Image clip reveals       | cubic-bezier(0.77, 0, 0.175, 1)    | 0.8s        |
| Page transitions         | cubic-bezier(0.23, 1, 0.32, 1)     | 0.3s - 0.5s |
| Accordion expand         | cubic-bezier(0.23, 1, 0.32, 1)     | 0.6s        |
| Letter-spacing hover     | ease                                | 0.5s        |
| Cursor state changes     | ease-out                            | 0.3s        |
| Stagger offset           | —                                   | 80 - 100ms  |

Primary easing: cubic-bezier(0.23, 1, 0.32, 1). Fast start, gentle settle. Confident and premium.

---

## IMPLEMENTATION PRIORITY

Phase 1 (immediate): page transitions, scroll reveal variety (done; the Menu + overlay was not built, see Layer 1)
Phase 2 (next): Image clip-path reveals, hover interaction standardization
Phase 3 (polish): Loading states, mobile optimization, performance audit

---

## SITE MAP AND ROUTES (as built)

Live domain: https://studios.houseofsingh.com (canonical everywhere). Hosting: Vercel.

| Route | Rendering |
|---|---|
| / | Static, refreshed every 60 s (ISR) |
| /services, /services/[slug] (brand-identity, visual-media, digital-design, creative-strategy) | ISR 60 s; service copy from src/data/services.ts |
| /work, /work/[slug] | ISR 60 s; case studies from Sanity |
| /insights, /insights/[slug] | ISR 60 s; every published article generated ahead |
| /about, /careers, /initiatives, /initiatives/[slug] (parallel, commons) | ISR 60 s |
| /ai, /partners, /privacy, /terms | Static |
| /start, /brand-pulse, /contact | Rendered on every request (they read query parameters) |
| /sitemap.xml, /llms.txt | Refreshed hourly |
| /robots.txt, og and share images | Static |
| /studio | Sanity Studio, own route group, no site chrome |
| /api/lead, /api/careers, /api/subscribe, /api/brand-pulse, /api/project-planner | POST, forward to n8n |
| /api/consent-region | GET, decides strict consent regions |

Redirects (next.config.ts, 301): /packages → /start; /plan → /start; /pulse → /brand-pulse; /journal and /journal/* → /insights; /work/meridian, /work/soulbound, /work/test → /work. Unknown URLs give the site 404 (noindex).

When Sanity fails at runtime, pages keep their last good version (src/lib/sanity/resilience.ts); fallback content is used only while building.

---

## Protected: intentional work, do not remove

These look unusual or redundant but are deliberate. Any change touching them needs the owner's approval. Report a genuine defect in one of them as a defect; never remove or weaken it as cleanup.

- SEO structure: the semantic H1 swap on service pages (the label is the H1, the hero line an H2), and visually hidden H1s (homepage, Brand Pulse and Project Planner states, the hidden "Brand Pulse result" H1).
- Hidden descriptive link text: the sr-only text in "Learn More" links on /services and in footer social links; the logo alt as link text.
- Service FAQs and the questions accordion, with FAQPage JSON-LD.
- The structured data graph: ProfessionalService and Organization with @id, founder Person, Service, CreativeWork, Article, BreadcrumbList.
- RGD links (RgdLink and the auto linker in article bodies).
- SITE_OG and WEBSITE_OG (og:type, og:locale en_CA, og:site_name) and the share image routes.
- Related thinking, related work and related services modules, and src/lib/linking.ts.
- Sitemap lastmod (the static page date map) and llms.txt with its tests.
- Redirects in next.config.ts, and the intentional /initiatives/foundry 404.
- Consent gated GA4 and Clarity (nothing loads before consent).
- The analytics helper (src/lib/analytics.ts): page view parameters, trackOnce, the "set" call.
- Lead events and the ?hos_internal and ?hos_debug flags.
- Lead source capture (src/lib/lead-source.ts, src/lib/referrer.ts).
- Partner referrals (?ref=) and their attribution.
- Form protections: honeypots, the shared rate limiter, length limits, timeouts, the partner permission checkbox.
- The Sanity services mirror (sanity/schemas/service.ts and scripts/import-services; the code is the source of truth).
- The Sanity resilience helper (src/lib/sanity/resilience.ts).
- Privacy and terms wording.
- Accessible Ash for small text on light backgrounds, decided 30 Oct 2026 (--text-label, #716F6C), Gunmetal on Cloudy White panels (.surface-cloudy); Marble Ash for non text and for text on dark backgrounds.

---

## SANITY

Sanity Studio is embedded at /studio inside its own route group and deploys with Vercel. Never run `sanity deploy`; it creates a separate hosted Studio that falls out of sync with the code.
