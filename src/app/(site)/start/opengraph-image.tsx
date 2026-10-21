// The Project Planner share image (og:image). twitter-image.tsx reuses it.
import { BriefMotif, SHARE_CONTENT_TYPE, SHARE_SIZE, shareImage } from "@/lib/og/share-image";

export const alt = "Project Planner by House of Singh Studios. Plan your project in two minutes. A first phase brief with starting prices, before you share any details.";
export const size = SHARE_SIZE;
export const contentType = SHARE_CONTENT_TYPE;

export default function Image() {
  return shareImage({
    label: "(PROJECT PLANNER)",
    heading: "Plan your project in two minutes.",
    line: "A first phase brief with starting prices, before you share any details.",
    motif: <BriefMotif />,
  });
}
