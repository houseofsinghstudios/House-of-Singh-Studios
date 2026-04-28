# House of Singh Studios, Engineering Operations Manual

This file sits beside CLAUDE.md. CLAUDE.md is the design and interaction constitution. This file is the engineering operations manual. Both are loaded at the start of every Claude Code session.

When the two conflict, design wins on visual decisions, engineering wins on operational decisions.

## Project Identity

Repo: studios.houseofsingh.com
Owner: House of Singh Studios Inc., Maninder Singh, Creative Director
Type: Editorial website with CMS backed insights and careers
Status: V2 redesign on branch claude/run-tests-WxtWY, merging to main when ready
Production URL: house-of-singh-studios.vercel.app

## Stack, locked

Next.js 16.1.6, App Router only. Never Pages Router.
React 19.2.3.
TypeScript strict mode.
Tailwind v4 via @tailwindcss/postcss. No tailwind.config.js needed.
Lenis for smooth scroll. The only approved animation dependency.
next-view-transitions plus the native View Transitions API for page transitions.
Vercel Speed Insights.
ESLint v9 with eslint-config-next.

## What is forbidden

No animation libraries beyond Lenis. Framer Motion was removed and stays removed.
No new dependencies without a written tradeoff approved by Maninder.
No Pages Router patterns.
No client components when a server component would work. Every client component needs a comment at the top of the file explaining why.
No raw img tags. Always next/image.
No inline styles unless dynamic.
No box-shadow. No border-radius unless explicitly approved. No gradients. No serif fonts. See CLAUDE.md.

## Run commands

Dev: npm run dev
Build: npm run build
Start: npm run start
Lint: npm run lint
Typecheck: npx tsc --noEmit

There is no test command yet. Manual QA on Vercel preview deployments. Visual regression with Playwright is on the roadmap, not yet active.

## Conventions

TypeScript strict. No any. Use unknown and narrow.
Functions under 50 lines. Files under 300 lines. Split when crossed.
One responsibility per component. Split when more than one.
Server components by default. Client components only when interactivity requires it, with a top of file comment.
Server side data fetching with fetch in server components. Never useEffect for initial loads.
Server actions for mutations. API routes only when an external client needs to call.
Validate every server input with zod or equivalent.

## House of Singh content standards

No hyphens in user facing copy.
No em dashes or en dashes.
No emojis.
Brand voice is short, confident, understated. No hype.
See CLAUDE.md for full design and interaction standards.

## Where things live

Source code: src/
App routes: src/app/
Components: src/components/
Library code: src/lib/
Static data: src/data/
Sanity schemas: sanity/schemas/
Audit reports: audits/AUDIT-YYYY-MM-DD-topic.md
Operations layer: .claude/

## Out of scope for this repo

OpenClaw lead generation system, separate repo
Personal brand content, IDEAS project, separate workspace
Client deliverables, separate workflow

## Escalation

Stop and surface to Maninder before proceeding if any of the following are true.

1. The change requires a new dependency.
2. The change touches the design system tokens in CLAUDE.md.
3. The change touches Sanity schemas in sanity/schemas.
4. The change touches src/app/api routes.
5. The change touches the View Transitions or Lenis integration.
6. The change touches anything in .claude.
7. A typecheck fails three times after fix attempts.
