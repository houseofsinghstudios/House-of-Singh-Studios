"use client";
// Everything after the result: feedback, Next Step, Keep It, studio view and the quiet links.
// Client component: feedback taps, form submissions and copying the share link.

import { useState } from "react";
import { Link } from "next-view-transitions";
import { FEEDBACK, KEEP_IT, NEXT_STEP, QUIET_LINKS } from "@/lib/brand-pulse/content";
import type { Feedback } from "@/lib/brand-pulse/types";
import PulseEmailForm from "./PulseEmailForm";
import PulseStudioView from "./PulseStudioView";
import type { LeadContact, ProfileContact, SendStatus } from "./events";

interface Props {
  bookingHref: string;
  shareHref: string;
  lead: SendStatus;
  leadEmail: string | null;
  onFeedback: (feedback: Feedback) => void;
  onLead: (contact: LeadContact, honeypot: string) => void;
  onProfile: (contact: ProfileContact, honeypot: string) => Promise<boolean>;
  onRestart: () => void;
}

function FeedbackRow({ onFeedback }: { onFeedback: (f: Feedback) => void }) {
  const [given, setGiven] = useState<Feedback | null>(null);
  if (given) return <p className="bp-note bp-feedback" role="status">{FEEDBACK.thanks}</p>;
  return (
    <div className="bp-feedback" role="group" aria-labelledby="bp-feedback-q">
      <p id="bp-feedback-q" className="bp-feedback-q">{FEEDBACK.question}</p>
      <div className="bp-feedback-options">
        {FEEDBACK.options.map((o) => (
          <button key={o.id} type="button" className="bp-chip-btn" onClick={() => { setGiven(o.id); onFeedback(o.id); }}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CopyLink({ href }: { href: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
    } catch {
      window.prompt(QUIET_LINKS.copyLink, href);
    }
  }
  return (
    <button type="button" className="bp-quiet-link" onClick={copy}>
      {copied ? QUIET_LINKS.copied : QUIET_LINKS.copyLink}
    </button>
  );
}

function KeepIt({ lead, leadEmail, shareHref, onLead, onProfile }: Pick<Props, "lead" | "leadEmail" | "shareHref" | "onLead" | "onProfile">) {
  return (
    <div className="bp-block">
      <p className="editorial-label bp-label">{KEEP_IT.label}</p>
      <h3 className="bp-block-heading">{KEEP_IT.heading}</h3>
      {lead === "success" && leadEmail ? (
        <>
          <p className="bp-note" role="status">{KEEP_IT.success}</p>
          <PulseStudioView email={leadEmail} onSubmit={onProfile} />
        </>
      ) : (
        <>
          <p className="bp-text">{KEEP_IT.text}</p>
          {lead === "error" && (
            <div className="bp-fallback" role="alert">
              <p className="bp-error">{KEEP_IT.failure}</p>
              <p className="bp-fallback-link">{shareHref}</p>
            </div>
          )}
          <PulseEmailForm id="bp-keep" buttonLabel={KEEP_IT.button} status={lead} onSubmit={onLead} />
        </>
      )}
    </div>
  );
}

export default function PulseFollowUp(props: Props) {
  return (
    <div className="bp-followup bp-reveal">
      <FeedbackRow onFeedback={props.onFeedback} />
      <div className="bp-blocks">
        <div className="bp-block">
          <p className="editorial-label bp-label">{NEXT_STEP.label}</p>
          <h3 className="bp-block-heading">{NEXT_STEP.heading}</h3>
          <p className="bp-text">{NEXT_STEP.text}</p>
          <a href={props.bookingHref} className="btn-primary bp-btn" target="_blank" rel="noopener noreferrer" data-cursor="link">
            {NEXT_STEP.button}
          </a>
        </div>
        <KeepIt {...props} />
      </div>
      <nav className="bp-quiet" aria-label="Brand Pulse">
        <Link href="/contact" className="bp-quiet-link">{QUIET_LINKS.conversation}</Link>
        <CopyLink href={props.shareHref} />
        <button type="button" className="bp-quiet-link" onClick={props.onRestart}>{QUIET_LINKS.startAgain}</button>
      </nav>
    </div>
  );
}
