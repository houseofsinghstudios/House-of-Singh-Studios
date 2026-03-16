# HOUSE OF SINGH STUDIOS — DEFINITIVE UI/UX DESIGN SYSTEM
# Version 2.0 | Evolved from editorial minimalism toward confident interactive editorial
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
| --text-muted       | Marble Ash     | #A9A6A2   | Labels, metadata, dividers, muted elements          |
| --border           | Cloudy White   | #E5E3E0   | Dividers, borders, structural lines                 |

No saturated colors. No gradients. No neon. The entire visual language operates in warm neutrals.

### Typography

Font: Inter (--sans). Everywhere. No exceptions.
Weights: 400 (regular) and 500 (medium) only.
Headlines: Tight negative letter-spacing (-0.02em to -0.03em). This is the editorial signature.
Body: 1.6 line height. Max width 680px.
Labels: 11px, uppercase, letter-spacing 0.1em to 0.12em, --text-muted color.

### Spacing

8px base grid. Section padding uses clamp() for responsive scaling.
Page horizontal padding: var(--page-px) = max(40px, 8vw).
Generous whitespace is non-negotiable. When in doubt, add more space.

### Anti-Patterns

Zero border-radius. Zero box-shadow. Zero gradients. Zero colored accent buttons.
Zero serif fonts. Zero animation libraries. Zero generic component defaults.
Left-aligned by default. Maximum 2 font weights per page.

---

## EVOLVED INTERACTION SYSTEM

Inspired by Dash Digital's interaction philosophy, adapted to our editorial language.

### Layer 1: Navigation

Philosophy: Minimal. The nav should almost disappear. Content is king.

CURRENT BEHAVIOR — Sticky header with wordmark left, text links right. Collapses from crest to wordmark on scroll.

EVOLVED BEHAVIOR:
- Header shrinks to a thin bar (48px height) on scroll with wordmark left and a single "Menu +" trigger right
- The full navigation lives in a full-screen overlay triggered by "Menu +"
- The overlay uses --bg background with large navigation links (Inter 500, clamp(32px, 4vw, 48px)) stacked vertically, left-aligned
- Each nav link has a small count or descriptor next to it where relevant (e.g. "Work 04" showing project count, "Case Studies 08")
- The overlay opens with a smooth opacity + translateY reveal (0.4s ease)
- Close trigger labeled "Close" replaces "Menu +"
- On desktop, the individual nav links can remain visible in the header alongside Menu +. The overlay is an enhancement, not a replacement.
- On mobile, only the wordmark and Menu + are visible. All navigation moves to the overlay.

WHY: This removes visual clutter from the content area. The user's attention stays on the work, not the chrome. Dash Digital does this and it makes the content feel larger.

IMPLEMENTATION: Modify Header.tsx to add an overlay nav component. Use React state for open/close. CSS transitions for the overlay. No animation libraries.

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
- Skeleton loading: if Sanity content takes time to load, show thin horizontal bars (8px height, --bg-shift fill, subtle pulse animation) in place of text blocks

---

## PAGE-SPECIFIC INTERACTION MAPS

### Homepage
Flow: Hero → (01) Featured Work → (02) The Argument → (03) Services → (04) About Preview → (05) Brands → (06) Testimonials → Stats → CTA

- Hero: page load entrance with staggered data attributes. Headline, supporting text, buttons stagger in 0.1s apart.
- Featured Work: 4-column card grid. Portrait images. Stagger reveal with 100ms offset per card.
- Argument: Two-column. Dark section option. Steps stagger on right column.
- Services: Accordion rows with hover reveal.
- About Preview: Two-column on --bg-shift. Compact.
- Brands: Accordion list with hover expand.
- Testimonials: Asymmetric carousel with auto-rotate and pause.
- Stats: Compact data bar with animated counters.
- CTA: Dark inverted. Asymmetric. The close.

### Work Page
- Default view: LIST (text rows with dividers, hover background shift)
- Toggle: LIST / GRID switch in top right
- Grid view: 2-column staggered cards with images
- Filter bar: horizontal pill buttons
- Heading: large with superscript project count

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

### Packages
- Compact hero
- Three-column pricing grid with dividers between tiers
- Recommended tier gets subtle --bg-shift background
- Flexibility disclaimer below
- Dark CTA

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
- Navigation: wordmark + Menu trigger only. Full-screen overlay for nav.
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

Phase 1 (immediate): Navigation overlay, page transitions, scroll reveal variety
Phase 2 (next): Image clip-path reveals, hover interaction standardization
Phase 3 (polish): Loading states, mobile optimization, performance audit
