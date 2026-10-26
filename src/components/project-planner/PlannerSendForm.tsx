"use client";
// "Send your brief to the studio." Client component: inline validation and form state.
// Contact details leave the browser only from here, and only when the visitor presses send.

import { useState } from "react";
import Link from "next/link";
import { SEND } from "@/lib/project-planner/content";
import { NOTE_LIMIT } from "@/lib/project-planner/config";
import HearAboutFields from "@/components/contact/HearAboutFields";
import { EMAIL_PATTERN, type Contact, type Heard } from "./events";

type Status = "idle" | "sending" | "success" | "error";

interface Props {
  onSend: (contact: Contact, honeypot: string, heard: Heard) => Promise<boolean>;
}

const FIELDS = [
  { key: "name", label: SEND.name, required: true, autoComplete: "name", type: "text" },
  { key: "email", label: SEND.email, required: true, autoComplete: "email", type: "email" },
  { key: "company", label: SEND.company, required: false, autoComplete: "organization", type: "text" },
  { key: "location", label: SEND.location, required: false, autoComplete: "off", type: "text" },
] as const;

export default function PlannerSendForm({ onSend }: Props) {
  const [values, setValues] = useState({ name: "", email: "", company: "", location: "", note: "" });
  const [insights, setInsights] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [heard, setHeard] = useState<Heard>({ hearAbout: "", recommendedBy: "" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "email", string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const sending = status === "sending";

  if (status === "success") return <p className="pp-note" role="status">{SEND.success}</p>;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const name = values.name.trim();
    const email = values.email.trim();
    const next: typeof errors = {};
    if (!name) next.name = SEND.nameRequired;
    if (!email) next.email = SEND.emailRequired;
    else if (!EMAIL_PATTERN.test(email)) next.email = SEND.emailInvalid;
    setErrors(next);
    if (next.name || next.email) return;
    setStatus("sending");
    const ok = await onSend({ name, email, company: values.company.trim(), location: values.location.trim(), note: values.note.trim(), marketingConsent: insights }, honeypot, heard);
    setStatus(ok ? "success" : "error");
  }

  return (
    <form className="pp-send" onSubmit={submit} noValidate data-clarity-mask="True">
      <h3 className="pp-send-heading" tabIndex={-1} id="pp-send-heading">{SEND.heading}</h3>
      <p className="pp-text">{SEND.text}</p>
      {FIELDS.map((f) => {
        const error = f.key === "name" || f.key === "email" ? errors[f.key] : undefined;
        return (
          <div key={f.key} className="pp-field">
            <label className="contact-label" htmlFor={`pp-send-${f.key}`}>{f.label} {!f.required && <span className="pp-muted">{SEND.optional}</span>}</label>
            <input
              id={`pp-send-${f.key}`}
              type={f.type}
              className="contact-input"
              autoComplete={f.autoComplete}
              maxLength={f.key === "email" ? 254 : 120}
              value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              aria-required={f.required || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `pp-send-${f.key}-error` : undefined}
              disabled={sending}
            />
            {error && <p id={`pp-send-${f.key}-error`} className="pp-error" role="alert">{error}</p>}
          </div>
        );
      })}
      <div className="pp-field">
        <label className="contact-label" htmlFor="pp-send-note">{SEND.note} <span className="pp-muted">{SEND.optional}</span></label>
        <textarea id="pp-send-note" className="contact-input pp-textarea" rows={4} maxLength={NOTE_LIMIT} value={values.note} onChange={(e) => setValues((v) => ({ ...v, note: e.target.value }))} aria-describedby="pp-send-note-count" disabled={sending} />
        <p id="pp-send-note-count" className="pp-small">{SEND.noteLimit(NOTE_LIMIT - values.note.length)}</p>
      </div>
      <HearAboutFields idPrefix="pp-send" fieldClass="pp-field pp-hear" disabled={sending} onChange={setHeard} />
      <div className="pp-honeypot" aria-hidden="true">
        <label htmlFor="pp-send-url">Leave empty</label>
        <input id="pp-send-url" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      <label className="pp-tick">
        <input type="checkbox" checked={insights} onChange={(e) => setInsights(e.target.checked)} disabled={sending} />
        <span>{SEND.insights}</span>
      </label>
      <p className="pp-small">{SEND.smallPrint} <Link href="/privacy" className="pp-link">{SEND.privacyLink}</Link>.</p>
      <button type="submit" className="btn-primary pp-btn" disabled={sending} aria-busy={sending}>{sending ? SEND.sending : SEND.button}</button>
      {status === "error" && <p className="pp-error" role="alert">{SEND.failure}</p>}
    </form>
  );
}
