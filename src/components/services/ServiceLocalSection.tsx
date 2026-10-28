// "(04) Across the GTA" on a service page: where the studio works and who it works with. The
// editorial split used on the Initiatives and Partners pages (label, heading and intro on the left,
// three numbered rows with 1px rules on the right), with the service page section padding.
import EditorialLabel from "@/components/ui/EditorialLabel";
import NumberedRows from "@/components/initiatives/NumberedRows";
import type { ServiceData } from "@/data/services";
import "@/components/initiatives/initiatives.css";

export default function ServiceLocalSection({ local, number }: { local: ServiceData["localSection"]; number: string }) {
  return (
    <section
      className="init-section init-split"
      aria-labelledby="gta-heading"
      style={{ padding: "clamp(48px, 8vw, 96px) var(--page-px)" }}
    >
      <div className="init-split-head">
        <div className="css-reveal">
          <EditorialLabel number={number} text="Across the GTA" className="mb-6" />
        </div>
        <h2 id="gta-heading" className="svcd-process-heading css-reveal" style={{ transitionDelay: "80ms" }}>
          {local.heading}
        </h2>
        <p className="init-split-intro css-reveal" style={{ transitionDelay: "160ms" }}>
          {local.intro}
        </p>
      </div>
      <div className="init-split-body">
        <NumberedRows rows={local.rows} />
      </div>
    </section>
  );
}
