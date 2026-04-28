# Framer Motion Audit

**Date:** 2026-04-28
**Repo:** House of Singh Studios
**Auditor:** Claude Code

---

## Step 1: Files Importing Framer Motion

**None.**

`framer-motion` (v12.36.0) is listed in `package.json` as a production dependency but is **not imported by any source file** in the codebase.

```
grep -rn "from ['\"]framer-motion['\"]" src/   → 0 results
grep -rn "motion\\.div\\|AnimatePresence\\|useScroll\\|useMotion\\|useAnimation" src/   → 0 results
```

The only references to `framer-motion` exist in:
- `package.json` (line 16) — production dependency
- `package-lock.json` — resolved lockfile entries

---

## Step 2: Specific Framer Motion Features Used

| Feature | Files | Count |
|---------|-------|-------|
| — | — | 0 |

No Framer Motion APIs are used anywhere in the source code.

---

## Step 3: CSS + IntersectionObserver Replacements

Not applicable. There are no Framer Motion usages to replace.

The codebase already implements all animations using the patterns documented in CLAUDE.md:
- **Scroll reveals:** CSS classes (`css-reveal`, `scroll-reveal-up`, `reveal-clip`, `reveal-stagger-parent`) driven by `IntersectionObserver` via `ScrollObserver`
- **Hover interactions:** Pure CSS transitions using `cubic-bezier(0.23, 1, 0.32, 1)`
- **Page transitions:** View Transitions API (native, zero bundle cost)
- **Smooth scroll:** Lenis (the only approved third-party animation dependency per CLAUDE.md)
- **Custom cursor:** `requestAnimationFrame` at 60fps

---

## Step 4: Painful / Impossible CSS Replacements

None to flag. The codebase has no Framer Motion usage.

---

## Step 5: Recommendation

**Remove `framer-motion` from `package.json`.**

It is dead weight — installed but never imported. Removing it will:
- Reduce `npm install` time and `node_modules` size (~1.2 MB)
- Eliminate a dependency that contradicts the CLAUDE.md performance budget ("No animation libraries — GSAP, Framer Motion, etc.")
- Remove a potential vector for accidental future usage

To remove:

```bash
npm uninstall framer-motion
```

This is a zero-risk change. No source files reference it.
