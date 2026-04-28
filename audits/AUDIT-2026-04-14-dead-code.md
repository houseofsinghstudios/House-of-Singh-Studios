# Dead Code Audit Report

Date: 2026-04-14
Branch: claude/run-tests-WxtWY

---

## 1. Unused Imports

No unused imports found across 85+ TypeScript/TSX files in src/ and sanity/.
All imported symbols are actively referenced in their respective files.

---

## 2. Orphaned Components

### Certainly orphaned (never imported anywhere)

| File | Component | Notes |
|------|-----------|-------|
| `src/components/ui/Container.tsx` | Container | Exported via `src/components/ui/index.ts` barrel but never imported by any page or component |
| `src/components/ui/Divider.tsx` | Divider | Exported via `src/components/ui/index.ts` barrel but never imported by any page or component |
| `src/components/ui/SectionWrapper.tsx` | SectionWrapper | Exported via `src/components/ui/index.ts` barrel but never imported by any page or component |
| `src/components/ui/TextReveal.tsx` | TextReveal | Exported via `src/components/ui/index.ts` barrel but never imported by any page or component |

**Confidence: CERTAIN** — grep confirms zero imports of these components outside their own files and the barrel index.

Note: Button and EditorialLabel from the same barrel ARE actively used (13 and 7 imports respectively).

---

## 3. Orphaned Pages

No orphaned pages found. All 15 routes are linked from navigation (Header.tsx or Footer.tsx) and included in sitemap.ts.

---

## 4. Dead Sanity Schemas

### Registered schemas (sanity/schemas/index.ts)

| Schema | Queried in src/lib/sanity/ | Called by pages | Status |
|--------|---------------------------|-----------------|--------|
| service | Yes (services.ts) | Yes (/services) | ACTIVE |
| caseStudy | Yes (projects.ts) | Yes (/work) | ACTIVE |
| post | Yes (queries.ts) | Yes (/insights) | ACTIVE |
| package | Yes (queries.ts) | Yes (/packages) | ACTIVE |
| role | Yes (queries.ts) | Yes (/careers) | ACTIVE |
| siteSettings | Yes (queries.ts) | Yes (/about) | ACTIVE |
| **testimonial** | Query defined but never called | No | **DEAD** |
| **teamMember** | Query defined but never called | No | **DEAD** |

### Details

**testimonial** — `getFeaturedTestimonials()` is defined in `src/lib/sanity/queries.ts:210` but never imported or called. Testimonials are hardcoded in `src/lib/constants/homepage-data.ts`.
**Confidence: CERTAIN**

**teamMember** — `getTeamMembers()` is defined in `src/lib/sanity/queries.ts:223` but never imported or called. No UI exists to display team members.
**Confidence: CERTAIN**

---

## 5. Unused Utility Functions

| File | Export | Status |
|------|--------|--------|
| `src/lib/hooks/useScrollProgress.ts` | `useScrollProgress()` | Never imported. **Confidence: CERTAIN** |
| `src/lib/hooks/useScrollProgress.ts` | `rangeProgress()` | Never imported. **Confidence: CERTAIN** |
| `src/lib/hooks/useScrollProgress.ts` | `clamp01()` | Only used internally by rangeProgress(). **Confidence: CERTAIN** |
| `src/lib/config.ts` | `siteConfig` | Never imported anywhere. **Confidence: CERTAIN** |
| `src/lib/scroll-fallback.ts` | `initScrollFallbacks()` | Never imported. No-op stub. **Confidence: CERTAIN** |
| `src/lib/scroll-fallback.ts` | `cleanScrollFallbacks()` | Never imported. No-op stub. **Confidence: CERTAIN** |
| `src/lib/sanity/queries.ts` | `getAllCaseStudies()` | Never imported. Superseded by `getAllProjects()` in projects.ts. **Confidence: CERTAIN** |
| `src/lib/sanity/queries.ts` | `getCaseStudyBySlug()` | Never imported. Superseded by `getProjectBySlug()` in projects.ts. **Confidence: CERTAIN** |
| `src/lib/sanity/queries.ts` | `getFeaturedTestimonials()` | Never imported. Testimonials are hardcoded. **Confidence: CERTAIN** |
| `src/lib/sanity/queries.ts` | `getTeamMembers()` | Never imported. No team UI exists. **Confidence: CERTAIN** |
| `src/data/projects.ts` | `getProjectBySlug()` | Never imported from pages. Only used as Sanity fallback inside `src/lib/sanity/projects.ts` via dynamic import. **Confidence: NEEDS MANUAL REVIEW** |
| `src/data/projects.ts` | `getNextProject()` | Never imported from pages. Unused fallback. **Confidence: CERTAIN** |
| `src/data/projects.ts` | `getWorkTypeFilters()` | Never imported. Superseded by the version in `src/lib/sanity/projects.ts`. **Confidence: CERTAIN** |

