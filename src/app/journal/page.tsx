import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Insights on design, branding, AI in creative work, and building brands that scale. From House of Singh Studios.",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function JournalPage() {
  const posts = await getAllPosts();

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

        {posts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(
              (post: {
                _id: string;
                title: string;
                slug: { current: string };
                excerpt?: string;
                featuredImage?: object;
                category?: string;
                publishedAt?: string;
              }) => (
                <Link
                  key={post._id}
                  href={`/journal/${post.slug.current}`}
                  className="group block"
                >
                  <div className="aspect-[16/10] bg-neutral-100 mb-4 overflow-hidden relative">
                    {post.featuredImage ? (
                      <Image
                        src={urlFor(post.featuredImage)
                          .width(600)
                          .height(375)
                          .url()}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-sm text-neutral-400">{post.title}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                    {post.category && (
                      <span className="capitalize">{post.category}</span>
                    )}
                    {post.category && post.publishedAt && (
                      <span className="text-neutral-300">&middot;</span>
                    )}
                    {post.publishedAt && (
                      <span>{formatDate(post.publishedAt)}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-black group-hover:text-neutral-700 transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              )
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group">
                <div className="aspect-[16/10] bg-neutral-100 mb-4" />
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
        )}
      </div>
    </section>
  );
}
