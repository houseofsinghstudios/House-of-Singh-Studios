# Header Review Audit

**Date:** 2026-04-28
**Branch:** claude/run-tests-WxtWY
**File reviewed:** src/components/layout/Header.tsx
**Auditor:** Claude Code

---

## 1. Context

A ship-feature cycle added a client component comment to Header.tsx. The comment change was approved clean. During review, the agent found three pre-existing issues in the same file. None of these were introduced by the feature change. All three are legacy violations to address in a future cleanup pass.

---

## 2. Findings

| # | Line | Category | Issue | Confidence | Status |
|---|------|----------|-------|-----------|--------|
| 1 | ~~85~~ | ~~Raw img tag~~ | ~~`<img>` used for the SVG crest logo with an eslint-disable comment to suppress `@next/next/no-img-element`. ENGINEERING.md says always use `next/image`.~~ | ~~CERTAIN~~ | **RESOLVED 2026-04-28** (commit `a66a316`) |
| 2 | 78 | Inline style | `style={{ transform: ... }}` on the header element. The value is dynamic (depends on hidden state) so it passes the "No inline styles unless dynamic" rule. However toggling a CSS class would be more consistent with the rest of the codebase. | CERTAIN | Open |
| 3 | ~~103~~ | ~~Inline style~~ | ~~`style={{ flex: 1 }}` on a spacer div. This value is static and never changes. ENGINEERING.md forbids static inline styles.~~ | ~~CERTAIN~~ | **RESOLVED 2026-04-28** (commit `919fd6c`) |

---

## 3. Detail

### ~~Finding 1: Raw img tag at line 85~~

**RESOLVED 2026-04-28** (commit `a66a316`). Replaced raw `<img>` with `next/image` `<Image>` component using `unoptimized` prop for SVG. Removed the eslint-disable comment. Lint rule now passes naturally.

### Finding 2: Inline transform style at line 78

The header uses `style={{ transform: 'translateY(-100%)' }}` or similar when hidden. The value depends on component state so the inline style is technically permitted under ENGINEERING.md. The issue is consistency. Every other show or hide interaction in the codebase uses a CSS class toggle.

**Suggested fix:** Add a `.site-header--hidden` class to globals.css with `transform: translateY(-100%)`. Apply that class conditionally instead of the inline style. This keeps the pattern consistent and makes the transition easier to adjust later.

### Finding 3: Static inline style at line 103

A spacer div carries `style={{ flex: 1 }}`. This value never changes at runtime. ENGINEERING.md forbids inline styles that are not driven by dynamic values.

**Suggested fix:** Replace with the Tailwind utility class `flex-1`. Alternatively add a named CSS class in globals.css. Either approach removes the static inline style.

---

## 4. Recommended Next Steps

Work through these in the order listed below.

1. Fix Finding 3 first. It is the smallest change. Replace `style={{ flex: 1 }}` with `flex-1`. One line. Zero risk.
2. Fix Finding 1 next. Swap the raw `<img>` tag for `next/image` and delete the eslint-disable comment. Confirm the crest renders correctly in both light and dark header states after the change.
3. Review Finding 2 with Maninder. The inline style works correctly today. Moving to a CSS class is a consistency improvement, not a bug fix. Maninder should decide whether this belongs in the current cleanup or a later polish pass.

---

## 5. Summary Table

| Finding | File | Line | Severity | Confidence | Status |
|---------|------|------|----------|-----------|--------|
| ~~Raw img tag with eslint-disable~~ | ~~src/components/layout/Header.tsx~~ | ~~85~~ | ~~Medium~~ | ~~CERTAIN~~ | **RESOLVED 2026-04-28** (commit `a66a316`) |
| Inline transform style (dynamic, consistency issue) | src/components/layout/Header.tsx | 78 | Low | CERTAIN | Open |
| ~~Static inline flex style~~ | ~~src/components/layout/Header.tsx~~ | ~~103~~ | ~~Low~~ | ~~CERTAIN~~ | **RESOLVED 2026-04-28** (commit `919fd6c`) |
