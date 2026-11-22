// Network member cards on /about: from Sanity documents to exactly what a card needs (role, photo
// URL, alt text, blur placeholder). Pure, so it is tested without Sanity. Nothing else reaches the
// browser: the query never asks for internalName, and this keeps only the card fields.
import { asText } from "../as-text";

export interface NetworkCard {
  role: string;
  alt: string;
  src: string;
  lqip?: string;
}

// As the query returns it. photo keeps asset, crop and hotspot so the URL builder can crop around them.
interface NetworkMemberDoc {
  role?: unknown;
  photo?: { alt?: unknown; asset?: { _id?: unknown; metadata?: { lqip?: unknown } | null } | null; crop?: unknown; hotspot?: unknown } | null;
}

// The square photo URL for a card, cropped around the hotspot. Supplied by the caller (urlFor).
export type SquareUrl = (photo: NonNullable<NetworkMemberDoc["photo"]>) => string;


// Drops any member without a role, a photo or alt text: a card never shows half filled.
export function toNetworkCards(docs: unknown, squareUrl: SquareUrl): NetworkCard[] {
  if (!Array.isArray(docs)) return [];
  return docs.flatMap((doc: NetworkMemberDoc) => {
    const role = asText(doc?.role);
    const alt = asText(doc?.photo?.alt);
    if (!role || !alt || !doc.photo?.asset?._id) return [];
    const lqip = asText(doc.photo.asset.metadata?.lqip);
    return [{ role, alt, src: squareUrl(doc.photo), ...(lqip ? { lqip } : {}) }];
  });
}
