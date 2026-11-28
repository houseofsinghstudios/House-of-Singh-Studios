// The next/image loader (images.loaderFile in next.config.ts): Sanity images are served by Sanity's own
// image CDN, never by Vercel's /_next/image, whose Hobby allowance ran out on 28 Nov 2026 and answered
// 402 for every image it had not cached. next/image still builds the srcset, sizes, priority and lazy
// loading; this only says where each width comes from.
//
// A cdn.sanity.io address arrives already built by imageSource (src/lib/sanity/image.ts) or urlFor, with
// the Studio crop (rect), fit and automatic format. Only the width and the quality change: the width
// next/image asks for, never past the width the builder capped (fit max never enlarges past the
// original either), and the quality next/image asks for (75, the default; 60 for the homepage hero).
// So each image is compressed once, from the original upload, at the chosen quality. A fixed height
// (the square network photos) scales with the width. The hotspot is CSS (object-position), untouched.
// Everything else, the files in /public and any other host, is returned exactly as given.
//
// It runs in the browser too, so it imports nothing: no image builder, no Sanity client.

const SANITY_IMAGES = "https://cdn.sanity.io/images/";
export const DEFAULT_QUALITY = 75;

export default function sanityImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  if (!src.startsWith(SANITY_IMAGES)) return src;
  const url = new URL(src);
  const params = url.searchParams;
  const cap = Number(params.get("w")) || Infinity;
  const w = Math.min(width, cap);
  const h = Number(params.get("h"));
  if (h && Number.isFinite(cap)) params.set("h", String(Math.round((h * w) / cap)));
  params.set("w", String(w));
  params.set("q", String(quality || DEFAULT_QUALITY));
  if (!params.has("fit")) params.set("fit", "max");
  if (!params.has("fm") && !params.has("auto")) params.set("auto", "format");
  return url.toString();
}
