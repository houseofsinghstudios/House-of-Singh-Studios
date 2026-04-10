"use client";

import type { Project } from "@/data/projects";
import type { ProjectDetail } from "@/data/projectDetails";
import { getProjectDetail } from "@/data/projectDetails";
import CaseStudyTemplate from "@/components/casestudy/CaseStudyTemplate";

interface CaseStudyClientProps {
  project: Project;
  detail: ProjectDetail | null;
}

export default function CaseStudyClient({ project, detail }: CaseStudyClientProps) {
  const resolved = detail || getProjectDetail(project.slug);

  if (!resolved) return null;

  return <CaseStudyTemplate project={resolved} />;
}
