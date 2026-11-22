// Every form field shows keyboard focus as the shared 2px Obsidian rule (the one documented shadow),
// held back after a pointer press. The article newsletter field had none (site audit S-04).
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("article newsletter: the shared form focus, held back after a pointer press", () => {
  const css = readFileSync("src/components/insights/article.css", "utf8");
  assert.match(css, /form:not\(\[data-pointer-focus\]\) \.art-newsletter-input:focus-visible \{\s*border-bottom-color: var\(--text-primary\);\s*box-shadow: inset 0 -1px 0 var\(--text-primary\);/);
  const form = readFileSync("src/components/insights/ArticleNewsletter.tsx", "utf8");
  assert.match(form, /usePointerFocusFlag\(formRef, status\)/);
  assert.match(form, /<form ref=\{formRef\} onSubmit=\{handleSubmit\}/);
});

test("Copy link is named by its own words and announces the copy politely (site audit S-14)", () => {
  const share = readFileSync("src/components/ShareButtons.tsx", "utf8");
  assert.doesNotMatch(share, /aria-label="Copy link"/);
  assert.match(share, /className="share-btn needs-js"\s+onClick=\{handleCopy\}\s*>\s*\{copied \? 'Copied' : 'Copy link'\}/);
  assert.match(share, /<span className="sr-only" aria-live="polite">\s*\{copied \? 'Link copied\.' : ''\}\s*<\/span>/);
});
