import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Insights on design, branding, AI in creative work, and building brands that scale. From House of Singh Studios.",
};

export default function JournalPage() {
  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-4">
            Journal
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black">
            Thinking out loud
          </h1>
          <p className="mt-5 text-lg text-neutral-500 leading-relaxed">
            Perspectives on design, branding, AI, and building creative
            businesses. Written by the studio.
          </p>
        </div>

        {/* Placeholder grid — will be populated from Sanity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group">
              <div className="aspect-[16/10] bg-neutral-100 rounded-xl mb-4" />
              <p className="text-xs text-neutral-400 mb-2">Coming Soon</p>
              <h3 className="text-lg font-semibold text-black">
                Blog Post {i}
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                This will be populated from Sanity CMS.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
