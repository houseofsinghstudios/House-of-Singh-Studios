// One numbered section on an Initiatives page: the editorial label "(01)", the h2 in the service page
// section heading style, then the content. The same vertical padding as the service page sections.
// split: the editorial split for sections of numbered rows or lists. Label, heading and an optional
// intro sentence in a left column about a third wide, the content on the right. Stacks on phones.
import type { ReactNode } from "react";
import EditorialLabel from "@/components/ui/EditorialLabel";

interface Props {
  id: string;
  number: string;
  heading: string;
  intro?: string;
  split?: boolean;
  children: ReactNode;
}

export default function InitiativeSection({ id, number, heading, intro, split, children }: Props) {
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
  return (
    <section
      className={split ? "init-section init-split" : "init-section"}
      aria-labelledby={`${id}-heading`}
      style={{ padding: "clamp(64px, 8vw, 120px) var(--page-px)" }}
    >
      {split ? (
        <>
          <div className="init-split-head">{head}</div>
          <div className="init-split-body">{children}</div>
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
