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
| --error            | Oxide          | #7A4136   | Form and tool error text only, through .form-error (7.4:1 on Silver Mist, 6.2:1 on Cloudy White) |

No saturated colors. No gradients. No neon. The entire visual language operates in warm neutrals.

Oxide (decided 1 Nov 2026): the one error colour, a muted warm brick that sits with the neutrals. Every form
and tool error (contact, careers, newsletter, Project Planner, Brand Pulse) uses the shared .form-error style:
13px Inter, line height 1.5, Oxide, 8px above (.form-error--lead for a message that opens a form). The written
message always shows next to its field or button; colour is never the only signal. Oxide is for nothing else.

Overlays: --overlay-3, -8, -15, -28, -42, -50 and -60 are #1A1A1A at those strengths, for soft hairlines, tints and scrims (28 and 42: the homepage hero's Pause button at rest and on hover).

Accessible Ash (decided 30 Oct 2026): every small text element on a light background uses --text-label,
never Marble Ash: editorial labels, metadata lines, numbers, tags, back links, share labels, placeholders.
Marble Ash stays for non text uses (hairlines, borders, dividers, decorative shapes) and for text on dark
backgrounds, where it passes (6.6:1 on Obsidian). On Cloudy White panels (#E5E3E0) Accessible Ash
is only 3.91:1, so small text there uses Gunmetal (5.3:1): the panel carries .surface-cloudy, which
sets --text-label to Gunmetal for everything inside it. The same holds while a hover ground shows (since 22 Nov 2026): the next project row and the About process steps (.row-bleed), the service deliverables and accordion rows, the About network cards and the AI Lab comparison rows set --text-label to Gunmetal on hover (globals.css), as the homepage What we do row does. Dark section labels in Silver Mist at reduced opacity
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
- Box shadow: one, deliberate. Form fields show keyboard focus as a 2px Obsidian bottom rule; the second pixel is an inset shadow so the field keeps its size (globals.css, contact-input focus-visible, shared by the contact form, the Project Planner and Brand Pulse; careers.css for the careers form; article.css for the article newsletter field). No other shadow is allowed.
- Font weights: only 400 and 500 are loaded (src/app/fonts.ts, shared by the root layout and the error page), so only those render.
- Colour: Canada red #D52B1E, for one element only: the 11 point maple leaf before "Proudly Canadian owned and operated." in the closing crest section (src/components/layout/FooterReveal.tsx), 12px, decorative (aria-hidden). Nowhere else: no buttons, accents, borders or text. The line itself stays on the page only, never in metadata, structured data or llms.txt.

---

## EVOLVED INTERACTION SYSTEM

Inspired by Dash Digital's interaction philosophy, adapted to our editorial language.

### Layer 1: Navigation

Philosophy: Minimal. The nav should almost disappear. Content is king.

AS BUILT (src/components/layout/Header.tsx, MenuDrawer.tsx, TorontoTime.tsx; scroll rules in src/lib/header-scroll.ts):
- One fixed bar on --bg, at every width and scroll position: 72px above 1080px, 56px at 1080px and below. The single token is --header-bar; pages that clear the header use it (the old --header-logo-top, --header-logo-height and --header-clearance are gone).
- Home link: the text "House of Singh Studios", never artwork, in the nav's own type: Inter 500, 11px, uppercase (written in normal case in the markup, capitals from CSS, so screen readers say the name naturally), 0.14em, Obsidian (the links are Gunmetal; that is the one difference). Its own text is its accessible name; view-transition-name site-logo. The same size at every width, on one line (about 180px wide), with at least 132px before the links and 100px before the menu button from 360px up, so no width rule. The owner keeps the master wordmark artwork outside the site. The crest no longer appears in the header; the file stays for the footer.
- A 1px --border line fades in under the bar after 20px of scroll (0.3s).
- Hides on the way down and shows on the way up: hides only past 400px and after more than 8px down since the last change of direction, shows after more than 8px up, translateY(-100%) over 0.35s cubic-bezier(0.23, 1, 0.32, 1) (the token --header-slide). Always shown at the top, while the drawer is open, and when keyboard focus moves into it. With reduced motion it never hides. Header.tsx sets html[data-header-hidden] while it is hidden, so --header-edge reads 0px instead of the bar height: anything that sits under the header and follows it uses --header-edge and --header-slide, never its own scroll logic.
- Above 1080px: five links (Services, Work, AI Lab, About, Insights; one list in src/components/layout/site-links.ts, which the drawer shares and adds Contact to) with the underline wipe, 32px apart, then "Plan your project" to /start: .btn-primary at the nav's size (Obsidian, Silver Mist text), data-cursor="link", tracked as header_cta_click { location: "header" }. Contact is not in the desktop header.
- At 1080px and below: the menu button (aria-label "Open menu" / "Close menu", aria-expanded, aria-controls, 44px tap area) opens and closes the drawer, tracked as menu_open on opening. No "Plan your project" on phones. Its two lines (22px, 1.5px, Obsidian) morph into the close cross: opening, they slide to the middle (translateY 3.75px, 180ms) and then turn to 45 and minus 45 degrees (280ms, from 180ms); closing is the exact reverse. Reduced motion: the icon swaps at once. The header sits above the drawer and its scrim (z-index 130 over 121 and 120), so the button stays in place, visible and usable, while the drawer is open.
- The drawer: from the right, 85vw up to 420px, translateX(100%) to 0 over 0.55s, over a var(--overlay-50) scrim fading over 0.45s, its top under the header bar. No close X of its own: the morphing menu button is the one control. Six links (Services, Work, AI Lab, About, Insights, Contact), about 55px each, entering from 24px with a stagger from 0.16s, 50ms apart. At the foot: "(Studio)" over "Toronto, Canada" and "(Local time)" over the live Toronto time (America/Toronto whatever the visitor's zone, shown after mount only, refreshed every 15s while open, the colon dimming every 2s).
- The drawer is a disclosure, not a dialog: a region named "Menu" that the menu button controls (aria-expanded, aria-controls) from outside it; role dialog with aria-modal would hide that button from screen readers. While open, everything else is inert (the rest of the header included, the menu button excepted), so the page behind cannot be reached by keyboard or screen reader, and it does not scroll (Lenis paused). Focus moves to the menu button, Tab wraps between it and the drawer's links (a nav named "Site pages"), and focus returns to the button on close. It closes on the menu button, the scrim, Escape, a link, a swipe right of more than 60px, and when the window widens past 1080px. Reduced motion: a 0.3s fade, no slide or stagger. This closes health check F-10.
- Design exception, decided for the drawer: its links have no dividers between them, unlike the rest of the site's rows.
- Partners, Initiatives, Careers, Privacy and Terms are reached from the footer, not the header. The footer's legal links read "Privacy policy", "Privacy choices" and "Terms" (sentence case; the legal pages' own wording is unchanged). Commons is linked from the About page and the Initiatives page instead.
- Footer: three columns of four links (Studio, Company, Start). Below 768px the headings show, Studio and Company sit side by side, and Start follows with its links in two columns, row by row.

- Action names (owner decision, Nov 2026): the main action is "Plan your project" everywhere, in sentence case, to /start (a heading reads "Plan your project."); the second action is "Book a discovery call", in sentence case, to DISCOVERY_CALL_URL. Guard: tests/one-action-name.test.ts. Every other button and link label is in sentence case too ("Send my brief", "Try again", "Learn more"), never Title Case (22 Nov 2026; guard in tests/audit-pr1.test.ts).

NOT BUILT: the earlier "Menu +" overlay with a 48px bar, link counts ("Work 04") and a "Close" label was never shipped, and the full screen panel it replaced is gone. Do not rebuild either without the owner's approval.

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

AS BUILT (since 22 Nov 2026): one path in every browser, no scroll linked animation-timeline: view() (it reversed on the way back up and left content half faded on the first screen). An inline script in the root layout's head, src/app/layout.tsx (REVEAL_ARM_SCRIPT, src/lib/reveal.ts; it skips /studio; <html> carries suppressHydrationWarning for its two attributes), sets html[data-js] and html[data-reveal] before the page paints, only when JavaScript runs; ClientShell sets data-js on mount if it is missing (never data-reveal); the hidden starting states in globals.css ("The shared reveal") apply only under it, so a page without JavaScript shows everything at full strength. ScrollObserver adds .in-view once to every element in REVEAL_SELECTOR: at once for anything already on screen (any part of it), as it enters for the rest (its top a tenth of the screen in), and for elements added later (a MutationObserver); it never removes the class. If ScrollObserver has not started within 4s, the script disarms the page and everything shows. Reduced motion: nothing is hidden. Classes: .css-reveal, .scroll-reveal-up, .scroll-clip-reveal, .reveal-clip (curtain wipe; a fade up below 768px), .reveal-stagger-parent (children 80ms apart), .reveal-text, and the About and Insights cascades. Elements whose class string changes after render (React rewrites className) must carry their changing state in a data attribute instead, or the reveal is lost.

### Layer 4: Hover Interactions

CURRENT BEHAVIOR — Various hover effects across components.

EVOLVED BEHAVIOR — Standardize to a consistent interaction vocabulary:

ACCORDION ROWS (services, brands):
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
- Standalone action links, the second shared style (recorded 22 Nov 2026): a link that must read as a link at rest, on its own line inside a panel, shows its 1px Obsidian underline at rest and wipes it out to the right on hover (scaleX(1) → scaleX(0), origin left at rest, right on hover, 0.3s). Used by the homepage What we do "<Service name> in detail" (wwd.css) and the Living Index invitation link, "Plan your project" (work-index.css, on /work and in the homepage Selected work). Every other text link uses the wipe in above.

BUTTONS:
- Primary: light sweep overlay via ::before translateX(-100% → 0) over 0.4s
- Secondary: dark fill sweep via ::before, text color inverts
- Magnetic hover: button follows cursor at 0.15 strength via translate3d

NAVIGATION LINKS:
- Same underline wipe as text links

### Layer 5: Section Composition

EVOLVED PATTERNS for how sections are structured:

NUMBERED SECTIONS:
- Major sections get a number label: "(01) Selected work", "(02) What we do", etc.
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
- Minimum image height on desktop: 400px for inline images, 500px for hero/featured images. Exception: the /work image window, 400px to 590px, following each image's proportion
- Aspect ratios: 3:4 portrait for project cards, 4:3 landscape for case study heroes, 16:9 for full-width banners
- Images enter viewport with clip-path reveal: inset(0 100% 0 0) → inset(0 0 0 0) over 0.8s
- On hover (when image is a link): scale(1.03) zoom
- All images use Next.js Image component with proper sizes, alt, and priority attributes
- Sanity sources (since 23 Nov 2026, site audit S-03 and S-08; guard tests/image-sources.test.ts): every on-page Sanity image is built by imageSource in src/lib/sanity/image.ts, at least twice the width it is shown at and capped at 2400, fit max (never enlarged past the original), automatic format, quality 90, so next/image does the one real compression and serves each screen its width from sizes. Caps: the case study hero, project cards, related rows and block images 2400 (CASE_IMAGE_WIDTH); Insights featured and article hero 2400, cards 1200, images in an article's text 1600; the homepage hero 2400, the What we do preview 900. Only the crops keep their own chain: share images (1200 by 630) and the square network photos (800, quality 90). Insights frames crop with object-fit at the Studio hotspot (insightImagePosition, the homepage hero's rule; the centre without one). The sources themselves are the limit: every case study featured and homepage hero image is under 2880px wide today, so they stay soft on 2x screens until larger exports go into Studio.
- Placeholder state (before real images): --bg-shift background, no text, no labels

