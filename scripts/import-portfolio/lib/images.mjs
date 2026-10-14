// Prepares one image for upload with sharp. Local processing only, no network.
// Uploads stay large on purpose: Sanity resizes on delivery, so never shrink to display width.

import fs from "node:fs/promises";
import sharp from "sharp";
import { JPEG_QUALITY, MAX_EDGE } from "./config.mjs";

const HAS_MOZJPEG = Boolean(sharp.versions && sharp.versions.mozjpeg);

export async function processImage(filePath) {
  const input = await fs.readFile(filePath);
  const meta = await sharp(input).metadata();

  // EXIF orientations 5 to 8 store the image sideways. Report what a viewer sees.
  const sideways = (meta.orientation || 1) >= 5;
  const before = {
    width: sideways ? meta.height : meta.width,
    height: sideways ? meta.width : meta.height,
    bytes: input.length,
  };

  let pipeline = sharp(input)
    // Apply the EXIF rotation to the pixels before EXIF is stripped, or phone photos upload sideways.
    .rotate()
    // Shrink only when the longest edge is over the limit. Never upscale, never crop.
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });

  if (meta.hasAlpha) pipeline = pipeline.flatten({ background: "#ffffff" });

  const { data, info } = await pipeline
    .toColorspace("srgb")
    // Embed an sRGB profile to match the converted pixels. All other metadata (EXIF, XMP, GPS) is dropped.
    .withIccProfile("srgb")
    .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: HAS_MOZJPEG })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    before,
    after: { width: info.width, height: info.height, bytes: data.length },
  };
}

export function outputFilename(file) {
  return file.replace(/\.(jpe?g|png|webp)$/i, ".jpg");
}
