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
