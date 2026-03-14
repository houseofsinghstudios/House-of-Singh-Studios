# House of Singh Studios — studios.houseofsingh.com

**Designed by Claude (Anthropic) + Maninder Singh**

## Project Overview

Commercial website for House of Singh Studios Inc., a multidisciplinary creative agency and AI powered brand systems studio based in Toronto. This site is designed to Awwwards Site of the Day standard. Every detail, from cursor behavior to scroll timing, is intentional.

## Tech Stack

* **Framework:** Next.js (App Router)
* **CMS:** Sanity (studio at /studio route)
* **Styling:** Tailwind CSS v4 (configured via `@theme inline` in globals.css)
* **Deployment:** Vercel
* **Page transitions:** next-view-transitions (View Transitions API)
* **Animations:** Pure CSS only. Zero animation libraries. No Framer Motion. No GSAP.
* **Scroll animations:** CSS `animation-timeline: view()` with IntersectionObserver fallback
* **Cursor:** Custom dot + ring system with 6 contextual states

## Project Structure

```
src/
  app/             → Pages and routes (App Router)
  components/
    ui/            → Base primitives (Button, Container, Divider, etc.)
    layout/        → Header, Footer, SubscribeForm
    homepage/      → Homepage section components
    [page]/        → Page-specific client components
  data/            → Static data (projects.ts, services.ts)
  lib/             → Utilities, hooks, Sanity client
  styles/          → Additional CSS (scroll-animations.css)
```

## Development Rules

* Server components by default. Only use `"use client"` when interactivity is required.
* Every component gets its own file. No multi-component files.
* Use Tailwind utility classes with the custom `@theme` tokens defined in globals.css.
* All buttons MUST use the `Button` component from `src/components/ui/Button.tsx`.
* All links that navigate between pages MUST use `Link` from `"next-view-transitions"`.
* No new animation libraries. Ever. All animations use pure CSS or the existing ScrollObserver.
* No `border-radius` anywhere. The global CSS enforces `border-radius: 0 !important`.
* Never use hardcoded color values. Always use CSS variables (`--bg`, `--text-primary`, etc.).
* Never use `rgba(26, 26, 26, ...)` directly. Use `var(--text-primary)` with opacity utilities.

## DESIGN SYSTEM

### Color Palette

| Name | CSS Variable | Tailwind | Hex | Usage |
|------|-------------|----------|-----|-------|
| Obsidian Black | `--text-primary` | `text-obsidian`, `bg-obsidian` | `#22211F` | Headlines, primary text, dark sections |
| Gunmetal Gray | `--text-secondary` | `text-gunmetal`, `bg-gunmetal` | `#5C5B58` | Body text, secondary content |
| Marble Ash | `--text-muted` | `text-marble`, `bg-marble` | `#A9A6A2` | Labels, metadata, muted elements |
| Cloudy White | `--bg-shift`, `--border` | `text-cloudy`, `bg-cloudy` | `#E5E3E0` | Alt backgrounds, borders, dividers |
| Silver Mist | `--bg` | `text-mist`, `bg-mist` | `#F7F6F5` | Page background, lightest surface |

### Color Rules

* Page background: `--bg` (Silver Mist `#F7F6F5`). Never pure white.
* Alternate sections: `--bg-shift` (Cloudy White `#E5E3E0`).
* Headlines and primary text: `--text-primary` (Obsidian Black).
* Body text: `--text-secondary` (Gunmetal Gray).
* Labels and metadata: `--text-muted` (Marble Ash).
* Borders and dividers: `--border` (Cloudy White).
* Dark inverted sections: `--text-primary` background with `--bg` text.
* Never use saturated accent colors, gradients, or neon tones.

### Typography

**Primary font:** Inter (`--sans: 'Inter', system-ui, sans-serif`)
**Editorial accent:** Cormorant Garamond (`--serif`) for select display moments only.

| Role | Size (desktop) | Weight | Letter Spacing | Line Height | Case |
|------|---------------|--------|---------------|-------------|------|
| Display / Hero | `clamp(48px, 6vw, 96px)` | 500 | `-0.03em` | 0.95 | Normal |
| Section Heading | `clamp(36px, 4vw, 64px)` | 500 | `-0.025em` | 1.0 | Normal |
| Subsection | `clamp(24px, 3vw, 36px)` | 500 | `-0.02em` | 1.15 | Normal |
| Body Large | `20px` | 400 | `-0.01em` | 1.6 | Normal |
| Body | `15px to 16px` | 400 | `normal` | 1.65 | Normal |
| Small / Caption | `13px` | 400 | `0.02em` | 1.4 | Normal |
| Label / Metadata | `11px` | 400 | `0.1em to 0.12em` | 1.3 | Uppercase |

