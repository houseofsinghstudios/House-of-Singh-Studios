// /initiatives/parallel: hero, (01) How it works, (02) The work, (03) Questions, (04) Nominate.
import type { Project } from "@/data/projects";
import NextPageLink from "@/components/layout/NextPageLink";
import ServiceDeliverableRow from "@/components/services/ServiceDeliverableRow";
import { PARALLEL } from "@/lib/initiatives/content";
import InitiativeHero from "./InitiativeHero";
import InitiativeSection from "./InitiativeSection";
import InitiativeWork from "./InitiativeWork";
import InitiativeQuestions from "./InitiativeQuestions";
import { NominateBand } from "./NominateBand";

export default function ParallelPage({ projects }: { projects: Project[] }) {
  return (
    <div className="init-page">
      <InitiativeHero programme="Parallel" heading={PARALLEL.heading} intro={PARALLEL.intro} />
      <InitiativeSection id="how-it-works" number="01" heading={PARALLEL.stepsHeading}>
        <div className="init-steps">
          {PARALLEL.steps.map((step, i) => (
            <div key={step.name} className="css-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <ServiceDeliverableRow number={String(i + 1).padStart(2, "0")} name={step.name} description={step.description} titleAs="h3" />
            </div>
          ))}
        </div>
      </InitiativeSection>
      <InitiativeSection id="the-work" number="02" heading={PARALLEL.workHeading}>
        <InitiativeWork projects={projects} empty={PARALLEL.workEmpty} />
      </InitiativeSection>
      <InitiativeSection id="questions" number="03" heading={PARALLEL.questionsHeading}>
        <InitiativeQuestions questions={PARALLEL.questions} />
      </InitiativeSection>
      <NominateBand number="04" item={PARALLEL.nominate} />
      <NextPageLink current="/initiatives/parallel" />
    </div>
  );
}
