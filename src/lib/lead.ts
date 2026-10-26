// Contact form lead: field cleaning and length rules for /api/lead. Pure, so it can be tested.
import { messageOptional } from "@/lib/partners/forms";

export const LEAD_LIMITS = { name: 120, message: 5000, service: 80, budget: 80 } as const;

// The contact form's budget ranges, in display order. The budget is optional: an empty value is valid.
export const BUDGET_OPTIONS = ["Not sure yet", "$1,000 to $4,000", "$4,000 to $10,000", "$10,000 to $20,000", "$20,000 or more"] as const;

export interface LeadFields {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
}

// Removes tags and surrounding whitespace. A missing or empty value becomes an empty string.
export function cleanField(value: unknown): string {
  if (!value) return "";
  return String(value).replace(/<[^>]*>/g, "").trim();
}

// Lengths are checked after cleaning. The reason is short and never quotes the submitted value.
// An introduction's or partnership's message is optional; every other lead needs one.
export function checkLeadLengths(fields: LeadFields): string | null {
  if (fields.name.length < 1 || fields.name.length > LEAD_LIMITS.name) return `Name must be 1 to ${LEAD_LIMITS.name} characters`;
  if (fields.message.length > LEAD_LIMITS.message) return `Message must be at most ${LEAD_LIMITS.message.toLocaleString("en-US")} characters`;
  if (fields.message.length < 1 && !messageOptional(fields.service)) return `Message must be 1 to ${LEAD_LIMITS.message.toLocaleString("en-US")} characters`;
  if (fields.service.length > LEAD_LIMITS.service) return `Service must be at most ${LEAD_LIMITS.service} characters`;
  if (fields.budget.length > LEAD_LIMITS.budget) return `Budget must be at most ${LEAD_LIMITS.budget} characters`;
  return null;
}
