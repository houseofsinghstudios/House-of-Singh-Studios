// The section below the tool on /brand-pulse, never on a shared result: what the check reads, how it
// works, the brand profiles and four questions. A server component, built from the numbered sections
// the Initiatives pages use (the label "(01)", the section heading, the editorial split, the numbered
// rows and the questions accordion), so it keeps the site's label, heading and content rhythm; those
// components bring only numbered-section.css, not the whole Initiatives stylesheet. The
// FAQPage structured data comes from the same four questions, inside InitiativeQuestions, so it exists
// only where the section does. Copy: GUIDE, VITALS and PROFILES in src/lib/brand-pulse/content.ts.
import InitiativeSection from "@/components/initiatives/InitiativeSection";
import InitiativeQuestions from "@/components/initiatives/InitiativeQuestions";
import NumberedRows from "@/components/initiatives/NumberedRows";
import { GUIDE, PROFILES, VITALS } from "@/lib/brand-pulse/content";
import "./brand-pulse.css";

const two = (i: number) => String(i + 1).padStart(2, "0");

export default function PulseGuide() {
  return (
    <div className="bp-guide">
      <InitiativeSection id="what-it-reads" number="01" heading={GUIDE.reads.heading} intro={GUIDE.reads.intro} split>
        <NumberedRows rows={VITALS.map((v) => ({ name: v.label, description: v.explainer }))} />
      </InitiativeSection>

      <InitiativeSection id="how-it-works" number="02" heading={GUIDE.how.heading} split>
        <ol className="init-steps bp-guide-steps">
          {GUIDE.how.steps.map((step, i) => (
            <li key={step} className="css-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="svc-del-row">
                <span className="svc-del-num" aria-hidden="true">{two(i)}</span>
                <p className="svc-del-name">{step}</p>
              </div>
            </li>
          ))}
        </ol>
      </InitiativeSection>

      <InitiativeSection id="brand-profiles" number="03" heading={GUIDE.profiles.heading} split>
        <NumberedRows rows={Object.values(PROFILES).map((p) => ({ name: p.name, description: p.headline }))} />
      </InitiativeSection>

      <InitiativeSection id="questions" number="04" heading={GUIDE.questions.heading} split>
        <InitiativeQuestions questions={GUIDE.questions.items} />
      </InitiativeSection>
    </div>
  );
}
