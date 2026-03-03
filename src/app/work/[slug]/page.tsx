import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { getCaseStudyBySlug } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return { title: "Case Study Not Found" };
  }

  return {
    title: caseStudy.seoTitle || caseStudy.title,
    description: caseStudy.seoDescription || caseStudy.overview,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <article className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/work"
          className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          &larr; All Work
        </Link>

        {/* Header */}
        <div className="mt-8 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black">
            {caseStudy.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-500">
            {caseStudy.client && <span>{caseStudy.client}</span>}
            {caseStudy.industry && (
              <>
                <span className="text-neutral-300">|</span>
                <span>{caseStudy.industry}</span>
              </>
            )}
            {caseStudy.year && (
              <>
                <span className="text-neutral-300">|</span>
                <span>{caseStudy.year}</span>
              </>
            )}
          </div>
          {caseStudy.services?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {caseStudy.services.map(
                (service: { _id: string; title: string }) => (
                  <span
                    key={service._id}
                    className="text-xs px-3 py-1 bg-neutral-100 text-neutral-600"
                  >
                    {service.title}
                  </span>
                )
              )}
            </div>
          )}
        </div>

        {/* Featured Image */}
        {caseStudy.featuredImage && (
          <div className="mt-12 aspect-[16/9] bg-neutral-100 overflow-hidden relative">
            <Image
              src={urlFor(caseStudy.featuredImage)
                .width(1400)
                .height(788)
                .url()}
              alt={caseStudy.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Overview */}
        {caseStudy.overview && (
          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-semibold text-black mb-4">
              Overview
            </h2>
            <p className="text-neutral-500 leading-relaxed">
              {caseStudy.overview}
            </p>
          </div>
        )}

        {/* Challenge */}
        {caseStudy.challenge && (
          <div className="mt-12 max-w-3xl">
            <h2 className="text-2xl font-semibold text-black mb-4">
              Challenge
            </h2>
            <div className="text-neutral-500 leading-relaxed prose prose-neutral">
              <PortableText value={caseStudy.challenge} />
            </div>
          </div>
        )}

        {/* Approach */}
        {caseStudy.approach && (
          <div className="mt-12 max-w-3xl">
            <h2 className="text-2xl font-semibold text-black mb-4">
              Approach
            </h2>
            <div className="text-neutral-500 leading-relaxed prose prose-neutral">
              <PortableText value={caseStudy.approach} />
            </div>
          </div>
        )}

        {/* Deliverables */}
        {caseStudy.deliverables?.length > 0 && (
          <div className="mt-12 max-w-3xl">
            <h2 className="text-2xl font-semibold text-black mb-4">
              Deliverables
            </h2>
            <div className="flex flex-col gap-2">
              {caseStudy.deliverables.map((item: string, i: number) => (
                <p key={i} className="text-sm text-neutral-600">
                  {item}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {caseStudy.results && (
          <div className="mt-12 max-w-3xl">
            <h2 className="text-2xl font-semibold text-black mb-4">Results</h2>
            <div className="text-neutral-500 leading-relaxed prose prose-neutral">
              <PortableText value={caseStudy.results} />
            </div>
          </div>
        )}

        {/* Gallery */}
        {caseStudy.gallery?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-black mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudy.gallery.map(
                (
                  image: {
                    _key: string;
                    asset: object;
                    alt?: string;
                    caption?: string;
                  },
                  i: number
                ) => (
                  <figure key={image._key || i}>
                    <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                      <Image
                        src={urlFor(image).width(800).height(600).url()}
                        alt={image.alt || `Gallery image ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {image.caption && (
                      <figcaption className="mt-2 text-xs text-neutral-400">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              )}
            </div>
          </div>
        )}

        {/* Testimonial */}
        {caseStudy.testimonial?.quote && (
          <div className="mt-16 p-8 lg:p-10 bg-neutral-50 max-w-3xl">
            <blockquote className="text-lg text-neutral-700 leading-relaxed italic">
              &ldquo;{caseStudy.testimonial.quote}&rdquo;
            </blockquote>
            <div className="mt-4">
              <p className="text-sm font-semibold text-black">
                {caseStudy.testimonial.author}
              </p>
              {caseStudy.testimonial.role && (
                <p className="text-sm text-neutral-500">
                  {caseStudy.testimonial.role}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
