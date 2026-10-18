// Project Planner intro. Rendered inside the ProjectPlanner client flow; no hooks.
import Link from "next/link";
import { INTRO } from "@/lib/project-planner/content";

export default function PlannerIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="pp-intro">
      <p className="editorial-label pp-eyebrow">{INTRO.eyebrow}</p>
      <h1 className="pp-heading">{INTRO.heading}</h1>
      <p className="pp-lead">{INTRO.text}</p>
      <p className="pp-text">{INTRO.trust}</p>
      <button type="button" className="btn-primary pp-btn" onClick={onStart}>{INTRO.button}</button>
      <p className="pp-small">
        {INTRO.privacy} <Link href="/privacy" className="pp-link">{INTRO.privacyLink}</Link>.
      </p>
      <div className="pp-intro-links">
        <p className="pp-text">{INTRO.writeLead} <Link href="/contact" className="pp-link">{INTRO.writeLink}</Link></p>
        <p className="pp-text">{INTRO.pulseLead} <Link href="/brand-pulse" className="pp-link">{INTRO.pulseLink}</Link></p>
      </div>
    </div>
  );
}
