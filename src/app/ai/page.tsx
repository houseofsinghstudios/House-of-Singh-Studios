import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Capabilities",
  description:
    "How House of Singh Studios uses AI to power design, accelerate delivery, and give clients access to intelligent creative tools.",
};

export default function AIPage() {
  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-4">
            AI at Our Studio
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black">
            Design powered by intelligence
          </h1>
          <p className="mt-5 text-lg text-neutral-500 leading-relaxed">
            We do not use AI as a gimmick. It is embedded into how we think,
            build, and deliver. From proposal generation to brand analysis, AI
            accelerates every layer of our process.
          </p>
        </div>

        {/* How AI Powers Our Process */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold text-black mb-8">
            How AI powers your project
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Faster proposals",
                description:
                  "AI drafts customized proposals grounded in your brief, our pricing, and relevant case studies. You get a tailored response faster.",
              },
              {
                title: "Smarter strategy",
                description:
                  "AI analyzes your industry, competitors, and positioning to surface insights that inform the creative direction from day one.",
              },
              {
                title: "Fewer revisions",
                description:
                  "AI powered briefs and discovery processes mean we understand your brand deeper before we start designing. The result: 40% fewer revision cycles.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 border border-neutral-100 rounded-xl"
              >
                <h3 className="text-base font-semibold text-black">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Client AI Tools */}
        <div className="p-8 lg:p-10 bg-neutral-50 rounded-2xl">
          <h2 className="text-2xl font-semibold text-black mb-3">
            AI tools for clients
          </h2>
          <p className="text-neutral-500 max-w-xl mb-8">
            We are building a suite of AI tools that clients can access directly.
            Brand audits, content analysis, and creative briefs — powered by your
            data, delivered instantly.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
          >
            Get Early Access
          </Link>
        </div>
      </div>
    </section>
  );
}
