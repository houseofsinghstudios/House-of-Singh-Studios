import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Explore our portfolio of brand identity, visual media, digital design, and creative strategy projects.",
};

export default function WorkPage() {
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

        {/* Placeholder grid — will be populated from Sanity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-neutral-100 rounded-2xl flex items-center justify-center"
            >
              <p className="text-sm text-neutral-400">Case Study {i}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
