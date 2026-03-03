import Link from "next/link";
import type { Metadata } from "next";
import { getAllPackages } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Explore our design service packages. Brand identity, visual media, digital design, and creative strategy — structured for clarity and results.",
};

const hardcodedPackages = [
  {
    name: "Foundation",
    description:
      "For businesses starting fresh or refining the basics. A focused brand identity package.",
    includes: [
      "Brand strategy session",
      "Logo system (primary + secondary marks)",
      "Color and typography system",
      "Basic brand guidelines (digital PDF)",
    ],
    idealFor: "Ideal for startups and small businesses.",
    featured: false,
  },
  {
    name: "Growth",
    description:
      "For businesses ready to scale their brand across channels. A comprehensive identity and content system.",
    includes: [
      "Everything in Foundation",
      "Extended visual language",
      "Social media content system",
      "Website design direction",
      "Brand photography art direction",
    ],
    idealFor: "Ideal for growing businesses and funded startups.",
    featured: true,
  },
  {
    name: "Enterprise",
    description:
      "For businesses that need a complete creative partner. Full service design, strategy, and AI integration.",
    includes: [
      "Everything in Growth",
      "Full website design and development",
      "Brand film or campaign video",
      "Creative strategy and positioning",
      "AI workflow integration",
      "Ongoing design support",
    ],
    idealFor: "Ideal for established businesses and organizations.",
    featured: false,
  },
];

export default async function PackagesPage() {
  const sanityPackages = await getAllPackages();

  const packages =
    sanityPackages?.length > 0
      ? sanityPackages.map(
          (p: {
            _id: string;
            name: string;
            description?: string;
            includes?: string[];
            idealFor?: string;
            featured?: boolean;
          }) => ({
            name: p.name,
            description: p.description || "",
            includes: p.includes || [],
            idealFor: p.idealFor || "",
            featured: p.featured || false,
          })
        )
      : hardcodedPackages;

  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-4">
            Packages
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black">
            Clear scope. Real results.
          </h1>
          <p className="mt-5 text-lg text-neutral-500 leading-relaxed">
            We structure our services into packages so you know exactly what you
            are getting. Every engagement starts with a discovery call.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map(
            (pkg: {
              name: string;
              description: string;
              includes: string[];
              idealFor: string;
              featured: boolean;
            }) => (
              <div
                key={pkg.name}
                className={`p-8 border ${
                  pkg.featured
                    ? "border-black bg-black text-white"
                    : "border-neutral-100 bg-white text-black"
                }`}
              >
                <h2 className="text-xl font-semibold">{pkg.name}</h2>
                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    pkg.featured ? "text-neutral-300" : "text-neutral-500"
                  }`}
                >
                  {pkg.description}
                </p>

                <div className="mt-6 flex flex-col gap-2">
                  {pkg.includes.map((item: string) => (
                    <p
                      key={item}
                      className={`text-sm ${
                        pkg.featured ? "text-neutral-200" : "text-neutral-600"
                      }`}
                    >
                      {item}
                    </p>
                  ))}
                </div>

                {pkg.idealFor && (
                  <p className="mt-6 text-xs text-neutral-400">
                    {pkg.idealFor}
                  </p>
                )}

                <Link
                  href="/contact"
                  className={`mt-6 ${
                    pkg.featured
                      ? "btn-primary-inverted"
                      : "btn-primary"
                  }`}
                >
                  Book a Discovery Call
                </Link>
              </div>
            )
          )}
        </div>

        <p className="mt-12 text-center text-sm text-neutral-400">
          All packages are customized after an initial discovery call. Pricing
          depends on scope and timeline.
        </p>
      </div>
    </section>
  );
}
