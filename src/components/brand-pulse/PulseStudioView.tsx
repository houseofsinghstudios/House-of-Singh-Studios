"use client";
// Optional studio view details, offered after the email is sent. Client component: form state.

import { useState } from "react";
import { STUDIO_VIEW, TEAM_SIZES } from "@/lib/brand-pulse/content";
import type { TeamSize } from "@/lib/brand-pulse/types";
import type { ProfileContact, SendStatus } from "./events";

interface Props {
  email: string;
  onSubmit: (contact: ProfileContact, honeypot: string) => Promise<boolean>;
}

const WEBSITE_PATTERN = /^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i;
const FIELDS = [
  { key: "name", label: STUDIO_VIEW.name, autoComplete: "name" },
  { key: "company", label: STUDIO_VIEW.company, autoComplete: "organization" },
  { key: "website", label: STUDIO_VIEW.website, autoComplete: "url" },
] as const;

export default function PulseStudioView({ email, onSubmit }: Props) {
  const [values, setValues] = useState({ name: "", company: "", website: "" });
  const [teamSize, setTeamSize] = useState<TeamSize | "">("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");
  const sending = status === "sending";

  if (status === "success") return <p className="bp-note" role="status">{STUDIO_VIEW.success}</p>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const website = values.website.trim();
    const problem = website && !WEBSITE_PATTERN.test(website) ? STUDIO_VIEW.websiteInvalid : "";
    setError(problem);
    if (problem) return;
    setStatus("sending");
    const ok = await onSubmit({ email, name: values.name.trim(), company: values.company.trim(), website, teamSize }, honeypot);
    setStatus(ok ? "success" : "error");
  }

  return (
    <form className="bp-form bp-studio" onSubmit={handleSubmit} noValidate data-clarity-mask="True">
      <p className="bp-text">{STUDIO_VIEW.text}</p>
      <div className="bp-studio-grid">
        {FIELDS.map((f) => (
          <div key={f.key} className="bp-field">
            <label className="contact-label" htmlFor={`bp-studio-${f.key}`}>{f.label}</label>
            <input
              id={`bp-studio-${f.key}`}
              className="contact-input"
              autoComplete={f.autoComplete}
              maxLength={f.key === "website" ? 200 : 120}
              value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              aria-invalid={f.key === "website" && error ? true : undefined}
              aria-describedby={f.key === "website" && error ? "bp-studio-website-error" : undefined}
              disabled={sending}
            />
            {f.key === "website" && error && <p id="bp-studio-website-error" className="bp-error" role="alert">{error}</p>}
          </div>
        ))}
        <div className="bp-field">
          <label className="contact-label" htmlFor="bp-studio-team">{STUDIO_VIEW.teamSize}</label>
          <select id="bp-studio-team" className="contact-input" value={teamSize} onChange={(e) => setTeamSize(e.target.value as TeamSize | "")} disabled={sending}>
            <option value="">{STUDIO_VIEW.teamSizePlaceholder}</option>
            {TEAM_SIZES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
      </div>
      <div className="bp-honeypot" aria-hidden="true">
        <label htmlFor="bp-studio-url2">Leave empty</label>
        <input id="bp-studio-url2" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      <button type="submit" className="btn-secondary bp-btn" disabled={sending} aria-busy={sending}>
        {sending ? STUDIO_VIEW.sending : STUDIO_VIEW.button}
      </button>
      {status === "error" && <p className="bp-error" role="alert">{STUDIO_VIEW.failure}</p>}
    </form>
  );
}
