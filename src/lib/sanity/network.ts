// Network members for /about, published and switched on, in their order. Refreshes every 60 seconds
// like the rest of the page. Never asks for internalName. An empty list (none yet, or Sanity
// unreachable) means the page shows its six placeholder cards.
import { client } from "./client";
import { urlFor } from "./image";
import { toNetworkCards, type NetworkCard } from "@/lib/about/network";

const networkMembersQuery = `*[_type == "networkMember" && showOnWebsite == true && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(order asc) {
  role,
  photo { alt, crop, hotspot, asset->{ _id, metadata { lqip } } }
}`;

// 800 square covers the widest card (about 410px) at 2x; next/image resizes from there.
const PHOTO_EDGE = 800;

export async function getNetworkMembers(): Promise<NetworkCard[]> {
  try {
    const docs = await client.fetch(networkMembersQuery, {}, { next: { revalidate: 60 } });
    return toNetworkCards(docs, (photo) =>
      urlFor(photo as Parameters<typeof urlFor>[0]).width(PHOTO_EDGE).height(PHOTO_EDGE).fit("crop").auto("format").url()
    );
  } catch (error) {
    console.warn("[about] network members fetch failed, showing placeholders:", error instanceof Error ? error.name : "unknown error");
    return [];
  }
}
