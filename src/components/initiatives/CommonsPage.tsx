// /initiatives/commons: hero with at a glance, (01) What we offer, (02) Who can apply and (03) How we
// choose as editorial splits, (04) Pro bono work, then Questions and Nominate with what happens next.
// Pro bono work shows when there are recognitions or Commons case studies; without either it is
// left out and the sections after it move up a number.
import type { Project } from "@/data/projects";
import NextPageLink from "@/components/layout/NextPageLink";
import { COMMONS } from "@/lib/initiatives/content";
import type { Recognition } from "@/lib/initiatives/types";
import InitiativeHero from "./InitiativeHero";
import InitiativeSection from "./InitiativeSection";
import InitiativeWork from "./InitiativeWork";
import InitiativeQuestions from "./InitiativeQuestions";
import NumberedRows from "./NumberedRows";
import ProBonoWork from "./ProBonoWork";
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

export default function CommonsPage({ projects, recognitions }: { projects: Project[]; recognitions: Recognition[] }) {
  const hasWork = recognitions.length > 0 || projects.length > 0;
  const num = (n: number) => String(hasWork ? n : n - 1).padStart(2, "0");
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
      {hasWork && (
        <InitiativeSection id="pro-bono-work" number="04" heading={COMMONS.workHeading}>
          {recognitions.length > 0 && <ProBonoWork recognitions={recognitions} />}
          <InitiativeWork projects={projects} />
        </InitiativeSection>
      )}
      <InitiativeSection id="questions" number={num(5)} heading={COMMONS.questionsHeading}>
        <InitiativeQuestions questions={COMMONS.questions} />
      </InitiativeSection>
      <NominateBand number={num(6)} item={COMMONS.nominate} next={COMMONS.next} />
      <NextPageLink current="/initiatives/commons" />
    </div>
  );
}
