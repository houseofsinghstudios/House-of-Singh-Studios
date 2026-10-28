// /initiatives/parallel: hero with at a glance, (01) the edition's parts as an editorial split,
// (02) the work, (03) Questions, (04) the lighter suggest band.
import type { Project } from "@/data/projects";
import NextPageLink from "@/components/layout/NextPageLink";
import InlineLinks from "@/components/InlineLinks";
import { PARALLEL, QUESTIONS_NOTE } from "@/lib/initiatives/content";
import InitiativeHero from "./InitiativeHero";
import InitiativeSection from "./InitiativeSection";
import InitiativeWork from "./InitiativeWork";
import InitiativeQuestions from "./InitiativeQuestions";
import NumberedRows from "./NumberedRows";
import { NominateBand } from "./NominateBand";

export default function ParallelPage({ projects }: { projects: Project[] }) {
  return (
    <div className="init-page">
      <InitiativeHero programme="Parallel" heading={PARALLEL.heading} intro={PARALLEL.intro} glance={PARALLEL.glance} />
      <InitiativeSection id="steps" number="01" heading={PARALLEL.stepsHeading} intro={PARALLEL.stepsIntro} split>
        <NumberedRows rows={PARALLEL.steps} />
      </InitiativeSection>
      <InitiativeSection id="the-work" number="02" heading={PARALLEL.workHeading}>
        <InitiativeWork projects={projects} empty={PARALLEL.workEmpty} />
      </InitiativeSection>
      <InitiativeSection id="questions" number="03" heading={PARALLEL.questionsHeading} note={<InlineLinks text={QUESTIONS_NOTE} />}>
        <InitiativeQuestions questions={PARALLEL.questions} />
      </InitiativeSection>
      <NominateBand number="04" item={PARALLEL.nominate} light />
      <NextPageLink current="/initiatives/parallel" />
    </div>
  );
}
