import Link from "next/link";

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <article className="py-24 px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/journal"
          className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          &larr; All Posts
        </Link>
        <h1 className="mt-8 text-4xl sm:text-5xl font-semibold tracking-tight text-black">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="mt-5 text-lg text-neutral-500">
          This blog post will be populated from Sanity CMS.
        </p>
      </div>
    </article>
  );
}