### Typography Rules

* Headlines MUST use tight negative letter spacing. This is the editorial signature.
* Body text MUST use 1.6+ line height.
* Labels MUST be small, uppercase, tracked out. Use `.editorial-label` class.
* Serif (Cormorant Garamond) is ONLY for project names in work listings and select editorial moments. It is never used for body text, buttons, or labels.
* Only weights 400 (regular) and 500 (medium) for Inter. 600 sparingly for emphasis.
* Max body text width: 680px to 740px. Never run prose full width.
* Max headline width: 900px.
* Use `clamp()` for all responsive type sizing. No breakpoint-based font size changes.

### Spacing

8px base grid. All responsive spacing uses `clamp()`.

| Token | Value | Usage |
|-------|-------|-------|
| sm | `24px` | Tight internal gaps |
| md | `clamp(40px, 5vw, 64px)` | Standard spacing |
| lg | `clamp(64px, 8vw, 120px)` | Section vertical padding |
| xl | `clamp(80px, 10vw, 160px)` | Major section breaks |

Page horizontal padding: `var(--page-px)` = `max(40px, 8vw)`. Drops to `24px` below 900px.

### Layout Principles

* 12 column CSS Grid with gaps between 20px and 60px depending on context.
* Asymmetric splits ALWAYS preferred: 55/45, 60/40, or 70/30. Never 50/50 without reason.
* Full bleed images on portfolio and case study pages.
* Text blocks offset from center. Left alignment is the default everywhere.
* Content max width: 1280px for wide layouts, 900px for text-heavy sections.
* No box shadows. Ever.
* No border-radius. Ever. Enforced globally via CSS.
* Borders and dividers: `1px solid var(--border)` or `rgba(26, 26, 26, 0.08)` for subtle.

## INTERACTION DESIGN SYSTEM

This site uses a layered interaction system. Each layer operates independently and degrades gracefully.

### Layer 0: Custom Cursor (6 States)

The cursor system replaces the default cursor on mouse (`pointer: fine`) devices and is hidden on touch devices. It consists of a dot (8px, precision indicator) and a ring (36px, trailing context indicator).

| State | Trigger | Dot Behavior | Ring Behavior |
|-------|---------|-------------|---------------|
| Default | Normal browsing | 8px solid, full opacity | 36px border, 40% opacity |
| Hover | Links, buttons, interactive | 4px, 60% opacity | 56px, 55% opacity |
| View | Project cards, case studies | Hidden (opacity 0) | 80px, frosted glass bg, "View" label |
| Distort | Project images | 6px | 40px, dashed border, slow spin animation |
| Pause | Testimonial carousel | Hidden | 48px with pause icon (two vertical bars) |
| Drag | Available for future use | Reserved | Reserved |

Rules: The cursor ring uses `will-change: transform`. Transitions are 0.3s ease-out. The "View" label uses the editorial-label style (10px, uppercase, 0.12em tracking).

### Layer 1: Scroll-Driven Reveals (CSS animation-timeline)

All scroll animations use native CSS `animation-timeline: view()`. This runs on the GPU compositor thread with zero JavaScript overhead in Chrome/Edge. Safari/Firefox get IntersectionObserver fallback via the ScrollObserver component.

Core animation keyframes:
* `revealFadeUp`: opacity 0 + translateY(30px) → opacity 1 + translateY(0)
* `revealFade`: opacity 0 → opacity 1

Animation range pattern:
```css
animation-range: entry 0% entry 30%;
```

This means the animation plays as the element enters the viewport, from 0% entry to 30% entry. Staggered siblings offset by 3-5% increments.

Where scroll reveals apply:
* `.css-reveal`: Standard sections, content blocks
* `.css-reveal-late`: Elements that should reveal slightly after their siblings
* `.css-fade`: Opacity-only reveals for subtle elements
* Staggered section children: Argument steps, process rows, package tiers, deliverable rows

Safari/Firefox fallback:
Inside `@supports not (animation-timeline: view())`, the same elements use:
* `opacity 0` + `translateY(30px)` as initial state
* `.in-view` class triggers transition to visible state
* Stagger via `transition-delay` on `nth-child` selectors

