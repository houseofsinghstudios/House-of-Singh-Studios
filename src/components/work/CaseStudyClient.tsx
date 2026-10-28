// Server component: resolves the project detail (Sanity first, then the src/data fallback)
// and renders the template. Interactive children carry their own "use client".
import type { Project } from "@/data/projects";
import type { ProjectDetail } from "@/data/projectDetails";
import { getProjectDetail } from "@/data/projectDetails";
import CaseStudyTemplate, { type ServiceLink } from "@/components/casestudy/CaseStudyTemplate";

interface CaseStudyClientProps {
  project: Project;
  detail: ProjectDetail | null;
  services?: ServiceLink[];
}

export default function CaseStudyClient({ project, detail, services = [] }: CaseStudyClientProps) {
  const resolved = detail || getProjectDetail(project.slug);

  if (!resolved) return null;

  return <CaseStudyTemplate project={resolved} services={services} />;
}
