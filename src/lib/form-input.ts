// Shared cleaning for form input, in linear time on any input. Pure, so it can be tested.
//
// Every value is cut before any pattern runs, and no pattern here can backtrack on a long string,
// so a hostile submission costs the same as a normal one. Values are cut at twice their limit, not
// at the limit: the existing length checks still see an over-long value and reject it as before,
// and a normal value (leading spaces, tags and all) cleans exactly as it always did.

// The longest valid email address (RFC 5321 path limit).
export const EMAIL_MAX = 254;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The raw value as a string, cut to twice the field's limit before anything else looks at it.
export function capRaw(value: unknown, max: number): string {
  return String(value).slice(0, max * 2);
}

// Removes "<...>" runs exactly as value.replace(/<[^>]*>/g, "") does, in one pass: each "<" is
// removed through the next ">"; once a "<" has no ">" after it, nothing later can match either.
export function stripTags(value: string): string {
  let out = "";
  let from = 0;
  for (;;) {
    const open = value.indexOf("<", from);
    if (open === -1) break;
    const close = value.indexOf(">", open + 1);
    if (close === -1) break;
    out += value.slice(from, open);
    from = close + 1;
  }
  return out + value.slice(from);
}

// A plausible email address, checked for length before the pattern runs.
export function isEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= EMAIL_MAX && EMAIL.test(value);
}
