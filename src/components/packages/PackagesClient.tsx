"use client";

import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";
import NextPageLink from "@/components/layout/NextPageLink";

const tiers = [
  {
    number: "01",
    title: "Brand Foundation",
    price: "$4,000",
    description:
      "For businesses launching or formalizing their visual identity for the first time.",
    includes: [
      "Logo system with primary mark and variations",
      "Color and typography framework",
      "Basic brand guidelines document",
      "Primary brand applications",
    ],
    timeline: "4 to 6 weeks",
    bestFor:
      "Founders, new ventures, businesses operating without a formal brand system.",
    cta: { text: "Start a Project", href: "/contact", variant: "secondary" as const },
    recommended: false,
  },
  {
    number: "02",
    title: "Brand Identity System",
    price: "$10,000",
    description:
      "For established businesses that need a complete visual identity built to scale.",
    includes: [
      "Full discovery and strategy phase",
      "Complete logo system with variations",
      "Typography and color architecture",
      "Comprehensive brand guidelines document",
      "Collateral design suite",
      "Art direction for brand photography and content",
    ],
    timeline: "8 to 12 weeks",
    bestFor:
      "Businesses doing $1M+ that have outgrown their current brand.",
    cta: { text: "Book a Discovery Call", href: "https://cal.com/houseofsinghstudios/hr", variant: "primary" as const },
    recommended: true,
  },
  {
    number: "03",
    title: "Brand Ecosystem",
    price: "$20,000",
    description:
      "For businesses that need brand identity, digital presence, content systems, and ongoing creative direction under one roof.",
    includes: [
      "Everything in Brand Identity System",
      "Website design direction and content architecture",
      "Content strategy and social media systems",
      "Brand launch support",
      "3 months of post-launch creative direction and support",
    ],
    timeline: "12 to 16 weeks",
    bestFor:
      "Businesses preparing for a major growth phase, market expansion, or rebrand.",
    cta: { text: "Book a Discovery Call", href: "https://cal.com/houseofsinghstudios/hr", variant: "primary" as const },
    recommended: false,
  },
];

export default function PackagesClient() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="flex flex-col justify-end px-[var(--page-px)]"
        style={{ minHeight: "50vh", paddingTop: "var(--hero-pt)", paddingBottom: 80 }}
      >
        <p
          data-hero-label
          className="font-[var(--sans)] text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-primary)]"
          style={{ opacity: 0.4 }}
        >
          (Packages)
        </p>

        <h1
          data-hero-heading
          className="reveal-text font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] mt-4 overflow-hidden max-w-[800px]"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.15 }}
        >
          Clear scope. Defined deliverables. No surprises.
        </h1>

        <p
          data-hero-sub
          className="font-[var(--sans)] font-normal text-[16px] leading-[1.75] text-[color:var(--text-primary)] max-w-[600px] mt-6"
          style={{ opacity: 0.6 }}
        >
          Every engagement starts with a discovery conversation. These packages
          reflect typical starting points for the most common project types.
        </p>
      </section>

      {/* ── PRICING GRID ── */}
      <section
        className="css-reveal"
        style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px) 0" }}
      >
        <EditorialLabel text="Pricing" className="mb-10" />
        <div className="packages-grid">
          {tiers.map((tier) => (
            <div
              key={tier.number}
              className={`package-tier css-reveal${tier.recommended ? " package-tier--recommended" : ""}`}
            >
              <div className="package-tier-inner">
                <p
                  className="font-[var(--sans)] text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-primary)]"
                  style={{ opacity: 0.4 }}
                >
                  {tier.number}
                </p>

                {tier.recommended && (
                  <p className="recommended-tag font-[var(--sans)] text-[10px] uppercase tracking-[0.15em] text-[color:var(--text-primary)] mt-3">
                    Recommended
                  </p>
                )}

                <h2
                  className="font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] mt-4"
                  style={{
                    fontSize: "clamp(24px, 2.5vw, 28px)",
                    lineHeight: 1.2,
                  }}
                >
                  {tier.title}
                </h2>

                <div className="mt-5">
                  <p
                    className="font-[var(--sans)] font-normal text-[14px] text-[color:var(--text-primary)]"
                    style={{ opacity: 0.5 }}
                  >
                    Starting at
                  </p>
                  <p
                    className="font-[var(--sans)] font-medium text-[color:var(--text-primary)]"
                    style={{ fontSize: "clamp(20px, 2vw, 24px)" }}
                  >
                    {tier.price}
                  </p>
                </div>

                <p
                  className="font-[var(--sans)] font-normal text-[15px] leading-[1.65] text-[color:var(--text-primary)] mt-5"
                  style={{ opacity: 0.6 }}
                >
                  {tier.description}
                </p>

                <div className="mt-6">
                  <p
                    className="font-[var(--sans)] text-[11px] uppercase tracking-[0.1em] text-[color:var(--text-primary)] mb-3"
                    style={{ opacity: 0.4 }}
                  >
                    What is included
                  </p>
                  <div className="flex flex-col gap-2">
                    {tier.includes.map((item) => (
                      <p
                        key={item}
                        className="font-[var(--sans)] font-normal text-[14px] text-[color:var(--text-primary)]"
                        style={{ opacity: 0.6 }}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <p
                  className="font-[var(--sans)] font-normal text-[13px] text-[color:var(--text-primary)] mt-6"
                  style={{ opacity: 0.4 }}
                >
                  {tier.timeline}
                </p>

                <p
                  className="font-[var(--sans)] font-normal italic text-[13px] text-[color:var(--text-primary)] mt-2"
                  style={{ opacity: 0.4 }}
                >
                  {tier.bestFor}
                </p>

                <div className="mt-8">
                  <Button
                    href={tier.cta.href}
                    variant={tier.cta.variant}
                    className="w-full text-center"
                    data-cursor="link"
                    {...(tier.cta.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {tier.cta.text}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FLEXIBILITY NOTE ── */}
      <div
        className="css-reveal px-[var(--page-px)]"
        style={{ paddingTop: 64, paddingBottom: 80 }}
      >
        <p
          className="font-[var(--sans)] font-normal text-[14px] leading-[1.75] max-w-[600px] mx-auto text-center"
          style={{ color: "var(--text-muted)" }}
        >
          Every project is scoped through a discovery conversation. These
          starting points reflect typical engagements. Your investment depends on
          scope, timeline, and complexity.
        </p>
      </div>

      <NextPageLink />

      {/* ── CTA (dark inverted) ── */}
      <section
        className="cta-section-mobile css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "120px var(--page-px)",
        }}
      >
        <div className="cta-dark-grid">
          <div className="css-reveal">
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                opacity: 0.4,
                marginBottom: 24,
              }}
            >
              (Next Step)
            </p>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 500,
                fontSize: "clamp(48px, 6vw, 80px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--bg)",
                margin: 0,
              }}
            >
              Not sure which package fits?
            </h2>
          </div>
          <div className="cta-dark-buttons css-reveal">
            <Button
              href="https://cal.com/houseofsinghstudios/hr"
              variant="primary-inverted"
              data-cursor="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Discovery Call
            </Button>
            <Button
              href="/contact"
              variant="secondary-inverted"
              data-cursor="link"
            >
              Start a Project
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
