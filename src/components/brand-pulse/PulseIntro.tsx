// Brand Pulse intro screen. Rendered inside the BrandPulse client flow.
import { INTRO } from "@/lib/brand-pulse/content";

interface Props {
  headingLevel: "h1" | "h2";
  startLabel: string;
  onStart: () => void;
}

export default function PulseIntro({ headingLevel: Heading, startLabel, onStart }: Props) {
  return (
    <div className="bp-intro">
      <div className="bp-intro-main">
        <p className="editorial-label bp-label">{INTRO.label}</p>
        <Heading className="bp-heading">{INTRO.heading}</Heading>
        <p className="bp-text">{INTRO.text}</p>
        <div className="bp-intro-actions">
          <button type="button" className="btn-primary bp-btn" onClick={onStart}>
            {startLabel}
          </button>
          <p className="bp-small">{INTRO.instant}</p>
        </div>
      </div>
      <div className="bp-intro-side">
        <p className="editorial-label bp-label">{INTRO.youGet}</p>
        <ul className="bp-get-list">
          {INTRO.youGetItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="bp-trust">{INTRO.trust}</p>
      </div>
    </div>
  );
}
