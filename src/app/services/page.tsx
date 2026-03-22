import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import ServiceRows from "@/components/ServiceRows";
import DiagnosticTrigger from "@/components/DiagnosticTrigger";

export const metadata: Metadata = {
  title: "Services — House of Singh Studios",
  description:
    "Brand identity, visual media, digital design, and creative strategy for established businesses ready to invest in how they show up.",
};

export default function ServicesPage() {
  return (
    <>
      <section
        className="svc-hero"
        style={{ padding: "clamp(48px, 8vw, 96px) var(--page-px) clamp(32px, 4vw, 48px)" }}
      >
        <p className="svc-hero-label" data-hero-label>
          (Services)
        </p>
        <h1 className="svc-hero-heading" data-hero-heading>
          We solve brand problems for established businesses.
        </h1>
        <p className="svc-hero-sub" data-hero-sub>
          Four situations. Four solutions. Find the one that sounds like yours.
        </p>
        <DiagnosticTrigger />
      </section>

      <ServiceRows />

      <section className="svc-dark-cta">
        <p className="svc-dark-cta-text">Ready to start a conversation?</p>
        <div className="svc-dark-cta-btns">
          <Link href="/contact" className="svc-btn-light" data-cursor="link">
            Discovery Call
          </Link>
          <Link href="/packages" className="svc-btn-outline" data-cursor="link">
            Packages
          </Link>
        </div>
      </section>
    </>
  );
}
