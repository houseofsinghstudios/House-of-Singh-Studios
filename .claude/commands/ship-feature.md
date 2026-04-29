---
name: ship-feature
description: End to end feature delivery. Architect, change, review, prepare commit message.
argument-hint: [feature description in plain English]
---

# Ship Feature

You are running the full delivery cycle for the feature described in $ARGUMENTS.

Run the cycle in this exact order. Do not skip steps.

Step 1. Invoke the architect agent with the feature description. Wait for its output. If the architect blocks, stop and surface to Maninder.

Step 2. Present the architect output to Maninder. Ask, do you approve this approach as written. Wait for an explicit answer.

Step 3. Make the code change yourself, scoped strictly to the file list the architect approved. Follow CLAUDE.md and ENGINEERING.md. Use the smallest correct change.

Step 4. Run npx tsc --noEmit. Run npm run lint on the changed files. If anything fails, fix only what is needed. Do not loop more than three times. Surface to Maninder if it loops three times.

Step 5. Invoke the reviewer agent. If verdict is BLOCK, fix the blocking issues and re run the reviewer. If APPROVE WITH NOTES, present the notes to Maninder and ask whether to ship now or fix first. If APPROVE, proceed.

Step 6. Produce a final report. What changed file by file. Verification checklist for Vercel preview. Required environment variables if any. Commit message in the format type colon description.

Step 7. Wait for Maninder to confirm before committing. Never auto commit.
