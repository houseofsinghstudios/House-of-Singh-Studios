// The /partners hero: the Services hero structure, spacing and entrance (svc-hero-stagger label,
// h1, intro), with the two calls to action as the fourth staggered row. On phones "Introduce a
// Client" is full width and first.
import { Link } from "next-view-transitions";
import Button from "@/components/ui/Button";
import { INTRODUCE_HREF, PARTNER_HREF, PARTNERS } from "@/lib/partners/content";

export default function PartnersHero() {
  return (
    <section style={{ padding: "var(--hero-pt) var(--page-px) clamp(64px, 8vw, 100px)" }}>
      <p className="editorial-label svc-hero-stagger" style={{ margin: "0 0 16px" }}>
        ({PARTNERS.label})
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
        {PARTNERS.heading}
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
        {PARTNERS.intro}
      </p>
      <div className="pt-hero-actions svc-hero-stagger">
        <Button href={INTRODUCE_HREF} variant="primary" data-cursor="link" data-partner-action="introduce" data-partner-location="hero">
          {PARTNERS.introduce}
        </Button>
        <Link href={PARTNER_HREF} className="arrow-link no-underline pt-hero-link" data-cursor="link" data-partner-action="partner" data-partner-location="hero">
          <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
            {PARTNERS.partner} <span className="arrow-icon">&rarr;</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
