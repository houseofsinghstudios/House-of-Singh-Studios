"use client";
// A client component: the signup form keeps the email, the honeypot and the sending state, posts to
// /api/subscribe and records newsletter_signup once the signup is accepted.

import { useRef, useState, FormEvent } from "react";
import { trackOnce } from "@/lib/analytics";
import { createSubmissionKeeper } from "@/lib/submission-id";

export default function ArticleNewsletter() {
  const [email, setEmail] = useState("");
  // The hidden field only a bot fills in; the API ignores the signup if it is set.
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const inFlight = useRef(false);
  // The submission id: the same for retries of the same signup, so n8n can drop a duplicate.
  const [submission] = useState(() => createSubmissionKeeper());

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    // A ref, not state: a second submit can arrive before the disabled button renders.
    if (inFlight.current) return;
    inFlight.current = true;
    const id = submission.idFor({ email, source: "article", honeypot });
    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "article", honeypot, submissionId: id }),
      });
      if (!res.ok) throw new Error();
      submission.done();
      setStatus("success");
      // Only once the subscription is accepted, and never for the bot trap. No email.
      if (!honeypot) trackOnce("newsletter_signup", id);
    } catch {
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "success") {
    return (
      <div style={{ marginTop: 32 }}>
        <p className="art-newsletter-success">
          Thank you. You&rsquo;re on the list.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 32 }}>
      <form onSubmit={handleSubmit} className="art-newsletter-form" data-clarity-mask="True">
        <span className="art-newsletter-label">
          Get studio insights in your inbox.
        </span>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "submitting"}
          className="art-newsletter-input"
        />
        <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
          <label htmlFor="newsletter-honeypot">Do not fill this field</label>
          <input
            id="newsletter-honeypot"
            type="text"
            name="honeypot"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="art-newsletter-submit"
          style={{ opacity: status === "submitting" ? 0.4 : 1 }}
        >
          Subscribe&nbsp;&rarr;
        </button>
      </form>
      {status === "error" && (
        <p className="art-newsletter-error">Something went wrong. Try again.</p>
      )}
    </div>
  );
}