---

## 6. Duplicate or Conflicting Definitions

| Function/Export | Location 1 | Location 2 | Conflict |
|-----------------|-----------|-----------|----------|
| `getWorkTypeFilters` | `src/data/projects.ts:268` returns `string[]` | `src/lib/sanity/projects.ts:350` returns `DisciplineFilter[]` | Same name, different return types. Only the sanity version is used. |
| `getProjectBySlug` | `src/data/projects.ts:256` returns `Project \| undefined` | `src/lib/sanity/projects.ts:253` returns `Promise<Project \| null>` | Same name, different signatures. Sanity version calls data version as fallback via dynamic import. |

**Confidence: CERTAIN** — both duplications exist. The data/ versions are legacy fallbacks.

---

## 7. Dead GROQ References

The following GROQ queries still reference `services[]->` which dereferences the `service` schema via a reference field. This field was removed from the caseStudy schema in commit cc6a5b0. The queries will not break (Sanity returns null for missing fields) but the projections are dead code.

| File | Line | Query |
|------|------|-------|
| `src/lib/sanity/projects.ts` | 15 | `services[]-> { _id, title, slug }` in allProjectsQuery |
| `src/lib/sanity/projects.ts` | 46 | `services[]-> { _id, title, slug }` in projectBySlugQuery |
| `src/lib/sanity/projects.ts` | 75 | `services[]-> { _id, title, slug }` in featuredProjectsQuery |
| `src/lib/sanity/queries.ts` | 43 | `services[]-> { _id, title, slug }` in getAllCaseStudies |
| `src/lib/sanity/queries.ts` | 61 | `services[]-> { _id, title, slug }` in getCaseStudyBySlug |

**Confidence: CERTAIN** — the services reference field no longer exists in the schema.

---

## 8. Environment Variables

| Variable | Used in | Documented in .env.local | Status |
|----------|---------|--------------------------|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `src/lib/sanity/client.ts` | Yes | OK |
| `NEXT_PUBLIC_SANITY_DATASET` | `src/lib/sanity/client.ts` | Yes | OK |
| `NEXT_PUBLIC_SITE_URL` | `src/lib/config.ts` | No | **UNDOCUMENTED** (has fallback) |
| `ANTHROPIC_API_KEY` | `src/app/api/brand-pulse/route.ts` | No | **UNDOCUMENTED** (no fallback) |
| `N8N_WEBHOOK_URL` | `src/app/api/lead/route.ts` | No | **UNDOCUMENTED** (no fallback) |
| `N8N_SUBSCRIBE_WEBHOOK_URL` | `src/app/api/subscribe/route.ts` | No | **UNDOCUMENTED** (no fallback) |
| `N8N_CAREERS_WEBHOOK_URL` | `src/app/api/careers/route.ts` | No | **UNDOCUMENTED** (no fallback) |
| `N8N_BRAND_PULSE_WEBHOOK_URL` | `src/app/api/brand-pulse/route.ts` | No | **UNDOCUMENTED** (no fallback) |

No `.env.example` file exists. 6 of 8 environment variables are undocumented.

Note: `NEXT_PUBLIC_SITE_URL` is referenced in `src/lib/config.ts` but `siteConfig` itself is never imported (see Section 5), so this variable is effectively unused.

---

## Summary

| Category | Dead items found |
|----------|-----------------|
| Unused imports | 0 |
| Orphaned components | 4 (Container, Divider, SectionWrapper, TextReveal) |
| Orphaned pages | 0 |
| Dead Sanity schemas | 2 (testimonial, teamMember) |
| Unused utility functions | 13 |
| Duplicate definitions | 2 |
| Dead GROQ references | 5 |
| Undocumented env vars | 6 (1 effectively unused) |
