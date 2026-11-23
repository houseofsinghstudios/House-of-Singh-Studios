// Contact form lead: field cleaning and length rules for /api/lead. Pure, so it can be tested.
import { messageOptional } from "@/lib/partners/forms";
import { capRaw, stripTags } from "@/lib/form-input";
import { BAND_IDS, BAND_LABELS } from "@/lib/budget-bands";

export const LEAD_LIMITS = { name: 120, email: 254, message: 5000, service: 80, budget: 80 } as const;

// The contact form's budget ranges, in display order: the Project Planner's own investment ranges, from
// the one shared list (src/lib/budget-bands.ts), so both forms offer the same choices in the same words.
// The label is what the form sends. The budget is optional: an empty value is valid.
export const BUDGET_OPTIONS: readonly string[] = BAND_IDS.map((id) => BAND_LABELS[id]);

export interface LeadFields {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
}

// Removes tags and surrounding whitespace. A missing or empty value becomes an empty string. The raw
// value is first cut at twice the field's limit (src/lib/form-input.ts), so the length checks still
// reject an over-long value and nothing ever scans more than that.
export function cleanField(value: unknown, max: number): string {
  if (!value) return "";
  return stripTags(capRaw(value, max)).trim();
}

// The same for a one line field (a name, an email, a choice): line breaks and runs of spaces become one
// space, so nothing downstream can be handed a value that spans lines (audit finding 16). Messages keep
// their line breaks through cleanField.
export function cleanLine(value: unknown, max: number): string {
  return cleanField(value, max).replace(/\s+/g, " ");
}

// Lengths are checked after cleaning. The reason is short and never quotes the submitted value.
// An introduction's or partnership's message is optional; every other lead needs one.
export function checkLeadLengths(fields: LeadFields): string | null {
  if (fields.name.length < 1 || fields.name.length > LEAD_LIMITS.name) return `Name must be 1 to ${LEAD_LIMITS.name} characters`;
  if (fields.email.length > LEAD_LIMITS.email) return `Email must be at most ${LEAD_LIMITS.email} characters`;
  if (fields.message.length > LEAD_LIMITS.message) return `Message must be at most ${LEAD_LIMITS.message.toLocaleString("en-US")} characters`;
  if (fields.message.length < 1 && !messageOptional(fields.service)) return `Message must be 1 to ${LEAD_LIMITS.message.toLocaleString("en-US")} characters`;
  if (fields.service.length > LEAD_LIMITS.service) return `Service must be at most ${LEAD_LIMITS.service} characters`;
  if (fields.budget.length > LEAD_LIMITS.budget) return `Budget must be at most ${LEAD_LIMITS.budget} characters`;
  return null;
}
