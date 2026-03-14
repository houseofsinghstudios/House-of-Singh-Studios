"use client";

import Button from "@/components/ui/Button";

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
    cta: { text: "Book a Discovery Call", href: "#", variant: "primary" as const },
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
    cta: { text: "Book a Discovery Call", href: "#", variant: "primary" as const },
    recommended: false,
  },
];

export default function PackagesClient() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="flex flex-col justify-center px-[var(--page-px)]"
        style={{ minHeight: "100vh" }}
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
          className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] mt-4 overflow-hidden max-w-[800px]"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.15 }}
        >
          Clear scope. Defined deliverables. No surprises.
        </h1>

        <p
          data-hero-sub
          className="font-[var(--sans)] font-normal text-[16px] leading-[1.75] text-[color:var(--text-primary)] max-w-[600px] mt-6"
          style={{ opacity: 0.6 }}
        >
          Every engagement starts with a discovery conversation. These packages reflect typical starting points for the most common project types.
        </p>
      </section>

      {/* ── TIERS ── */}
      <div className="packages-grid px-[var(--page-px)]">
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
                <p
                  className="recommended-tag font-[var(--sans)] text-[10px] uppercase tracking-[0.15em] text-[color:var(--text-primary)] mt-3"
                >
                  Recommended
                </p>
              )}

              <h2
                className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] mt-4"
                style={{ fontSize: "clamp(24px, 2.5vw, 28px)", lineHeight: 1.2 }}
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
                  className="font-[var(--sans)] font-semibold text-[color:var(--text-primary)]"
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
                >
                  {tier.cta.text}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── FLEXIBILITY LINE ── */}
      <div className="px-[var(--page-px)] mt-16 mb-20">
        <p
          className="font-[var(--sans)] font-normal text-[14px] leading-[1.75] text-[color:var(--text-primary)] max-w-[600px] mx-auto text-center"
          style={{ opacity: 0.4 }}
        >
          Every project is scoped through a discovery conversation. These starting points reflect typical engagements. Your investment depends on scope, timeline, and complexity.
        </p>
      </div>

      {/* ── CTA ── */}
      <section
        className="css-reveal text-center"
        style={{ padding: "80px var(--page-px) 160px" }}
      >
        <h2
          className="css-reveal font-[var(--serif)] font-normal text-[color:var(--text-primary)] overflow-hidden"
          style={{ fontSize: "clamp(28px, 3vw, 36px)", lineHeight: 1.15 }}
        >
          Not sure which package fits?
        </h2>
        <div className="css-reveal flex flex-wrap justify-center gap-3 mt-10">
          <Button href="#" data-cursor="link">
            Book a Discovery Call
          </Button>
          <Button href="/contact" variant="secondary" data-cursor="link">
            Start a Project
          </Button>
        </div>
      </section>
    </>
  );
}
