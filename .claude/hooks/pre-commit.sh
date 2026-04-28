#!/bin/bash
# House of Singh pre commit hook
# Runs before every git commit. Blocks the commit if any check fails.
# Exit code 2 blocks. Exit code 0 allows.

set -e

echo "House of Singh pre commit checks running..."

# Step 1, type check
echo "[1/3] Type checking..."
if ! npx tsc --noEmit 2>&1; then
  echo "BLOCK: TypeScript type check failed."
  exit 2
fi

# Step 2, lint only the staged TypeScript files
echo "[2/3] Linting staged files..."
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E "\.(ts|tsx)$" || true)
if [ -n "$STAGED_FILES" ]; then
  if ! npx eslint $STAGED_FILES --quiet; then
    echo "BLOCK: ESLint failed on staged files."
    exit 2
  fi
fi

# Step 3, House of Singh brand voice scan on staged tsx files
echo "[3/3] Brand voice check..."
TSX_FILES=$(echo "$STAGED_FILES" | grep "\.tsx$" || true)
if [ -n "$TSX_FILES" ]; then
  # Check for em dashes and en dashes in source
  if grep -nP "[\x{2013}\x{2014}]" $TSX_FILES 2>/dev/null > /tmp/dash-violations.txt; then
    if [ -s /tmp/dash-violations.txt ]; then
      echo "WARNING: em dashes or en dashes detected in tsx files."
      cat /tmp/dash-violations.txt
      echo ""
      echo "Replace with commas, periods, or rewrite the sentence."
      echo "Type 'override' to commit anyway, or anything else to abort."
      read -r RESPONSE
      if [ "$RESPONSE" != "override" ]; then
        echo "BLOCK: Commit aborted."
        exit 2
      fi
    fi
  fi

  # Check for emojis in JSX text and string literals
  if grep -nP "[\x{1F300}-\x{1F9FF}\x{2600}-\x{27BF}]" $TSX_FILES 2>/dev/null > /tmp/emoji-violations.txt; then
    if [ -s /tmp/emoji-violations.txt ]; then
      echo "BLOCK: emoji detected in tsx files. House of Singh standard forbids emojis in user facing content."
      cat /tmp/emoji-violations.txt
      exit 2
    fi
  fi
fi

echo "All checks passed. Commit allowed."
exit 0
