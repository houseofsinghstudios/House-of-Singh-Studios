// "Reading your brand pulse" screen. Pure markup: the timing lives in CSS and in BrandPulse.
// The one deliberate exception to the site's fade only motion: a 1px pulse line drawn across the width.
import { EVALUATING, VITALS } from "@/lib/brand-pulse/content";

export default function PulseEvaluating() {
  return (
    <div className="bp-evaluating" role="status">
      <h2 className="bp-heading bp-eval-heading" tabIndex={-1}>{EVALUATING.heading}</h2>
      <svg className="bp-eval-line" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path
          d="M0 20 H420 L440 20 L452 6 L466 34 L480 12 L490 20 H1000"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <ul className="bp-eval-rows">
        {VITALS.map((v, i) => (
          <li key={v.id} className="bp-eval-row" style={{ animationDelay: `${i * 400}ms` }}>
            <span>{v.label}</span>
            <span className="bp-eval-checked">{EVALUATING.checked}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
