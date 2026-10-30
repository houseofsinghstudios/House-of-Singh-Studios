# House of Singh Studios, Engineering Operations Manual

This file sits beside CLAUDE.md. CLAUDE.md is the design and interaction constitution. This file is the engineering operations manual. Both are loaded at the start of every Claude Code session.

When the two conflict, design wins on visual decisions, engineering wins on operational decisions.

## Project Identity

Repo: houseofsinghstudios/House-of-Singh-Studios (public on GitHub, deliberately; never commit secrets)
Owner: House of Singh Studios Inc., Maninder Singh, Creative Director
Type: Editorial website with Sanity backed work, insights, initiatives and careers, two interactive tools (Brand Pulse Check, Project Planner) and forms that hand off to n8n
Status: live. main deploys to production on Vercel; work happens on feature/next-work and merges through pull requests.
Production URL: https://studios.houseofsingh.com (canonical). The .vercel.app address is not the canonical site.

## Stack, locked

Next.js 16.4.2, App Router only. Never Pages Router. Turbopack builds.
React 19.2.3.
Node 22.12 or newer (Sanity requires it; CI runs Node 22.x).
Sanity 5 (embedded Studio at /studio) with next-sanity 12 for reads. Published content only, no token on the site.
TypeScript strict mode.
Tailwind v4 via @tailwindcss/postcss. No tailwind.config.js needed.
Lenis for smooth scroll. The only approved animation dependency.
next-view-transitions plus the native View Transitions API for page transitions.
Vercel Speed Insights.
ESLint v9 with eslint-config-next.

Browser support note. The View Transitions API is Chromium only. Safari and Firefox visitors see a default page change as a progressive enhancement fallback. This is the design intent. Do not investigate Safari hard cuts as bugs.

## What is forbidden

No animation libraries beyond Lenis. Framer Motion was removed and stays removed.
No new dependencies without a written tradeoff approved by Maninder.
No Pages Router patterns.
No client components when a server component would work. Every client component needs a comment at the top of the file explaining why.
No raw img tags. Always next/image (SVGs with unoptimized, as the header and footer crests do).
No inline styles unless dynamic.

Known gaps against these rules, to fix when the files are next touched, not as a reason to relax them: several client components could be server components (health check F-12), some client components have no top comment, about 400 static inline style objects remain (Careers, Privacy, Terms, AI Lab), and eight files exceed 300 lines (globals.css is about 6,000).
No box-shadow. No border-radius unless explicitly approved. No gradients. No serif fonts. See CLAUDE.md.

## Run commands

Dev: npm run dev
Build: npm run build
Start: npm run start
Lint: npm run lint (must pass with 0 problems)
Typecheck: npx tsc --noEmit
Test: npm run test (Node's built in test runner, with tsx to load TypeScript)
Content imports: npm run import:services, import:portfolio, import:roles (need SANITY_WRITE_TOKEN in a local .env.import, never committed and never on Vercel)

CI: .github/workflows/ci.yml runs npm ci, the type check, lint, the tests and a production build on every pull request and on pushes to main and feature/next-work. No secrets; the build reads only the public Sanity project id and dataset.

Unit tests (about 270, in tests/) cover: the Brand Pulse and Project Planner engines, links and events; analytics, consent, Clarity, campaign and lead source capture; the lead, careers and subscribe API routes, n8n posting and partner referrals; SEO (Open Graph, linking, sitemap dates, llms.txt, RGD links, inline links, alt text, article dates); copy rules for services, initiatives and partners; the Sanity resilience helper; the import scripts. Not yet covered: the project planner and consent region routes, rate limit responses, the consent and form components in a browser, and visual regression. Manual QA on Vercel preview deployments.

## Conventions

TypeScript strict. No any. Use unknown and narrow.
Functions under 50 lines. Files under 300 lines. Split when crossed.
One responsibility per component. Split when more than one.
Server components by default. Client components only when interactivity requires it, with a top of file comment.
Server side data fetching in server components. Never useEffect for initial loads.
Sanity reads go through src/lib/sanity and readSanity (src/lib/sanity/resilience.ts): at runtime a failed read rethrows so the last good page stays; fallbacks only while building.
Forms post to API routes in src/app/api, which validate, apply the honeypot, rate limit and length limits, and forward to n8n with the shared secret header. No server actions are used.
Validate every server input. The routes use hand written validators (no zod); keep it that way unless a dependency is approved.

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
Sanity reads: src/lib/sanity/
Tests: tests/
Import and indexing scripts: scripts/
CI: .github/workflows/ci.yml
Analytics notes: docs/analytics/
Health checks: docs/health/ (historical records, do not edit)
Older audit reports: audits/AUDIT-YYYY-MM-DD-topic.md
Operations layer: .claude/

Protected work: see "Protected: intentional work, do not remove" in CLAUDE.md. Changes touching it need the owner's approval.

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
