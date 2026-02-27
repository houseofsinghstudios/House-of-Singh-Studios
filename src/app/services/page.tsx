import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Brand identity, visual media, digital design, and creative strategy. AI powered design services for businesses across North America.",
};

const services = [
  {
    title: "Brand Identity & Visual Design",
    description:
      "We build visual identities that feel as intentional as they look. From strategy to execution, we shape how brands show up across mediums — distinct, cohesive and culturally grounded.",
    deliverables: [
      "Naming and brand strategy",
      "Logo systems and brand marks",
      "Color, type and visual language",
      "Brand guidelines and documentation",
      "Packaging and collateral design",
      "Art direction and brand expressions",
    ],
    href: "/services/brand-identity",
  },
  {
    title: "Visual Media & Content Production",
    description:
      "We create visual narratives that move beyond surface aesthetics. From cinematic storytelling to campaign imagery, our work blends emotion with structure.",
    deliverables: [
      "Brand films and short form video",
      "Campaign direction and visual storytelling",
      "Photography and art direction",
      "Social and digital content systems",
      "Script development and narrative shaping",
    ],
    href: "/services/visual-media",
  },
  {
    title: "Digital Design & Experience",
    description:
      "We design digital environments that feel intuitive, refined and purposeful. Our focus is not only how something functions, but how it communicates and connects.",
    deliverables: [
      "Website design and development direction",
      "Interface and digital layout systems",
      "Interactive brand experiences",
      "Content architecture and structure",
      "Ongoing digital design support",
    ],
    href: "/services/digital-design",
  },
  {
    title: "Creative Strategy & Systems",
    description:
      "We help brands think clearly before they design boldly. Strategy at our studio is not theoretical — it is structured, actionable and built for long term growth.",
    deliverables: [
      "Brand positioning and clarity workshops",
      "Creative direction frameworks",
      "Content and communication strategy",
      "Visual consistency systems",
      "AI supported workflow integration",
    ],
    href: "/services/creative-strategy",
  },
];

export default function ServicesPage() {
  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-4">
            Services
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black">
            What we do
          </h1>
          <p className="mt-5 text-lg text-neutral-500 leading-relaxed">
            Four disciplines working in concert. Each grounded in strategy,
            elevated by design, and accelerated by AI.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group block p-8 lg:p-10 border border-neutral-100 rounded-2xl hover:border-neutral-300 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-black group-hover:text-neutral-700 transition-colors">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-neutral-500 leading-relaxed max-w-xl">
                    {service.description}
                  </p>
                </div>
                <div className="flex-shrink-0 lg:max-w-xs">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                    Deliverables
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {service.deliverables.map((item) => (
                      <p key={item} className="text-sm text-neutral-600">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm font-medium text-black">
                Explore this service &rarr;
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
