// Initiatives page hero: the Services page hero (svc-hero-stagger label, h1, intro), same spacing.
// On a program page the label is a breadcrumb: "(Initiatives / Parallel)", with Initiatives
// linking back to /initiatives in the label style, underlined on hover only. A program page also
// has an "At a glance" column on the right: one row per fact between 1px rules, stacked under the
// intro on phones.
import { Link } from "next-view-transitions";
import { GLANCE_LABEL } from "@/lib/initiatives/content";
import type { GlanceItem } from "@/lib/initiatives/types";
import "./initiatives.css";

interface Props {
  heading: string;
  intro: string;
  // The program name for the breadcrumb; omitted on /initiatives itself.
  programme?: string;
  glance?: GlanceItem[];
}

function Glance({ items }: { items: GlanceItem[] }) {
  return (
    <div className="init-hero-glance svc-hero-stagger">
      <p className="editorial-label init-glance-heading">{GLANCE_LABEL}</p>
      <ul className="init-glance">
        {items.map((item) => (
          <li key={item.value} className="init-glance-row">
            {item.label && <span className="editorial-label init-glance-key">{item.label}</span>}
            <span className="init-glance-value">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InitiativeHero({ heading, intro, programme, glance }: Props) {
  return (
    <section className="init-hero" style={{ padding: "var(--hero-pt) var(--page-px) clamp(64px, 8vw, 100px)" }}>
      <div className="init-hero-grid">
        <div>
          <p className="editorial-label svc-hero-stagger" style={{ margin: "0 0 16px" }}>
            {programme ? (
              <>
                (<Link href="/initiatives" className="init-crumb">Initiatives</Link> / {programme})
              </>
            ) : (
              "(Initiatives)"
            )}
          </p>
          <h1
            className="svc-hero-stagger"
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 500,
              fontSize: "clamp(28px, 4vw, 48px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "var(--text-primary)",
              margin: "0 0 20px",
              maxWidth: 620,
            }}
          >
            {heading}
          </h1>
          <p
            className="svc-hero-stagger"
            style={{
              fontFamily: "var(--sans)",
              fontSize: 15,
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              margin: 0,
              maxWidth: 440,
            }}
          >
            {intro}
          </p>
        </div>
        {glance && glance.length > 0 && <Glance items={glance} />}
      </div>
    </section>
  );
}
