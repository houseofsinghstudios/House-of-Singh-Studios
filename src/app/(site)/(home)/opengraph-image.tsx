// The homepage share image (og:image). twitter-image.tsx reuses it. The same picture is the site
// wide default at /share-image.png.
import { SHARE_CONTENT_TYPE, SHARE_SIZE, STUDIO_SHARE_ALT, studioShareImage } from "@/lib/og/share-image";

export const alt = STUDIO_SHARE_ALT;
export const size = SHARE_SIZE;
export const contentType = SHARE_CONTENT_TYPE;

export default function Image() {
  return studioShareImage();
}
