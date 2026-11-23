// Project Planner intro. Rendered inside the ProjectPlanner client flow; no hooks.
import IntentLink from "@/components/IntentLink";
import { INTRO } from "@/lib/project-planner/content";

export default function PlannerIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="pp-intro">
      <p className="editorial-label pp-eyebrow">{INTRO.eyebrow}</p>
      <h1 className="pp-heading">{INTRO.heading}</h1>
      <p className="pp-lead">{INTRO.text}</p>
      <p className="pp-text">{INTRO.trust}</p>
      <button type="button" className="btn-primary pp-btn needs-js" onClick={onStart}>{INTRO.button}</button>
      <p className="pp-small">
        {INTRO.privacy} <IntentLink href="/privacy" className="pp-link">{INTRO.privacyLink}</IntentLink>.
      </p>
      <div className="pp-intro-links">
        <p className="pp-text">{INTRO.writeLead} <IntentLink href="/contact" className="pp-link">{INTRO.writeLink}</IntentLink></p>
        <p className="pp-text">{INTRO.pulseLead} <IntentLink href="/brand-pulse" className="pp-link">{INTRO.pulseLink}</IntentLink></p>
      </div>
    </div>
  );
}
