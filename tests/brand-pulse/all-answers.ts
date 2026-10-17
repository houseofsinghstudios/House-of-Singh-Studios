// Every one of the 53,760 answer combinations, in question order.
import { ANSWER_IDS, QUESTION_ORDER, type Answers } from "@/lib/brand-pulse/types";

export function* allAnswers(): Generator<Answers> {
  const walk = function* (i: number, acc: Partial<Answers>): Generator<Answers> {
    if (i === QUESTION_ORDER.length) return yield acc as Answers;
    const q = QUESTION_ORDER[i];
    for (const id of ANSWER_IDS[q]) yield* walk(i + 1, { ...acc, [q]: id });
  };
  yield* walk(0, {});
}
