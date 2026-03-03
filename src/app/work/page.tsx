import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllCaseStudies } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Explore our portfolio of brand identity, visual media, digital design, and creative strategy projects.",
};

export default async function WorkPage() {
  const caseStudies = await getAllCaseStudies();

  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-4">
            Portfolio
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black">
            Selected work
          </h1>
          <p className="mt-5 text-lg text-neutral-500 leading-relaxed">
            A curated selection of projects across brand identity, visual media,
            digital design, and creative strategy.
          </p>
        </div>

        {caseStudies?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map(
              (study: {
                _id: string;
                title: string;
                slug: { current: string };
                client?: string;
                industry?: string;
                featuredImage?: object;
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
                        <p className="text-sm text-neutral-400">
                          {study.title}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold text-black group-hover:text-neutral-700 transition-colors">
                      {study.title}
                    </h2>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-neutral-100 flex items-center justify-center"
              >
                <p className="text-sm text-neutral-400">Case Study {i}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
