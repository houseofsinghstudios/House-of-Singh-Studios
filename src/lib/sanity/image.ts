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
