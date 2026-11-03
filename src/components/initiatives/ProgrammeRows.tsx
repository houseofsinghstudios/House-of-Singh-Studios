// /initiatives, (01) Programs: one Services page block row per visible initiative, a 1px rule
// between rows. Left: the status line in Obsidian, the category, name, tagline, summary, then an
// Explore button in the /services Learn More style. Right: the newest project's cover once the program has published work,
// otherwise a landscape panel (Cloudy ground, the row number small at the top left, the at a glance
// values in one row along the bottom). On phones the panel gives way to a short list of the same
// values between the summary and Explore. A row with its own page is one link, named
// "Explore <name>"; its hover is the existing service block hover. An initiative with a logo in
// Sanity shows the logo in place of the visible name; with no published project yet, the panel
// shows that logo large instead (see logoInPanel).
import Image from "next/image";
import { Link } from "next-view-transitions";
import type { Project } from "@/data/projects";
import { projectImage } from "@/components/work/WorkCards";
import { LANDING } from "@/lib/initiatives/content";
import { initiativeLogo, statusText, type Initiative } from "@/lib/initiatives/types";
import { logoSizes } from "@/lib/initiatives/logo-scale";
import InitiativeLogo from "./InitiativeLogo";

export interface ProgrammeRow {
  initiative: Initiative;
  linked: boolean;
  newest: Project | null;
}

// The panel logo's drawn width is about 55% of the panel, which is 45% of the row; 22vw is a
// little more at every width the panel shows, and the browser doubles it on a 2x screen.
export const PANEL_LOGO_SIZES = "22vw";

// Whether the panel shows the programme's logo: a logo is set and there is no published project.
// Decided on every render, so publishing a project brings the cover back and the small logo too.
export const logoInPanel = (row: ProgrammeRow) => !row.newest && !!initiativeLogo(row.initiative, "light");

function Visual({ row, number }: { row: ProgrammeRow; number: string }) {
  const { initiative, newest } = row;
  const logo = logoInPanel(row) ? initiativeLogo(initiative, "light") : undefined;
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
      {logo && (
        <div className="init-panel-logo">
          <InitiativeLogo logo={logo} alt="" sizes={PANEL_LOGO_SIZES} />
        </div>
      )}
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

// The name as the row's h3. With a logo set, the logo shows in its place (decorative, empty alt)
// and the same h3 stays beside it as visually hidden text, so the heading reads exactly as before.
// When the panel shows the logo, this small one is hidden beside the panel (tablet and desktop)
// and still shows on phones, where there is no panel.
function Name({ initiative, inPanel }: { initiative: Initiative; inPanel: boolean }) {
  const logo = initiativeLogo(initiative, "light");
  if (!logo) return <h3 className="svc-block-name">{initiative.name}</h3>;
  return (
    <div className={inPanel ? "svc-block-name init-row-logo init-row-logo--panel" : "svc-block-name init-row-logo"}>
      <InitiativeLogo logo={logo} alt="" sizes={logoSizes(logo, "row")} />
      <h3 className="sr-only">{initiative.name}</h3>
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
        <Name initiative={initiative} inPanel={logoInPanel(row)} />
        <p className="init-row-tagline">{initiative.tagline}</p>
        <p className="svc-block-desc">{initiative.summary}</p>
        {initiative.atAGlance.length > 0 && (
          <ul className="init-row-glance">
            {initiative.atAGlance.map((item) => (
              <li key={item.value}>{item.value}</li>
            ))}
          </ul>
        )}
        {/* The /services button look, as a visual element inside the row's one link. */}
        {linked && <span className="svc-block-btn init-row-explore">{LANDING.explore(initiative.name)}</span>}
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
