# House of Singh Studios

The website of House of Singh Studios, a creative direction and design studio in Toronto:
https://studios.houseofsingh.com

It is an editorial site with services, work (case studies), insights (articles), initiatives,
partners and careers, two interactive tools (the Brand Pulse Check and the Project Planner), and forms
that hand off to n8n. Content is edited in Sanity, embedded at `/studio`.

The rules for working on it live beside this file:

- [CLAUDE.md](CLAUDE.md): the design system and interaction rules, the page map, the routes, and the
  protected list (intentional work that needs the owner's approval to change).
- [ENGINEERING.md](ENGINEERING.md): the stack, conventions, run commands and what needs escalating.
- [docs/](docs/): the forms to n8n contracts ([docs/integrations/n8n.md](docs/integrations/n8n.md)),
  the analytics debug checklist ([docs/analytics/](docs/analytics/)) and the health checks
  ([docs/health/](docs/health/), historical records, not edited).

## Stack

- Next.js 16 (App Router, Turbopack builds), React 19, TypeScript in strict mode.
- Tailwind CSS v4, plus plain CSS: `src/app/globals.css` for the shared base and stylesheets beside
  the components for page specific styles.
- Sanity 5 for content (next-sanity for reads, published content only, no token on the site).
- Lenis for smooth scrolling (the only animation dependency) and the View Transitions API for page
  changes.
- Vercel for hosting, with Vercel Speed Insights. GA4 and Microsoft Clarity load only after consent.
- Node 22.12 or newer (see `.nvmrc` and `engines` in package.json).

## Setup

```bash
git clone https://github.com/houseofsinghstudios/House-of-Singh-Studios.git
cd House-of-Singh-Studios
npm ci
npm run dev
```

Then open http://localhost:3000. A fresh checkout builds and runs without any environment variables:
the public Sanity project id and dataset are in the code (`src/lib/sanity/project.ts`). If Sanity
cannot be reached while building, the build completes on the fallback content
(`src/lib/sanity/resilience.ts`).

The forms only send anything when the n8n variables below are set; without them a form shows its error
message, which is the expected behaviour locally.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serves the production build |
| `npm run lint` | ESLint; must report 0 problems |
| `npx tsc --noEmit` | Type check; must report 0 errors |
| `npm run test` | Unit tests (Node's test runner with tsx), in `tests/` |
| `npm run import:services` | Mirrors the service copy in `src/data/services.ts` into Sanity |
| `npm run import:portfolio` | Imports case studies into Sanity |
| `npm run import:roles` | Imports careers roles into Sanity |
| `npm run indexnow` | Tells IndexNow about changed pages |

The import scripts need a Sanity write token in a local `.env.import` (see `.env.import.example`
and each script's README in `scripts/`). That token never goes in git or on Vercel.

## Environment variables

Copy `.env.example` to `.env.local` for local work. `.env.local` is ignored by git. (It was tracked
from March to October 2026, holding only the public Sanity project id and dataset.)

| Variable | Needed for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Optional | Public; the code falls back to the studio's project |
| `NEXT_PUBLIC_SANITY_DATASET` | Optional | Public; the code falls back to `production` |
| `N8N_WEBHOOK_SECRET` | All forms and tools | Sent to every n8n webhook in a header; without it nothing is sent |
| `N8N_WEBHOOK_URL` | Contact form | Lead Capture workflow |
| `N8N_CAREERS_WEBHOOK_URL` | Careers form | Careers Applications workflow |
| `N8N_SUBSCRIBE_WEBHOOK_URL` | Newsletter | Newsletter Subscribe workflow |
| `N8N_BRAND_PULSE_WEBHOOK_URL` | Brand Pulse Check | Brand Pulse workflow |
| `N8N_PROJECT_PLANNER_WEBHOOK_URL` | Project Planner | Project Planner workflow |

Secrets (the webhook secret, the webhook URLs, the Sanity write token) are never written into the
code, docs or logs. On Vercel they are set in the project's Environment Variables settings.
Analytics run only on the production deployment (`VERCEL_ENV` is `production`) and only after consent.

## Deployment

Vercel builds every push. `main` deploys to production at https://studios.houseofsingh.com; other
branches and pull requests get preview deployments (Dependabot branches are skipped, see
`vercel.json`). Pages refresh from Sanity on their own schedule (most every 60 seconds, see the route
table in CLAUDE.md), so content edits need no deploy.

The Sanity Studio deploys with the site at `/studio`. Never run `sanity deploy`: it creates a separate
hosted Studio that falls out of step with the code.

## CI and branch protection

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main` and `feature/next-work`:
`npm ci`, the type check, lint, the unit tests and a production build. It needs no secrets.

`main` is protected by a repository ruleset: changes arrive only through a pull request, the CI check
"Type check, lint, tests and build" must pass before merging, and the branch cannot be deleted or
force pushed. Work happens on `feature/next-work` and is merged to `main` by pull request.
