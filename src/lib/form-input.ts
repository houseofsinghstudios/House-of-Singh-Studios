// Shared cleaning for form input, in linear time on any input. Pure, so it can be tested.
//
// Every value is cut before any pattern runs, and no pattern here can backtrack on a long string,
// so a hostile submission costs the same as a normal one. Values are cut at twice their limit, not
// at the limit: the existing length checks still see an over-long value and reject it as before,
// and a normal value (leading spaces, tags and all) cleans exactly as it always did.

// The longest valid email address (RFC 5321 path limit).
export const EMAIL_MAX = 254;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The raw value, cut to twice the field's limit before anything else looks at it. Anything that is not
// a string (an object, a number, a value with a crafted toString) counts as empty, so an odd form value
// is a clean 400 at the length checks, never a 500 (audit of 20 Nov 2026, finding 15).
export function capRaw(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max * 2) : "";
}

// A path on this site, for a landing page: it must start with a single "/" ("//host" and "/\host"
// are other sites to a browser), without its query or fragment, tags removed, spaces collapsed, at most
// max characters. Anything else is "" (audit finding 16).
export function sitePath(value: unknown, max: number): string {
  if (typeof value !== "string" || !/^\/(?![/\\])/.test(value)) return "";
  return stripTags(capRaw(value.split(/[?#]/)[0], max)).replace(/\s+/g, " ").trim().slice(0, max);
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

// A submission id as the forms make it (submissionId() in src/lib/analytics.ts: 32 lowercase
// hexadecimal characters), or undefined for anything else, which is then not sent to n8n.
const SUBMISSION_ID = /^[0-9a-f]{32}$/;

export function cleanSubmissionId(value: unknown): string | undefined {
  return typeof value === "string" && SUBMISSION_ID.test(value) ? value : undefined;
}
