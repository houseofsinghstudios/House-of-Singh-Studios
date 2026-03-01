import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTeamMembers, getSiteSettings } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "House of Singh Studios is an AI powered design studio based in Toronto, delivering brand identity, visual media, digital design, and creative strategy across North America.",
};

export default async function AboutPage() {
  const [teamMembers, siteSettings] = await Promise.all([
    getTeamMembers(),
    getSiteSettings(),
  ]);

  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-4">
            About
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black">
            Built different. By design.
          </h1>
          <p className="mt-5 text-lg text-neutral-500 leading-relaxed">
            {siteSettings?.description ||
              "House of Singh Studios is a multidisciplinary design studio based in Toronto. We combine human creativity with AI intelligence to deliver work that is intentional, scalable, and built for growth."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Our approach
            </h2>
            <p className="text-neutral-500 leading-relaxed">
              We do not separate design from strategy. Every project starts with
              understanding — the market, the audience, and the opportunity. AI
              is not an add on. It is woven into how we research, create, and
              deliver. This means faster turnarounds, deeper insights, and work
              that is grounded in data as much as it is in craft.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Our vision
            </h2>
            <p className="text-neutral-500 leading-relaxed">
              We are building the studio model of the future. One where AI
              amplifies human creativity instead of replacing it. Where a lean
              team delivers enterprise quality work. Where every process is
              documented, automated, and designed to scale across cities and
              borders.
            </p>
          </div>
        </div>

        {/* Team Members */}
        {teamMembers?.length > 0 && (
          <div className="mb-20">
            <h2 className="text-2xl font-semibold text-black mb-8">
              The team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {teamMembers.map(
                (member: {
                  _id: string;
                  name: string;
                  role?: string;
                  bio?: string;
                  photo?: object;
                  linkedin?: string;
                }) => (
                  <div key={member._id}>
                    {member.photo ? (
                      <div className="aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden relative mb-4">
                        <Image
                          src={urlFor(member.photo)
                            .width(400)
                            .height(533)
                            .url()}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[3/4] bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                        <p className="text-sm text-neutral-400">
                          {member.name}
                        </p>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-black">
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="text-sm text-neutral-500">{member.role}</p>
                    )}
                    {member.bio && (
                      <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        LinkedIn &rarr;
                      </a>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="p-8 lg:p-10 bg-neutral-50 rounded-2xl text-center">
          <h2 className="text-2xl font-semibold text-black">
            Want to work with us?
          </h2>
          <p className="mt-3 text-neutral-500 max-w-md mx-auto">
            We are always open to conversations with businesses that care about
            how they show up in the world.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
