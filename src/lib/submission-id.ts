// The submission id each form sends with a submission, so n8n can recognise the same submission
// arriving twice (a retry after a timeout, when n8n had in fact saved the first one).
//
// In the browser: one id per submission, kept while the visitor retries the same content; changed
// content gets a new id, and a success clears it. The same id also keys the form's analytics event
// (trackOnce), as it always did.
// On the server, cleanSubmissionId (src/lib/form-input.ts) passes on only an id of this shape.
import { submissionId } from "@/lib/analytics";

export function createSubmissionKeeper(make: () => string = submissionId) {
  let current: { id: string; content: string } | null = null;
  return {
    // The id for this content: the same as last time when the content has not changed.
    idFor(content: unknown): string {
      const key = JSON.stringify(content);
      if (!current || current.content !== key) current = { id: make(), content: key };
      return current.id;
    },
    // After a success: the next submission, even with the same content, is a new one.
    done() {
      current = null;
    },
  };
}
