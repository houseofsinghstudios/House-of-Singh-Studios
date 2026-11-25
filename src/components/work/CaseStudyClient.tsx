// Server component: renders the case study template from the detail the page read from Sanity
// (getProjectDetailBySlug, whose local data fallback applies only while building). Never reads the
// local data itself, so a case study Sanity does not have can never be drawn from the old copy.
// Interactive children carry their own "use client".
import type { ProjectDetail } from "@/data/projectDetails";
import CaseStudyTemplate, { type ServiceLink } from "@/components/casestudy/CaseStudyTemplate";

interface CaseStudyClientProps {
  detail: ProjectDetail | null;
  services?: ServiceLink[];
}

export default function CaseStudyClient({ detail, services = [] }: CaseStudyClientProps) {
  if (!detail) return null;

  return <CaseStudyTemplate project={detail} services={services} />;
}
