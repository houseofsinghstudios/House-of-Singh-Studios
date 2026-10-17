// Share codes. The seven answers as one mixed radix number, written in base 36 and padded to 4 characters.
// Decoding never throws: anything that is not a valid code returns null.

import { ANSWER_IDS, QUESTION_ORDER, type Answers, type QuestionId } from "./types";

const CODE_LENGTH = 4;
const TOTAL = QUESTION_ORDER.reduce((n, q) => n * ANSWER_IDS[q].length, 1);

export function encode(answers: Answers): string {
  let value = 0;
  for (const q of QUESTION_ORDER) {
    const ids: readonly string[] = ANSWER_IDS[q];
    const index = ids.indexOf(answers[q]);
    if (index < 0) throw new Error(`Brand Pulse: unknown answer for ${q}`);
    value = value * ids.length + index;
  }
  return value.toString(36).padStart(CODE_LENGTH, "0");
}

export function decode(code: unknown): Answers | null {
  if (typeof code !== "string" || !new RegExp(`^[0-9a-z]{${CODE_LENGTH}}$`).test(code)) return null;
  let value = parseInt(code, 36);
  if (!Number.isInteger(value) || value < 0 || value >= TOTAL) return null;

  const picked: Partial<Record<QuestionId, string>> = {};
  for (let i = QUESTION_ORDER.length - 1; i >= 0; i--) {
    const q = QUESTION_ORDER[i];
    const ids: readonly string[] = ANSWER_IDS[q];
    picked[q] = ids[value % ids.length];
    value = Math.floor(value / ids.length);
  }
  return picked as Answers;
}

// True only when every question has one of its allowed answer ids.
export function isValidAnswers(input: unknown): input is Answers {
  if (!input || typeof input !== "object") return false;
  const record = input as Record<string, unknown>;
  return QUESTION_ORDER.every((q) => (ANSWER_IDS[q] as readonly unknown[]).includes(record[q]));
}
