// /partners: hero, at a glance, then (01) your client in safe hands, (02) how it works,
// (03) what it is worth, (04) who it is for, (05) questions, the action band and the next page link.
// Server rendered; only the count up, the Copy Text button and the analytics listener run in the
// browser. Sections, rows, questions and the band reuse the Initiatives and service page patterns.
import NextPageLink from "@/components/layout/NextPageLink";
import InitiativeSection from "@/components/initiatives/InitiativeSection";
import InitiativeQuestions from "@/components/initiatives/InitiativeQuestions";
import NumberedRows from "@/components/initiatives/NumberedRows";
import { TakePartBand } from "@/components/initiatives/NominateBand";
import { BAND, HOW, QUESTIONS, QUESTIONS_HEADING, SAFE, WHO, WORTH } from "@/lib/partners/content";
import PartnersHero from "./PartnersHero";
import PartnerStats from "./PartnerStats";
import IntroductionBox from "./IntroductionBox";
import PartnerEvents from "./PartnerEvents";
import "@/components/initiatives/initiatives.css";
import "./partners.css";

function SafeHands() {
  return (
    <ul className="pt-safe">
      {SAFE.items.map((item, i) => (
        <li key={item.name} className="pt-safe-item css-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
          <h3 className="pt-safe-name">{item.name}</h3>
          <p className="pt-safe-line">{item.line}</p>
        </li>
      ))}
    </ul>
  );
}

function Worth() {
  return (
    <div className="css-reveal">
      <p className="pt-worth-line">{WORTH.line}</p>
      <p className="pt-worth-body">{WORTH.body}</p>
      <p className="pt-worth-small">{WORTH.small}</p>
    </div>
  );
}

function Who() {
  return (
    <ul className="pt-who">
      {WHO.rows.map((row, i) => (
        <li key={row.who} className="pt-who-row css-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
          <p className="pt-who-name">{row.who}</p>
          <p className="pt-who-moment">{row.moment}</p>
        </li>
      ))}
    </ul>
  );
}

export default function PartnersPage() {
  const band = BAND.map((b) => ({ ...b, track: { action: b.slug, location: "band" } }));
  return (
    <div className="init-page pt-page">
      <PartnerEvents />
      <PartnersHero />
      <section className="pt-glance-section" aria-label="At a glance">
        <PartnerStats />
      </section>
      <InitiativeSection id="safe" number="01" heading={SAFE.heading}>
        <SafeHands />
      </InitiativeSection>
      <InitiativeSection id="how" number="02" heading={HOW.heading} intro={HOW.intro} split>
        <NumberedRows rows={HOW.steps} />
        <IntroductionBox />
      </InitiativeSection>
      <InitiativeSection id="worth" number="03" heading={WORTH.heading}>
        <Worth />
      </InitiativeSection>
      <InitiativeSection id="who" number="04" heading={WHO.heading}>
        <Who />
      </InitiativeSection>
      <InitiativeSection id="questions" number="05" heading={QUESTIONS_HEADING}>
        <InitiativeQuestions questions={QUESTIONS} />
      </InitiativeSection>
      <TakePartBand ariaLabel="Introduce a client or become a partner" items={band} />
      <NextPageLink current="/partners" />
    </div>
  );
}
