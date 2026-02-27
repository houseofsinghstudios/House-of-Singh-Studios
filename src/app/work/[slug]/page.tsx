import Link from "next/link";

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/work"
          className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          &larr; All Work
        </Link>
        <div className="mt-8 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black">
            {slug.replace(/-/g, " ")}
          </h1>
          <p className="mt-5 text-lg text-neutral-500">
            This case study will be populated from Sanity CMS.
          </p>
        </div>
      </div>
    </section>
  );
}