### Layer 7: Loading and Empty States

- No spinning loaders anywhere
- Page loads: content enters via the staggered reveal system. The page appears to "build" itself.
- Form submissions: button text changes to "Sending..." with reduced opacity
- Empty content states: a quiet centered message in --text-muted, no decorative elements
- Skeleton loading: not built (pages are static or ISR, so content arrives with the HTML). If ever needed: thin horizontal bars (8px height, --bg-shift fill, subtle pulse animation) in place of text blocks
- Without JavaScript (since 22 Nov 2026, homepage audit H-14; guard tests/needs-js.test.ts): nothing visible does nothing. Controls that only work with JavaScript carry .needs-js and stay hidden until the inline script in the root layout sets html[data-js] before the page paints (the menu button, Pause, the Living Index choice lists, the Proof index, the Start chips and their help line, Top, the Insights filters, the Brand Pulse and planner start buttons, Copy text on /partners, Copy link on articles, the careers Apply buttons), so nothing flashes with it. Controls that carry content are plain text until the page runs in the browser: the What we do row headings and phone words, and the Living Index choices (no underline or chevron without JavaScript). The contact, careers and article newsletter forms post to their route, which answers a plain post from the site with a written page (src/lib/no-script-page.ts), so nothing goes into a page address. The services and questions accordion (ServiceDetailAccordion, protected; owner approved, 22 Nov 2026) shows every answer without JavaScript, its triggers plain headings and no plus; its closed panels collapse only under html[data-js] (data-open, globals.css), and the buttons, inert and inline heights arrive once the page runs, so nothing flashes and layout shift stays 0. The questions, their order, their wording and the FAQPage JSON-LD are unchanged.
- The 404 (since 23 Nov 2026, site audit Step 1b; guard tests/not-found.test.ts): an address no route matches reaches the root src/app/not-found.tsx, which Next.js builds as /_not-found and answers with a 404 status as real HTML: the site shell (src/components/layout/SiteShell.tsx, shared with (site)/layout.tsx), so the header, the arming script in the head, the copy and the footer read in full without JavaScript. Title "Page not found", noindex, follow, no canonical. There is no catch-all route: it would turn every unknown address into a notFound() call. notFound() from a site page (a missing case study, article, initiative, service or archive page, and /initiatives/foundry on purpose) uses (site)/not-found.tsx, with the same copy (NotFoundContent) and metadata: a correct 404 status and noindex, but Next.js 16 draws it in the browser only (vercel/next.js #99287, open in 16.4.6 and 16.5.0-canary.60). Owner decision, 23 Nov 2026: no proxy in front of the slug pages to change that; revisit when a Next.js release draws notFound() on the server.
- Errors: src/app/(site)/error.tsx shows "This page could not load right now." inside the site layout, with Try again, the homepage and /contact; src/app/global-error.tsx shows the same outside it. Both are noindex.

---

## PAGE-SPECIFIC INTERACTION MAPS

### Homepage
Flow, as built (src/app/(site)/(home)/page.tsx): Hero → (01) Selected work → (02) What we do → (03) Proof → (04) Start, then the footer. No Next page link on the homepage. The Testimonials carousel, the Proof counters (50+ projects, 12+ years, 8+ industries), "Two ways to start" (ToolBand) and the dark homepage call to action (CtaSection) are gone.

- Hero (src/components/homepage/HeroSection.tsx, a server component, with the client parts HeroInteractive, HeroImages, HeroCaption, HeroLine and HeroPause; styles in hero.css; words, timings and helpers in src/lib/homepage-hero.ts). Projects from getHeroProjects, the Studio "Homepage hero" fieldset. The H1 stays visually hidden (protected), then the label "(Brand identity studio, Toronto)".
  - Layout: above 1080px the hero fills the first screen under the header; the image runs from 46% of the width to the right edge, full height, and the text column holds the label (64px under the header), the value line and, at its foot, the caption (44px above the hero's bottom). At 1080px and below: the image first (full width, clamp(380px, 110vw, 620px) tall), the caption 12px under it, then the label and the value line.
  - Value line: "Brand identity, design and digital for growing businesses.", weight 500, -0.03em, three lines always reserved so no word length moves anything. Nothing in it is interactive, at any width (no list, no button, no plus). The visible line is aria-hidden; screen readers read the sentence once, with "businesses", from a visually hidden copy, and word changes are not announced.
  - The word follows the image, at every width: while a project's image shows, the word is that project's Studio "Field word" (heroWordFor in src/lib/homepage-hero.ts). The first image on the first pass shows "businesses"; once the rotation has looped, the first project shows its own word; a project without a field word shows "businesses" for its turn. A new word needs no code change: add a project with "Show in the homepage hero" on and a Field word set in Studio. The word sits on a marker band: Cloudy White behind the word, 3px wider each side, from 0.12em below the line's top to 0.02em above its bottom, with the full stop just outside it (the stop belongs to the word and leaves and arrives with its letters, so nothing already on the page moves). At 1080px and below the word starts its own line, kept whole, so no word length moves the lines above it: layout shift from a word change is 0 there (measured at 320, 360, 390, 768 and 1080). Above 1080px a short word ends line two and a longer one starts line three, as before; each word arrives in a box of its own (keyed by the change, with the space before it), so nothing already on the page moves and the layout shift is 0 there too (measured at 1081, 1280 and 1440; the line is pixel identical in screenshots of every word, since 22 Nov 2026). A change: as the old image starts to fade, the band wipes away to the right while the letters rise out (240ms, 12ms apart); then, as the new image fades in, the letters rise in (600ms, 25ms apart) while the band wipes in from the left (700ms).
  - One clock: the images, one per project (its first hero image, in hero order), hold 5s each, the first included, at every width, and crossfade over 1.2s (1.4s at 1080px and below); the word changes with them. A 2px progress line along the image's foot is the clock. When it ends, the rotation moves on only once the next image has loaded and decoded: a late image holds the current image, its word and its caption (the line stays full) until it is ready, then they change together and the line starts again; a broken image never stalls it. Pause, a pointer, keyboard focus or a finger on the image hold the image and its word together, a late image included.
  - Links: the whole image and "View project" go to the project on screen (/work/slug); the image takes the site cursor's View state. Both are named "View project: <Hero name>" (VIEW_PROJECT and heroLinkTopic, src/lib/homepage-hero.ts): the visible words first, the name as sr-only text, no aria-label (WCAG 2.5.3); the image link has no visible words, so its slides are aria-hidden and it carries the same sr-only text.
  - Pause: a small button over the image, bottom right, because anything that moves on its own for more than five seconds needs one (WCAG 2.2.2). It stops the images and the word, so it is named "Pause the animation" / "Play the animation", its name switching with its icon (pause bars / play triangle) and no aria-pressed (a changing name and a pressed state together read as a contradiction; changed 22 Nov 2026). Each press sends hero_pause_toggle { state }. Shown only when something moves (two projects or more, motion allowed).
  - Reduced motion: nothing moves: the first image only, "businesses" on its band, no entrance, no Pause.
  - Caption: the project's hero name, its hero line (desktop only) and "View project". Intended: no Client or Exploration tag in the hero; the case study page carries it.
  - Images: next/image at quality 60, served as AVIF or WebP, from a quality 90 source built by the Sanity image builder with the Studio crop (at most 2400px wide); the hotspot as object-position; sizes "(max-width: 1080px) 100vw, 54vw"; the first image preloaded with high fetch priority (it is the LCP element), the rest lazy. "Contain" images sit inside the frame on Cloudy White.
  - With no hero projects: the text column only, beside an empty Cloudy White column (no image column on phones); nothing moves and there is no Pause.
  - Not read: the Studio "Field". It stays filled in Studio for later use; getHeroProjects does not query it (since 22 Nov 2026).
  - Analytics: hero_project_click { project, source: image or caption }, hero_pause_toggle { state }.
- (01) Selected work (src/components/homepage/SelectedWorkSection.tsx, server; the client island src/components/work/index/HomeWorkIndex.tsx with home-work.css): a short Living Index, the /work parts in a "home" mode (rows, lists and window shared through index-shared.ts; the six for each choice from homeOrders, rows numbered by homeRows, the closing link from homeAllWorkLink, all in src/lib/work-index.ts; data from getIndexProjects).
  - The section is named by its h2 (aria-labelledby, id selected-work-heading). Header row on the 12 column grid: the label "(01) Selected work" on 1 to 2; on 3 to 12 the h2 "See our work for [your kind of business]." (Inter 500, 46px, -0.03em, Gunmetal, the choice Obsidian; 32px at 1080px and below), its one choice built as on /work (the shared Choice: one continuous 2px underline under the chevron, role button, aria-expanded and aria-controls, Enter, Space, Escape). No discipline choice.
  - The list it opens: All work, the five business types with counts and up to three thumbnails across the whole portfolio (zero count options disabled), then "Something else? Tell us about yours" to /start. Thumbnails load only once the list has first opened.
  - Six rows from homeSelection: with no choice, the projects with Show on Homepage on, by Homepage order (fewer than six when fewer are featured); with a choice, every match from the whole portfolio first, then the curated ones fill to six. Numbers 01 to 06 in the order shown (the frame code follows), names 44px h3 links with the project's one view transition name (the hero names none), strips of three. With a choice: the matches (Obsidian), the question row with Plan your project, then the label "More from the studio" and the rest in Accessible Ash.
  - The choice is page state only: the address never changes. It carries forward through the closing row under the grid (hairline above), which holds only the link on the right: "All work (08)", or "All work for food and drink (03)" to /work?for=food-and-drink. The "Studio exploration" labels on rows and in the window stay.
  - Window and phones as on /work (sticky window, under the header and following it at 1080px and below, the row at its edge shown).
  - Performance: the hero image stays the LCP. Nothing here is priority or preloaded; the window image and the strip images render only after intent (a pointer or focus in the section, or the window scrolling into view once the page has loaded), and the home items carry no blurred placeholders, to keep the first download small. The page source carries the h2 and the six h3 links in the default order. No css-reveal on the rows; the section itself reveals.
- (02) What we do (src/components/homepage/what-we-do: WhatWeDoSection, a server component, with the client island WhatWeDo, WwdField, WwdRows and WwdPhoneWords; wwd.css; rules in src/lib/what-we-do.ts; approved on the canvas, desktop WWDSideBySide, phone WWDPhoneM1). It replaced The Argument and the Capabilities rows.
  - Content: every word from src/data/services.ts (number, name, tagline, description, deliverables as the disciplines: 9, 6, 8, 7). Every count is derived, including the heading number written as a word: "Four services. Thirty disciplines. One studio." (wwdHeading). The real work behind a discipline comes from the Studio "What we do" fieldset (getWhatWeDoWork); without it the word is plain text.
  - Desktop (above 1080px): the label over a full width h2 (48/56, -0.03em, 20px under the label; on one line, white-space nowrap, from 1280px up, two balanced lines between 1081 and 1279px) and, 16px lower, "Everything we make is built to work as one system, from the strategy to the last business card." (16/24 Gunmetal). 72px lower the keyword field and the service rows sit side by side, so a row and the words it lights are always on one screen; both start at the same top. At 1440 by 900 the heading, the whole field and all four rows with the first open fit at once (label to last row about 762px).
  - The keyword field: columns 1 to 7 with 56px right padding, sticky at --header-edge plus 32px and moving with --header-slide; 25/32, -0.02em, max 1100px. All thirty disciplines interleaved (interleave), a "/" at weight 400 in Accessible Ash in a 0.9em cell only between words on the same line (each term a nowrap flex item with its slash in front, the list pulled left one cell inside an overflow hidden frame). A word with work links to /work/<slug> with a 1px Marble Ash underline (0.16em offset); hover or focus swaps it for the hero's marker band (Cloudy White, 3px wider each side, from 0.14em below the line top, 0.9em tall, wiping in from the left over 0.4s), plus a 2px Obsidian focus outline. Pointing at a word shows a decorative 300 by 220 preview that never covers the word or its line (placePreview): its bottom left corner (the caption included) 24px right of the pointer and 24px above it, and never below the top of the word's line; mirrored to the left of the pointer when it would leave the viewport on the right, and placed below the pointer's line when it would rise above the header's edge; with "<Discipline> for <Client>" and the service name under it; next/image at sizes 300px, never priority, loaded only after the pointer first enters the field.
  - The rows: columns 8 to 12. An h3 holding a button (aria-expanded, aria-controls), padding 24px 0, the number (11px label, 24px wide), 16px, the name (25/32), then the count (two digits) and a 12px plus that turns into a minus (0.4s) on the right. The first open; one at a time. The panel (grid rows 0fr to 1fr over 0.6s; closed panels inert; without JavaScript every panel is open and nothing is inert: they collapse only under html[data-js], which the inline script in the root layout sets before the page paints, and inert is added only once the page runs in the browser, so nothing flashes or shifts), indented 40px to line up with the name: the tagline (20/28), the description (14/20 Gunmetal) 12px under it, "<Service name> in detail" to /services/<slug> 20px under that, 32px bottom padding. No "What it includes" list on desktop: the lit words in the field show the disciplines.
  - Lighting (a mouse, or keyboard focus; the rules in wwdLight, src/lib/what-we-do.ts; approved on the canvas as WWDLightShared): while nothing is pointed at, the open row keeps its disciplines Obsidian in the field and turns the rest Accessible Ash, by colour only (no bands at rest, and the open row has no ground). The row pointed at or focused takes a Cloudy White ground, 16px wider than its text on each side, fading in over 0.5s with the site easing (while it shows, the row's small text, the 11px number, turns Gunmetal with it, the .surface-cloudy rule), and its name loosens from -0.025em to -0.01em (0.5s ease); in the field, each of its disciplines takes the marker band (Cloudy White, background-position 0 0.14em, 0.9em tall, 3px wider each side, box-decoration-break clone, on the word's inner span .wwd-ink so it never fights a linked word's underline or hover band), wiping in from the left over 0.45s, 12ms apart in reading order, while the other words turn Accessible Ash. Leaving the rows (after 150ms) wipes the bands out and returns to the open row's colour only state; with every row closed, every word is Obsidian. Pointing at a field word keeps its own band and preview and turns the other services' names Accessible Ash. Reduced motion: the ground and bands appear at once, no stagger. Desktop only; phones unchanged.
  - Phone (1080px and below, minor third): heading 32/40, "Everything we make is built to work as one system.", no keyword field, the same rows (72px minimum, first open). An open row shows the tagline, the service's own disciplines as the slash field (20/32), every word a button (aria-expanded, aria-controls; underlined when it has work), then the detail link. A tap marks the word with the band and opens a card under the field (0.45s, one at a time, tap again or Close, a 44px target): the name, the description and, with work, "See it in <Client>". No images on phones.
  - Reduced motion: no stagger, the band at once, no height animation, no preview motion.
  - Analytics: home_wwd_service_open { service }, home_wwd_word_click { discipline, has_work, layout }, home_service_click { service } on the detail links. No hover events.
- (03) Proof, "What every client can count on." (src/components/homepage/proof: ProofSection, a server component, with the client island ProofLight; proof.css; promises, copy and rules in src/lib/proof.ts; approved on the canvas, desktop ProofScrollLit, phone ProofScrollLitPhone). It replaced the Testimonials carousel and the Proof counters.
  - Content: four chapters in order, each a label, a promise (h3) and one client quote: 01 Understanding "We learn your business before we design for it. The strategy is agreed with you first." (Siddhartha Sharma), 02 Time "First concepts within two weeks. A reply within one business day." (Lovejot), 03 Effort "Two revision rounds included. The thinking happens before the drawing." (Keval), 04 People "One senior contact, from the first call to the final file." (Yanina). The promises live in code and are true on every project: never add numbers, statistics, prices or an exit or refund line. Each quote is the testimonial's excerpt with its key phrase on the marker band, captioned "Name, Role"; the testimonials come from Sanity, with the coded TESTIMONIALS as the fallback per promise (see SANITY).
  - Structure: section aria-labelledby the h2; an ol of chapters, each an h3 then a figure with blockquote and figcaption; the key phrase a span with the band. The server renders 01 lit and the rest at rest, the island's first state, so nothing flashes and all of it reads without JavaScript.
  - The light (both widths): one chapter lit at a time, 01 first. Lit: promise, quote and name Obsidian, and the key phrase's Cloudy White band wiping in from the left (background-position 0 0.14em, size 0% to 100% by 0.9em, 0.7s with a 0.12s delay, 3px wider each side, box-decoration-break clone; the band is a one colour background image so it can wipe). At rest: Accessible Ash, colour only, never opacity, band at 0%. Colour 0.5s; the desktop promise loosens from -0.025em to -0.02em when lit. Scroll decides: the last chapter whose top has crossed 55% of the viewport (IntersectionObserver, root margin 0 0 -45% 0, no scroll listeners); the list gets measured bottom space only if the last chapter could not reach the line.
  - Desktop (above 1080px): 12 columns, 160px vertical padding. Columns 1 to 4 sticky at --header-edge plus 48px, moving with --header-slide: the label, the h2 (48/56, -0.03em, balance), and 48px lower the index (ol "Our promises", max 240px): buttons with the number (11px, Accessible Ash) over the name (16/24, 500), padding 12px 0 12px 20px, a 2px Obsidian bar on the left (scaleY from the top, 0.5s) and aria-current="step" for the lit one. A click scrolls its chapter to 30% down the viewport (never under the header; Lenis when it runs, instant with reduced motion); keyboard focus on a button lights its chapter (2px Obsidian outline, 2px offset). Columns 6 to 12 the chapters: hairline above, 40px padding, at least 420px tall; promise 31/40; the figure 40px lower, max 520px, quote 20/28, caption 14px under it. Pointing at a chapter (a mouse, above 1080px) lights it until the pointer leaves the list. No per chapter label: the index carries the names.
  - Phone (1080px and below): one column, 96px vertical padding, no index; h2 32/40 16px under the label; chapters with a hairline, 24px padding, at least 360px tall, the label "01  Understanding" (11px, following the light), promise 24/32, quote 16/24, caption 10px under it. Scroll only. A zero height sticky shell at the section's top (at --header-edge, moving with --header-slide, z-index 20, under the header and the drawer) holds the compact bar on Silver Mist: "(03) Proof" and the count "02 / 04", the title at 20/28, and four 2px segments (Obsidian up to the lit chapter). It fades in and drops 8px over 0.4s once the h2 has scrolled under the header (IntersectionObserver on the h2), hides when it comes back, and leaves with the section (the section clips it). Decorative: aria-hidden, nothing focusable.
  - Reduced motion: every chapter Obsidian with its band, no transitions, letter-spacing -0.02em; the index bar, the segments and the compact bar update at once.
  - Analytics: proof_index_click { promise } on desktop index clicks only. No images, no new dependencies.
- (04) Start, "Tell us about your business. We come to the call prepared." (src/components/homepage/start: StartSection, a server component, with the client island StartSheet; start.css; copy and rules in src/lib/home-start.ts; approved on the canvas, desktop HomeStart2, phone HomeStart2Phone). It closes the homepage and replaced "Two ways to start" and the dark call to action.
  - Content: the label "(04) Start", the h2, and "Five quick questions, then pick a time. A 30 minute call with the studio. No pitch, no obligation." ("Five" is the planner's own question count, stepCount, written as a word; "30" is DISCOVERY_CALL_MINUTES in src/lib/constants/booking.ts). Door links under a hairline: "Not sure what needs work? Take the Brand Pulse. One minute, free." (/brand-pulse?from=home_start) and "Rather skip the questions? Book a discovery call." (DISCOVERY_CALL_URL, tracked by the site wide discovery_call_click listener). No prices.
  - The call brief (a Silver Mist sheet): "Your call brief" and the count ("0 of 5"), "Started <day> <Month> <year>" in Toronto time (written after mount only), a "Business" row when a business type was chosen in (01) Selected work (page state shared through src/lib/home-choice.ts, never the address), question 01 in the planner's own words (NEEDS) with every one of its options as chips, in its order and words (SERVICE_IDS and SERVICE_LABELS: Brand identity or rebrand, Website, Photography, Video, Packaging design, Positioning or brand strategy, I need help defining the work), the later questions as labels by the planner's short names (TOLD_QUESTIONS: Starting point, Success looks like, Priorities, Timing; Priorities is skipped and the count reads "of 4" when the visitor is unsure, as in the planner), "Then / Choose a time for your call." (ACTIONS.book), the full width "Plan your project" button, and the planner's CALL.line under it. Nothing is retyped from the planner.
  - Chips: the planner's own rule (toggleMulti in src/lib/project-planner/engine.ts, shared): up to three (aria-pressed), and "I need help defining the work" stands alone (choosing it clears the others, choosing another clears it); a fourth tap does nothing; at rest a Marble Ash border, chosen Obsidian with Silver Mist text, hover border Obsidian, 44px tall, 0.3s. Any chip makes the count "1 of 5" and turns "02 Starting point" Obsidian; an aria-live polite line says what changed ("Brand identity or rebrand, Website added. 1 of 5 answered."). "Plan your project" goes to /start?service=identity,website&begin=1&from=home_start (the planner's ids; the planner opens with them chosen, on question 02), or /start?begin=1&from=home_start with none. from=home_start is the site's placement convention for links within the site (parsePlacement in src/lib/project-planner/start-links.ts and src/lib/brand-pulse/entry.ts): a brief or a Brand Pulse result started here records attribution.entryPlacement "home_start" (tests/home-start-attribution.test.ts). src/lib/lead-source.ts, the session's first page, is unchanged. The discovery call link carries nothing. The planner has no business type question, so the Selected work choice is not passed on.
  - Desktop (above 1080px): Obsidian, 160px top and 140px bottom padding, 12 columns. Columns 1 to 5: the label (Marble Ash), the h2 (52px, -0.035em, line height 1.08, Silver Mist) 28px under it, the line (16/1.6 Marble Ash, max 420px) 24px lower, the door links 72px lower (hairline in Gunmetal above, 15px, Marble Ash, links Silver Mist with a 1px Marble Ash underline). Columns 7 to 12: the sheet, 36px padding. The button: full width, 56px, the site's primary button and its sweep, 14px 500.
  - Phone (1080px and below): one column, 72px top and 80px bottom padding, h2 34px, line 15px, the sheet next (24px padding, 8px wider than the text each side), then the door links 40px lower.
  - Motion: once, when the sheet first comes into view (IntersectionObserver on its unclipped wrapper), the sheet wipes open from the top (clip-path inset 0 0 100% 0 to 0, 0.8s, cubic-bezier(0.77, 0, 0.175, 1), 0.2s delay), then its hairlines draw from the left (scaleX, 0.6s, the site easing, 80ms apart). Armed only in the browser, so without JavaScript the sheet simply shows. Reduced motion: no wipe, no draw.
  - Analytics: home_start_chip { service, selected }, home_start_plan_click { services_count }.
- About Preview and Brands sections no longer exist.

### Work Page (the Living Index)
As built (src/app/(site)/work/page.tsx, server; the client island in src/components/work/index: WorkIndex, WorkSentence, WorkChoicePanel, WorkRows, WorkWindow, use-work-window.ts, work-index.css; words and rules in src/lib/work-index.ts; data from getIndexProjects).
- Top: the label "Work (08)" (the count), a visually hidden H1 "Work: brand identity, packaging, websites and photography by House of Singh Studios, Toronto", then the sentence "Work for [your kind of business], in [every discipline]." as the page's h2 (since 22 Nov 2026, so the outline runs H1, H2, then the project H3s; Inter 500, 76px, -0.04em, line height 1.08, Gunmetal; the choices Obsidian; 34px at 1080px and below).
- The choices: span role="button" (a button cannot wrap across lines), aria-expanded and aria-controls, Enter and Space open, Escape closes and returns focus. One continuous 2px Obsidian underline (a bottom border, box-decoration-break clone) runs under the words and a CSS chevron glued to the last word; the chevron turns 180 degrees when open (0.4s) and drops 2px on hover. Choosing writes the chosen words into the sentence.
- The lists: one open at a time, opening by height (0.55s) and pushing the page down; a "Close" text button. Business: All work, the five business types, then "Something else? Tell us about yours" (Plan your project, /start). Discipline: Every discipline, Identity, Packaging, Websites, Photography. Rows 28px Inter 500 with a hairline above; on the right up to three 32px thumbnails and the count, combined with the other current choice. An option with no match is Accessible Ash, aria-disabled, and cannot be chosen. At 1080px and below: 48px rows, no thumbnails.
- The index (12 columns): the list on 1 to 6, the image window on 7 to 12. A row: the number hanging in the page margin (above the name on phones), the name as an h3 link (48px, -0.035em) carrying the project's one view transition name (project-<slug>), a strip of up to six index images 24px tall at their true proportions (decorative), then "Sector. Deliverables." in 12px Gunmetal with the year and, for non client work, its type label on the right. 24px padding, hairline above.
- Order: rankProjects. Matches first, then an invitation row (1px Obsidian rule, the business type's question, else the discipline's, and "Plan your project" to /start), then an h2 "Other work" and the rest, names in Accessible Ash and strips at 30 percent. No match: "Nothing for that combination yet." and everything under Other work. Nothing is ever hidden. Rows that reorder carry no css-reveal; the page section enters once instead.
- Hover: the row pointed at (or focused) keeps Obsidian and loosens to -0.025em; every other name turns Accessible Ash (colour, never opacity).
- The image window: decorative (aria-hidden, no links, nothing focusable), sticky at 120px, 590px wide, object-fit cover at the hotspot, height clamp(400px, the image's proportion, 590px) easing over 0.6s. Under it: the frame code ("04B") and "02 / 03" (not for single image projects), the name with "Client work" or "Studio exploration", the one line (Hero line, else the overview's first sentence), "View case study". Pointing at a row flips its images every 1.4s on a 2px Silver Mist time line; pointing at a strip image holds it; keyboard focus plays one round, then holds; leaving the list keeps the last project. The next image is fetched before its turn (getImageProps). Never priority; strip images sizes 60px, lazy.
- 1080px and below: one column; the window full width, 220px tall, sticky at --header-edge (under the header, or at the top while the header is slid away, moving with it over --header-slide), with the frame code and name; the row crossing the window's bottom edge (IntersectionObserver) is the one shown. Strip images are not tappable. No grid, list or switch.
- Reduced motion: no flip, no time line, no height easing, no list or entrance animation.
- The address: ?for=<business type>&in=<discipline> (parseWorkParams), written with router.replace (scroll false). The page stays static (ISR 60 s): the island reads the address in the browser, and its Suspense fallback is the full list in the default order, every name an h3 link, in the page source. Canonical /work for every address; not in the sitemap.
- An aria-live polite status says what a choice did: "2 projects for food and drink brands. 6 more below."
- The case study cards (WorkCards.tsx, DisciplineTags) stay for the Initiatives pages and /services; their tags are plain text.
- Shared with the homepage's (01) Selected work, which uses these parts in a home mode (see Homepage).

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
- Process step numbers (01 to 05): 28px to 40px (24px below 900px), weight 500, so large text; Accessible Ash at full strength (4.64:1), Gunmetal on the hover ground; read with their step, not hidden from assistive technology (since 22 Nov 2026)
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
- src/data/packages.ts stays, without prices: only the three package names and timelines, which the planner reads (the retired page's other fields were removed on 22 Nov 2026).

### Project Planner (/start)
- Multi step brief builder. Rendered on every request (it reads ?service and ?begin). Described everywhere as "Plan your project in two minutes. We come to the call prepared."
- ?service= preselects up to three known services, comma separated, in order (parseService in src/lib/project-planner/start-links.ts; a single value works as before; unknown ids and repeats are ignored; "unsure" only alone). With ?begin=1 as well, question 01 is answered and the planner opens on question 02 (plannerOpening); ?begin=1 alone opens question 01.
- No prices (decided 20 Nov 2026): no price guide, starting price, fit note or budget comparison, in the planner, its brief, its result, its share image or anywhere it is described. Only the brand package timelines show, for brand identity as the main focus. The optional "investment range" question stays: it is the visitor's own range, sent to the studio.
- It ends in the call: the brief's main action is "Choose a time for your call" (DISCOVERY_CALL_URL, with the brief's notes), under it "Your answers go to the studio before the call, so we start with your business."; "Send my brief" stays second, with every form protection. The viewed event has already sent the answers to n8n, keyed by the brief id that the booking notes carry.
- The Service Pricing schema, its desk entry and the Studio singleton code were removed on 22 Nov 2026 (nothing read them). The document itself (id "servicePricing") was deleted from Sanity on 22 Nov 2026, with the owner's approval; nothing referenced it. The n8n payload no longer carries the price fields (priceSource, brief.priceLines and brief.fitNote, removed on 22 Nov 2026; docs/integrations/n8n.md).

### Brand Pulse Check (/brand-pulse)
- Self contained multi step tool with a shareable result (?r=, never indexed). Rendered on every request.
- The result never moves the page (since 23 Nov 2026, site audit S-02; guard tests/brand-pulse-guide.test.ts): the moment the last answer is chosen, the whole result, follow up included, goes in place, hidden and inert, in the same grid cell as the question and then the reading screen, which sit over it (.bp-stack, BrandPulse.tsx), so the page reaches its height on the click itself. When the reading ends, the parts show in the same order and timing as before (header, vital signs, paragraphs, services and follow up, 400ms apart) by opacity and transform only (data-shown, staged() in PulseResultView.tsx); a part not yet shown is invisible and inert, so Tab and screen readers skip it. Focus moves to the result heading. Reduced motion shows everything at once. Layout shift after the last answer: 0 at 390, 1080 and 1440, on /brand-pulse and /ai (it was 0.54, 0.31 and 0.15). The shared result renders every part shown.
- Below the tool, only when the page is not a shared result: PulseGuide, a server component built from the Initiatives numbered sections (label, section heading, editorial split, numbered rows, questions accordion). (01) What the Brand Pulse Check reads (the five VITALS), (02) How it works (three steps), (03) The brand profiles (the eight PROFILES), (04) Questions (four, with their FAQPage JSON-LD, which exists only with the section). Copy: GUIDE in src/lib/brand-pulse/content.ts; "Seven" and "five" come from the question and vital sign counts, the call length from DISCOVERY_CALL_MINUTES. The result's sentences live in sentences.ts.

### Initiatives (/initiatives, /initiatives/parallel, /initiatives/commons)
- The initiatives overview and two programme pages. Other initiatives are listed but have no page; /initiatives/foundry returns 404 on purpose.
- Programme rows with a page: "Explore <name>" is the link, stretched over the whole row (its ::after, above the cover), so a click anywhere opens the page and keyboard focus outlines the row; its name is its visible words, then the tagline as sr-only text, no aria-label (WCAG 2.5.3, since 22 Nov 2026).
- Logos (optional, Sanity "logo" and "logoOnDark", SVG or PNG): only when set, the logo replaces the visible name in the programme rows (the h3 stays as visually hidden text; while a programme has no published project, the logo shows large in the row's panel instead and the small one is hidden beside it, on phones the small one always shows), sits above the unchanged H1 in the program hero (decorative in both, empty alt; the alt field stays required in Studio), and the page shares /initiatives/[slug]/share-image (logo on Silver Mist). Without a logo every page and its share image are as before.

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
- Custom cursor: hidden on touch devices; on a mouse, hidden until the pointer first moves, then starting at the pointer
- Tap areas (since 22 Nov 2026): every link and button on the homepage, its header, drawer and footer is at least 44px to the finger at 1080px and below. Block links take padding with an equal negative margin, so nothing moves (a full page screenshot at 390 was pixel identical before and after), and their underlines and bands are moved back under the words; inline links (Selected work names, the Start door links) take vertical padding only, which never touches a line; Pause keeps its 32px square with an invisible 46px layer. The skip link, shown only to the keyboard, is the exception. Since the site audit (S-10, 22 Nov 2026) the rest of the site follows: every link and button is at least 24px at every width and 44px at 1080px and below, by the same techniques; boxes that show their edges (the share buttons, Learn more, RGD) take an invisible 44px band centred on them instead of padding. Three exceptions: discipline tag links are 24.5px at every width (they wrap into rows, 8px apart where they are links, so none covers another), RGD inside the /about founder heading keeps the heading's 34px line (the heading clips its overflow for the text reveal), and the Insights filters are 44px tall but as wide as their word plus 20px, so neighbours never overlap ("AI" is 33px). The header and footer links above 1080px are 17 to 20px tall and pass WCAG 2.5.8 by its spacing rule. Guard: tests/tap-targets.test.ts.
- Navigation: wordmark + menu button at 1080px and below, in the 56px bar. The menu opens as a drawer from the right (Layer 1).
- Image sizes reduced for performance
- Stagger delays reduced or removed
- Column layouts collapse to single column
- Scroll-driven animations: simplified to basic fade-in via IntersectionObserver
- Stats: 2x2 grid below 600px
- Work page: one column, the image window sticky under the header, the row at its bottom edge shown

---

## PERFORMANCE BUDGET

Target: Lighthouse 80+ across all metrics. Experience takes priority over perfect scores.

- No animation libraries (GSAP, Framer Motion, etc.)
- All animations: pure CSS + IntersectionObserver
- Images: Next.js Image with proper sizes and priority
- Fonts: Inter loaded via next/font with display swap
- Cursor: requestAnimationFrame for 60fps tracking
- Page transitions: View Transitions API (native, zero bundle cost)
- Prefetch on intent (since 22 Nov 2026): links to other pages are IntentLink (src/components/IntentLink.tsx), the view transition Link with viewport prefetch off and router.prefetch on hover, keyboard focus or touch, so nothing is fetched before the visitor shows intent and Chrome logs no unused preloaded stylesheets (prefetching on sight fetched nine routes, about 130 KB, before any interaction, with 24 console warnings at 1440). The /work links (the header's Work and Selected work's All work) keep prefetching on sight: /work adds no stylesheet the homepage lacks. A hover to click measured 73ms. Guard: tests/intent-link.test.ts.
- Scroll reveals: one IntersectionObserver path in every browser (Layer 3), each element revealed once with a CSS transition. No scroll linked animation-timeline: view() for reveals since 22 Nov 2026; the 1px scroll progress line still uses animation-timeline: scroll()
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
| /insights/page/[page] (2 onwards) | ISR 60 s; the archive pages behind "Load more" (a real link), indexed with their own title and canonical, not in the sitemap; 404 past the last page. /insights/page and /insights/page/1 redirect (301) to /insights |
| /about, /careers, /initiatives, /initiatives/[slug] (parallel, commons) | ISR 60 s |
| /ai, /partners, /privacy, /terms | Static, refreshed daily (the founder portrait in every page's structured data is read daily) |
| /start, /brand-pulse, /contact | Rendered on every request (they read query parameters) |
| /sitemap.xml, /llms.txt | Refreshed hourly, and at once when Sanity publishes (/api/revalidate) |
| /robots.txt, og and share images | Static |
| Any address no route matches | The root not-found (/_not-found), built ahead, status 404, drawn on the server inside the site shell |
| /initiatives/[slug]/share-image | Rendered on request; redirects to /share-image.png when there is no logo |
| /studio | Sanity Studio, own route group, no site chrome |
| /api/lead, /api/careers, /api/subscribe, /api/brand-pulse, /api/project-planner | POST, forward to n8n (contracts: docs/integrations/n8n.md) |
| /api/consent-region | GET, decides strict consent regions |
| /api/revalidate | POST from the Sanity webhook, signed with SANITY_REVALIDATE_SECRET (constant time check, at most 5 minutes old); refreshes the whole site, the sitemap and llms.txt at once |

Redirects (next.config.ts, 301): /packages → /start; /plan → /start; /pulse → /brand-pulse; /journal and /journal/* → /insights; /work/meridian, /work/soulbound, /work/test → /work; /insights/page and /insights/page/1 → /insights. Unknown URLs give the site 404 (status 404, noindex, follow), drawn on the server; missing slugs give the same 404 status and copy, drawn in the browser (Layer 7).

When Sanity fails at runtime, pages keep their last good version (src/lib/sanity/resilience.ts); fallback content is used only while building.

Security, as built (audit of 20 Nov 2026, follow up 22 Nov 2026):
- Form routes take JSON only and check the Origin (src/lib/request-guards.ts): the live domain, the production alias house-of-singh-studios.vercel.app, this project's own deployment addresses (house-of-singh-studios-<9 letters or digits>-houseofsinghstudios-projects.vercel.app) and this deployment's own branch address (VERCEL_URL, VERCEL_BRANCH_URL). Never any other *.vercel.app; localhost outside production only.
- Headers (next.config.ts): CSP with frame-src 'none' and upgrade-insecure-requests (violations to /api/csp-report); HSTS two years with includeSubDomains, no preload (the preload list takes only houseofsingh.com); Permissions-Policy turns off camera, microphone, geolocation, payment, usb, serial, hid, display-capture and browsing-topics; COOP same-origin-allow-popups. /studio has its own CSP (frame-src 'self', form-action 'self') and X-Robots-Tag noindex, nofollow.
- Rate limiter (src/lib/rate-limit.ts): each request counts under the first x-forwarded-for address and, when it differs, Vercel's own client address too (clientAddresses).
- Form text: a value that is not a string is empty (a 400, never a 500); one line fields collapse line breaks; landing pages are paths on this site only. Text is sent to n8n as plain text, not HTML encoded: n8n escapes it wherever it builds HTML (docs/integrations/n8n.md); React escapes what the site shows.
- /api/revalidate: the Sanity signature compared in constant time, refused when its timestamp is over 5 minutes from now, the body read up to 64 KB before checking.

---

## ENTITIES AND NAMING (search engines and AI assistants)

Three entities, kept apart and linked by shared @ids in the structured data (src/lib/schema.ts,
src/lib/site-graph.ts) and described in plain sentences in llms.txt ("Who is who", src/lib/llms.ts):

| Entity | What it is | @id | Owned by |
|---|---|---|---|
| Maninder Singh | Person: creative director, photographer and multidisciplinary designer, RGD; founder and creative director of the studio | https://houseofsingh.com/#maninder-singh | houseofsingh.com |
| House of Singh | Parent brand and creative practice of Maninder Singh, since 2014; a registered Canadian trademark | https://houseofsingh.com/#organization | houseofsingh.com |
| House of Singh Studios | The design studio, a venture of House of Singh, founded in Canada in 2023 | https://studios.houseofsingh.com/#organization | this site |

- houseofsingh.com (a separate repository) owns the person and the parent brand entities. This site
  only references them by those @ids (the Person node here describes the same person, with the same
  @id); it never mints its own ids for them.
- Wording: the studio is a "venture" of House of Singh. Never "division" or "subsidiary".
- Never publish the studio's exact founding day or month, anywhere (copy, metadata, JSON-LD,
  llms.txt): founded in 2023, nothing more. foundingDate is "2023". The founder's "14+ years" is
  personal experience, not the studio's age; do not change it.
- Never publish the trademark registration number: "HOUSE OF SINGH is a registered Canadian
  trademark", no number. Tests guard llms.txt and the JSON-LD against both.
- The founder's titles, always in this order: "creative director, photographer and
  multidisciplinary designer" (the Person description: "Creative director, photographer and
  multidisciplinary designer based in Toronto, Canada."). His job title on this site stays
  "Founder and Creative Director". RGD is "RGD (Registered Graphic Designers of Canada)".
- The founder's profiles (Person sameAs, src/lib/constants/profiles.ts), in this order: RGD
  (https://rgd.ca/members/profile/manindersingh), LinkedIn
  (https://www.linkedin.com/in/manindersingh333), Instagram (https://www.instagram.com/houseofsingh/),
  X (https://x.com/houseofsingh), Pinterest (https://ca.pinterest.com/houseofsingh). Match
  houseofsingh.com.
- houseofsinghstudios.com redirects to https://studios.houseofsingh.com at the Vercel domain level
  (not in next.config.ts); studios.houseofsingh.com stays the only canonical address.

## PRICING

Decided by Maninder, 20 Nov 2026: the site never shows the studio's own prices, not even a starting
price or a floor, in copy, the Project Planner, the contact form, structured data (no priceRange) or
llms.txt. Every path leads to a call or meeting; price comes last, after the call, in the written
proposal. Market price ranges for the industry (service FAQs, Insights articles) are allowed. The guard
is tests/no-studio-prices.test.ts. Insights articles live in Sanity: edit them there to the same rule.

## Protected: intentional work, do not remove

These look unusual or redundant but are deliberate. Any change touching them needs the owner's approval. Report a genuine defect in one of them as a defect; never remove or weaken it as cleanup.

- SEO structure: the semantic H1 swap on service pages (the label is the H1, the hero line an H2), and visually hidden H1s (homepage, Brand Pulse and Project Planner states, the hidden "Brand Pulse result" H1).
- Hidden descriptive link text: the sr-only text in "Learn more" links on /services, after the visible text of each "<Service name> in detail" link in the homepage (02) What we do (moved there from the old Capabilities rows, owner approved; no aria-label, so the name starts with the visible text), and in footer social links; the header home link named by its own text, "House of Singh Studios" (no aria-label).
- Service FAQs and the questions accordion, with FAQPage JSON-LD.
- The structured data graph: ProfessionalService and Organization with @id, founder Person, Service, CreativeWork, Article, BreadcrumbList.
- RGD links (RgdLink and the auto linker in article bodies).
- SITE_OG and WEBSITE_OG (og:type, og:locale en_CA, og:site_name) and the share image routes.
- Related thinking, related work and related services modules, and src/lib/linking.ts.
- Sitemap lastmod (the static page date map) and llms.txt with its tests.
- Redirects in next.config.ts, and the intentional /initiatives/foundry 404.
- Consent gated GA4, Clarity and Speed Insights: in strict regions nothing loads before consent; elsewhere they load by default with notice and opt out (src/lib/consent.ts). Owner decision, 21 Nov 2026: keep this default; analytics outside strict regions load with notice and opt out, which suits PIPEDA (audit finding 22).
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

Sanity Studio is embedded at /studio inside its own route group and deploys with Vercel. Never run `sanity deploy`; it creates a separate hosted Studio that falls out of sync with the code. The one exception: `sanity deploy --external --url https://studios.houseofsingh.com/studio` (with `--schema-required`, so a schema that cannot be stored fails the run), run only by the workflow below; it registers our existing self hosted Studio and its schema with Sanity, and never builds, uploads or creates a hosted Studio.

Schema deploy is different, and automatic: `sanity schema deploy` uploads only the content model (the schema
document `_.schemas.hos-studios` in the production dataset), which tools such as the Sanity MCP server, Agent
Actions and Canvas validate against. It hosts nothing and changes no content. The embedded Studio never updates
that copy itself, so .github/workflows/sanity-schema-deploy.yml runs `npx sanity schema deploy --workspace
hos-studios` on every push to main that changes sanity/, sanity.config.ts or a file under src/ that they import,
directly or through their imports (twelve today, listed in the workflow; tests/sanity-schema-deploy.test.ts walks
the imports and fails when one is missing from the trigger), and by hand from the Actions tab. A second step then
runs that one exception, `sanity deploy --external --url https://studios.houseofsingh.com/studio --schema-required`: Sanity's tools
validate against the registered Studio (user application h8sx77qg2395sepru27oouhh, urlType external), whose schema
descriptor only this command refreshes; the URL matches that registration, so no new one is made. Its token is the
GitHub secret SANITY_SCHEMA_DEPLOY_TOKEN: a project robot token with the "Deploy Studio (Token only)" permission,
the least both steps accept (the deployStudio grant, no content write). Never put it in Vercel, in .env files or in
the code. In short: `sanity schema deploy` and the external registration, yes, through the workflow; any other
`sanity deploy`, never (the guard test allows only that command, with or without --schema-required, in every workflow and npm script).

Publishing refreshes the site at once: a webhook in sanity.io/manage posts to /api/revalidate, signed with
SANITY_REVALIDATE_SECRET (set on Vercel and on the webhook). Without it, changes wait for each page's own refresh.

Insights order (src/lib/insights-listing.ts): one hero, the newest post marked Featured, then every other
post newest first. Featured never pushes a newer post below an older one. A future publishedAt is fixed in
Studio, not in code.

Homepage hero fieldset (Project documents, collapsed): "Show in the homepage hero" puts a project in the
rotating homepage hero; "Hero order" sorts it (client work always first, then explorations, then by order and
title, six at most); "Hero name" is the caption under the image; "Hero line" the short desktop line under it;
"Field word" is the word in the homepage line while the project's image shows (lower case, plural); "Field" is
not shown on the site at the moment, kept filled for later use; "Hero images" are one to four images, of which
the homepage shows the first; "Hero fit" fills the frame or fits inside it (website screens). Name, line, field, word
and images are required once the project shows. Read by getHeroProjects (src/lib/sanity/projects.ts, order
in src/lib/homepage-hero.ts); the homepage hero shows them.

Site Settings (sanity/schemas/siteSettings.ts): only the About page fields are read (studio image, founder portrait,
name, role, bio and second bio paragraph; src/lib/sanity/queries.ts). Founder role, bio and second paragraph say "When
empty, the About page shows the text written in the code." Hidden since 20 Nov 2026, not deleted (their data stays):
studioName, tagline, description, email, phone, location, instagramUrl, linkedinUrl, ogImage; nothing in src reads
them (tests/site-settings.test.ts).

Testimonials (listed in Studio as "Testimonials"; read by getProofChapters in src/lib/sanity/testimonials.ts, rules in
src/lib/proof.ts): quote, author, role, company, photo, related case study and featured as before, plus "Excerpt" (required,
the part shown in the homepage (03) Proof, copied exactly from the quote), "Key phrase" (required, the words on the
marker band, copied exactly from the excerpt) and "Promise" (optional: Understanding, Time, Effort or People; no two
published testimonials may share one). For each promise the homepage shows the published testimonial that supports it;
without one, or when Sanity fails while building, the coded testimonial for that promise (TESTIMONIALS in
src/lib/constants/homepage-data.ts, the fallback only), so a chapter is never empty. No Review or AggregateRating schema.
Publishing one refreshes the homepage through /api/revalidate, which refreshes the whole site for any document type.

What we do fieldset (Project documents, collapsed, after the Work index): "What we do" (whatWeDo) is up to twelve
entries, each a discipline (a dropdown of the thirty deliverable names from src/data/services.ts) and an image
with hotspot, crop and a required alt; each discipline at most once per project. Read by getWhatWeDoWork
(src/lib/sanity/projects.ts, picked in src/lib/what-we-do.ts): for each discipline, the first project listing
it that is marked client or Commons (explorations, Parallel projects and projects with no type are never used, so "See it in" never reads as client work when it is not), by Homepage order, then newest. The homepage (02) What
we do links that word to the case study and shows the image in its preview.

Project type (projectType, required since 20 Nov 2026): Client, Exploration, Parallel or Commons; new projects start
as Client. Studio requires it (a project without a type cannot be published; the field carries the three definitions)
and the portfolio import refuses a project.json without one (scripts/import-portfolio, checkProjectType, an error
naming the file). Every published project has a type. The client fallback in projectType()
(src/lib/initiatives/types.ts), used by the work index, the hero order, case study labels and tags, only guards old
data; What we do refuses an untyped project outright.

Work index fieldset (Project documents, collapsed, after the Homepage hero; for the Living Index on the
homepage's Selected work and on /work): "Business type" (sector) is one of Food and drink,
Events, Beauty and fragrance, Fashion and jewellery, Home and lifestyle, or Other (on /work, in no business
type; unset reads as Other), the list in src/lib/work-index.ts; "Index images" are up to six images with
required alt text, in order, for the strip under the project name and the image window (empty: the featured
image, then the page blocks' images in page order, each asset once, six at most; each image carries its hotspot
and crop, for heroObjectPosition); "Homepage order" sorts the
projects with "Show on Homepage" on in Selected work, lowest first, six at most. Read by getIndexProjects
(src/lib/sanity/projects.ts), mapped, ranked and selected in src/lib/work-index.ts (client work first, then
newest; a chosen business type or discipline moves matches to the top and hides nothing; ?for= and ?in=). The year
shown is the Studio "Year" only, nothing when it is empty; the publish date only orders the list.
