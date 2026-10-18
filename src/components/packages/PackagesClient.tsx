"use client";

import Button from "@/components/ui/Button";
import EditorialLabel from "@/components/ui/EditorialLabel";
import NextPageLink from "@/components/layout/NextPageLink";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { PACKAGE_TIERS as tiers } from "@/data/packages";

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
        <div className="cta-centered">
          <p className="cta-label">(Next Step)</p>
          <h2 className="cta-heading">Not sure which package fits?</h2>
          <div className="cta-buttons">
            <Button href={DISCOVERY_CALL_URL} variant="primary-inverted" data-cursor="link" target="_blank" rel="noopener noreferrer">
              Book a Discovery Call
            </Button>
            <Button href="/start" variant="secondary-inverted" data-cursor="link">
              Start a Project
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
