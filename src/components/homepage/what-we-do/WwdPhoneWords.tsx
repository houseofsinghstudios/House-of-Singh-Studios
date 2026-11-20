"use client";
// A client component: on phones, an open service shows its own disciplines as the slash field, every
// word a button. Tapping a word marks it with the marker band and opens a text card under the field
// (one at a time; tap again or Close shuts it): the discipline, its description and, for a word with
// real work, a link to that case study. No images on phones.

import { useState } from "react";
import { Link } from "next-view-transitions";
import { track } from "@/lib/analytics";
import { caseStudyHref, seeItText, type WwdService, type WwdWork } from "@/lib/what-we-do";

interface Props {
  service: WwdService;
  work: Record<string, WwdWork>;
}

export default function WwdPhoneWords({ service, work }: Props) {
  const [active, setActive] = useState<string | null>(null);
  // The card keeps its last words while it closes, so the text never vanishes mid animation.
  const [shown, setShown] = useState<string | null>(null);
  const cardId = `wwd-card-${service.slug}`;
  const discipline = service.disciplines.find((d) => d.name === shown);
  const w = shown ? work[shown] : undefined;

  const choose = (name: string) => {
    if (active === name) return setActive(null);
    setActive(name);
    setShown(name);
    track("home_wwd_word_click", { discipline: name, has_work: Boolean(work[name]), layout: "phone" });
  };
  const close = () => {
    const name = active;
    setActive(null);
    if (name) document.querySelector<HTMLButtonElement>(`#${cardId}-words [data-word="${CSS.escape(name)}"]`)?.focus();
  };

  return (
    <>
      <div className="wwd-field-frame wwd-field-frame--phone">
        <ul id={`${cardId}-words`} className="wwd-field wwd-field--phone">
          {service.disciplines.map((d) => (
            <li key={d.name} className="wwd-term">
              <span className="wwd-sep" aria-hidden="true">/</span>
              <button
                type="button"
                className="wwd-word wwd-word-btn"
                data-word={d.name}
                data-work={work[d.name] ? true : undefined}
                data-active={active === d.name ? true : undefined}
                aria-expanded={active === d.name}
                aria-controls={cardId}
                onClick={() => choose(d.name)}
              >
                {d.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div id={cardId} className="wwd-card" data-open={active ? true : undefined} inert={!active}>
        <div className="wwd-card-clip">
          {discipline && (
            <div className="wwd-card-body">
              <p className="wwd-card-name">{discipline.name}</p>
              <p className="wwd-desc">{discipline.description}</p>
              {w && (
                <Link href={caseStudyHref(w.slug)} className="wwd-card-link" data-cursor="link">
                  {seeItText(w.client)}
                </Link>
              )}
              <button type="button" className="wwd-card-close" onClick={close}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
