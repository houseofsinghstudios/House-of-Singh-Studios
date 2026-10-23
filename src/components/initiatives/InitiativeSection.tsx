// One numbered section on an Initiatives page: the editorial label "(01)", the h2 in the service page
// section heading style, then the content. The same vertical padding as the service page sections.
import type { ReactNode } from "react";
import EditorialLabel from "@/components/ui/EditorialLabel";

interface Props {
  id: string;
  number: string;
  heading: string;
  children: ReactNode;
}

export default function InitiativeSection({ id, number, heading, children }: Props) {
  return (
    <section className="init-section" aria-labelledby={`${id}-heading`} style={{ padding: "clamp(64px, 8vw, 120px) var(--page-px)" }}>
      <div className="css-reveal">
        <EditorialLabel text={number} className="mb-6" />
      </div>
      <h2 id={`${id}-heading`} className="svcd-process-heading css-reveal" style={{ transitionDelay: "80ms" }}>
        {heading}
      </h2>
      {children}
    </section>
  );
}
