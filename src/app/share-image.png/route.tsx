// The site wide default share image at a fixed address, /share-image.png: the homepage picture,
// drawn once at build time. Pages without their own image point their og:image here.
import { studioShareImage } from "@/lib/og/share-image";

export const dynamic = "force-static";

export function GET() {
  return studioShareImage();
}
