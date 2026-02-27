import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Media & Content Production",
  description:
    "Brand films, campaign direction, photography, social content systems, and script development. Visual narratives that move beyond surface aesthetics.",
};

export default function VisualMediaPage() {
  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <Link href="/services" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
            &larr; All Services
          </Link>
          <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-black">
            Visual Media & Content Production
          </h1>
          <p className="mt-5 text-lg text-neutral-500 leading-relaxed">
            We create visual narratives that move beyond surface aesthetics. From
            cinematic storytelling to campaign imagery, our work blends emotion
            with structure. Every frame is considered, every sequence intentional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            "Brand films and short form video",
            "Campaign direction and visual storytelling",
            "Photography and art direction",
            "Social and digital content systems",
            "Script development and narrative shaping",
          ].map((item) => (
            <div key={item} className="p-6 border border-neutral-100 rounded-xl">
              <p className="text-sm font-medium text-black">{item}</p>
            </div>
          ))}
        </div>

        <div className="p-8 lg:p-10 bg-neutral-50 rounded-2xl text-center">
          <h2 className="text-2xl font-semibold text-black">
            Ready to create visual impact?
          </h2>
          <p className="mt-3 text-neutral-500 max-w-md mx-auto">
            Let&apos;s discuss how visual media can elevate your brand narrative.
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
