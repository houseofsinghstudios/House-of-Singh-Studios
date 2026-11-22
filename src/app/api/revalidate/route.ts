import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { checkSignature, REVALIDATE_TARGETS, SIGNATURE_HEADER } from "@/lib/revalidate";
import { parseJson, readBodyText } from "@/lib/request-body";

// On demand revalidation, called by a Sanity webhook (sanity.io/manage, API, Webhooks) whenever a
// published document is created, updated or deleted. Without it, a change waits for each page's
// own refresh (60 seconds for most pages, an hour for the sitemap and llms.txt).
//
// Only Sanity can call it: the request must carry a signature made with SANITY_REVALIDATE_SECRET,
// the same secret set on the webhook. Fail closed: no secret configured means nothing is refreshed.
// The body is read up to 64 KB, the signature compared in constant time and refused when more than
// five minutes old (checkSignature in src/lib/revalidate.ts). A valid delivery then waits three
// seconds for Sanity's eventual consistency, as next-sanity's parseBody did, so the pages rebuild
// with the new content. Logs carry the "[revalidate]" prefix and never the body.
//
// Answers: 500 without the secret; 400 for a body that cannot be read or a signature header in the
// wrong format; 401 for a missing, wrong or expired signature; 500 when the refresh itself fails, so
// Sanity retries the delivery; 200 once refreshed.

const SETTLE_MS = 3000;

export async function POST(req: NextRequest): Promise<Response> {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not set, nothing refreshed");
    return Response.json({ message: "Not configured" }, { status: 500 });
  }

  const body = await readBodyText(req, 64 * 1024);
  if (body === null) {
    console.error("[revalidate] could not read the request: body too large");
    return Response.json({ message: "Bad request" }, { status: 400 });
  }
  const check = checkSignature(body, req.headers.get(SIGNATURE_HEADER), secret);
  if (check === "malformed") {
    console.error("[revalidate] could not read the request: signature header in the wrong format");
    return Response.json({ message: "Bad request" }, { status: 400 });
  }
  if (check !== "valid") {
    console.warn(`[revalidate] refused a request: signature ${check}`);
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }
  if (parseJson(body) === null) {
    console.error("[revalidate] could not read the request: body is not JSON");
    return Response.json({ message: "Bad request" }, { status: 400 });
  }
  await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));

  try {
    for (const { path, type } of REVALIDATE_TARGETS) revalidatePath(path, type);
  } catch (error) {
    // A server error, so Sanity retries the delivery.
    console.error(`[revalidate] refresh failed: ${errorName(error)}`);
    return Response.json({ message: "Could not refresh" }, { status: 500 });
  }
  console.log("[revalidate] site refreshed");
  return Response.json({ revalidated: true, now: Date.now() });
}

const errorName = (error: unknown) => (error instanceof Error ? error.name : "unknown error");