### Layer 2: View Transitions API

Page-to-page transitions use the View Transitions API via `next-view-transitions`.

* Root transition: 0.4s crossfade with `cubic-bezier(0.23, 1, 0.32, 1)`
* Named transitions: `service-title` morphs between list and detail pages
* Old view: fades out with slight upward movement (-8px)
* New view: fades in with slight downward origin (+8px)

### Layer 3: Page Load Entrance

On every page load, hero elements animate in with staggered timing using data attributes:
* `[data-hero-label]`: 0s delay
* `[data-hero-heading]`: 0.1s delay
* `[data-hero-body]`, `[data-hero-sub]`, `[data-desc]`: 0.2s delay
* Animation: 0.6s `cubic-bezier(0.23, 1, 0.32, 1)`, opacity + translateY(20px)

### Layer 4: Hover Micro-Interactions

**Navigation Links**
* Header links: `::after` pseudo-element, 1px underline, `scaleX(0)` to `scaleX(1)`
* Transform-origin switches: right on rest, left on hover (creates directional wipe effect)
* Footer links: Same pattern but at 30% opacity for subtlety

**Buttons**
* Primary: Light sweep overlay (`rgba` white 10%) slides in from left via `translateX`
* Secondary: Dark fill sweep (solid dark) slides in from left, text color inverts via CSS
* Primary-inverted: Subtle dark sweep (`rgba` black 5%)
* All sweeps: 0.4s `cubic-bezier(0.23, 1, 0.32, 1)`
* Magnetic hover: Button element subtly pulls toward cursor (0.15 strength, `translate3d`)

**Project Row (Work Page)**
* Background: `::before` pseudo with bg-shift color fades in (opacity 0.5s)
* Title: letter-spacing transitions from `-0.01em` to `0.015em` (0.5s ease)
* Metadata: color transitions from faint to muted (0.3s ease)

**Project Cards (Homepage)**
* Card lifts: `translateY(-4px)` on hover (0.3s ease)
* Image zooms: `scale(1.03)` with 0.6s `cubic-bezier(0.23, 1, 0.32, 1)`
* Description reveals: max-height 0 to 60px with opacity fade (0.4s ease)

**Post Cards (Insights)**
* Title: opacity drops to 0.7 on hover (0.3s ease)
* Image: `scale(1.02)` zoom (0.6s ease)

**Service Blocks**
* Background: `brightness(0.95)` filter on hover
* Title: border-bottom reveals from transparent to text-primary (0.3s ease)
* Description: opacity 0 to 1 fade in (0.3s ease)

**Arrow Links**
* Arrow icon: `translateX(6px)` on hover (0.25s ease)

**Read More Links**
* `translateX(4px)` on hover (0.3s ease)

**Next Project Link**
* Title letter-spacing expands to `0.03em` on hover

### Layer 5: Form Interactions

**Focus States**
* Input fields: bottom border darkens from 15% to 50-60% opacity
* Textarea: full border darkens from 10% to 30% opacity
* Focus line: Animated `scaleX(0)` to `scaleX(1)` bar appears below focused inputs
* Transform-origin: center, 0.3s `cubic-bezier(0.23, 1, 0.32, 1)`

**Select Fields**
* Custom SVG chevron via `background-image` (no default browser arrow)
* Same bottom-border focus behavior as inputs

### Layer 6: Structural Animations

**Accordion (Careers Page)**
* `max-height: 0` to `2000px` with overflow hidden (0.5s ease)
* Toggle icon rotates 45 degrees when expanded (0.3s ease)

**Filter Transitions**
* Active filter: opacity goes from 0.35/0.5 to 0.9/1 with underline
* Project rows: opacity + transform transition on filter change (0.3s ease)

**Sticky Elements**
* Insights filter bar: sticky at `top 80px` with `backdrop-filter blur(8px)`

**Work Page Split Screen**
* Left column: scrollable content
* Right column: sticky at `top 80px`, height `calc(100vh - 80px)`
* Image panel: absolute positioned items with `will-change: opacity, transform`

### Layer 7: Advanced CSS Scroll Animations

These only activate in Chrome/Edge via `@supports (animation-timeline: view())`:
* Ghost number parallax: Service block numbers move at different scroll speed
* Image parallax: Project images translate from -5% to +5% Y across viewport
* Founder photo iris reveal: `clip-path inset` animates from 50% to 0%
* AI stage active indicator: `border-left-color` pulses as section crosses viewport center

