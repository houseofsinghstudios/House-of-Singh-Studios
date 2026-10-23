// Commons, "Pro bono work": the organizations from the Commons recognitions, grouped by year with a
// small year label above each row. A row of three equal slots between 1px Marble rules, no boxes:
// each logo as uploaded, fitted to one height and centred, its name beneath in the label style.
// The last slot is outlined in Obsidian and links to the nominate band. Slots stack on phones.
import Image from "next/image";
import { COMMONS } from "@/lib/initiatives/content";
import { recognitionsByYear, type Recognition } from "@/lib/initiatives/types";

function Slot({ recognition }: { recognition: Recognition }) {
  const { logo, name } = recognition;
  return (
    <li className="init-pb-slot">
      <div className="init-pb-logo">
        <Image
          src={logo.url}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          sizes="(max-width: 767px) 60vw, 240px"
          // SVG logos are served as uploaded; the image optimizer only handles raster files.
          unoptimized={logo.url.endsWith(".svg")}
        />
      </div>
      <span className="editorial-label init-pb-name">{name}</span>
    </li>
  );
}

export default function ProBonoWork({ recognitions }: { recognitions: Recognition[] }) {
  const groups = recognitionsByYear(recognitions);
  return (
    <div className="init-pb">
      {groups.map((group, i) => (
        <div key={group.year ?? "undated"} className="init-pb-group css-reveal">
          {group.year && <p className="editorial-label init-pb-year">{group.year}</p>}
          <ul className="init-pb-row">
            {group.items.map((r) => (
              <Slot key={`${r.name}-${r.logo.url}`} recognition={r} />
            ))}
            {i === groups.length - 1 && (
              <li className="init-pb-slot init-pb-slot--open">
                <a href={COMMONS.openSlot.href} className="init-pb-open" data-cursor="link">
                  {COMMONS.openSlot.text} <span className="arrow-icon" aria-hidden="true">&rarr;</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
