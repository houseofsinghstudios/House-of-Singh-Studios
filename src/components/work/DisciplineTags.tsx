// Discipline tags for project cards: the Initiatives programme pages and the /services project cards.
// Every tag stays on one line and the row wraps. Below 768px only the first two show, then "+N",
// all in CSS so nothing shifts on load. "+N" is plain text, so a tap on it opens the card's link.
// An Exploration, Parallel or Commons project leads with its type label, which always shows.
import ProjectTypeLabel from "./ProjectTypeLabel";
import type { ProjectType } from "@/lib/initiatives/types";

export interface DisciplineTag {
  value: string;
  label: string;
}

interface Props {
  tags: DisciplineTag[];
  className: string;
  projectType?: ProjectType;
}

const SHOWN_ON_MOBILE = 2;

export default function DisciplineTags({ tags, className, projectType }: Props) {
  const hidden = tags.length - SHOWN_ON_MOBILE;
  return (
    <span className={`dtags ${className}`}>
      <ProjectTypeLabel type={projectType} className="dtag" />
      {tags.map((tag, i) => {
        const cls = `dtag${i >= SHOWN_ON_MOBILE ? " dtag--extra" : ""}`;
        return <span key={tag.value} className={cls}>{tag.label}</span>;
      })}
      {hidden > 0 && <span className="dtag dtag-more">{`+${hidden}`}</span>}
    </span>
  );
}
