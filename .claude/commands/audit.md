---
name: audit
description: Run a full quality and dead code audit. Writes a date stamped report to audits.
argument-hint: [optional, topic name like dead-code or dependencies]
---

# Audit

Run a full audit and write a report to audits/AUDIT-YYYY-MM-DD-topic.md. If topic is missing, default to general.

Step 1. Run npx tsc --noEmit. Capture any type errors.

Step 2. Run npm run lint. Capture any lint errors.

Step 3. Find unused imports across src and sanity. List each file.

Step 4. Find orphaned components. Files in src/components that are not imported anywhere. Cross reference against src/components/ui/index.ts barrel exports.

Step 5. Find dead Sanity queries. Functions in src/lib/sanity that are exported but never imported.

Step 6. Find unused utility functions in src/lib.

Step 7. Find duplicate or conflicting definitions.

Step 8. Find environment variables used in code but missing from .env.example.

Step 9. Verify every page route in src/app has correct imports and renders without static generation errors.

Step 10. Invoke the doc writer agent to format the findings into the standard audit structure with sections, confidence labels, and a recommended next steps list.

Step 11. Save to audits/AUDIT-YYYY-MM-DD-topic.md. Do not commit.

Step 12. Surface a summary to Maninder. Top three priorities only. Do not flood with detail. Detail is in the file.