## INTERACTION PATTERNS TO ADD (AWWWARDS ELEVATION)

The following interactions are NOT yet implemented but should be added to reach Site of the Day level. Each one is designed to work within the existing pure CSS + minimal JS architecture.

### 1. Horizontal Scroll Progress Indicator

A 1px line at the very top of the viewport that fills from left to right as the user scrolls. Uses `scroll()` timeline, zero JavaScript.

```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--text-primary);
  transform-origin: left;
  transform: scaleX(0);
  z-index: 9999;
  animation: scrollProgress linear;
  animation-timeline: scroll();
}
@keyframes scrollProgress {
  to { transform: scaleX(1); }
}
```

### 2. Smooth Number Counter (Stats Section)

Stats like "150+" should count up from 0 when they scroll into view. Use CSS `@property` for animating a custom property, or a tiny IntersectionObserver + requestAnimationFrame if CSS counter animation is not sufficient.

### 3. Text Reveal on Headlines (TextReveal Component)

Already built in the component system. Lines mask in from below with stagger. Use on all major section headings for consistency. Currently available via the `TextReveal` component.

### 4. Staggered Card Entrance

When a grid of cards enters the viewport, each card should fade in with a 100ms offset from the previous one. Already partially implemented via `nth-child` transition-delay pattern. Extend to all card grids site-wide.

### 5. Image Reveal Wipe

For portfolio images, instead of simple fade-in, use a clip-path wipe: `inset(0 100% 0 0)` to `inset(0 0 0 0)`. This creates a curtain-reveal effect. 0.8s `cubic-bezier(0.77, 0, 0.175, 1)`.

### 6. Footer Parallax Peek

The footer should feel like it is "behind" the last section. The last section gets a slight negative margin-bottom, and the footer uses a subtle `translateY` that resolves as you scroll to the bottom. This creates a layered paper-stack effect.

### 7. Link Hover with Character Stagger

For the primary navigation links, on hover, each character shifts up slightly (`translateY -2px`) with a stagger delay per character. Requires splitting text into spans (can be done in the Header component). Very subtle but an Awwwards signature detail.

### 8. Scroll Velocity Aware Cursor Ring

The cursor ring size could subtly increase when the user scrolls fast and return to normal when they stop. This requires a tiny scroll velocity tracker (`requestAnimationFrame` + delta comparison). Optional but distinctive.

### 9. Dark Mode Section Transition

When scrolling from a light section into the obsidian dark CTA section, the transition should feel like a "dip" — the background color change could animate via a `clip-path` or a gradient edge rather than a hard color boundary.

### 10. Loading State: Skeleton Pulse

For any Sanity-fetched content that might load slowly, use a skeleton screen with a subtle horizontal shimmer animation rather than spinners or blank space.

## COMPONENT REFERENCE

### Base Components (src/components/ui/)

**Button**
* Variants: `primary`, `secondary`, `primary-inverted`, `text`
* Magnetic hover effect via `translate3d` (0.15 strength)
* Fill sweep animations via CSS `::before` pseudo-elements
* Uses `next-view-transitions` Link for href navigation
* Supports `onClick` for non-navigation actions
* Never create inline-styled buttons anywhere

**Container**
* Wraps all page content with consistent margins
* Uses `var(--page-px)` for horizontal padding
* Max width: 1280px (default) or 680px (narrow)
* Server component, no client-side code

**Divider**
* 1px solid `var(--border)` hairline
* Spacing: `sm` (24px), `md` (clamp 40-64px), `lg` (clamp 64-120px)

**SectionWrapper**
* Auto-alternating backgrounds: even index = mist, odd = cloudy
* Override via `bg` prop: `"mist"` | `"cloudy"` | `"obsidian"` | `"white"`
* Uses `.css-reveal` class for scroll animation
* Spacing: `sm`, `md`, `lg` via section-wrapper CSS classes

**TextReveal**
* Headline mask-in animation on scroll entry
* Single text: wraps in overflow-hidden span, translates up
* Multi-line via `lines` prop: each line staggers by 0.12s
* Uses IntersectionObserver (threshold 0.1, rootMargin -40px)
* CSS classes: `.text-reveal-line`, `.text-reveal-inner`, `.revealed`

