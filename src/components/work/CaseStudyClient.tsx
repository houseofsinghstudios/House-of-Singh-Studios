"use client";

import type { Project } from "@/data/projects";
import { getProjectDetail } from "@/data/projectDetails";
import CaseStudyTemplate from "@/components/casestudy/CaseStudyTemplate";

interface CaseStudyClientProps {
  project: Project;
}

export default function CaseStudyClient({ project }: CaseStudyClientProps) {
  const detail = getProjectDetail(project.slug);

  if (!detail) return null;

  return <CaseStudyTemplate project={detail} />;
}
