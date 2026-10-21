// The Brand Pulse share image (og:image). twitter-image.tsx reuses it.
import { PulseMotif, SHARE_CONTENT_TYPE, SHARE_SIZE, shareImage } from "@/lib/og/share-image";

export const alt = "Brand Pulse by House of Singh Studios. How healthy is your brand? Five vital signs. About a minute. Free.";
export const size = SHARE_SIZE;
export const contentType = SHARE_CONTENT_TYPE;

export default function Image() {
  return shareImage({
    label: "(BRAND PULSE)",
    heading: "How healthy is your brand?",
    line: "Five vital signs. About a minute. Free.",
    motif: <PulseMotif />,
  });
}
