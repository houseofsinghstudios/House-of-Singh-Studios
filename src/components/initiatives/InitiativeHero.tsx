// Initiatives page hero: the Services page hero (svc-hero-stagger label, h1, intro), same spacing.
// On a programme page the label is a breadcrumb: "(Initiatives / Parallel)", with Initiatives
// linking back to /initiatives in the label style, underlined on hover only.
import { Link } from "next-view-transitions";
import "./initiatives.css";

interface Props {
  heading: string;
  intro: string;
  // The programme name for the breadcrumb; omitted on /initiatives itself.
  programme?: string;
}

export default function InitiativeHero({ heading, intro, programme }: Props) {
  return (
    <section className="init-hero" style={{ padding: "var(--hero-pt) var(--page-px) clamp(64px, 8vw, 100px)" }}>
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
    </section>
  );
}
