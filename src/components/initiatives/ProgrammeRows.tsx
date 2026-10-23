// /initiatives, (01) Programmes: one Services page block row per visible initiative, a 1px rule
// between rows. Left: category and status, name, tagline, summary, Explore with the site arrow.
// Right: the newest project's cover once the programme has published work, otherwise a typographic
// panel (Cloudy ground, the row number large, the tagline in the heading style). A row with its own
// page is one link, named "Explore <name>"; its hover is the existing service block hover.
import Image from "next/image";
import { Link } from "next-view-transitions";
import type { Project } from "@/data/projects";
import { projectImage } from "@/components/work/WorkCards";
import { LANDING } from "@/lib/initiatives/content";
import { statusText, type Initiative } from "@/lib/initiatives/types";

export interface ProgrammeRow {
  initiative: Initiative;
  linked: boolean;
  newest: Project | null;
}

function Visual({ row, number }: { row: ProgrammeRow; number: string }) {
  const { initiative, newest } = row;
  if (newest) {
    return (
      <div className="svc-block-img init-visual">
        <Image src={projectImage(newest)} alt={newest.name} fill sizes="(max-width: 768px) 100vw, 45vw" style={{ objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div className="svc-block-img init-visual init-panel" aria-hidden="true">
      <div className="init-panel-inner">
        <span className="init-panel-num">{number}</span>
        <span className="init-panel-tagline">{initiative.tagline}</span>
      </div>
    </div>
  );
}

function RowBody({ row, number }: { row: ProgrammeRow; number: string }) {
  const { initiative, linked } = row;
  const status = statusText(initiative);
  return (
    <>
      <div className="init-row-text">
        <p className="svc-block-label">
          {initiative.category}
          {status ? ` (${status})` : ""}
        </p>
        <h3 className="svc-block-name">{initiative.name}</h3>
        <p className="init-row-tagline">{initiative.tagline}</p>
        <p className="svc-block-desc">{initiative.summary}</p>
      </div>
      <div className="init-row-visual">
        <Visual row={row} number={number} />
      </div>
      {linked && (
        <span className="init-row-explore">
          {LANDING.explore(initiative.name)} <span className="arrow-icon" aria-hidden="true">&rarr;</span>
        </span>
      )}
    </>
  );
}

export default function ProgrammeRows({ rows }: { rows: ProgrammeRow[] }) {
  return (
    <div className="init-rows">
      {rows.map((row, i) => {
        const number = String(i + 1).padStart(2, "0");
        return row.linked ? (
          <Link
            key={row.initiative.slug}
            href={`/initiatives/${row.initiative.slug}`}
            className="svc-block init-row css-reveal no-underline"
            aria-label={LANDING.explore(row.initiative.name)}
            data-cursor="link"
          >
            <RowBody row={row} number={number} />
          </Link>
        ) : (
          <div key={row.initiative.slug} className="svc-block init-row css-reveal">
            <RowBody row={row} number={number} />
          </div>
        );
      })}
    </div>
  );
}
