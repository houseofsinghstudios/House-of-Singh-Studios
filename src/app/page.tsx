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
      {/* ── Hero Section ── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 var(--page-px) 80px",
        }}
      >
        {/* Editorial label */}
        <p
          className="editorial-label reveal-up"
          style={{ animationDelay: "0.1s", marginBottom: 24 }}
        >
          (Creative Direction Studio.)
        </p>

        {/* Hero content */}
        <div style={{ maxWidth: 800 }}>
          {/* Headline */}
          <h1
            className="reveal-up"
            style={{
              animationDelay: "0.2s",
              fontFamily: "var(--serif)",
              fontWeight: 600,
              fontSize: "clamp(44px, 6.2vw, 80px)",
              lineHeight: 1.08,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            We build brands that
            <br />
            think, adapt, and scale.
          </h1>

          {/* Secondary text — 32px gap */}
          <p
            className="reveal-up"
            style={{
              animationDelay: "0.35s",
              marginTop: 32,
              fontFamily: "var(--sans)",
              fontWeight: 400,
              fontSize: 18,
              lineHeight: 1.6,
              color: "var(--text-muted)",
              maxWidth: 560,
            }}
          >
            A multidisciplinary design studio powered by AI systems and led by
            creative direction.
          </p>

          {/* Supporting text — 20px gap */}
          <p
            className="reveal-up"
            style={{
              animationDelay: "0.5s",
              marginTop: 20,
              fontFamily: "var(--sans)",
              fontWeight: 300,
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--text-faint)",
              maxWidth: 560,
            }}
          >
            We deliver brand identity, visual media, digital design, and
            creative strategy for businesses across North America.
          </p>

          {/* CTAs — 48px gap */}
          <div
            className="reveal-up"
            style={{
              animationDelay: "0.65s",
              marginTop: 48,
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <Link href="/work" className="btn-primary">
              View Projects
            </Link>
            <Link href="/contact" className="btn-secondary">
              Start a Project
            </Link>
          </div>
        </div>

        {/* Scroll indicator — bottom center */}
        <div
          className="reveal-up"
          style={{
            animationDelay: "0.9s",
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p className="editorial-label">(Scroll.)</p>
          <div className="scroll-track">
            <div className="scroll-thumb" />
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "64px var(--page-px)",
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p
              style={{
                fontFamily: "var(--serif)",
                fontSize: 32,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {siteConfig.stats.projects}
            </p>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                color: "var(--text-faint)",
                marginTop: 4,
              }}
            >
              Projects Delivered
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--serif)",
                fontSize: 32,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {siteConfig.stats.years}
            </p>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                color: "var(--text-faint)",
                marginTop: 4,
              }}
            >
              Years of Experience
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--serif)",
                fontSize: 32,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {siteConfig.stats.countries}
            </p>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                color: "var(--text-faint)",
                marginTop: 4,
              }}
            >
              Countries Served
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--serif)",
                fontSize: 32,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {siteConfig.stats.fewerRevisions}
            </p>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                color: "var(--text-faint)",
                marginTop: 4,
              }}
            >
              Fewer Revisions with AI
            </p>
          </div>
        </div>
      </section>

      {/* ── Featured Case Studies ── */}
      {featuredCaseStudies?.length > 0 && (
        <section style={{ padding: "96px var(--page-px)" }}>
          <div className="max-w-7xl mx-auto">
            <p className="editorial-label" style={{ marginBottom: 16 }}>
              Featured Work
            </p>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(28px, 3.5vw, 40px)",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 56,
              }}
            >
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
                    <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
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
                          <p
                            style={{
                              fontFamily: "var(--sans)",
                              fontSize: 13,
                              color: "var(--text-faint)",
                            }}
                          >
                            {study.title}
                          </p>
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <h3
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 16,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {study.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 13,
                          color: "var(--text-faint)",
                          marginTop: 4,
                        }}
                      >
                        {[study.client, study.industry]
                          .filter(Boolean)
                          .join(" — ")}
                      </p>
                    </div>
                  </Link>
                )
              )}
            </div>
            <div style={{ marginTop: 40, textAlign: "center" }}>
              <Link href="/work" className="btn-secondary">
                View All Work &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Services Overview ── */}
      <section style={{ padding: "96px var(--page-px)" }}>
        <div className="max-w-7xl mx-auto">
          <p className="editorial-label" style={{ marginBottom: 16 }}>
            What We Do
          </p>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 56,
            }}
          >
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
                  className="group block"
                  style={{
                    padding: 32,
                    border: "1px solid var(--border)",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "var(--text-muted)",
                      marginTop: 12,
                    }}
                  >
                    {service.description}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      marginTop: 20,
                    }}
                  >
                    Learn more &rarr;
                  </p>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {featuredTestimonials?.length > 0 && (
        <section
          style={{
            padding: "96px var(--page-px)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <p className="editorial-label" style={{ marginBottom: 16 }}>
              Testimonials
            </p>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(28px, 3.5vw, 40px)",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 56,
              }}
            >
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
                    style={{
                      padding: 32,
                      background: "var(--bg-shift)",
                    }}
                  >
                    <blockquote
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "var(--text-secondary)",
                      }}
                    >
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div
                      style={{
                        marginTop: 24,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
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
                        <p
                          style={{
                            fontFamily: "var(--sans)",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                          }}
                        >
                          {testimonial.author}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--sans)",
                            fontSize: 12,
                            color: "var(--text-faint)",
                          }}
                        >
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

      {/* ── CTA Section ── */}
      <section
        style={{
          padding: "96px var(--page-px)",
          background: "var(--text-primary)",
        }}
      >
        <div className="max-w-7xl mx-auto" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 600,
              color: "var(--bg)",
            }}
          >
            Ready to build something remarkable?
          </h2>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 16,
              color: "var(--text-faint)",
              marginTop: 16,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Let&apos;s discuss your project and explore how AI powered design can
            elevate your brand.
          </p>
          <div style={{ marginTop: 32 }}>
            <Link href="/contact" className="btn-primary-inverted">
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
