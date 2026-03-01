import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { getPostBySlug } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-24 px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/journal"
          className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          &larr; All Posts
        </Link>

        {/* Header */}
        <div className="mt-8">
          <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            {post.category && (
              <span className="capitalize">{post.category}</span>
            )}
            {post.category && post.publishedAt && (
              <span className="text-neutral-300">&middot;</span>
            )}
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-lg text-neutral-500 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mt-10 aspect-[16/9] bg-neutral-100 rounded-2xl overflow-hidden relative">
            <Image
              src={urlFor(post.featuredImage).width(1200).height(675).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Body */}
        {post.body && (
          <div className="mt-12 prose prose-neutral max-w-none">
            <PortableText
              value={post.body}
              components={{
                types: {
                  image: ({
                    value,
                  }: {
                    value: { asset: object; alt?: string; caption?: string };
                  }) => (
                    <figure className="my-8">
                      <div className="aspect-[16/9] bg-neutral-100 rounded-xl overflow-hidden relative">
                        <Image
                          src={urlFor(value).width(1200).height(675).url()}
                          alt={value.alt || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {value.caption && (
                        <figcaption className="mt-2 text-center text-sm text-neutral-400">
                          {value.caption}
                        </figcaption>
                      )}
                    </figure>
                  ),
                },
              }}
            />
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-neutral-100 rounded-full text-neutral-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Services */}
        {post.relatedServices?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Related Services
            </h3>
            <div className="flex flex-wrap gap-3">
              {post.relatedServices.map(
                (service: {
                  _id: string;
                  title: string;
                  slug: { current: string };
                }) => (
                  <Link
                    key={service._id}
                    href={`/services/${service.slug.current}`}
                    className="text-sm px-4 py-2 border border-neutral-200 rounded-full hover:border-neutral-400 transition-colors"
                  >
                    {service.title}
                  </Link>
                )
              )}
            </div>
          </div>
        )}

        {/* Related Case Studies */}
        {post.relatedCaseStudies?.length > 0 && (
          <div className="mt-8 pt-8 border-t border-neutral-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Related Work
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.relatedCaseStudies.map(
                (study: {
                  _id: string;
                  title: string;
                  slug: { current: string };
                  featuredImage?: object;
                }) => (
                  <Link
                    key={study._id}
                    href={`/work/${study.slug.current}`}
                    className="group block"
                  >
                    <div className="aspect-[4/3] bg-neutral-100 rounded-xl overflow-hidden relative">
                      {study.featuredImage && (
                        <Image
                          src={urlFor(study.featuredImage)
                            .width(400)
                            .height(300)
                            .url()}
                          alt={study.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-black group-hover:text-neutral-700 transition-colors">
                      {study.title}
                    </p>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
