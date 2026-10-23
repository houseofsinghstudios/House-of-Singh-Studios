// /initiatives/commons: hero, (01) What we offer beside (02) Who can apply, (03) How we choose,
// (04) The work, (05) Questions, (06) Nominate.
import type { Project } from "@/data/projects";
import EditorialLabel from "@/components/ui/EditorialLabel";
import NextPageLink from "@/components/layout/NextPageLink";
import { COMMONS } from "@/lib/initiatives/content";
import InitiativeHero from "./InitiativeHero";
import InitiativeSection from "./InitiativeSection";
import InitiativeWork from "./InitiativeWork";
import InitiativeQuestions from "./InitiativeQuestions";
import { NominateBand } from "./NominateBand";

function ListColumn({ id, number, heading, items, note }: { id: string; number: string; heading: string; items: string[]; note?: string }) {
  return (
    <section className="init-col" aria-labelledby={`${id}-heading`}>
      <div className="css-reveal">
        <EditorialLabel text={number} className="mb-6" />
      </div>
      <h2 id={`${id}-heading`} className="svcd-process-heading css-reveal" style={{ transitionDelay: "80ms" }}>
        {heading}
      </h2>
      <ul className="svc-del-list init-list">
        {items.map((item, i) => (
          <li key={item} className="svc-del-item css-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
            {item}
          </li>
        ))}
      </ul>
      {note && <p className="init-note css-reveal">{note}</p>}
    </section>
  );
}

export default function CommonsPage({ projects }: { projects: Project[] }) {
  return (
    <div className="init-page">
      <InitiativeHero programme="Commons" heading={COMMONS.heading} intro={COMMONS.intro} />
      <div className="init-cols" style={{ padding: "clamp(64px, 8vw, 120px) var(--page-px)" }}>
        <ListColumn id="what-we-offer" number="01" heading={COMMONS.offerHeading} items={COMMONS.offer} />
        <ListColumn id="who-can-apply" number="02" heading={COMMONS.eligibleHeading} items={COMMONS.eligible} note={COMMONS.notEligible} />
      </div>
      <InitiativeSection id="how-we-choose" number="03" heading={COMMONS.chooseHeading}>
        <p className="init-text css-reveal">{COMMONS.chooseIntro}</p>
        <ol className="init-criteria">
          {COMMONS.criteria.map((c, i) => (
            <li key={c.name} className="init-criterion css-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="svc-del-num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="init-criterion-name">{c.name}</h3>
              <p className="init-criterion-line">{c.line}</p>
            </li>
          ))}
        </ol>
      </InitiativeSection>
      <InitiativeSection id="the-work" number="04" heading={COMMONS.workHeading}>
        <InitiativeWork projects={projects} empty={COMMONS.workEmpty} />
      </InitiativeSection>
      <InitiativeSection id="questions" number="05" heading={COMMONS.questionsHeading}>
        <InitiativeQuestions questions={COMMONS.questions} />
      </InitiativeSection>
      <NominateBand number="06" item={COMMONS.nominate} />
      <NextPageLink current="/initiatives/commons" />
    </div>
  );
}
