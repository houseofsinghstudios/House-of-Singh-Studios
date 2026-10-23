import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import NextPageLink from "@/components/layout/NextPageLink";
import InitiativeHero from "@/components/initiatives/InitiativeHero";
import InitiativeSection from "@/components/initiatives/InitiativeSection";
import InitiativeQuestions from "@/components/initiatives/InitiativeQuestions";
import ProgrammeRows, { type ProgrammeRow } from "@/components/initiatives/ProgrammeRows";
import { TakePartBand } from "@/components/initiatives/NominateBand";
import { LANDING } from "@/lib/initiatives/content";
import { linksToPage } from "@/lib/initiatives/pages";
import { visibleInitiatives, type ProjectType } from "@/lib/initiatives/types";
import { getInitiatives } from "@/lib/sanity/initiatives";
import { getProjectsByType } from "@/lib/sanity/projects";
import { studioTitle } from "@/lib/seo";

export const revalidate = 60;

const URL = "https://studios.houseofsingh.com/initiatives";

export const metadata: Metadata = {
  title: LANDING.title,
  description: LANDING.description,
  alternates: { canonical: URL },
  openGraph: { title: studioTitle(LANDING.title), description: LANDING.description, url: URL },
};

// Programme slugs that are also project types: their newest published case study fills the row.
const TYPED: ProjectType[] = ["parallel", "commons"];

export default async function InitiativesPage() {
  const all = await getInitiatives();
  const visible = visibleInitiatives(all);
  const projects = await getProjectsByType(TYPED);
  const rows: ProgrammeRow[] = visible.map((initiative) => ({
    initiative,
    linked: linksToPage(initiative, all),
    newest: (TYPED as string[]).includes(initiative.slug) ? projects[initiative.slug as ProjectType][0] ?? null : null,
  }));
  // Only programmes that are visible and have a page get a column in the band.
  const takePart = LANDING.takePart.filter((item) => rows.some((r) => r.linked && r.initiative.slug === item.slug));

  return (
    <div className="init-page">
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://studios.houseofsingh.com" },
        { name: "Initiatives", url: URL },
      ]} />
      <InitiativeHero heading={LANDING.heading} intro={LANDING.intro} />
      <InitiativeSection id="programmes" number="01" heading={LANDING.programmesHeading}>
        <ProgrammeRows rows={rows} />
      </InitiativeSection>
      {takePart.length > 0 && <TakePartBand number="02" heading={LANDING.takePartHeading} items={takePart} />}
      <InitiativeSection id="questions" number={takePart.length > 0 ? "03" : "02"} heading={LANDING.questionsHeading}>
        <InitiativeQuestions questions={LANDING.questions} />
      </InitiativeSection>
      <NextPageLink current="/initiatives" />
    </div>
  );
}
