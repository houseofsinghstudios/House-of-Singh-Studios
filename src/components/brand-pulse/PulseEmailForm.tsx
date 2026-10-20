"use client";
// Email form for Keep It and for the gate settings. Client component: inline validation and form state.

import { useState } from "react";
import { KEEP_IT } from "@/lib/brand-pulse/content";
import { EMAIL_PATTERN, type LeadContact, type SendStatus } from "./events";

interface Props {
  id: string;
  buttonLabel: string;
  status: SendStatus;
  onSubmit: (contact: LeadContact, honeypot: string) => void;
}

export default function PulseEmailForm({ id, buttonLabel, status, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [retake, setRetake] = useState(false);
  const [insights, setInsights] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const sending = status === "sending";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const value = email.trim();
    const problem = !value ? KEEP_IT.emailRequired : EMAIL_PATTERN.test(value) ? "" : KEEP_IT.emailInvalid;
    setError(problem);
    if (problem) return;
    onSubmit({ email: value, retakeReminder: retake, marketingConsent: insights }, honeypot);
  }

  return (
    <form className="bp-form" onSubmit={handleSubmit} noValidate data-clarity-mask="True">
      <div className="bp-field">
        <label className="contact-label" htmlFor={`${id}-email`}>{KEEP_IT.emailLabel}</label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          className="contact-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-email-error` : undefined}
          disabled={sending}
        />
        {error && <p id={`${id}-email-error`} className="bp-error" role="alert">{error}</p>}
      </div>
      <div className="bp-honeypot" aria-hidden="true">
        <label htmlFor={`${id}-website-url`}>Leave empty</label>
        <input id={`${id}-website-url`} tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      <label className="bp-tick">
        <input type="checkbox" checked={retake} onChange={(e) => setRetake(e.target.checked)} disabled={sending} />
        <span>{KEEP_IT.retake}</span>
      </label>
      <label className="bp-tick">
        <input type="checkbox" checked={insights} onChange={(e) => setInsights(e.target.checked)} disabled={sending} />
        <span>{KEEP_IT.insights}</span>
      </label>
      <button type="submit" className="btn-primary bp-btn" disabled={sending} aria-busy={sending}>
        {sending ? KEEP_IT.sending : buttonLabel}
      </button>
      <p className="bp-small">{KEEP_IT.smallPrint}</p>
    </form>
  );
}
