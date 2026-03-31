import type { Metadata } from "next";
import ServicesClient from "@/components/services/ServicesClient";
import NextPageLink from "@/components/layout/NextPageLink";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services — House of Singh Studios",
  description:
    "Brand identity, visual media, digital design, and creative strategy for established businesses ready to invest in how they show up.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesClient />
      <NextPageLink />
      <section
        className="css-reveal"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg)",
          padding: "clamp(100px, 12vw, 160px) var(--page-px)",
        }}
      >
        <div className="cta-centered">
          <h2 className="cta-heading">Have a project in mind?</h2>
          <div className="cta-buttons">
            <Button href="/contact" variant="primary-inverted" data-cursor="link">
              Start a Project
            </Button>
            <Button href="/contact" variant="secondary-inverted" data-cursor="link">
              Book a Discovery Call
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
