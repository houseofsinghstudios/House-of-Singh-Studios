---
paths:
  - "src/app/**/*.tsx"
  - "src/components/**/*.tsx"
---

# Frontend Rules

These rules load when editing any tsx file in src/app or src/components.

## Architecture

Next.js 16 App Router only. Never Pages Router. Never Vite.
Server components by default. Client components require a comment at the top of the file explaining why.
Use loading.tsx and error.tsx for every route segment that fetches data.

## Components

Functional components only. No class components.
One responsibility per file. Split when more than one.
Files under 300 lines. Functions under 50 lines.
No new ui primitives without checking src/components/ui first. Existing primitives are Button and EditorialLabel.

## Animations and interactions

Pure CSS plus IntersectionObserver. No animation libraries.
Lenis is the only approved third party animation dependency for smooth scroll.
View Transitions API for page transitions, configured via next-view-transitions.
Easings are defined in CLAUDE.md. Use them, do not invent new ones.
Reveal patterns are defined in CLAUDE.md. css-reveal, reveal-clip, reveal-stagger-parent.

## Styling

Tailwind v4 utility classes via @tailwindcss/postcss.
No inline styles unless dynamic.
No box-shadow. No border-radius unless explicitly approved. No gradients.
Color tokens are defined in CLAUDE.md. Use the CSS variables, not hex values directly.
Typography is Inter only via next/font. Two weights only, 400 and 500.

## Data fetching

Server side fetch in server components. Never useEffect for initial loads.
Server actions for mutations on the same app.
API routes only when an external client needs to call.

## Images

next/image for every image. Never raw img.
alt text in House of Singh voice. Short, specific.

## State

Local state with useState is fine. For shared state, prefer URL state, then context.
Do not reach for a state library.

## House of Singh content standards

No hyphens in user facing copy.
No em dashes or en dashes.
No emojis.
Short sentences. Confident voice. Understated tone.
