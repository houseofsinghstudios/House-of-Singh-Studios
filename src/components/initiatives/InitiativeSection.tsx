// One numbered section on an Initiatives page: the editorial label "(01)", the h2 in the service page
// section heading style, then the content. The same vertical padding as the service page sections.
// split: the editorial split for sections of numbered rows or lists. Label, heading and an optional
// intro sentence in a left column about a third wide, the content on the right. Stacks on phones.
// note: a short line under the heading in the left column (questions sections). It comes after the
// content in the page, so on phones it stacks last and is reached last by keyboard.
import type { ReactNode } from "react";
import EditorialLabel from "@/components/ui/EditorialLabel";

interface Props {
  id: string;
  number: string;
  heading: string;
  intro?: string;
  split?: boolean;
  note?: ReactNode;
  children: ReactNode;
}

export default function InitiativeSection({ id, number, heading, intro, split, note, children }: Props) {
  const head = (
    <>
      <div className="css-reveal">
        <EditorialLabel text={number} className="mb-6" />
      </div>
      <h2 id={`${id}-heading`} className="svcd-process-heading css-reveal" style={{ transitionDelay: "80ms" }}>
        {heading}
      </h2>
      {intro && <p className="init-split-intro css-reveal" style={{ transitionDelay: "160ms" }}>{intro}</p>}
    </>
  );
  const isSplit = split || !!note;
  return (
    <section
      className={isSplit ? `init-section init-split${note ? " init-split--note" : ""}` : "init-section"}
      aria-labelledby={`${id}-heading`}
      style={{ padding: "clamp(64px, 8vw, 120px) var(--page-px)" }}
    >
      {isSplit ? (
        <>
          <div className="init-split-head">{head}</div>
          <div className="init-split-body">{children}</div>
          {note && <p className="init-split-intro init-split-note css-reveal" style={{ transitionDelay: "160ms" }}>{note}</p>}
        </>
      ) : (
        <>
          {head}
          {children}
        </>
      )}
    </section>
  );
}
