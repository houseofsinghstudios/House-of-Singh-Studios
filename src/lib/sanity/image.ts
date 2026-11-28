// "server-only": the image URL builder brings the whole Sanity client with it, so it stays on the
// server. Client components receive finished URLs as plain strings.
import "server-only";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "./client";
import { heroObjectPosition } from "@/lib/homepage-hero";

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// The address of an on-page Sanity image for next/image: at most maxWidth wide, never enlarged past the
// original (fit max), automatic format, the Studio crop kept. next/image's loader
// (src/lib/sanity/image-loader.ts) then sets the width each screen needs, never past maxWidth, and the
// quality (75, the hero 60), so Sanity's CDN compresses once from the original and a phone never
// downloads the large file (site audit S-03, S-08; Sanity serves since 28 Nov 2026, not /_next/image).
// The quality 90 here is replaced by the loader's. Every on-page Sanity image goes through this; only
// crops (share images, network photos) do not.
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

// The Insights image sizes, each at least twice the width it is shown at (site audit S-08): the
// featured post on /insights (1210 css px at 1440) and an article's hero (full width) 2400, a post
// card (the /insights grid and an article's related posts, half the page) 1200, an image inside an
// article's text (740 css px) 1600. Width only: the frames crop with object-fit, at the image's Studio
// hotspot (insightImagePosition), so a fixed height would only cap the width of a taller image.
// An Insights frame's object-position: the image's Studio hotspot inside its crop, as the homepage
// hero places its images, so a hotspot set in Studio is respected; the centre without one.
export function insightImagePosition(image: { hotspot?: { x: number; y: number }; crop?: { top: number; bottom: number; left: number; right: number } }) {
  return heroObjectPosition(image);
}

export const insightImageUrl = {
  featured: (source: SanityImageSource) => imageSource(source, 2400),
  card: (source: SanityImageSource) => imageSource(source, 1200),
  hero: (source: SanityImageSource) => imageSource(source, 2400),
  body: (source: SanityImageSource) => imageSource(source, 1600),
};

// A homepage hero image: the Studio crop applied (as rect), at most 2400px wide, automatic format.
// The loader sets each width and quality 60 (HeroImages.tsx), compressed once by Sanity from the
// original upload. The query gives the asset's URL
// rather than its reference; the builder reads the asset from it.
export function heroImageUrl(image: { url: string; crop?: { top: number; bottom: number; left: number; right: number } }) {
  const source: SanityImageSource = { asset: { url: image.url }, ...(image.crop ? { crop: image.crop } : {}) };
  return imageSource(source, 2400);
}

// The homepage What we do preview (a 300 by 220 frame, so 900px covers three times density): the
// Studio crop applied, at most 900px wide, automatic format; the loader sets the width and quality.
export function wwdPreviewUrl(image: { url: string; crop?: { top: number; bottom: number; left: number; right: number } }) {
  const source: SanityImageSource = { asset: { url: image.url }, ...(image.crop ? { crop: image.crop } : {}) };
  return imageSource(source, 900);
}
