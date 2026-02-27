import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Identity & Visual Design",
  description:
    "We build visual identities that feel as intentional as they look. Logo systems, brand strategy, visual language, and guidelines.",
};

export default function BrandIdentityPage() {
  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <Link
            href="/services"
            className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            &larr; All Services
          </Link>
          <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-black">
            Brand Identity & Visual Design
          </h1>
          <p className="mt-5 text-lg text-neutral-500 leading-relaxed">
            We build visual identities that feel as intentional as they look.
            From strategy to execution, we shape how brands show up across
            mediums — distinct, cohesive and culturally grounded. Whether it is a
            full brand system or a single moment of design, our approach is
            rooted in clarity, precision and emotional resonance.
          </p>
        </div>

        {/* Deliverables */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            "Naming and brand strategy",
            "Logo systems and brand marks",
            "Color, type and visual language",
            "Brand guidelines and documentation",
            "Packaging and collateral design",
            "Art direction and brand expressions",
          ].map((item) => (
            <div
              key={item}
              className="p-6 border border-neutral-100 rounded-xl"
            >
              <p className="text-sm font-medium text-black">{item}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="p-8 lg:p-10 bg-neutral-50 rounded-2xl text-center">
          <h2 className="text-2xl font-semibold text-black">
            Ready to build your brand identity?
          </h2>
          <p className="mt-3 text-neutral-500 max-w-md mx-auto">
            Let&apos;s explore how we can shape a visual identity that is
            uniquely yours.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
          >
            Start a Conversation
          </Link>
        </div>
      </div>
    </section>
  );
}
