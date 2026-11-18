import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { REVALIDATE_TARGETS, signatureAccepted } from "@/lib/revalidate";

// On demand revalidation, called by a Sanity webhook (sanity.io/manage, API, Webhooks) whenever a
// published document is created, updated or deleted. Without it, a change waits for each page's
// own refresh (60 seconds for most pages, an hour for the sitemap and llms.txt).
//
// Only Sanity can call it: the request must carry a signature made with SANITY_REVALIDATE_SECRET,
// the same secret set on the webhook. Fail closed: no secret configured means nothing is refreshed.
// parseBody waits about three seconds for Sanity's eventual consistency before answering, so the
// pages rebuild with the new content. Logs carry the "[revalidate]" prefix and never the body.

export async function POST(req: NextRequest): Promise<Response> {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not set, nothing refreshed");
    return Response.json({ message: "Not configured" }, { status: 500 });
  }

  try {
    const { isValidSignature } = await parseBody(req, secret, true);
    if (!signatureAccepted(isValidSignature)) {
      console.warn("[revalidate] refused a request without a valid signature");
      return Response.json({ message: "Invalid signature" }, { status: 401 });
    }
    for (const { path, type } of REVALIDATE_TARGETS) revalidatePath(path, type);
    console.log("[revalidate] site refreshed");
    return Response.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    // A body that is not JSON lands here (parseBody parses it after the signature check).
    console.error(`[revalidate] failed: ${error instanceof Error ? error.name : "unknown error"}`);
    return Response.json({ message: "Could not refresh" }, { status: 400 });
  }
}
