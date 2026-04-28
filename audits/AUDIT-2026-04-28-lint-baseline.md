# Lint Baseline Audit

**Date:** 2026-04-28
**Branch:** claude/run-tests-WxtWY
**Auditor:** Claude Code

---

## 1. Context

During the ship-feature cycle for the Header.tsx spacer fix (Finding 3 from AUDIT-2026-04-28-header-review.md), `npm run lint` was run as part of Step 4 verification. The lint output returned 8 issues across 6 files. None were introduced by the spacer fix. The changed files, Header.tsx and globals.css, produced zero lint errors. All 8 issues are pre-existing. This audit records them as a baseline so the team can resolve them in a future cleanup pass.

---

## 2. Findings

| # | File | Line | Rule | Category | Severity | Confidence | Status |
|---|------|------|------|----------|----------|-----------|--------|
| 1 | ~~src/components/SliderDiagnostic.tsx~~ | ~~87~~ | ~~react-hooks/set-state-in-effect~~ | ~~React hooks~~ | ~~Low~~ | ~~CERTAIN~~ | **RESOLVED** (commit `d9d9818`) — moved out of src tree, not blocking lint anymore, will be re-evaluated when revived for phase two |
| 2 | src/components/about/AboutClient.tsx | 11 | @typescript-eslint/no-explicit-any | TypeScript | Medium | CERTAIN | Open |
| 3 | src/components/about/AboutClient.tsx | 12 | @typescript-eslint/no-explicit-any | TypeScript | Medium | CERTAIN | Open |
| 4 | src/components/ai/AILabClient.tsx | 4 | @typescript-eslint/no-unused-vars | Dead code | Low | CERTAIN | Open |
| 5 | src/components/homepage/ProofSection.tsx | 67 | react-hooks/exhaustive-deps | React hooks | Medium | CERTAIN | Open |
| 6 | src/components/homepage/ServicesSection.tsx | 56 | react-hooks/set-state-in-effect | React hooks | Low | CERTAIN | Open |
| 7 | src/components/layout/FooterReveal.tsx | 40 | @next/next/no-img-element | Next.js best practices | Medium | CERTAIN | Open |
| 8 | src/components/services/ServiceDetailAccordion.tsx | 21 | react-hooks/set-state-in-effect | React hooks | Low | CERTAIN | Open |

---

## 3. Detail

### ~~Finding 1: setState in effect in SliderDiagnostic.tsx at line 87~~

**RESOLVED 2026-04-28** (commit `d9d9818`). File moved out of `src/` tree to `archive/brand-diagnostic/SliderDiagnostic.tsx`. No longer triggers lint. Will be re-evaluated when revived for phase two.

### Finding 2: Explicit any type in AboutClient.tsx at line 11

An `any` type is used in component props or a data structure at column 134. Using `any` removes TypeScript's ability to catch type errors in that path.

**Suggested fix:** Replace `any` with the correct typed interface for the data being passed. Check the Sanity schema or the parent component to determine what shape the data takes.

### Finding 3: Explicit any type in AboutClient.tsx at line 12

A second `any` type appears on the next line at column 135 in the same component.

**Suggested fix:** Same as Finding 2. Both usages likely relate to the same data structure. Typing them together in a single pass is more efficient.

### Finding 4: Unused import in AILabClient.tsx at line 4

`Link` is imported from `next-view-transitions` at column 10 but is never used in the component body. Dead imports add noise and slow down future readers of the file.

**Suggested fix:** Remove the unused import line. The fix is one deletion. Zero risk.

### Finding 5: Stale ref in cleanup in ProofSection.tsx at line 67

The effect cleanup function references `rafIds.current` directly. The ref value will likely have changed by the time cleanup runs, meaning the cleanup may cancel the wrong animation frame IDs.

**Suggested fix:** At the top of the effect, copy `rafIds.current` to a local variable. Use that local variable inside the cleanup function. This ensures cleanup always refers to the IDs that were active when the effect ran.

### Finding 6: setState in effect in ServicesSection.tsx at line 56

`setActiveIndex(null)` is called synchronously inside a useEffect that depends on `isMobile`. This triggers the cascading render warning from the lint rule.

**Suggested fix:** Consider using a ref to track active index, or restructure the logic so the state reset does not happen synchronously inside the effect body.

### Finding 7: Raw img tag in FooterReveal.tsx at line 40

A raw `<img>` tag is used at column 9 instead of the Next.js `Image` component. This bypasses Next.js image optimisation, results in slower LCP, and increases bandwidth usage for visitors.

**Suggested fix:** Replace the `<img>` tag with the `Image` component from `next/image`. Set `width`, `height`, and `alt` props. Verify the footer renders correctly after the change.

### Finding 8: setState in effect in ServiceDetailAccordion.tsx at line 21

`setIsMobile(mq.matches)` is called synchronously inside a useEffect at column 5. The effect initialises state from a media query match result, which triggers the cascading render lint rule.

**Suggested fix:** Initialise the state with a lazy initializer in useState, for example `useState(() => window.matchMedia('(max-width: 768px)').matches)`. This removes the need for the synchronous setState call inside the effect entirely.

---

## 4. Recommended Next Steps

Work through these in the order listed below.

1. Fix Finding 4 first. Deleting an unused import is one line and zero risk. Run lint after to confirm the count drops to 7.
2. Fix Findings 2 and 3 together. Both are in AboutClient.tsx. Type the data structure once and both violations resolve in the same commit.
3. Fix Finding 7 next. Swapping the raw `<img>` for `next/image` in FooterReveal.tsx directly improves site performance and removes a rule violation that matches the same class of issue fixed in the header audit.
4. Fix Finding 5. The stale ref in ProofSection.tsx is the highest-risk issue because it can silently cause incorrect cleanup at runtime. Copy the ref to a local variable inside the effect.
5. Fix Findings 1, 6, and 8 together in a single pass. All three are the same rule violation pattern (setState in effect). Resolving them together is more efficient than three separate commits.

---

## 5. Summary Table

| Finding | File | Line | Rule | Severity | Confidence | Status |
|---------|------|------|------|----------|-----------|--------|
| ~~setState in effect (hydration gate)~~ | ~~src/components/SliderDiagnostic.tsx~~ | ~~87~~ | ~~react-hooks/set-state-in-effect~~ | ~~Low~~ | ~~CERTAIN~~ | **RESOLVED** (commit `d9d9818`) — archived to archive/brand-diagnostic/ |
| Explicit any type | src/components/about/AboutClient.tsx | 11 | @typescript-eslint/no-explicit-any | Medium | CERTAIN | Open |
| Explicit any type | src/components/about/AboutClient.tsx | 12 | @typescript-eslint/no-explicit-any | Medium | CERTAIN | Open |
| Unused import (Link) | src/components/ai/AILabClient.tsx | 4 | @typescript-eslint/no-unused-vars | Low | CERTAIN | Open |
| Stale ref in cleanup | src/components/homepage/ProofSection.tsx | 67 | react-hooks/exhaustive-deps | Medium | CERTAIN | Open |
| setState in effect (isMobile reset) | src/components/homepage/ServicesSection.tsx | 56 | react-hooks/set-state-in-effect | Low | CERTAIN | Open |
| Raw img element | src/components/layout/FooterReveal.tsx | 40 | @next/next/no-img-element | Medium | CERTAIN | Open |
| setState in effect (media query init) | src/components/services/ServiceDetailAccordion.tsx | 21 | react-hooks/set-state-in-effect | Low | CERTAIN | Open |
