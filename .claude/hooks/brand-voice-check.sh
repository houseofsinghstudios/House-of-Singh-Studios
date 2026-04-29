#!/bin/bash
# House of Singh brand voice check hook
# Runs before any Write or Edit on tsx files in src.
# Scans the proposed content for design system violations.

PAYLOAD=$(cat)

if command -v jq >/dev/null 2>&1; then
  FILE_PATH=$(echo "$PAYLOAD" | jq -r '.tool_input.file_path // .tool_input.path // empty')
  CONTENT=$(echo "$PAYLOAD" | jq -r '.tool_input.content // .tool_input.new_str // empty')
else
  exit 0
fi

# Only check tsx files inside src
case "$FILE_PATH" in
  src/*.tsx|src/**/*.tsx)
    ;;
  *)
    exit 0
    ;;
esac

VIOLATIONS=""

# Emoji check
if echo "$CONTENT" | grep -qP "[\x{1F300}-\x{1F9FF}\x{2600}-\x{27BF}]" 2>/dev/null; then
  VIOLATIONS="${VIOLATIONS}- Emoji detected. CLAUDE.md and ENGINEERING.md forbid emojis in user facing content.\n"
fi

# Em dash and en dash check
if echo "$CONTENT" | grep -qP "[\x{2013}\x{2014}]"; then
  VIOLATIONS="${VIOLATIONS}- Em dash or en dash detected. Use commas, periods, or rewrite.\n"
fi

# Animation library import check
if echo "$CONTENT" | grep -qE "from ['\"]framer-motion['\"]"; then
  VIOLATIONS="${VIOLATIONS}- Framer Motion import detected. Animation libraries are forbidden. Use CSS plus IntersectionObserver per CLAUDE.md.\n"
fi
if echo "$CONTENT" | grep -qE "from ['\"]gsap['\"]"; then
  VIOLATIONS="${VIOLATIONS}- GSAP import detected. Animation libraries are forbidden.\n"
fi

if [ -n "$VIOLATIONS" ]; then
  echo "House of Singh brand voice check failed for $FILE_PATH"
  printf "%b" "$VIOLATIONS"
  exit 2
fi

exit 0
