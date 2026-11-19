// "server-only": the image URL builder brings the whole Sanity client with it, so it stays on the
// server. Client components receive finished URLs as plain strings.
import "server-only";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// A share image (og:image) from a Sanity image: 1200x630, cropped around its hotspot, automatic
// format, quality 80. Never the original upload, however large.
export function shareImageUrl(source: SanityImageSource) {
  return urlFor(source).width(1200).height(630).fit("crop").auto("format").quality(80).url();
}

// The Insights image sizes: the featured post on /insights, a post card (the /insights grid and an
// article's related posts), an article's hero, and an image inside an article's text.
export const insightImageUrl = {
  featured: (source: SanityImageSource) => urlFor(source).width(1200).height(675).url(),
  card: (source: SanityImageSource) => urlFor(source).width(600).height(338).url(),
  hero: (source: SanityImageSource) => urlFor(source).width(1600).height(900).url(),
  body: (source: SanityImageSource) => urlFor(source).width(1200).height(675).url(),
};

// A homepage hero image: the Studio crop applied (as rect), at most 2400px wide, automatic format,
// quality 90, so the source next/image compresses (at quality 60, HeroImages.tsx) is clean. next/image
// then serves the width each screen needs. The query gives the asset's URL
// rather than its reference; the builder reads the asset from it.
export function heroImageUrl(image: { url: string; crop?: { top: number; bottom: number; left: number; right: number } }) {
  const source: SanityImageSource = { asset: { url: image.url }, ...(image.crop ? { crop: image.crop } : {}) };
  return urlFor(source).width(2400).fit("max").auto("format").quality(90).url();
}
