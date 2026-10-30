// Newsletter signup rules for /api/subscribe. Pure, so it can be tested.

import { EMAIL_MAX, isEmail } from "./form-input";

// The longest valid email address (RFC 5321 path limit).
export const SUBSCRIBE_EMAIL_MAX = EMAIL_MAX;

// A short reason when the email cannot be accepted, otherwise null. Never quotes the value.
// The length is checked before the pattern, so the pattern never runs on a long value.
export function checkSubscribeEmail(email: string): string | null {
  if (!email) return "Invalid email";
  if (email.length > SUBSCRIBE_EMAIL_MAX) return `Email must be at most ${SUBSCRIBE_EMAIL_MAX} characters`;
  if (!isEmail(email)) return "Invalid email";
  return null;
}
