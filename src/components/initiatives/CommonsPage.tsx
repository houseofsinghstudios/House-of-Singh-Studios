// /initiatives/commons: hero with at a glance, (01) What we offer, (02) Who can apply and (03) How we
// choose as editorial splits, (04) the work, (05) Questions, (06) Nominate with what happens next.
import type { Project } from "@/data/projects";
import NextPageLink from "@/components/layout/NextPageLink";
import { COMMONS } from "@/lib/initiatives/content";
import InitiativeHero from "./InitiativeHero";
import InitiativeSection from "./InitiativeSection";
import InitiativeWork from "./InitiativeWork";
import InitiativeQuestions from "./InitiativeQuestions";
import NumberedRows from "./NumberedRows";
import { NominateBand } from "./NominateBand";

function List({ items, note }: { items: string[]; note?: string }) {
  return (
    <>
      <ul className="svc-del-list init-list">
        {items.map((item, i) => (
          <li key={item} className="svc-del-item css-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
            {item}
          </li>
        ))}
      </ul>
      {note && <p className="init-note css-reveal">{note}</p>}
    </>
  );
}

export default function CommonsPage({ projects }: { projects: Project[] }) {
  return (
    <div className="init-page">
      <InitiativeHero programme="Commons" heading={COMMONS.heading} intro={COMMONS.intro} glance={COMMONS.glance} />
      <InitiativeSection id="what-we-offer" number="01" heading={COMMONS.offerHeading} split>
        <List items={COMMONS.offer} />
      </InitiativeSection>
      <InitiativeSection id="who-can-apply" number="02" heading={COMMONS.eligibleHeading} split>
        <List items={COMMONS.eligible} note={COMMONS.notEligible} />
      </InitiativeSection>
      <InitiativeSection id="how-we-choose" number="03" heading={COMMONS.chooseHeading} split>
        <NumberedRows rows={COMMONS.criteria.map((c) => ({ name: c.name, description: c.line }))} />
      </InitiativeSection>
      <InitiativeSection id="the-work" number="04" heading={COMMONS.workHeading}>
        <InitiativeWork projects={projects} empty={COMMONS.workEmpty} />
      </InitiativeSection>
      <InitiativeSection id="questions" number="05" heading={COMMONS.questionsHeading}>
        <InitiativeQuestions questions={COMMONS.questions} />
      </InitiativeSection>
      <NominateBand number="06" item={COMMONS.nominate} next={COMMONS.next} />
      <NextPageLink current="/initiatives/commons" />
    </div>
  );
}
