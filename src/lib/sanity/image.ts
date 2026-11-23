// "server-only": the image URL builder brings the whole Sanity client with it, so it stays on the
// server. Client components receive finished URLs as plain strings.
import "server-only";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// A clean source for next/image: at most maxWidth wide, never enlarged past the original (fit max),
// automatic format, quality 90. next/image then does the one real compression and serves the width
// each screen needs from its sizes, so a phone never downloads the large file (site audit S-03, S-08).
// Every on-page Sanity image goes through this; only crops (share images, network photos) do not.
export function imageSource(source: SanityImageSource, maxWidth: number) {
  return urlFor(source).width(maxWidth).fit("max").auto("format").quality(90).url();
}

// A case study image (its hero, the project cards and the related rows) and a case study block image:
// the hero is full width, 2880 device px at 1440 on a 2x screen, so the cap is the site's 2400.
export const CASE_IMAGE_WIDTH = 2400;

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
  return imageSource(source, 2400);
}

// The homepage What we do preview (a 300 by 220 frame, so 900px covers three times density): the
// Studio crop applied, at most 900px wide, automatic format, quality 90. next/image serves the rest.
export function wwdPreviewUrl(image: { url: string; crop?: { top: number; bottom: number; left: number; right: number } }) {
  const source: SanityImageSource = { asset: { url: image.url }, ...(image.crop ? { crop: image.crop } : {}) };
  return imageSource(source, 900);
}
