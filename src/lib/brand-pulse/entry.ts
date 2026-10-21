// Ways into Brand Pulse from links elsewhere on the site. Pure, so the server page, the browser and
// the API route share one set of rules, and the tests cover them.
//   ?q=<question id>:<answer id>  one answer to preselect, checked against the questions in content.ts
//   ?from=<placement>             where the visitor came from, recorded as attribution.entryPlacement
// Neither ever carries personal data.

import { QUESTIONS } from "./content";
import type { Answers, QuestionId } from "./types";

export const ENTRY_PLACEMENTS = ["home_band_chip", "home_band_button"] as const;
export type EntryPlacement = (typeof ENTRY_PLACEMENTS)[number] | "direct";

const first = (v: unknown): unknown => (Array.isArray(v) ? v[0] : v);

// "updated:3-5" becomes { updated: "3-5" }. Anything that is not exactly one known question and one
// of its own answers is ignored.
export function parsePrefill(value: unknown): Partial<Answers> | null {
  const raw = first(value);
  if (typeof raw !== "string") return null;
  const match = /^([a-z]+):([a-z0-9-]+)$/.exec(raw);
  if (!match || !Object.hasOwn(QUESTIONS, match[1])) return null;
  const question = match[1] as QuestionId;
  const options: Record<string, unknown> = QUESTIONS[question].options;
  return Object.hasOwn(options, match[2]) ? ({ [question]: match[2] } as Partial<Answers>) : null;
}

// A known placement, otherwise "direct".
export function parsePlacement(value: unknown): EntryPlacement {
  const raw = first(value);
  return (ENTRY_PLACEMENTS as readonly unknown[]).includes(raw) ? (raw as EntryPlacement) : "direct";
}
