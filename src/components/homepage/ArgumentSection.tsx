import { ARGUMENT } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

const STEP_NUMBERS = ["01", "02", "03"];

export default function ArgumentSection() {
  return (
    <section className="argument-section css-reveal" style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px)" }}>
      <div className="argument-grid">
        {/* Left column: label, heading, snap */}
        <div className="argument-left">
          <EditorialLabel text="02 — The Argument" className="mb-6" />

          <h2
            className="css-reveal font-[var(--sans)] font-medium tracking-[-0.03em] text-[color:var(--text-primary)] m-0 overflow-hidden"
            style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.1 }}
          >
            {ARGUMENT.heading}
          </h2>

          <p
            className="we-fix-that css-reveal mt-10 font-[var(--sans)] font-medium text-[color:var(--text-primary)]"
            style={{ fontSize: "clamp(22px, 2vw, 28px)", position: "relative", display: "inline-block" }}
          >
            {ARGUMENT.snap}
          </p>
        </div>

        {/* Right column: numbered steps */}
        <div className="argument-steps">
          {ARGUMENT.steps.map((step, i) => (
            <div key={step} className="argument-step-row css-reveal">
              <span className="argument-step-num">{STEP_NUMBERS[i]}</span>
              <p className="argument-step-text">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
