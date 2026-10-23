// The small project type label: Exploration, Parallel or Commons. Client work shows nothing.
// Plain text inside the line it sits in, so screen readers read it with the rest.
import { projectTypeLabel, type ProjectType } from "@/lib/initiatives/types";

export default function ProjectTypeLabel({ type, className }: { type?: ProjectType; className?: string }) {
  const label = projectTypeLabel(type);
  if (!label) return null;
  return <span className={`ptype${className ? ` ${className}` : ""}`}>{label}</span>;
}
