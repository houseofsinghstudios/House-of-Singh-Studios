// The homepage share image (og:image). twitter-image.tsx reuses it.
import { SHARE_CONTENT_TYPE, SHARE_SIZE, shareImage } from "@/lib/og/share-image";

export const alt = "House of Singh Studios. Clear thinking, made visible. Brand identity and design studio in Toronto.";
export const size = SHARE_SIZE;
export const contentType = SHARE_CONTENT_TYPE;

export default function Image() {
  return shareImage({
    label: "(HOUSE OF SINGH STUDIOS)",
    heading: "Clear thinking, made visible.",
    line: "Brand identity and design. Toronto.",
    footer: "studios.houseofsingh.com",
  });
}
