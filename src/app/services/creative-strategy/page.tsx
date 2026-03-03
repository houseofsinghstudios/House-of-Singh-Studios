import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creative Strategy & Systems",
  description:
    "Brand positioning workshops, creative direction frameworks, content strategy, visual consistency systems, and AI supported workflow integration.",
};

export default function CreativeStrategyPage() {
  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <Link href="/services" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
            &larr; All Services
          </Link>
          <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-black">
            Creative Strategy & Systems
          </h1>
          <p className="mt-5 text-lg text-neutral-500 leading-relaxed">
            We help brands think clearly before they design boldly. Strategy at
            our studio is not theoretical — it is structured, actionable and
            built for long term growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            "Brand positioning and clarity workshops",
            "Creative direction frameworks",
            "Content and communication strategy",
            "Visual consistency systems",
            "AI supported workflow integration",
          ].map((item) => (
            <div key={item} className="p-6 border border-neutral-100 rounded-xl">
              <p className="text-sm font-medium text-black">{item}</p>
            </div>
          ))}
        </div>

        <div className="p-8 lg:p-10 bg-neutral-50 rounded-2xl text-center">
          <h2 className="text-2xl font-semibold text-black">
            Ready to think before you design?
          </h2>
          <p className="mt-3 text-neutral-500 max-w-md mx-auto">
            Let&apos;s build the strategic foundation your brand needs to grow.
          </p>
          <Link
            href="/contact"
            className="btn-primary mt-6"
          >
            Start a Conversation
          </Link>
        </div>
      </div>
    </section>
  );
}