**EditorialLabel**
* Small uppercase metadata text
* Uses `.editorial-label` CSS class (11px, uppercase, 0.12em tracking, `--text-faint` color)

## PERFORMANCE RULES

* No animation libraries. CSS handles everything.
* All scroll animations use `will-change` sparingly. Only on elements that actually animate.
* Images use Next.js `Image` component with proper width/height/priority.
* Fonts: Inter loaded via `next/font/google` with `display: swap`.
* Custom cursor uses `requestAnimationFrame` for smooth 60fps tracking.
* `animation-timeline: view()` runs on compositor thread. Zero main thread cost.
* Page transitions via View Transitions API. Native browser, zero bundle cost.
* Target: Lighthouse Performance 95+, Accessibility 95+.

## ANTI PATTERNS (NEVER DO THESE)

* Never use `border-radius` on any element
* Never use `box-shadow` on any element
* Never use gradient backgrounds
* Never use colored accent buttons (blue, green, red CTAs)
* Never center all text on a page. Left align is default.
* Never use more than 2 font weights on a single page
* Never stack more than 3 cards in a row
* Never install Framer Motion, GSAP, or any animation library
* Never use pure white (`#FFFFFF`) as a page background
* Never use generic component library defaults (shadcn, MUI defaults)
* Never add floating action buttons, toast notifications, or back-to-top buttons
* Never use placeholder images or generic stock photography
* Never add sticky headers taller than 80px
* Never create competing animation systems. Everything goes through the existing CSS layers.
* Never use `setTimeout` or `setInterval` for animations. Use CSS transitions, `requestAnimationFrame`, or `animation-timeline`.
* Never hardcode pixel breakpoints for font sizes. Use `clamp()`.
* Never skip the reduced-motion media query. All motion MUST respect `prefers-reduced-motion`.
* Never use `transform: scale()` values above 1.05 on hover. Keep it subtle.
* Never add loading spinners. Use skeleton states with shimmer.

## EASING REFERENCE

| Purpose | Easing | Duration |
|---------|--------|----------|
| Hover transitions | `ease` or `cubic-bezier(0.23, 1, 0.32, 1)` | 0.2s to 0.3s |
| Fill sweeps | `cubic-bezier(0.23, 1, 0.32, 1)` | 0.4s |
| Scroll reveals | `linear` (scroll-driven) | Tied to scroll |
| IntersectionObserver | `cubic-bezier(0.23, 1, 0.32, 1)` | 0.5s to 0.7s |
| Text reveals | `cubic-bezier(0.22, 1, 0.36, 1)` | 0.8s |
| Image zoom | `cubic-bezier(0.23, 1, 0.32, 1)` | 0.6s to 0.7s |
| Page load entrance | `cubic-bezier(0.23, 1, 0.32, 1)` | 0.6s |
| View transitions | `cubic-bezier(0.23, 1, 0.32, 1)` | 0.4s to 0.5s |
| Cursor movement | none (follows mouse via rAF) | Instant |
| Cursor state changes | `ease-out` | 0.3s |
| Clip-path reveals | `cubic-bezier(0.77, 0, 0.175, 1)` | 0.8s |
| Letter-spacing hover | `ease` | 0.5s |
| Accordion open/close | `ease` | 0.5s |

The primary easing for this project is `cubic-bezier(0.23, 1, 0.32, 1)`. This is a fast-start, gentle-settle curve that feels confident and premium. Use it as the default for any new interaction unless there is a specific reason to choose something else.

## AWWWARDS JUDGING CRITERIA ALIGNMENT

For reference, Awwwards judges score on four dimensions. Here is how this site addresses each:

**Design (40%):** Editorial modernist aesthetic, custom color system, typographic hierarchy with tight letter-spacing on headlines, asymmetric layouts, warm neutral palette, serif/sans pairing for contrast, zero generic patterns.

**Usability (20%):** Clear navigation, logical page hierarchy, responsive from 375px to 2560px+, accessible form patterns, sticky filter bars for long lists, readable body text at 15-16px with 1.65 line height.

**Creativity (20%):** Custom 6-state cursor system, scroll-driven CSS animations (cutting edge API), text mask reveals, button fill sweeps, project row letter-spacing hover, image parallax via scroll timeline, iris reveal on photos.

**Content (20%):** Sanity CMS for dynamic content, structured case studies with deliverables and process documentation, insights/blog with reading time, filterable work portfolio, clear service offerings.
