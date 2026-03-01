import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import {
  getAllServices,
  getFeaturedCaseStudies,
  getFeaturedTestimonials,
} from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

const hardcodedServices = [
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
];

export default async function Home() {
  const [sanityServices, featuredCaseStudies, featuredTestimonials] =
    await Promise.all([
      getAllServices(),
      getFeaturedCaseStudies(),
      getFeaturedTestimonials(),
    ]);

  const services =
    sanityServices?.length > 0
      ? sanityServices.map(
          (s: {
            _id: string;
            title: string;
            slug: { current: string };
            description?: string;
          }) => ({
            title: s.title,
            description: s.description || "",
            href: `/services/${s.slug.current}`,
          })
        )
      : hardcodedServices;

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
            House of Singh Studios is a multidisciplinary design studio powered
            by AI. We deliver brand identity, visual media, digital design, and
            creative strategy for businesses across North America.
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
            <p className="text-3xl font-semibold text-black">
              {siteConfig.stats.projects}
            </p>
            <p className="mt-1 text-sm text-neutral-500">Projects Delivered</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-black">
              {siteConfig.stats.years}
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Years of Experience
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-black">
              {siteConfig.stats.countries}
            </p>
            <p className="mt-1 text-sm text-neutral-500">Countries Served</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-black">
              {siteConfig.stats.fewerRevisions}
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Fewer Revisions with AI
            </p>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      {featuredCaseStudies?.length > 0 && (
        <section className="py-24 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-4">
              Featured Work
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-black mb-14">
              Recent projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredCaseStudies.map(
                (study: {
                  _id: string;
                  title: string;
                  slug: { current: string };
                  client?: string;
                  industry?: string;
                  featuredImage?: object;
                  overview?: string;
                }) => (
                  <Link
                    key={study._id}
                    href={`/work/${study.slug.current}`}
                    className="group block"
                  >
                    <div className="aspect-[4/3] bg-neutral-100 rounded-2xl overflow-hidden relative">
                      {study.featuredImage ? (
                        <Image
                          src={urlFor(study.featuredImage)
                            .width(800)
                            .height(600)
                            .url()}
                          alt={study.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-sm text-neutral-400">
                            {study.title}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-black group-hover:text-neutral-700 transition-colors">
                        {study.title}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-500">
                        {[study.client, study.industry]
                          .filter(Boolean)
                          .join(" — ")}
                      </p>
                    </div>
                  </Link>
                )
              )}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/work"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-8 py-3.5 text-sm font-medium text-black hover:bg-neutral-50 transition-colors"
              >
                View All Work &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

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
            {services.map(
              (service: {
                title: string;
                description: string;
                href: string;
              }) => (
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
              )
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {featuredTestimonials?.length > 0 && (
        <section className="py-24 px-6 lg:px-10 border-t border-neutral-100">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-4">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-black mb-14">
              What our clients say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTestimonials.map(
                (testimonial: {
                  _id: string;
                  quote: string;
                  author: string;
                  role?: string;
                  company?: string;
                  photo?: object;
                }) => (
                  <div
                    key={testimonial._id}
                    className="p-8 bg-neutral-50 rounded-2xl"
                  >
                    <blockquote className="text-neutral-700 leading-relaxed">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      {testimonial.photo && (
                        <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0">
                          <Image
                            src={urlFor(testimonial.photo)
                              .width(80)
                              .height(80)
                              .url()}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-black">
                          {testimonial.author}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {[testimonial.role, testimonial.company]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

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
