// /initiatives, (01) Programs: one Services page block row per visible initiative, a 1px rule
// between rows. Left: the status line in Obsidian, the category, name, tagline, summary, then Explore
// with the site arrow. Right: the newest project's cover once the program has published work,
// otherwise a landscape panel (Cloudy ground, the row number small at the top left, the at a glance
// values in one row along the bottom). On phones the panel gives way to a short list of the same
// values between the summary and Explore. A row with its own page is one link, named
// "Explore <name>"; its hover is the existing service block hover.
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
    <div className="svc-block-img init-visual init-panel">
      <span className="editorial-label init-panel-num" aria-hidden="true">{number}</span>
      {initiative.atAGlance.length > 0 && (
        <ul className="init-panel-glance">
          {initiative.atAGlance.map((item) => (
            <li key={item.value}>{item.value}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RowBody({ row, number }: { row: ProgrammeRow; number: string }) {
  const { initiative, linked } = row;
  const status = statusText(initiative);
  return (
    <>
      <div className="init-row-text">
        {status && <p className="editorial-label init-row-status">({status})</p>}
        <p className="svc-block-label">{initiative.category}</p>
        <h3 className="svc-block-name">{initiative.name}</h3>
        <p className="init-row-tagline">{initiative.tagline}</p>
        <p className="svc-block-desc">{initiative.summary}</p>
        {initiative.atAGlance.length > 0 && (
          <ul className="init-row-glance">
            {initiative.atAGlance.map((item) => (
              <li key={item.value}>{item.value}</li>
            ))}
          </ul>
        )}
        {linked && (
          <span className="init-row-explore">
            {LANDING.explore(initiative.name)} <span className="arrow-icon" aria-hidden="true">&rarr;</span>
          </span>
        )}
      </div>
      <div className={row.newest ? "init-row-visual" : "init-row-visual init-row-visual--panel"}>
        <Visual row={row} number={number} />
      </div>
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
