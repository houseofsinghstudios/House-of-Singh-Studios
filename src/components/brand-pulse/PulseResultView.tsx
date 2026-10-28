// The Brand Pulse result: pulse, profile, headline, five vital signs, four paragraphs and the service lines.
// No hooks, so it renders on the server for shared links and inside the client flow for a live check.
// Actions are never rendered: they are for the email only.
import { Link } from "next-view-transitions";
import { SERVICE_LINES } from "@/lib/brand-pulse/content";
import type { Level, Result } from "@/lib/brand-pulse/types";
import { serviceLinkLabel } from "@/lib/linking";
import "./brand-pulse.css";

interface Props {
  result: Result;
  // 0 header only, 1 adds vital signs, 2 adds paragraphs, 3 adds service lines.
  stage?: number;
  // Under the "before-full-result" gate the paragraphs and services wait for the email.
  locked?: boolean;
}

const FILLED: Record<Level, number> = { good: 3, attention: 2, risk: 1 };

function Meter({ level }: { level: Level }) {
  return (
    <span className="bp-meter" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < FILLED[level] ? "is-on" : undefined} />
      ))}
    </span>
  );
}

export default function PulseResultView({ result, stage = 3, locked = false }: Props) {
  return (
    <div className="bp-result">
      <header className="bp-reveal">
        <p className="editorial-label bp-label">{result.pulseLabel}</p>
        <h2 className="bp-heading bp-result-name" tabIndex={-1}>{result.profileName}</h2>
        <p className="bp-headline">{result.headline}</p>
      </header>

      {stage >= 1 && (
        <ul className="bp-vitals bp-reveal">
          {result.vitals.map((v) => (
            <li key={v.id} className={`bp-vital is-${v.level}`}>
              <span className="bp-vital-label">{v.label}</span>
              <span className="bp-vital-level">
                <Meter level={v.level} />
                {v.levelLabel}
              </span>
              <span className="bp-vital-explainer">{v.explainer}</span>
            </li>
          ))}
        </ul>
      )}

      {stage >= 2 && !locked && (
        <div className="bp-paragraphs bp-reveal">
          {result.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      )}

      {stage >= 3 && !locked && (
        <div className="bp-services bp-reveal">
          <p>
            {SERVICE_LINES.recommended}{" "}
            <Link href={`/services/${result.service.slug}`} className="bp-link" aria-label={serviceLinkLabel(result.service.slug, result.service.name)}>{result.service.name}</Link>
          </p>
          {result.alsoService && (
            <p>
              {SERVICE_LINES.also}{" "}
              <Link href={`/services/${result.alsoService.slug}`} className="bp-link" aria-label={serviceLinkLabel(result.alsoService.slug, result.alsoService.name)}>{result.alsoService.name}</Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
