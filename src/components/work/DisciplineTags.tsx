// Discipline tags for project cards and rows: /work grid, /work list and the /services project cards.
// Every tag stays on one line and the row wraps. Below 768px only the first two show, then "+N",
// all in CSS so nothing shifts on load. "+N" is plain text, so a tap on it opens the card's link.

export interface DisciplineTag {
  value: string;
  label: string;
}

interface Props {
  tags: DisciplineTag[];
  className: string;
  // When given, tags are buttons that filter (the /work page). Otherwise plain text.
  onSelect?: (value: string) => void;
}

const SHOWN_ON_MOBILE = 2;

export default function DisciplineTags({ tags, className, onSelect }: Props) {
  const hidden = tags.length - SHOWN_ON_MOBILE;
  return (
    <span className={`dtags ${className}`}>
      {tags.map((tag, i) => {
        const cls = `dtag${i >= SHOWN_ON_MOBILE ? " dtag--extra" : ""}`;
        return onSelect ? (
          <button
            key={tag.value}
            type="button"
            className={`${cls} wp-grid-cat-tag`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(tag.value);
            }}
          >
            {tag.label}
          </button>
        ) : (
          <span key={tag.value} className={cls}>{tag.label}</span>
        );
      })}
      {hidden > 0 && <span className="dtag dtag-more">{`+${hidden}`}</span>}
    </span>
  );
}
