// Careers application: field cleaning and length rules for /api/careers. Pure, so it can be tested.
import { cleanField } from "./lead";
import { EMAIL_MAX, isEmail } from "./form-input";

export const CAREERS_LIMITS = { name: 120, email: 254, role: 120, portfolioUrl: 500, message: 5000 } as const;

export interface CareersFields {
  name: string;
  email: string;
  role: string;
  portfolioUrl: string;
  message: string;
}

// The cleaned fields, tags and surrounding whitespace removed, missing values empty.
export function cleanCareers(body: Record<string, unknown>): CareersFields {
  return {
    name: cleanField(body.name, CAREERS_LIMITS.name),
    email: cleanField(body.email, CAREERS_LIMITS.email),
    role: cleanField(body.role, CAREERS_LIMITS.role),
    portfolioUrl: cleanField(body.portfolioUrl, CAREERS_LIMITS.portfolioUrl),
    message: cleanField(body.message, CAREERS_LIMITS.message),
  };
}

// A short reason when the application cannot be accepted, otherwise null. Never quotes the value.
export function checkCareers(f: CareersFields): string | null {
  if (!f.name || !f.email || !f.role) return "Name, email, and role are required.";
  // The pattern runs only on an address of a valid length; a longer one fails the length cap below.
  if (f.email.length <= EMAIL_MAX && !isEmail(f.email)) return "Invalid email format.";
  const labels: Record<keyof CareersFields, string> = { name: "Name", email: "Email", role: "Role", portfolioUrl: "Portfolio URL", message: "Message" };
  for (const key of Object.keys(CAREERS_LIMITS) as (keyof CareersFields)[]) {
    if (f[key].length > CAREERS_LIMITS[key]) return `${labels[key]} must be at most ${CAREERS_LIMITS[key].toLocaleString("en-US")} characters`;
  }
  return null;
}
