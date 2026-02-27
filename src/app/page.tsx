import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-6">
            AI Powered Design Studio
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-black">
            We build brands that
            <br />
            think, adapt, and scale.
          </h1>
          <p className="mt-6 text-lg text-neutral-500 leading-relaxed max-w-xl">
            House of Singh Studios is a multidisciplinary design studio powered by AI.
            We deliver brand identity, visual media, digital design, and creative
            strategy for businesses across North America.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              Start a Project
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-8 py-3.5 text-sm font-medium text-black hover:bg-neutral-50 transition-colors"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-neutral-100 py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-3xl font-semibold text-black">{siteConfig.stats.projects}</p>
            <p className="mt-1 text-sm text-neutral-500">Projects Delivered</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-black">{siteConfig.stats.years}</p>
            <p className="mt-1 text-sm text-neutral-500">Years of Experience</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-black">{siteConfig.stats.countries}</p>
            <p className="mt-1 text-sm text-neutral-500">Countries Served</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-black">{siteConfig.stats.fewerRevisions}</p>
            <p className="mt-1 text-sm text-neutral-500">Fewer Revisions with AI</p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-4">
            What We Do
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-black mb-14">
            Four disciplines. One studio.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Brand Identity & Visual Design",
                description:
                  "Visual identities that feel as intentional as they look. From strategy to execution.",
                href: "/services/brand-identity",
              },
              {
                title: "Visual Media & Content Production",
                description:
                  "Visual narratives that move beyond surface aesthetics. Every frame considered.",
                href: "/services/visual-media",
              },
              {
                title: "Digital Design & Experience",
                description:
                  "Digital environments that feel intuitive, refined and purposeful.",
                href: "/services/digital-design",
              },
              {
                title: "Creative Strategy & Systems",
                description:
                  "Think clearly before designing boldly. Strategy that is structured and actionable.",
                href: "/services/creative-strategy",
              },
            ].map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group block p-8 border border-neutral-100 rounded-2xl hover:border-neutral-300 transition-colors"
              >
                <h3 className="text-xl font-semibold text-black group-hover:text-neutral-700 transition-colors">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
                  {service.description}
                </p>
                <p className="mt-5 text-sm font-medium text-black">
                  Learn more &rarr;
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-10 bg-black text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Ready to build something remarkable?
          </h2>
          <p className="mt-4 text-neutral-400 text-lg max-w-lg mx-auto">
            Let&apos;s discuss your project and explore how AI powered design can
            elevate your brand.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black hover:bg-neutral-100 transition-colors"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
