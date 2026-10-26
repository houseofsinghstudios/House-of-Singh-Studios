// Newsletter signup rules for /api/subscribe. Pure, so it can be tested.

// The longest valid email address (RFC 5321 path limit).
export const SUBSCRIBE_EMAIL_MAX = 254;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A short reason when the email cannot be accepted, otherwise null. Never quotes the value.
export function checkSubscribeEmail(email: string): string | null {
  if (!email || !EMAIL.test(email)) return "Invalid email";
  if (email.length > SUBSCRIBE_EMAIL_MAX) return `Email must be at most ${SUBSCRIBE_EMAIL_MAX} characters`;
  return null;
}
